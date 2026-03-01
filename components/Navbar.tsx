"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = ["home", "about", "experience", "contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileActive, setMobileActive] = useState<string | null>(null);

  /* ===== SCROLL BEHAVIOUR ===== */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      setScrolled(current > 20);

      // hide navbar on scroll down
      if (current > lastScrollY && current > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(current);

      // active section detect
      navItems.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* ================= FLOATING NAVBAR ================= */}
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          transition-transform duration-700 ease-in-out
          ${hidden ? "-translate-y-full" : "translate-y-0"}
        `}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className={`
              mt-3 h-[68px]
              rounded-2xl
              flex items-center justify-between
              px-5 sm:px-6
              backdrop-blur-2xl
              border border-white/10
              relative overflow-hidden
              transition-all duration-500
              shadow-[0_10px_30px_rgba(0,0,0,0.25)]
              ${
                scrolled
                  ? "bg-[#0f172a]/60 ring-1 ring-purple-400/30"
                  : "bg-[#0f172a]/45"
              }
            `}
          >
            {/* COSMIC ANIMATED BG */}
            {scrolled && (
              <div className="absolute inset-0 -z-10 opacity-40 animate-cosmic-bg bg-[length:200%_200%] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
            )}

            {/* SOFT GLASS GLOW */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-2xl" />

            {/* LOGO */}
            <h1 className="text-white font-bold text-xl md:text-2xl tracking-wide">
              Zodiac
            </h1>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              {navItems.map((item) => {
                const active = activeSection === item;

                return (
                  <a
                    key={item}
                    href={`#${item}`}
                    className={`relative group transition-all duration-300 ${
                      active
                        ? "text-white"
                        : "text-white/75 hover:text-white"
                    }`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}

                    {/* underline */}
                    <span
                      className={`
                        absolute left-0 -bottom-1 h-[2px]
                        bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
                        transition-all duration-300
                        ${active ? "w-full" : "w-0 group-hover:w-full"}
                      `}
                    />

                    {/* active glow */}
                    {active && (
                      <span className="absolute -inset-2 -z-10 rounded-lg bg-purple-500/20 blur-md" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* ================= CINEMATIC MOBILE MENU ================= */}
      <div
        className={`
          fixed inset-0 w-screen h-screen z-40
          backdrop-blur-2xl bg-[#0f172a]/90
          transition-all duration-700 ease-out
          ${
            mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      >
        {/* cosmic glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute w-96 h-96 bg-purple-600/30 blur-3xl rounded-full -top-20 -left-20 animate-pulse" />
          <div className="absolute w-96 h-96 bg-pink-600/30 blur-3xl rounded-full bottom-0 right-0 animate-pulse" />
        </div>

        {/* menu items */}
        <div
          className={`
            flex flex-col items-center justify-center h-full gap-8 text-2xl font-medium
            transition-all duration-700
            ${
              mobileOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-8 opacity-0"
            }
          `}
        >
          {navItems.map((item, index) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => {
                setMobileActive(item);
                closeMobile();
              }}
              style={{ transitionDelay: `${index * 80}ms` }}
              className={`
                relative transition-all duration-500
                ${
                  mobileActive === item
                    ? "text-white scale-105"
                    : "text-white/80 hover:text-white hover:scale-105"
                }
              `}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}

              {/* underline */}
              <span
                className={`
                  absolute left-0 -bottom-1 h-[2px]
                  bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
                  transition-all duration-300
                  ${mobileActive === item ? "w-full" : "w-0"}
                `}
              />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}