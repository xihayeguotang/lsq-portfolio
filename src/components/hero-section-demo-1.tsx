"use client";

import { motion } from "motion/react";
import { SparklesCore } from "@/components/ui/sparkles";
import TvSim from "@/components/tv-sim";

export default function HeroSectionOne() {
  return (
    <div className="relative w-full flex flex-col items-center pt-10 md:pt-20 pb-10 md:pb-16 overflow-hidden">
      {/* Decorative gradient lines */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80 pointer-events-none">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-[#6366f1] to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80 pointer-events-none">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-[#6366f1] to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80 pointer-events-none">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-[#6366f1] to-transparent" />
      </div>

      {/* Decorative background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* Title */}
      <div className="relative w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Sparkles decoration — 与标题重合 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-2xl h-48">
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={400}
              className="w-full h-full"
              particleColor="#6366f1"
            />
            <div className="absolute inset-0 w-full h-full bg-transparent" style={{ maskImage: "radial-gradient(400px 150px at center, transparent 10%, white)", WebkitMaskImage: "radial-gradient(400px 150px at center, transparent 10%, white)" }} />
          </div>
        </div>

        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-6xl dark:text-slate-300">
          {"百科 TV 大屏端设计"
            .split("")
            .map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.04,
                  ease: "easeInOut",
                }}
                className="mr-[0.02em] inline-block"
              >
                {char}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-base font-normal md:text-lg" style={{ color: "var(--dbx-text-secondary)" }}
        >
          远距离交互适配 · 家庭大屏学习体验
        </motion.p>
      </div>

      {/* TV Simulation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="relative z-10 w-full mt-16 md:mt-20"
      >
        <TvSim />
      </motion.div>
    </div>
  );
}
