"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function GlowingSection({ children, className = "" }: Props) {
  return (
    <div className={`relative rounded-3xl p-6 ${className}`}>
      {/* Glowing border */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 blur-2xl opacity-30 animate-pulse-slow pointer-events-none"></div>
      {/* Inner content */}
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes pulse-slow {
          0% { opacity: 0.2; transform: scale(0.95); }
          50% { opacity: 0.4; transform: scale(1); }
          100% { opacity: 0.2; transform: scale(0.95); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}