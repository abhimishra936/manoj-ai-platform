"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const zodiacSigns = [
  { en: "Aries (Ram)", hi: "मेष", img: "/zodiac/aries.jpg", href: "/zodiac/aries" },
  { en: "Taurus (Bull)", hi: "वृषभ", img: "/zodiac/taurus.jpg", href: "/zodiac/taurus" },
  { en: "Gemini (Twins)", hi: "मिथुन", img: "/zodiac/gemini.jpg", href: "/zodiac/gemini" },
  { en: "Cancer (Crab)", hi: "कर्क", img: "/zodiac/cancer.jpg", href: "/zodiac/cancer" },
  { en: "Leo (Lion)", hi: "सिंह", img: "/zodiac/leo.jpg", href: "/zodiac/leo" },
  { en: "Virgo (Virgin)", hi: "कन्या", img: "/zodiac/virgo.jpg", href: "/zodiac/virgo" },
  { en: "Libra (Scales)", hi: "तुला", img: "/zodiac/libra.jpg", href: "/zodiac/libra" },
  { en: "Scorpio (Scorpion)", hi: "वृश्चिक", img: "/zodiac/scorpio.jpg", href: "/zodiac/scorpio" },
  { en: "Sagittarius (Archer)", hi: "धनु", img: "/zodiac/sagittarius.jpg", href: "/zodiac/sagittarius" },
  { en: "Capricorn (Goat)", hi: "मकर", img: "/zodiac/capricorn.jpg", href: "/zodiac/capricorn" },
  { en: "Aquarius (Pitcher)", hi: "कुंभ", img: "/zodiac/aquarius.jpg", href: "/zodiac/aquarius" },
  { en: "Pisces (Fish)", hi: "मीन", img: "/zodiac/pisces.jpg", href: "/zodiac/pisces" },
];

export default function ZodiacCarousel() {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);

  const [pause, setPause] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);

  /* ===== PARALLAX ===== */
  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ===== AUTO SCROLL ===== */
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let frame: number;
    const speed = 0.45;

    const animate = () => {
      if (!pause) {
        const half = container.scrollWidth / 2;
        container.scrollLeft += speed;

        if (container.scrollLeft >= half) {
          container.scrollLeft -= half;
        }
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [pause]);

  /* ===== DRAG SCROLL FIXED ===== */
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const down = (e: MouseEvent) => {
      isDown = true;
      container.classList.add("cursor-grabbing");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      setPause(true);
    };

    const move = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = x - startX;
      container.scrollLeft = scrollLeft - walk * 1.2;
    };

    const up = () => {
      isDown = false;
      container.classList.remove("cursor-grabbing");
      setPause(false);
    };

    container.addEventListener("mousedown", down);
    container.addEventListener("mousemove", move);
    container.addEventListener("mouseup", up);
    container.addEventListener("mouseleave", up);

    return () => {
      container.removeEventListener("mousedown", down);
      container.removeEventListener("mousemove", move);
      container.removeEventListener("mouseup", up);
      container.removeEventListener("mouseleave", up);
    };
  }, []);

  /* ===== AUTO CENTER ===== */
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const cards = Array.from(
        container.querySelectorAll(".zodiac-item")
      ) as HTMLElement[];

      const center =
        container.scrollLeft + container.clientWidth / 2;

      let closest = 0;
      let min = Infinity;

      cards.forEach((card, i) => {
        const c = card.offsetLeft + card.clientWidth / 2;
        const d = Math.abs(center - c);
        if (d < min) {
          min = d;
          closest = i;
        }
      });

      setActiveIndex(closest);
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">

      {/* PARALLAX RING */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ transform: `translateY(${offset * 0.08}px)` }}
      >
        <div className="w-[500px] h-[500px] border border-white/10 rounded-full animate-spin-slow" />
      </div>

      <h2 className="relative z-10 text-center text-4xl md:text-5xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
        Zodiac Experience
      </h2>

      <div className="relative z-10 overflow-hidden">
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto no-scrollbar px-4 cursor-grab select-none"
          onMouseEnter={() => setPause(true)}
          onMouseLeave={() => {
            setPause(false);
            setHovered(null);
          }}
        >
          {[...zodiacSigns, ...zodiacSigns].map((sign, idx) => {
            const active =
              hovered === idx || activeIndex === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHovered(idx)}
                onClick={() => router.push(sign.href)}
                className={`zodiac-item relative flex-shrink-0 w-[180px] rounded-3xl p-4 text-center transition-all duration-500 animate-float
                  ${
                    active
                      ? "scale-105 bg-indigo-900/40 z-20"
                      : "scale-95 opacity-70 bg-indigo-900/20"
                  }
                `}
              >
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <Image
                    src={sign.img}
                    alt={sign.en}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                <h3 className="text-white font-semibold text-lg">
                  {sign.en}
                </h3>
                <p className="text-purple-200 text-sm">{sign.hi}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}