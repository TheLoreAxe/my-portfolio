"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import airplaneImg from "@/app/assets/airplane.png";
import Image from "next/image";
type SubmitStatus = "idle" | "sending" | "success" | "error";

/**
 * Global styles to override browser-specific autofill styling.
 * Ensures the dark theme is maintained even when browser autofills inputs.
 */
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

// Utility to get element coordinates relative to the viewport
const getRect = (element: HTMLElement | null) => {
  if (!element)
    return { x: 0, y: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
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

  // Animation controls
  const buttonControls = useAnimation();
  const planeControls = useAnimation();

  const flightPath =
    "M0,0 C450,-75 300,-400 100,-400 C-200,-350 -300,300 1200,-600";

  const inputRefs = useRef<{
    [key: string]: HTMLInputElement | HTMLTextAreaElement | null;
  }>({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Lock horizontal scroll during animation to prevent layout shifts from the flying element
  useEffect(() => {
    if (status === "sending") {
      document.body.style.overflowX = "hidden";
      document.documentElement.style.overflowX = "hidden";
    } else {
      document.body.style.overflowX = "";
      document.documentElement.style.overflowX = "";
    }
    return () => {
      document.body.style.overflowX = "";
      document.documentElement.style.overflowX = "";
    };
  }, [status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAnimationAndSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status !== "idle") return;

    const btnRect = getRect(buttonRef.current);
    setStatus("sending");

    // 1. Particle Generation
    // Breaks input values into floating characters that converge on the button.
    const chars: FloatingChar[] = [];
    const createParticles = (key: keyof typeof formData) => {
      const el = inputRefs.current[key];
      if (!el) return;
      const rect = getRect(el);
      const text = formData[key];

      // Sampling strategy for performance optimization
      const MAX_PARTICLES_PER_FIELD = 30;
      const step = Math.ceil(text.length / MAX_PARTICLES_PER_FIELD);

      for (let i = 0; i < text.length; i += step) {
        const char = text[i];
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

    Object.keys(formData).forEach((k) =>
      createParticles(k as keyof typeof formData)
    );
    setFloatingChars(chars);

    // 2. Initial Animation State
    // Hide button, show plane, and start particle convergence.
    buttonControls.start({
      backgroundColor: "rgba(255,255,255,0)",
      boxShadow: "none",
      transition: { duration: 0.5 },
    });

    planeControls.start({
      opacity: 1,
      transition: { duration: 0.5 },
    });

    // Await particle convergence duration
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setFloatingChars([]);

    // 3. Flight Animation
    // Animates offsetDistance along the SVG path defined in `flightPath`.
    await planeControls.start({
      offsetDistance: "100%",
      opacity: 0,
      transition: {
        duration: 4,
        ease: "easeInOut",
      },
    });

    // 4. Data Submission & Cleanup
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed");

      setFormData({ name: "", company: "", email: "", message: "" });

      // Delay for UX feel before resetting
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Silent reset of plane position
      planeControls.set({ offsetDistance: "0%", opacity: 0 });

      setStatus("success");
      setTimeout(() => setStatus("idle"), 10);

      // Restore button state
      await buttonControls.start({
        opacity: 1,
        backgroundColor: "#dc2626",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.8, ease: "easeOut" },
      });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : String(err));

      // Error state recovery
      planeControls.set({ offsetDistance: "0%", opacity: 0 });
      buttonControls.set({
        opacity: 1,
        backgroundColor: "#dc2626",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      });
    }
  };

  const isTextHidden = status === "sending";

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <style>{globalStyles}</style>

      {/* Particle Rendering Layer */}
      <AnimatePresence>
        {floatingChars.map((item) => (
          <motion.span
            key={item.id}
            initial={{ x: item.startX, y: item.startY, opacity: 1, scale: 1 }}
            animate={{
              x: item.targetX,
              y: item.targetY,
              opacity: 0,
              scale: 0.2,
            }}
            transition={{
              duration: 0.9,
              ease: "backIn",
              delay: Math.random() * 0.1,
            }}
            className="fixed pointer-events-none z-50 text-white font-bold text-lg"
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              margin: 0,
              padding: 0,
            }}
          >
            {item.char}
          </motion.span>
        ))}
      </AnimatePresence>

      <form onSubmit={handleAnimationAndSubmit} className="form space-y-4">
        {["name", "company", "email", "message"].map((field) => (
          <div className="form-group" key={field}>
            <label htmlFor={field} className="form-label text-white capitalize">
              {field}
              {field !== "company" && "*"}
            </label>
            {field === "message" ? (
              <textarea
                ref={(el) => {
                  inputRefs.current[field] = el;
                }}
                id={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                rows={5}
                required
                placeholder={field === "message" ? "How can I help?" : ""}
                readOnly={status !== "idle"}
                className={`textarea ${isTextHidden ? "animating-hidden" : ""}`}
                style={{ color: isTextHidden ? "transparent" : "inherit" }}
              />
            ) : (
              <input
                ref={(el) => {
                  inputRefs.current[field] = el;
                }}
                id={field}
                type={field === "email" ? "email" : "text"}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                required={field !== "company"}
                placeholder={
                  field === "name"
                    ? "Your name"
                    : field === "email"
                    ? "you@example.com"
                    : "Company"
                }
                readOnly={status !== "idle"}
                className={`input ${isTextHidden ? "animating-hidden" : ""}`}
                style={{ color: isTextHidden ? "transparent" : "inherit" }}
              />
            )}
          </div>
        ))}

        {/* Submit Button & Flight Container */}
        <div className="flex justify-center pt-4 relative z-10 h-20 items-center">
          <motion.button
            ref={buttonRef}
            type="submit"
            disabled={status !== "idle"}
            animate={buttonControls}
            className="relative flex items-center justify-center rounded-md btn btn-primary"
            style={{ minWidth: "150px", minHeight: "50px" }}
          >
            <motion.span
              className="text-white font-semibold"
              animate={{ opacity: status === "sending" ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              Send Message
            </motion.span>

            {/* Plane Icon with Motion Path Animation */}
            <motion.div
              animate={planeControls}
              className="absolute left-1/2 top-1/2"
              style={{
                x: "-50%",
                y: "-50%",
                offsetPath:
                  status === "sending" ? `path("${flightPath}")` : "none",
                offsetRotate: status === "sending" ? "auto 0deg" : "0deg",
                offsetAnchor: "50% 50%",
              }}
              initial={{ opacity: 0 }}
            >
              <Image
                src={airplaneImg} // The Image component handles both strings and import objects automatically
                alt="Sending..."
                width={48}
                height={48}
                className="object-contain"
                style={{ transform: "rotate(30deg)" }}
              />
            </motion.div>
          </motion.button>
        </div>
        <div className="h-8 text-center">
          {status === "error" && (
            <p className="text-red-400 font-medium">{error}</p>
          )}
        </div>
      </form>
    </div>
  );
}
