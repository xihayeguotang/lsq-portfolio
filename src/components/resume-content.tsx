"use client";

import { motion } from "motion/react";
import { CardSpotlight } from "@/components/ui/card-spotlight";

/* ============ Data ============ */

const experiences = [
  {
    period: "2019.10 — 至今",
    company: "猿辅导（斑马）",
    role: "UI 设计师",
    highlights: [
      "斑马百科全生态产品线全链路UI设计与体验统筹，覆盖移动端、车机、TV大屏、智能硬件、海外产品、电商模块等多终端业务，主导设计体系建设、组件资产沉淀、工作流程优化与跨部门协作落地。",
      "承接斑马百科全矩阵业务设计：包含电商模块、海外产品体系、车机系统、TV端界面、智能硬件拍学机、应用商店素材全周期迭代设计。",
      "统筹斑马思维业务整体设计管理，搭建产品全局设计规范，优化团队工作流程，打通产品、研发、运营跨部门协作链路，保障设计交付质量。",
      "自主研发Sketch自动化提效插件，实现思维交互题设计产能提升70%，有效释放产研团队人力成本，减少重复绘图工作，提升整体迭代效率。",
      "负责周末游乐场、互动课件等业务视觉建设，搭建专属游戏化组件体系，沉淀业务复用资产，支撑教育场景互动体验设计。",
      "主导海外本地化设计项目，负责斑马AI学日本版APP及日本官网视觉设计、体验改版与长期迭代，适配海外用户使用习惯与审美偏好。",
      "全程负责斑马官方组件库从搭建、版本迭代到日常维护更新工作，完善通用组件、业务组件全态规范，统一底层视觉体系，实现多端复用与设计资产长期沉淀。",
    ],
  },
  {
    period: "2017.09 — 2019.09",
    company: "作业盒子",
    role: "UI 设计师",
    highlights: [
      "负责教育产品多端视觉体系搭建、全业务线体验设计与设计规范落地，覆盖 APP、小程序、H5 多终端产品。",
      "负责拍作业 APP 整体视觉设计，定义产品视觉基调，搭建基础设计规范，统一全链路设计质量。",
      "统筹 OCR 业务线 5 端产品视觉体系（小盒家长、家长盒子、小盒老师、钉钉小程序等），实现多端体验统一。",
      "负责学生端、教师端学科场景、作业题型模块全流程视觉设计。",
      "承接对外售课 H5、运营活动、品牌视觉、新品产品视觉定义全模块设计工作。",
    ],
  },
  {
    period: "2016.11 — 2017.09",
    company: "时趣互动北京科技有限公司",
    role: "UI 设计师",
    highlights: [
      "负责营销互动产品项目视觉设计、交互体验优化、活动页面体系设计。",
      "网红城堡产品体验优化与视觉改版",
      "网红卡营销项目全链路视觉设计",
      "影响力大学平台整体 UI 设计迭代",
      "智能助手产品界面与体验设计",
    ],
  },
  {
    period: "2015.06 — 2016.11",
    company: "麻辣老师",
    role: "UI 设计师",
    highlights: [
      "负责移动端 APP、WAP 端全页面 UI 设计、体验精细化优化、营销专题设计。",
      "负责产品 APP、WAP 端全页面视觉设计、细节体验迭代与长期体验维护。",
      "承接产品推广专题页、广告物料、运营活动视觉设计。",
      "搭建产品初代控件库与基础视觉规范，沉淀可复用设计资产。",
    ],
  },
];

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

/* ============ Main Component ============ */

export default function ResumeContent() {
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

            {/* Decorative gradient line */}
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
          {experiences.map((exp, i) => (
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
                  {/* Header row */}
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

                  {/* Highlights */}
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


      {/* Bottom spacing hint */}
      <div className="text-center pb-8">
      </div>
    </div>
  );
}
