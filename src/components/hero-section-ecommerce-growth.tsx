"use client";

import { motion } from "motion/react";
import { SparklesCore } from "@/components/ui/sparkles";
import PhoneMockup from "@/components/phone-mockup";

export default function HeroSectionEcommerceGrowth() {
  return (
    <div className="relative w-full flex flex-col items-center pt-10 md:pt-20 pb-14 overflow-hidden">
      {/* Decorative gradient lines */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-800/80 pointer-events-none">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-[#8b5cf6] to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-800/80 pointer-events-none">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-[#8b5cf6] to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-800/80 pointer-events-none">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent" />
      </div>

      {/* Decorative background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
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
              particleColor="#8b5cf6"
            />
            <div className="absolute inset-0 w-full h-full bg-transparent" style={{ maskImage: "radial-gradient(400px 150px at center, transparent 10%, white)", WebkitMaskImage: "radial-gradient(400px 150px at center, transparent 10%, white)" }} />
          </div>
        </div>

        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold md:text-4xl lg:text-6xl" style={{ color: "var(--dbx-text-primary)" }}>
          {"斑马百科"
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
          斑马百科全生态产品线 UI 设计与体验优化
        </motion.p>
      </div>

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
                style={{ color: "#8b5cf6" }}
              >
                01
              </span>
              <div className="h-px w-8" style={{ background: "linear-gradient(90deg, #8b5cf6, transparent)" }} />
              <h2
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "var(--dbx-text-primary)" }}
              >
                会员付费场景优化
              </h2>
            </div>
            <div className="mb-2 text-xs font-medium" style={{ color: "var(--dbx-text-tertiary)" }}>
              项目背景
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--dbx-text-secondary)" }}
            >
              针对新客群体进行优惠券有效期缩短（24小时→30分钟），并放大用户对于优惠券有效期的感知，从而刺激用户在短时间内完成下单，以此提升新客转化率。
            </p>
            {/* 数据 */}
            <div className="mt-4 space-y-3">
              <div
                className="rounded-xl p-4"
                style={{
                  background: "var(--dbx-bg-float)",
                  border: "1px solid var(--dbx-border-light)",
                }}
              >
                <div className="text-xs mb-2" style={{ color: "var(--dbx-text-tertiary)" }}>
                  会员在期 · 1208周
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="text-xs" style={{ color: "var(--dbx-text-tertiary)" }}>续订率提升</div>
                    <div
                      className="text-lg sm:text-xl font-bold"
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      1.43pp
                    </div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "var(--dbx-text-tertiary)" }}>续订GMV</div>
                    <div
                      className="text-lg sm:text-xl font-bold"
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      +9,793
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="rounded-xl p-4"
                style={{
                  background: "var(--dbx-bg-float)",
                  border: "1px solid var(--dbx-border-light)",
                }}
              >
                <div className="text-xs mb-2" style={{ color: "var(--dbx-text-tertiary)" }}>
                  会员过期 · 1215周
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="text-xs" style={{ color: "var(--dbx-text-tertiary)" }}>续订率提升</div>
                    <div
                      className="text-lg sm:text-xl font-bold"
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      1.34pp
                    </div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "var(--dbx-text-tertiary)" }}>续订GMV</div>
                    <div
                      className="text-lg sm:text-xl font-bold"
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      +13,503
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 右侧：手机模型 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex justify-center gap-3 sm:gap-4"
          >
            {[
              { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/baike-ecommerce/即将到期提示.jpg", alt: "即将到期提示" },
              { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/baike-ecommerce/首页弹窗.jpg", alt: "首页弹窗" },
              { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/baike-ecommerce/课节列表.jpg", alt: "课节列表" },
            ].map((item, i) => (
              <PhoneMockup
                key={i}
                src={item.src}
                alt={item.alt}
                className="w-[140px] sm:w-[180px] md:w-[210px]"
              />
            ))}
          </motion.div>
        </div>

      </section>

      {/* 内容容器 */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 mt-14">
        <div
          className="w-full rounded-xl p-6"
          style={{
            background: "var(--dbx-bg-float)",
            border: "1px solid var(--dbx-border-light)",
          }}
        >
          {/* 关键路径验证 */}
          <div className="mb-2 text-xs font-medium" style={{ color: "var(--dbx-text-tertiary)" }}>
            关键路径验证
          </div>
          <ul className="text-sm leading-relaxed space-y-1.5 mb-6 pl-4 list-disc" style={{ color: "var(--dbx-text-secondary)" }}>
            <li>会员中心进入率大幅提升：会员在期用户从 10.59% → 26.56%，过期用户从 20.8% → 33.57%</li>
            <li>点击开通率同步增长：会员在期用户从 10.36% → 11.34%，过期用户从 13.52% → 17.17%</li>
            <li>无分流负面影响：其他售卖页转化未出现明显下滑，方案仅通过强化会员转化路径提升业务收益。</li>
          </ul>

          {/* 项目价值 */}
          <div className="mb-2 text-xs font-medium" style={{ color: "var(--dbx-text-tertiary)" }}>
            项目价值
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--dbx-text-secondary)" }}
          >
            验证了"提升会员入口曝光 → 强化转化路径 → 促进续订"的业务逻辑，为后续会员体系优化提供了可落地的数据支撑，直接带动了续订率与GMV的双增长。
          </p>
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

      {/* ====== 第二个占位 Section ====== */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
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
                style={{ color: "#8b5cf6" }}
              >
                02
              </span>
              <div className="h-px w-8" style={{ background: "linear-gradient(90deg, #8b5cf6, transparent)" }} />
              <h2
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "var(--dbx-text-primary)" }}
              >
                成长主页 + 周报
              </h2>
            </div>
            <div className="mb-2 text-xs font-medium" style={{ color: "var(--dbx-text-tertiary)" }}>
              项目背景
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--dbx-text-secondary)" }}
            >
              成长主页与周报体系将学习行为数据可视化，引导家长定期进入家长中心Tab了解孩子知识掌握情况，通过周期性触达养成回访习惯，实现留存提升与转化增长的双重目标。
            </p>
            <div className="mb-2 mt-4 text-xs font-medium" style={{ color: "var(--dbx-text-tertiary)" }}>
              项目目标
            </div>
            <div className="text-sm leading-relaxed space-y-1" style={{ color: "var(--dbx-text-secondary)" }}>
              <p>1. 了解学生学习情况 — 将学习行为沉淀为可视化成长数据，让家长随时掌握孩子的知识掌握度、学习进度与薄弱环节。</p>
              <p>2. 提升留存 — 通过周报推送+成长主页承接，建立家长定期回访习惯，持续回到家长中心Tab查看动态。</p>
              <p>3. 驱动转化 — 成长数据形成"学习效果证明"，强化家长对产品价值的认可，为续费转化提供数据支撑。</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex justify-center gap-3 sm:gap-4"
          >
            {[
              { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/baike-ecommerce/百科成长主页.jpg", alt: "百科成长主页" },
              { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/baike-ecommerce/领域详情页.jpg", alt: "领域详情页" },
              { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/baike-ecommerce/周报.jpg", alt: "周报" },
            ].map((item, i) => (
              <PhoneMockup
                key={i}
                src={item.src}
                alt={item.alt}
                className="w-[140px] sm:w-[180px] md:w-[210px]"
              />
            ))}
          </motion.div>
        </div>
      </section>

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

      {/* ====== 下载引导 ====== */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* 左侧文字 */}
          <div className="flex-1 text-center sm:text-left">
            <h3
              className="text-lg sm:text-xl font-semibold mb-2"
              style={{ color: "var(--dbx-text-primary)" }}
            >
              更多精彩功能
            </h3>
            <p className="text-base sm:text-lg" style={{ color: "var(--dbx-text-secondary)" }}>
              以上仅为部分模块展示，更多体验尽在斑马百科 App。
            </p>
          </div>

          {/* 右侧二维码 */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2.5">
            <div
              className="rounded-2xl p-[2px]"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #a78bfa, #8b5cf6)",
                boxShadow: "0 8px 32px rgba(139,92,246,0.2)",
              }}
            >
              <div
                className="rounded-2xl p-3"
                style={{ background: "white" }}
              >
                <img
                  src="https://quickchart.io/qr?text=https://apps.apple.com/cn/app/%E6%96%91%E9%A9%AC%E7%99%BE%E7%A7%91/id1665617086&size=200&margin=1&dark=8b5cf6&light=f5f3ff"
                  alt="斑马百科 App Store 下载"
                  style={{ width: 140, height: 140, display: "block" }}
                />
              </div>
            </div>
            <span className="text-sm" style={{ color: "var(--dbx-text-tertiary)" }}>
              扫码下载 App
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
