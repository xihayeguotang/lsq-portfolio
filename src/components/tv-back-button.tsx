"use client";

export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-5 z-50 flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-all duration-200 hover:bg-white/10"
      style={{ color: "rgba(255,255,255,0.7)" }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
  );
}
