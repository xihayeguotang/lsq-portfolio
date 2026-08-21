"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft } from "iconsax-react";
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
        className="flex items-center justify-between px-4 sm:px-8"
        style={{ height: "var(--dbx-header-height)", flexShrink: 0 }}
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/chat")}
            className="flex items-center gap-1.5 cursor-pointer group"
            style={{ color: "var(--dbx-text-tertiary)" }}
            title="AI 助手"
          >
            <ArrowLeft size={18} color="currentColor" />
            <span
              className="text-xs transition-all duration-200 opacity-0 group-hover:opacity-100 whitespace-nowrap"
              style={{ color: "var(--dbx-text-tertiary)" }}
            >
              AI 助手
            </span>
          </motion.button>
        </div>
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
