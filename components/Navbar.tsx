"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          h-[80px]
          transition-all duration-500 ease-in-out
          ${hidden ? "-translate-y-full" : "translate-y-0"}
          backdrop-blur-xl
          border-b border-white/10
          ${scrolled
            ? "bg-[#0f172a]/90 shadow-xl"
            : "bg-[#0f172a]/60"}
        `}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* Logo */}
          <h1 className="text-xl md:text-2xl font-bold tracking-wide text-white">
            Zodiac
          </h1>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {["home", "about", "experience", "contact"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="relative group text-white/80 hover:text-white transition"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Mobile Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`
          fixed top-[80px] left-0 w-full z-40
          transition-all duration-500 ease-in-out
          backdrop-blur-xl
          bg-[#0f172a]/95
          border-b border-white/10
          ${mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}
        `}
      >
        <div className="flex flex-col items-center py-6 gap-6 text-lg">
          {["home", "about", "experience", "contact"].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={closeMobile}
              className="text-white/80 hover:text-white transition"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}