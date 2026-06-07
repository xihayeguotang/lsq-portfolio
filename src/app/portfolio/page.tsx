"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import PortfolioGrid from "@/components/portfolio-grid";

export default function PortfolioPage() {
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: "var(--dbx-bg-base)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center justify-between px-8"
        style={{ height: "var(--dbx-header-height)", flexShrink: 0 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium" style={{ color: "var(--dbx-text-primary)" }}>作品集</span>
          {/* Decorative dot */}
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/chat")}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer"
          style={{
            color: "var(--dbx-text-primary)",
            background: "var(--dbx-fill-trans-10)",
            border: "1px solid var(--dbx-border-light)",
          }}
        >
          AI 助手
        </motion.button>
      </motion.div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PortfolioGrid />
        </motion.div>
      </div>
    </div>
  );
}
