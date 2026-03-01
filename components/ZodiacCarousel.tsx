"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const zodiacSigns = [
  { en: "Aries", hi: "मेष", img: "/zodiac/aries.jpg", href: "/zodiac/aries" },
  { en: "Taurus", hi: "वृषभ", img: "/zodiac/taurus.jpg", href: "/zodiac/taurus" },
  { en: "Gemini", hi: "मिथुन", img: "/zodiac/gemini.jpg", href: "/zodiac/gemini" },
  { en: "Cancer", hi: "कर्क", img: "/zodiac/cancer.jpg", href: "/zodiac/cancer" },
  { en: "Leo", hi: "सिंह", img: "/zodiac/leo.jpg", href: "/zodiac/leo" },
  { en: "Virgo", hi: "कन्या", img: "/zodiac/virgo.jpg", href: "/zodiac/virgo" },
  { en: "Libra", hi: "तुला", img: "/zodiac/libra.jpg", href: "/zodiac/libra" },
  { en: "Scorpio", hi: "वृश्चिक", img: "/zodiac/scorpio.jpg", href: "/zodiac/scorpio" },
  { en: "Sagittarius", hi: "धनु", img: "/zodiac/sagittarius.jpg", href: "/zodiac/sagittarius" },
  { en: "Capricorn", hi: "मकर", img: "/zodiac/capricorn.jpg", href: "/zodiac/capricorn" },
  { en: "Aquarius", hi: "कुंभ", img: "/zodiac/aquarius.jpg", href: "/zodiac/aquarius" },
  { en: "Pisces", hi: "मीन", img: "/zodiac/pisces.jpg", href: "/zodiac/pisces" },
];

export default function ZodiacCarousel() {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [pause, setPause] = useState(false);

  /* ===== AUTO SCROLL ===== */
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let frame: number;
    const speed = 0.7;

    const animate = () => {
      if (!pause) {
        container.scrollLeft += speed;

        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [pause]);

  /* ===== DRAG SCROLL ===== */
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const down = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      setPause(true);
    };

    const move = (e: MouseEvent) => {
      if (!isDown) return;
      const x = e.pageX - container.offsetLeft;
      container.scrollLeft = scrollLeft - (x - startX);
    };

    const up = () => {
      isDown = false;
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

  return (
    <section className="galaxy-section">

      <div className="stars-layer"></div>
      <div className="shooting-star delay1"></div>
      <div className="shooting-star delay2"></div>

      <h2 className="zodiac-title">
        Zodiac Experience
      </h2>

      <div
        ref={carouselRef}
        className="carousel-container"
        onMouseEnter={() => setPause(true)}
        onMouseLeave={() => setPause(false)}
      >
        {[...zodiacSigns, ...zodiacSigns].map((sign, idx) => (
          <div
            key={idx}
            className="zodiac-card"
            onClick={() => router.push(sign.href)}
          >
            <div className="zodiac-image">
              <Image
                src={sign.img}
                alt={sign.en}
                fill
                className="object-cover rounded-full"
              />
            </div>

            <h3>{sign.en}</h3>
            <p>{sign.hi}</p>
          </div>
        ))}
      </div>
    </section>
  );
}