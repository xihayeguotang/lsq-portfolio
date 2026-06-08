"use client";

import { motion } from "motion/react";
import { SparklesCore } from "@/components/ui/sparkles";
import PhoneMockup from "@/components/phone-mockup";

const activityImages = [
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/overseas-localization/activity-1.jpg", alt: "完课返现活动 1", bottom: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/overseas-localization/phone-bottom.jpg" },
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/overseas-localization/activity-2.jpg", alt: "完课返现活动 2", bottom: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/overseas-localization/phone-bottom-2.png" },
];

export default function HeroSectionOverseasLocalization() {
  return (
    <div className="relative w-full flex flex-col items-center pt-10 md:pt-20 pb-14 overflow-hidden">
      {/* Decorative gradient lines */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-800/80 pointer-events-none">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-[#0ea5e9] to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-800/80 pointer-events-none">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-[#0ea5e9] to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-800/80 pointer-events-none">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-[#0ea5e9] to-transparent" />
      </div>

      {/* Decorative background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Title */}
      <div className="relative w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Sparkles decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-2xl h-48">
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={400}
              className="w-full h-full"
              particleColor="#0ea5e9"
            />
            <div className="absolute inset-0 w-full h-full bg-transparent" style={{ maskImage: "radial-gradient(400px 150px at center, transparent 10%, white)", WebkitMaskImage: "radial-gradient(400px 150px at center, transparent 10%, white)" }} />
          </div>
        </div>

        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold md:text-4xl lg:text-6xl" style={{ color: "var(--dbx-text-primary)" }}>
          {"Creta Class（クレタクラス）"
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
          日本版 APP 视觉设计 · 体验改版与长期迭代
        </motion.p>
      </div>

      {/* ====== 完课返现活动：左文右图 ====== */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 mt-20 md:mt-28">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* 左侧：标题 + 说明 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-[340px] flex-shrink-0"
          >
            <div className="flex items-center gap-3 mb-8">
              <span
                className="text-2xl md:text-3xl font-mono font-bold tracking-wider leading-none"
                style={{ color: "#0ea5e9" }}
              >
                01
              </span>
              <div className="h-px w-8" style={{ background: "linear-gradient(90deg, #0ea5e9, transparent)" }} />
              <h2
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "var(--dbx-text-primary)" }}
              >
                长期完课返现活动
              </h2>
            </div>
            <div className="mb-2 text-xs font-medium" style={{ color: "var(--dbx-text-tertiary)" }}>
              项目背景
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--dbx-text-secondary)" }}
            >
              在历史体验课完课返亚马逊卡活动中，活动对完课率产生了明显的提升作用且没有产生收入损失。再通过观测历史用户订阅及完课数据，用户的长期完课表现较差。因此为提升用户的升年率及长期续订率，向用户推出长期完课返现活动。
            </p>
          </motion.div>

          {/* 右侧：手机模型 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex justify-center gap-4 sm:gap-6"
          >
            {activityImages.map((item, i) => (
              <PhoneMockup
                key={i}
                src={item.src}
                alt={item.alt}
                bottom={item.bottom}
                className="w-[200px] sm:w-[240px] md:w-[280px]"
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 斜纹分割条 */}
      <div className="relative w-full my-10 md:my-14">
        <div
          className="w-full h-px"
          style={{ background: "rgba(100,100,100,0.15)" }}
        />
        <div className="relative w-full h-7 overflow-hidden">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: "repeating-linear-gradient(-45deg, rgba(100,100,100,0.15) 0px, rgba(100,100,100,0.15) 1px, transparent 1px, transparent 8px)",
            }}
          />
        </div>
        <div
          className="w-full h-px"
          style={{ background: "rgba(100,100,100,0.15)" }}
        />
      </div>

      {/* ====== 推荐返现转介绍活动：左文右图 ====== */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* 左侧：标题 + 说明 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-[340px] flex-shrink-0"
          >
            <div className="flex items-center gap-3 mb-8">
              <span
                className="text-2xl md:text-3xl font-mono font-bold tracking-wider leading-none"
                style={{ color: "#0ea5e9" }}
              >
                02
              </span>
              <div className="h-px w-8" style={{ background: "linear-gradient(90deg, #0ea5e9, transparent)" }} />
              <h2
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "var(--dbx-text-primary)" }}
              >
                推荐返现转介绍活动
              </h2>
            </div>
            <div className="mb-2 text-xs font-medium" style={{ color: "var(--dbx-text-tertiary)" }}>
              项目背景
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--dbx-text-secondary)" }}
            >
              日本业务计划上线现金返现活动进行获客，引导用户进行转介绍成单活动。
            </p>
            <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--dbx-text-secondary)" }}>
              <span className="font-medium" style={{ color: "var(--dbx-text-primary)" }}>优势：</span>
              是海外比较成熟的模式，使用此模式方便与KOL合作。
            </p>
            <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--dbx-text-secondary)" }}>
              <span className="font-medium" style={{ color: "var(--dbx-text-primary)" }}>劣势：</span>
              推荐人门槛高，且不容易发掘推荐人；点对点的传播相对难；可能比较难判断是否是纯增量。
            </p>
          </motion.div>

          {/* 右侧：手机模型 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex justify-center gap-4 sm:gap-6"
          >
            {[
              { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/overseas-localization/referral-1.jpg", alt: "转介绍活动 1", bottom: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/overseas-localization/referral-bottom.jpg" },
              { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/overseas-localization/referral-2.jpg", alt: "转介绍活动 2" },
            ].map((item, i) => (
              <PhoneMockup
                key={i}
                src={item.src}
                alt={item.alt}
                bottom={item.bottom}
                className="w-[200px] sm:w-[240px] md:w-[280px]"
              />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
