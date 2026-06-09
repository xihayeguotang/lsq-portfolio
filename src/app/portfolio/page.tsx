"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import PortfolioGrid from "@/components/portfolio-grid";
import Breadcrumb from "@/components/ui/breadcrumb";

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
            className="flex items-center gap-1.5 cursor-pointer"
            style={{ color: "var(--dbx-text-tertiary)" }}
            title="AI 助手"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </motion.button>
          <Breadcrumb
            items={[
              { label: "作品集" },
            ]}
          />
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
