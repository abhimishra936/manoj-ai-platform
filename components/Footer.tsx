"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const [stars, setStars] = useState<{ top: string; left: string; size: string; delay: string }[]>([]);

  useEffect(() => {
    // Generate 30 random stars only on the client
    const generatedStars = Array.from({ length: 30 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      delay: `${Math.random() * 5}s`,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <footer className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white pt-16 pb-8 overflow-hidden">
      {/* Floating stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white/30 rounded-full animate-pulse"
            style={{
              width: star.size,
              height: star.size,
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-left">
        {/* Help / About */}
        <div>
          <h3 className="text-xl font-bold mb-4 relative inline-block footer-heading">
            HELP
            <span className="absolute left-0 -bottom-1 w-full h-1 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 animate-gradient-slide"></span>
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Get solutions for your daily life challenges. Astrology provides clarity for the issues we often can't understand ourselves.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4 relative inline-block footer-heading">
            Contact
            <span className="absolute left-0 -bottom-1 w-full h-1 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 animate-gradient-slide"></span>
          </h3>
          <p className="text-gray-300 text-sm">
            📍 Golaghat Gadhaiya, Bhagalpur-812002, Bihar, India <br />
            📧 <Link href="mailto:mishra@panditmanojkumarmishra.com" className="underline hover:text-yellow-400 transition-colors">
              mishra@panditmanojkumarmishra.com
            </Link> <br />
            📞 (+91) 9431001096, (+91) 7004992838
          </p>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 relative inline-block footer-heading">
            Follow Us
            <span className="absolute left-0 -bottom-1 w-full h-1 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 animate-gradient-slide"></span>
          </h3>
          <div className="flex space-x-4 mt-2">
            <Link href="#" className="footer-icon"><FaFacebookF size={22} /></Link>
            <Link href="#" className="footer-icon"><FaInstagram size={22} /></Link>
            <Link href="#" className="footer-icon"><FaWhatsapp size={22} /></Link>
          </div>
        </div>
      </div>

      {/* Divider & copyright */}
      <div className="border-t border-white/20 mt-8 pt-4 text-center text-gray-400 text-sm">
        &copy; 2019 Made by Abhishek Mishra. All rights reserved.
      </div>

      {/* Neon/glow & animated underline styles */}
      <style jsx>{`
        .footer-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: all 0.3s ease;
          text-shadow: 0 0 5px #fff, 0 0 10px #f0f, 0 0 15px #ff0;
        }
        .footer-icon:hover {
          color: #fffa;
          transform: scale(1.2);
          text-shadow: 0 0 10px #fff, 0 0 20px #f0f, 0 0 30px #ff0;
        }

        .animate-gradient-slide {
          background-size: 200% 100%;
          animation: gradient-slide 3s linear infinite;
        }

        @keyframes gradient-slide {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 0%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
    </footer>
  );
}