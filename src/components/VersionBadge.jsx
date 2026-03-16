import React from "react";

/**
 * VersionBadge - Compressed Circular Edition
 * Optimized for Tailwind v4 + Vite 8
 */
export default function VersionBadge() {
  return (
    <div className="group relative flex items-center justify-center">
      {/* The actual badge */}
      <div className="
        size-12 
        flex flex-col items-center justify-center 
        rounded-full 
        bg-red-950/90 border border-red-500/40
        text-red-200 font-mono leading-none
        shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]
        select-none cursor-default
        transition-all duration-300 hover:border-red-400
      ">
        <span className="text-[9px] font-bold opacity-80 mb-0.5">HF</span>
        <div className="h-px w-4 bg-red-500/30 my-0.5" />
        <span className="text-[8px] tracking-tighter">V1.0</span>
      </div>

      {/* Optional Tooltip for the full date on hover */}
      <span className="absolute -bottom-8 scale-0 transition-all rounded bg-gray-800 p-1 text-[10px] text-white group-hover:scale-100">
        © 2026
      </span>
    </div>
  );
}