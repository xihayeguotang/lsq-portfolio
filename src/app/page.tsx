"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ImagesSlider } from "@/components/ui/images-slider";

export default function LandingPage() {
  const router = useRouter();

  const images = [
    "/hero-bg.jpg",
    "/hero-bg-2.jpg",
    "/hero-bg-3.jpg",
  ];

  return (
    <ImagesSlider className="w-full h-full" images={images}>
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <h1 className="text-white text-[56px] font-bold text-center">
          梁松泉・UI 设计作品集
        </h1>
        <p className="text-white/60 text-[28px] max-w-xl mt-4 text-center">
          UI Designer | Visual &amp; Interaction Design
        </p>
        <motion.button
          onClick={() => router.push("/chat")}
          className="px-8 py-3 border-none text-white mx-auto text-center rounded-full relative mt-14 cursor-pointer font-medium shadow-lg"
          style={{
            background: "linear-gradient(135deg, #1a1a1a, #333333)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
          whileHover={{ scale: 1.05, boxShadow: "0 6px 32px rgba(0,0,0,0.5)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span className="text-lg tracking-wide">查看作品</span>
        </motion.button>
      </motion.div>
    </ImagesSlider>
  );
}
