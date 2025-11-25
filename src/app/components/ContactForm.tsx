"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import planeImg from "../assets/airplane.png"; 

type SubmitStatus = "idle" | "sending" | "success" | "error";

// --- CSS ---
const globalStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px #1f2937 inset !important;
    -webkit-text-fill-color: white !important;
    transition: background-color 5000s ease-in-out 0s;
  }
  .animating-hidden:-webkit-autofill {
    -webkit-text-fill-color: transparent !important;
  }
`;

const getRect = (element: HTMLElement | null) => {
  if (!element) return { x: 0, y: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
};

interface FloatingChar {
  id: string;
  char: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });
  
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState("");
  const [floatingChars, setFloatingChars] = useState<FloatingChar[]>([]);
  
  const controls = useAnimation();
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | HTMLTextAreaElement | null }>({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  // --- SCROLL LOCK ---
  useEffect(() => {
    if (status === "sending") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAnimationAndSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status !== "idle") return;

    const btnRect = getRect(buttonRef.current);
    setStatus("sending");

    // --- 1. OPTIMIZED PARTICLE GENERATION ---
    const chars: FloatingChar[] = [];
    const createParticles = (key: keyof typeof formData) => {
      const el = inputRefs.current[key];
      if (!el) return;
      const rect = getRect(el);
      const text = formData[key];
      
      // OPTIMIZATION: If text is long, only take a sample of letters
      // We limit to max ~30 particles per field to prevent lag
      const MAX_PARTICLES_PER_FIELD = 30;
      const step = Math.ceil(text.length / MAX_PARTICLES_PER_FIELD);

      for (let i = 0; i < text.length; i += step) {
        const char = text[i];
        // Calculate position based on character index approximation
        // (This is a rough visual approximation to keep performance high)
        const randomOffsetX = (Math.random() - 0.5) * (rect.width * 0.9); 
        const randomOffsetY = (Math.random() - 0.5) * (rect.height * 0.6);

        chars.push({
          id: `${key}-${i}-${Date.now()}`,
          char,
          startX: rect.centerX + randomOffsetX,
          startY: rect.centerY + randomOffsetY,
          targetX: btnRect.centerX,
          targetY: btnRect.centerY,
        });
      }
    };

    createParticles("name");
    createParticles("company");
    createParticles("email");
    createParticles("message");

    setFloatingChars(chars);

    // --- 2. ANIMATION SEQUENCE ---
    
    // Fade out red button bg
    controls.start({
      backgroundColor: "rgba(255,255,255,0)",
      boxShadow: "none", 
      transition: { duration: 0.5 }
    });

    // Wait for letters (1s)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFloatingChars([]); 

    // Fly Plane
    await controls.start({
      x: window.innerWidth, 
      y: -window.innerHeight, 
      opacity: 0,
      transition: { duration: 1.5, ease: "easeInOut" }
    });

    // API Call
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim()
        }),
      });

      if (!response.ok) throw new Error("Failed");

      setFormData({ name: "", company: "", email: "", message: "" });
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 500)); 

      // Reset Position Invisibly
      controls.set({ x: 0, y: 0, opacity: 0 });

      // Reset State
      setStatus("success");
      setTimeout(() => setStatus("idle"), 10);

      // Fade Button Back In
      await controls.start({
        opacity: 1,
        backgroundColor: "#dc2626",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.8, ease: "easeOut" }
      });

    } catch (err) {
      setStatus("error");
      setError("Something went wrong.");
      controls.set({ x: 0, y: 0, opacity: 1, backgroundColor: "#dc2626", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" });
    }
  };

  const isTextHidden = status === "sending";

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <style>{globalStyles}</style>

      {/* FLOATING LETTERS */}
      <AnimatePresence>
        {floatingChars.map((item) => (
          <motion.span
            key={item.id}
            initial={{ x: item.startX, y: item.startY, opacity: 1, scale: 1 }}
            animate={{ 
              x: item.targetX, 
              y: item.targetY, 
              opacity: 0, 
              scale: 0.2 
            }}
            transition={{ 
              duration: 0.9, 
              ease: "backIn", 
              delay: Math.random() * 0.1 
            }}
            className="fixed pointer-events-none z-50 text-white font-bold text-lg"
            style={{ position: "fixed", left: 0, top: 0, margin: 0, padding: 0 }}
          >
            {item.char}
          </motion.span>
        ))}
      </AnimatePresence>

      <form onSubmit={handleAnimationAndSubmit} className="form space-y-4">
        <div className="form-group">
          <label htmlFor="name" className="form-label text-white">Name*</label>
          <input
            ref={(el) => { inputRefs.current["name"] = el; }}
            id="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Your name" readOnly={status !== "idle"}
            className={`input ${isTextHidden ? "animating-hidden" : ""}`}
            style={{ color: isTextHidden ? "transparent" : "inherit" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="company" className="form-label text-white">Company</label>
          <input
            ref={(el) => { inputRefs.current["company"] = el; }}
            id="company" type="text" value={formData.company} onChange={handleChange} placeholder="Company" readOnly={status !== "idle"}
            className={`input ${isTextHidden ? "animating-hidden" : ""}`}
            style={{ color: isTextHidden ? "transparent" : "inherit" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label text-white">Email*</label>
          <input
            ref={(el) => { inputRefs.current["email"] = el; }}
            id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" readOnly={status !== "idle"}
            className={`input ${isTextHidden ? "animating-hidden" : ""}`}
            style={{ color: isTextHidden ? "transparent" : "inherit" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="message" className="form-label text-white">Message*</label>
          <textarea
            ref={(el) => { inputRefs.current["message"] = el; }}
            id="message" value={formData.message} onChange={handleChange} rows={5} required placeholder="How can I help?" readOnly={status !== "idle"}
            className={`textarea ${isTextHidden ? "animating-hidden" : ""}`}
            style={{ color: isTextHidden ? "transparent" : "inherit" }}
          />
        </div>

        {/* BUTTON AREA */}
        <div className="flex justify-center pt-4 relative z-10 h-20 items-center">
          <motion.button
            ref={buttonRef}
            type="submit"
            disabled={status !== "idle"}
            animate={controls}
            className="relative flex items-center justify-center rounded-md btn btn-primary"
            style={{ minWidth: "150px", minHeight: "50px" }}
          >
            {/* TEXT */}
            <motion.span 
              className="text-white font-semibold"
              animate={{ opacity: status === "sending" ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              Send Message
            </motion.span>

            {/* PLANE - Updated Transition Logic */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: status === "sending" ? 1 : 0 }}
              // FIX: Instant fade out (0 duration) when state is NOT sending
              transition={{ duration: status === "sending" ? 0.5 : 0 }}
            >
               <img 
                 src={planeImg.src} 
                 alt="Sending..." 
                 className="w-16 h-16 object-contain" 
               />
            </motion.div>
          </motion.button>
        </div>
        
        <div className="h-8 text-center"> 
          {status === "error" && <p className="text-red-400 font-medium">{error}</p>}
        </div>
      </form>
    </div>
  );
}