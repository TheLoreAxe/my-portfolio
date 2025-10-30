import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import logo from "./assets/ms_logo.png";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matthew Steffan",
  description: "Matthew Steffan Portfolio",
  icons: {
    icon: "/assets/ms_logo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="navbar navbar-shell">
          <div className="navbar-inner">
            <a href="#about" className="flex items-center">
              <Image src={logo} alt="MS Logo" width={100} height={100} style={{height: 100, width: 100, marginRight: 16}} />
            </a>
            <div className="nav-links">
              <a href="#about" className="nav-link">About Me</a>
              <a href="#skills" className="nav-link">Skills</a>
              <a href="#projects" className="nav-link">Projects</a>
              <a href="#experience" className="nav-link">Experience</a>
              <a href="#contact" className="nav-link">Contact Me</a>
            </div>
          </div>
        </nav>
        <div className="site-container pt-20">{children}</div>
      </body>
    </html>
  );
}
