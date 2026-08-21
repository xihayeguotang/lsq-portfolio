"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ImagesSlider } from "@/components/ui/images-slider";
import { IntroCard } from "@/components/intro-card";
import { warmupAudio } from "@/lib/audio-context";

export default function LandingPage() {
  const router = useRouter();

  const images = [
    "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/assets/hero-bg.jpg",
    "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/assets/hero-bg-2.jpg",
    "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/assets/hero-bg-3.jpg",
  ];

  function goListen() {
    warmupAudio(); // 用户手势内预热共享音频,确保跳转后自动朗读不被浏览器静音
    router.push("/chat?intro=listen");
  }
  function goBrowse() {
    router.push("/portfolio");
  }

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
        <div className="w-full max-w-[440px] mt-10">
          <IntroCard onListen={goListen} onBrowse={goBrowse} />
        </div>
      </motion.div>
    </ImagesSlider>
  );
}
