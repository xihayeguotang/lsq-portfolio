"use client";

import { motion } from "motion/react";
import { VolumeHigh } from "iconsax-react";

/** 首次访问的欢迎引导卡：给访客两个入口（首页落地页使用） */
export function IntroCard({
  onListen,
  onBrowse,
}: {
  onListen: () => void;
  onBrowse: () => void;
}) {
  return (
    <motion.div
      className="intro-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="intro-card-actions">
        <motion.button
          className="intro-card-btn intro-card-btn-primary"
          onClick={onListen}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <VolumeHigh size={16} color="currentColor" aria-hidden />
          <span>自助讲解</span>
        </motion.button>
        <motion.button
          className="intro-card-btn"
          onClick={onBrowse}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>自由浏览</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
