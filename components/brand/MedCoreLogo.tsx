import React from "react";
import Link from "next/link";

interface MedCoreLogoProps {
  variant?: "full" | "icon";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function MedCoreLogo({
  variant = "full",
  className = "",
  size = "md",
}: MedCoreLogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const subtitleSizes = {
    sm: "text-[9px] tracking-wider",
    md: "text-[10px] tracking-widest",
    lg: "text-xs tracking-widest",
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* High-Tech Glowing Medical SVG Mark */}
      <div
        className={`relative ${iconSizes[size]} rounded-xl bg-slate-900 border border-teal-500/40 p-1.5 flex items-center justify-center shadow-lg shadow-teal-500/10 group-hover:border-cyan-400 group-hover:shadow-cyan-500/20 transition-all duration-300`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          {/* Medical Cross Arms */}
          <path
            d="M20 5V12M20 28V35M5 20H12M28 20H35"
            stroke="url(#logo-grad)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Center Heartbeat Pulse */}
          <path
            d="M10 20H15L17.5 13L22.5 27L25 20H30"
            stroke="#38BDF8"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* AI Neural Synapse Center Node */}
          <circle cx="20" cy="20" r="2.8" fill="#10B981" />
        </svg>

        {/* Ambient Pulse Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300 -z-10" />
      </div>

      {variant === "full" && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight text-white ${textSizes[size]}`}>
              Med<span className="text-cyan-400">Core</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-sm">
              AI
            </span>
          </div>
          <span
            className={`font-semibold uppercase text-slate-400 font-mono ${subtitleSizes[size]} mt-0.5`}
          >
            Smart Clinic &amp; Telehealth
          </span>
        </div>
      )}
    </Link>
  );
}
