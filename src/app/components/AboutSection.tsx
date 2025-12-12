"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUOTES } from "./quotes";

function getRandomQuote(quotes: typeof QUOTES, currentIndex?: number): number {
  if (quotes.length <= 1) return 0;
  
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * quotes.length);
  } while (newIndex === currentIndex && quotes.length > 1);
  
  return newIndex;
}

export default function AboutSection() {
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [isTwinkling, setIsTwinkling] = useState(false);

  // Pick a random quote on page load
  useEffect(() => {
    setQuoteIndex(getRandomQuote(QUOTES));
  }, []);

  const handleQuoteClick = () => {
    setIsTwinkling(true);
    
    // After twinkle animation, change to new quote
    setTimeout(() => {
      setQuoteIndex(getRandomQuote(QUOTES, quoteIndex));
      setIsTwinkling(false);
    }, 600); // Match animation duration
  };

  const currentQuote = QUOTES[quoteIndex];

  return (
    <section id="about" className="section section--about">
      <h1 className="section-title section-title--lg accent">About Me</h1>
      <p className="about-intro">Hi! I&apos;m Matthew!<br /><br />
      I am a software Developer with a love of automation and problem solving. I believe 
      in the power of technology to solve real-world problems and improve efficiency by creating the most user friendly environment.  
      <br /><br /> Welcome to my portfolio!</p>
      
      <motion.blockquote
        className={`quote-container ${isTwinkling ? "twinkling" : ""}`}
        onClick={handleQuoteClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIndex}
            className="quote-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <p>&ldquo;{currentQuote.quote}&rdquo;</p>
            <footer>{currentQuote.author}</footer>
          </motion.div>
        </AnimatePresence>
      </motion.blockquote>
      
      <p className="quote-hint">Click the quote to see another one!</p>
    </section>
  );
}


