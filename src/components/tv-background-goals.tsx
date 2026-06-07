"use client";

import { motion } from "motion/react";

const goals = [
  { icon: "📺", title: "远距离交互", desc: "打造适合 3 米观看距离的大屏操作体验" },
  { icon: "🎯", title: "焦点导航", desc: "建立清晰的 D-pad 焦点态与操作路径" },
  { icon: "🧹", title: "信息降噪", desc: "减少信息密度，突出核心内容与转化入口" },
  { icon: "🎨", title: "多端统一", desc: "与移动端保持品牌一致，同时适配大屏场景" },
];

export default function TvBackgroundGoals() {
  return (
    <section className="w-full py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-12 lg:gap-16"
      >
        {/* 上栏：背景 */}
        <div>
          <h2
            className="text-lg font-semibold mb-6"
            style={{ color: "var(--dbx-text-primary)" }}
          >
            项目背景
          </h2>
          <div
            className="text-base leading-relaxed space-y-4"
            style={{ color: "var(--dbx-text-secondary)" }}
          >
            <p>
              <span className="font-medium" style={{ color: "var(--dbx-text-primary)" }}>权益拓展</span>
              ——买百科会员可免费享 TV 端会员，增强吸引力。
            </p>
            <p>
              <span className="font-medium" style={{ color: "var(--dbx-text-primary)" }}>体验提升</span>
              ——因投屏体验不稳，上架厂商应用市场优化观看体验，借电视大屏优势提升用户体验与留存。
            </p>
            <p>
              <span className="font-medium" style={{ color: "var(--dbx-text-primary)" }}>获客推广</span>
              ——通过 TV 端应用市场推广、首页 Launcher 推荐资源位等，触达多元用户，扩大用户基础与 GMV。
            </p>
          </div>
        </div>

        {/* 下栏：目标 */}
        <div>
          <h2
            className="text-lg font-semibold mb-6"
            style={{ color: "var(--dbx-text-primary)" }}
          >
            设计目标
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex gap-3 p-4 rounded-xl"
                style={{
                  background: "var(--dbx-bg-float)",
                  border: "1px solid var(--dbx-border-light)",
                }}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--dbx-text-primary)" }}>
                    {item.title}
                  </div>
                  <div className="text-sm" style={{ color: "var(--dbx-text-tertiary)" }}>
                    {item.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
