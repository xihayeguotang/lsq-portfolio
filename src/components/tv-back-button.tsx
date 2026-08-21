"use client";

import { ArrowLeft } from "iconsax-react";

export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-5 z-50 flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-all duration-200 hover:bg-white/10"
      style={{ color: "rgba(255,255,255,0.7)" }}
    >
      <ArrowLeft size={20} color="currentColor" />
    </button>
  );
}
