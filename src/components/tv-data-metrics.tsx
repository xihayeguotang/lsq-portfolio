"use client";

import { motion } from "motion/react";

const brands = ["阿里", "当贝", "海信", "PPTV", "三星", "索尼", "小米", "TCL"];

const metrics = [
  { label: "新增设备激活", value: "21,505" },
  { label: "激活设备", value: "3,716" },
  { label: "登录率", value: "17%" },
  { label: "21日转化 UV", value: "986" },
  { label: "21日首购转化率", value: "7.9%" },
  { label: "整体转化率", value: "3.1%" },
];

export default function TvDataMetrics() {
  return (
    <section className="w-full pt-16 sm:pt-24 pb-14">
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
          项目数据
        </h2>
        <p style={{ color: "var(--dbx-text-secondary)" }} className="text-sm">
          TV 端上线后各渠道数据表现
        </p>
      </motion.div>

      {/* 日活跃规模 + 渠道 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-xl p-6 mb-6"
        style={{
          background: "var(--dbx-bg-float)",
          border: "1px solid var(--dbx-border-light)",
        }}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div>
            <div className="text-sm" style={{ color: "var(--dbx-text-tertiary)" }}>TV 端日活跃规模峰值</div>
            <div
              className="text-3xl sm:text-4xl font-bold"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              3,110
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm mb-2" style={{ color: "var(--dbx-text-tertiary)" }}>合作厂商渠道</div>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <span
                  key={brand}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    color: "var(--dbx-text-primary)",
                    background: "var(--dbx-bg-base)",
                    border: "1px solid var(--dbx-border-light)",
                  }}
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 数据指标 — 横排卡片 */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
      >
        {metrics.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-xl p-4 text-center"
            style={{
              background: "var(--dbx-bg-float)",
              border: "1px solid var(--dbx-border-light)",
            }}
          >
            <div
              className="text-lg sm:text-xl font-bold mb-1"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {row.value}
            </div>
            <div className="text-xs" style={{ color: "var(--dbx-text-tertiary)" }}>
              {row.label}
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}
