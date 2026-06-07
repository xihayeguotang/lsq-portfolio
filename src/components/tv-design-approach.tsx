"use client";

import { motion } from "motion/react";

const principles = [
  {
    title: "10-Foot UI · 远距离交互",
    desc: "电视用户距屏幕约 3 米，「后靠」观看而非「前倾」操作。延续我惯用的清爽留白风格，在此基础上升级字号层级与对比度——标题用更大字重、正文保持宽松行距，确保 3 米外也能轻松阅读。避免纯白画面抖动，采用品牌浅灰底色。",
  },
  {
    title: "D-pad 焦点 · 方向键导航",
    desc: "电视依赖遥控器方向键操作，不支持触控与悬停。采用大面积卡片作为交互单元，焦点态围绕卡片边框做高亮反馈，而非小按钮——这与我的卡片化设计习惯一脉相承，只是将 hover 效果适配为 D-pad 的 focus 态。",
  },
  {
    title: "横向浏览 · 内容即界面",
    desc: "延续我擅长的横向滚动布局，将内容组织为一行行可横向滑动的分类卡片区（推荐、动物、历史等）。每个卡片都是一张可视化入口，关键操作（播放、返回）固定在顶部不随滚动消失。",
  },
  {
    title: "信息降噪 · 大屏的克制",
    desc: "移动端常见的紧凑排版、多信息堆叠在 TV 端必须克制。这是我设计中最坚持的原则——留白不是浪费，而是层次。加大间距、精简文案、弱化非核心元素，让视觉效果「先整体、后细节」，3 米外一眼看到重点。",
  },
];

export default function TvDesignApproach() {
  return (
    <section
      className="w-full py-16 sm:py-24"
      style={{ background: "var(--dbx-bg-float)" }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: "var(--dbx-text-primary)" }}
          >
            设计思路
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl p-6"
              style={{
                background: "var(--dbx-bg-base)",
                border: "1px solid var(--dbx-border-light)",
              }}
            >
              <div className="flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-[5px] flex-shrink-0" style={{ background: "var(--dbx-accent)" }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-2" style={{ color: "var(--dbx-text-primary)" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--dbx-text-secondary)" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
