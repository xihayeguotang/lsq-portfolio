"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { getWorkExperiences } from "@/data/work-experiences";
import type { WorkExperience } from "@/data/work-experiences";

/* ============ Sub-components ============ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-sm font-semibold tracking-wide uppercase mb-8 flex items-center gap-3"
      style={{ color: "var(--dbx-text-tertiary)" }}
    >
      <span className="w-8 h-px" style={{ background: "var(--dbx-border-light)" }} />
      {children}
    </motion.h2>
  );
}

function SkeletonBlock({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl overflow-hidden animate-pulse p-5 sm:p-6"
      style={{ background: "var(--dbx-bg-float)", border: "1px solid var(--dbx-border-light)" }}
    >
      <div className="flex items-baseline justify-between gap-4 mb-1">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/3 rounded" style={{ background: "var(--dbx-fill-trans-10)" }} />
          <div className="h-3 w-1/5 rounded" style={{ background: "var(--dbx-fill-trans-10)" }} />
        </div>
        <div className="h-5 w-24 rounded-full" style={{ background: "var(--dbx-fill-trans-10)" }} />
      </div>
      <div className="mt-4 space-y-2">
        {[1, 2, 3].map((j) => (
          <div
            key={j}
            className="h-3 rounded"
            style={{ background: "var(--dbx-fill-trans-10)", width: `${60 + j * 10}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ============ Main Component ============ */

export default function ResumeContent() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkExperiences().then((data) => {
      setExperiences(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-[820px] mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-20">
      {/* ========== Profile Hero ========== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <div>
          <div className="pt-1">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold tracking-tight"
              style={{ color: "var(--dbx-text-primary)" }}
            >
              梁松泉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base mt-1.5"
              style={{ color: "var(--dbx-text-secondary)" }}
            >
              UI 设计师 · 9 年以上产品设计经验
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm mt-0.5"
              style={{ color: "var(--dbx-text-tertiary)" }}
            >
              目前就职于猿辅导（斑马）
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="h-0.5 mt-4 origin-left rounded-full w-20"
              style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, transparent)" }}
            />
          </div>
        </div>
      </motion.section>

      {/* ========== Work Experience ========== */}
      <section>
        <SectionTitle>工作经历</SectionTitle>
        <div className="space-y-6">
          {loading
            ? [0, 1, 2, 3].map((i) => <SkeletonBlock key={i} delay={i * 0.1} />)
            : experiences.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <CardSpotlight
                    className="!p-0 !rounded-xl !border-0 overflow-hidden"
                    color="rgba(99,102,241,0.08)"
                    radius={400}
                  >
                    <div className="relative p-5 sm:p-6">
                      <div className="flex items-baseline justify-between gap-4 mb-1">
                        <div>
                          <h3
                            className="text-base font-semibold"
                            style={{ color: "var(--dbx-text-primary)" }}
                          >
                            {exp.company}
                          </h3>
                          <p
                            className="text-sm mt-0.5"
                            style={{ color: "var(--dbx-text-tertiary)" }}
                          >
                            {exp.role}
                          </p>
                        </div>
                        <motion.span
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          className="text-xs whitespace-nowrap px-2.5 py-1 rounded-full"
                          style={{
                            color: "var(--dbx-text-tertiary)",
                            background: "var(--dbx-fill-trans-10)",
                          }}
                        >
                          {exp.period}
                        </motion.span>
                      </div>

                      <ul className="mt-4 space-y-2">
                        {exp.highlights.map((h, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: j * 0.05 }}
                            className="text-sm leading-relaxed pl-5 relative"
                            style={{ color: "var(--dbx-text-secondary)" }}
                          >
                            <span
                              className="absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-full"
                              style={{
                                background:
                                  j === 0
                                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                                    : "var(--dbx-text-tertiary)",
                              }}
                            />
                            {h}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </CardSpotlight>
                </motion.div>
              ))}
        </div>
      </section>

      <div className="text-center pb-8" />
    </div>
  );
}
