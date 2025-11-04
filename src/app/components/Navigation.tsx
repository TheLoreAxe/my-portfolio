"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "../assets/ms_logo.png";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
      <nav className="navbar navbar-shell">
        <div className="navbar-inner">
          <a href="#about" className="logo-link" onClick={closeMenu}>
            <Image 
              src={logo} 
              alt="MS Logo" 
              width={100} 
              height={100} 
              className="logo"
            />
          </a>
          <button 
            className="hamburger"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`nav-links ${isMenuOpen ? "nav-links--open" : ""}`}>
            <a href="#about" className="nav-link" onClick={closeMenu}>About Me</a>
            <a href="#skills" className="nav-link" onClick={closeMenu}>Skills</a>
            <a href="#projects" className="nav-link" onClick={closeMenu}>Projects</a>
            <a href="#experience" className="nav-link" onClick={closeMenu}>Experience</a>
            <a href="#contact" className="nav-link" onClick={closeMenu}>Contact Me</a>
          </div>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}
    </>
  );
}
