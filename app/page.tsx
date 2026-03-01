"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ZodiacCarousel from "@/components/ZodiacCarousel";
import GlowingSection from "@/components/GlowingSection";
import AIChatAstrologer from "@/components/AIChatAstrologer";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  /* ===== COSMIC CURSOR ===== */
  useEffect(() => {
    const move = (e: MouseEvent) =>
      setCursor({ x: e.clientX, y: e.clientY });

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* ===== SCROLL REVEAL ===== */
  useEffect(() => {
    const reveal = () => {
      const elements = document.querySelectorAll(".reveal");

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          el.classList.add("active");
        }
      });
    };

    reveal();
    window.addEventListener("scroll", reveal);
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* COSMIC CURSOR */}
      <div
        className="cosmic-cursor"
        style={{ left: cursor.x, top: cursor.y }}
      />

      <Navbar />

      {/* ================= MAIN ================= */}
      {/* removed extra top padding (FIXED GAP) */}
      <main className="relative pt-0 bg-gradient-to-br from-sky-50 via-indigo-50 to-pink-50">

        {/* ZODIAC HERO */}
        <GlowingSection className="py-0 reveal">
          <ZodiacCarousel />
        </GlowingSection>

        <GlowingSection className="py-0 reveal">
          <AIChatAstrologer />
        </GlowingSection>

        {/* ABOUT */}
        <GlowingSection className="py-0 reveal">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">

            <div className="flex-shrink-0 w-full md:w-1/3">
              <Image
                src="/images/manoj-about.jpg"
                alt="Manoj Kumar Mishra"
                width={320}
                height={320}
                className="rounded-3xl shadow-xl object-cover w-full border border-white/40"
              />
            </div>

            <div className="md:w-2/3 space-y-4 text-left">
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">
                About Manoj Kumar Mishra
              </h2>

              <p className="text-gray-700 text-lg leading-relaxed">
                Manoj Kumar Mishra brings decades of experience in Vedic Astrology,
                guiding individuals and businesses toward clarity, stability,
                and growth.
              </p>

              <Link
                href="/about"
                className="magnetic inline-block bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-full font-semibold text-white shadow-lg"
              >
                Discover More
              </Link>
            </div>
          </div>
        </GlowingSection>

        {/* DIVIDER */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400/40 to-transparent my-12" />

        {/* SERVICES */}
        <GlowingSection className="py-0 reveal">
          <div className="max-w-6xl mx-auto px-6 text-center">

            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">
              Astrology Services
            </h2>

            <p className="text-gray-600 mb-8">
              Personalized spiritual guidance for life, relationships and business growth.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Kundli Analysis", desc: "Deep planetary insights." },
                { title: "Marriage Matching", desc: "Compatibility analysis." },
                { title: "Career Guidance", desc: "Align with cosmic strengths." },
                { title: "Business Astrology", desc: "Strategic growth timing." },
                { title: "Gemstone Consultation", desc: "Energy balancing remedies." },
                { title: "Vastu Consultation", desc: "Harmony for spaces." },
              ].map((service, index) => (
                <div
                  key={index}
                  className="relative backdrop-blur-lg bg-white/50 border border-white/40 p-6 rounded-3xl shadow-lg hover:scale-105 transition"
                >
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </GlowingSection>

      </main>

      <Footer />
    </div>
  );
}