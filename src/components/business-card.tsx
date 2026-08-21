"use client";

import { motion } from "motion/react";
import { useState, useCallback } from "react";
import { Call, Sms } from "iconsax-react";

export default function BusinessCard() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const addRipple = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.15 }}
      className="relative group overflow-hidden"
      style={{ margin: "0 -12px -12px" }}
      onClick={addRipple}
    >
      {/* Ripples */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
            background: "rgba(99,102,241,0.12)",
          }}
        />
      ))}

      {/* Glow overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99,102,241,0.06), transparent 40%)",
        }}
      />

      {/* Top border line with animate on tap */}
      <div className="relative">
        <div className="h-px" style={{ background: "var(--dbx-border-light)", opacity: 0.3 }} />
        {ripples.length > 0 && (
          <motion.div
            key={ripples[ripples.length - 1].id}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 h-px origin-left"
            style={{ background: "rgba(99,102,241,0.5)" }}
          />
        )}
      </div>

      {/* Main content */}
      <div
        className="relative px-3 py-5 space-y-2"
        style={{ background: "var(--dbx-bg-sidebar)" }}
      >
        <div className="flex flex-col gap-3 pl-0">
          <div
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs"
            style={{ color: "var(--dbx-text-secondary)" }}
          >
            <Call size={13} color="currentColor" className="flex-shrink-0" />
            <span>18500540665</span>
          </div>
          <a
            href="mailto:499980564@qq.com"
            className="flex items-center gap-2 rounded-lg px-2 h-9 text-xs transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.97]"
            style={{ color: "var(--dbx-text-secondary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Sms size={13} color="currentColor" className="flex-shrink-0" />
            <span>499980564@qq.com</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
