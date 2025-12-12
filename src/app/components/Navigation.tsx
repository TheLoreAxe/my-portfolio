"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../assets/ms_logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <nav className="navbar">
      <a href="#about" className="navbar-logo">
        <Image 
          src={logo} 
          alt="MS Logo" 
          width={100} 
          height={100} 
          className="logo-image"
        />
      </a>

      {/* Hamburger Icon (Visible only on mobile via CSS) */}
      <div className="hamburger" onClick={toggleMenu}>
        <span className={isOpen ? "bar open" : "bar"}></span>
        <span className={isOpen ? "bar open" : "bar"}></span>
        <span className={isOpen ? "bar open" : "bar"}></span>
      </div>

      {/* Navigation Links */}
      <div className={`nav-menu ${isOpen ? "active" : ""}`}>
        <a href="#about" className="nav-link" onClick={toggleMenu}>About Me</a>
        <a href="#skills" className="nav-link" onClick={toggleMenu}>Skills</a>
        <a href="#projects" className="nav-link" onClick={toggleMenu}>Projects</a>
        <a href="#experience" className="nav-link" onClick={toggleMenu}>Experience</a>
        <a href="#contact" className="nav-link" onClick={toggleMenu}>Contact Me</a>
      </div>
    </nav>
  );
};

export default Navbar;