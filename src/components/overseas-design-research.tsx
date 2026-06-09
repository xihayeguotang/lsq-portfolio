"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

/* ============ Types ============ */

interface CultureRow {
  type: "text" | "icon";
  label?: string;
  value: string;
  icon?: string;
  iconColor?: string;
}

interface CultureRule {
  icon: string;
  title: string;
  rows: CultureRow[];
}

interface VisualSpec {
  icon: string;
  title: string;
  points: string[];
}

interface DesignResearchData {
  intro: string;
  scope: { categories: string[]; methods: string[] };
  visualOverview: {
    description: string;
    items: { label: string; desc: string }[];
  };
  cultureRules: CultureRule[];
  visualSpecs: VisualSpec[];
  mandatoryRules: { icon: string; text: string }[];
}

/* ============ Sub-components ============ */

function ModuleTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span
        className="text-2xl md:text-3xl font-mono font-bold tracking-wider leading-none"
        style={{ color: "#0ea5e9" }}
      >
        {number}
      </span>
      <div
        className="h-px w-8"
        style={{ background: "linear-gradient(90deg, #0ea5e9, transparent)" }}
      />
      <h2
        className="text-xl sm:text-2xl font-bold"
        style={{ color: "var(--dbx-text-primary)" }}
      >
        {title}
      </h2>
    </div>
  );
}

function Delimiter() {
  return (
    <div className="relative w-full my-10 md:my-14">
      <div
        className="w-full h-px"
        style={{ background: "rgba(100,100,100,0.15)" }}
      />
      <div className="relative w-full h-7 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "repeating-linear-gradient(-45deg, rgba(100,100,100,0.15) 0px, rgba(100,100,100,0.15) 1px, transparent 1px, transparent 8px)",
          }}
        />
      </div>
      <div
        className="w-full h-px"
        style={{ background: "rgba(100,100,100,0.15)" }}
      />
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl p-5 ${className}`}
      style={{
        background: "var(--dbx-bg-float)",
        border: "1px solid var(--dbx-border-light)",
      }}
    >
      {children}
    </div>
  );
}

/* ============ Icon helpers ============ */

function ScopeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </svg>
  );
}

function MethodIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CultureIconRow({
  icon,
  iconColor,
  value,
}: {
  icon: string;
  iconColor?: string;
  value: string;
}) {
  const colorMap: Record<string, string> = {
    green: "rgb(74,222,128)",
    red: "rgb(248,113,113)",
    amber: "rgb(251,191,36)",
  };
  return (
    <div className="flex items-start gap-2">
      <span
        className="flex-shrink-0 mt-0.5 text-xs"
        style={{ color: iconColor ? colorMap[iconColor] : undefined }}
      >
        {icon}
      </span>
      <span>{value}</span>
    </div>
  );
}

function SkeletonBlock() {
  return (
    <div className="flex flex-col items-center gap-6 py-16" style={{ color: "var(--dbx-text-tertiary)" }}>
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
        </svg>
      </motion.div>
      <span className="text-xs">加载中...</span>
    </div>
  );
}

/* ============ Main Component ============ */

export default function OverseasDesignResearch() {
  const [data, setData] = useState<DesignResearchData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/overseas-design-research")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return null; // silently fail
  }

  if (!data) {
    return (
      <div className="relative w-full flex flex-col items-center pt-8 md:pt-12 pb-6 overflow-hidden">
        <SkeletonBlock />
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col items-center pt-8 md:pt-12 pb-6 overflow-hidden">
      {/* ============ Section 01: 设计前期调研 ============ */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <ModuleTitle number="01" title="设计前期调研" />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-sm leading-relaxed mb-8 max-w-2xl"
          style={{ color: "var(--dbx-text-secondary)" }}
        >
          {data.intro}
        </motion.p>

        {/* 调研范围与方式 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-5 mb-10"
        >
          <div
            className="flex-1 rounded-xl p-5"
            style={{
              background: "var(--dbx-bg-float)",
              border: "1px solid var(--dbx-border-light)",
            }}
          >
            <h3
              className="text-xs font-semibold mb-3 flex items-center gap-2"
              style={{ color: "var(--dbx-text-primary)" }}
            >
              <ScopeIcon />
              调研品类
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.scope.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    color: "var(--dbx-text-secondary)",
                    background: "var(--dbx-fill-trans-10)",
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div
            className="flex-1 rounded-xl p-5"
            style={{
              background: "var(--dbx-bg-float)",
              border: "1px solid var(--dbx-border-light)",
            }}
          >
            <h3
              className="text-xs font-semibold mb-3 flex items-center gap-2"
              style={{ color: "var(--dbx-text-primary)" }}
            >
              <MethodIcon />
              调研方式
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.scope.methods.map((method) => (
                <span
                  key={method}
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    color: "var(--dbx-text-secondary)",
                    background: "var(--dbx-fill-trans-10)",
                  }}
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ============ 整体视觉风格总览 ============ */}
        <ModuleTitle number="02" title="整体视觉风格总览" />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-sm leading-relaxed mb-6"
          style={{ color: "var(--dbx-text-secondary)" }}
        >
          {data.visualOverview.description}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {data.visualOverview.items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl p-4"
              style={{
                background: "var(--dbx-bg-float)",
                border: "1px solid var(--dbx-border-light)",
              }}
            >
              <h4
                className="text-xs font-semibold mb-1"
                style={{ color: "var(--dbx-text-primary)" }}
              >
                {item.label}
              </h4>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--dbx-text-tertiary)" }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <Delimiter />

      {/* ============ 文化规则 ============ */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <ModuleTitle number="03" title="文化规则" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.cultureRules.map((rule, i) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="h-full flex flex-col">
                <h3
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: "var(--dbx-text-primary)" }}
                >
                  <span className="text-lg">{rule.icon}</span>
                  {rule.title}
                </h3>
                <div
                  className="space-y-2 text-xs leading-relaxed flex-1"
                  style={{ color: "var(--dbx-text-secondary)" }}
                >
                  {rule.rows.map((row, j) =>
                    row.type === "icon" ? (
                      <CultureIconRow
                        key={j}
                        icon={row.icon!}
                        iconColor={row.iconColor}
                        value={row.value}
                      />
                    ) : (
                      <p key={j}>
                        {row.label && (
                          <span
                            className="font-medium"
                            style={{ color: "var(--dbx-text-primary)" }}
                          >
                            {row.label}
                          </span>
                        )}
                        {row.value}
                      </p>
                    )
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Delimiter />

      {/* ============ 视觉规范 ============ */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <ModuleTitle number="04" title="视觉规范" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.visualSpecs.map((spec, i) => (
            <motion.div
              key={spec.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Card className="h-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{spec.icon}</span>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--dbx-text-primary)" }}
                  >
                    {spec.title}
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {spec.points.map((pt, j) => (
                    <li
                      key={j}
                      className="text-xs leading-relaxed pl-3 relative"
                      style={{ color: "var(--dbx-text-secondary)" }}
                    >
                      <span
                        className="absolute left-0 top-[0.45em] w-1 h-1 rounded-full"
                        style={{ background: "var(--dbx-text-tertiary)" }}
                      />
                      {pt}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Delimiter />

      {/* ============ 强制落地要求 ============ */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <ModuleTitle number="05" title="强制落地要求（文化红线）" />

        <div
          className="rounded-xl p-5 sm:p-6 border"
          style={{
            background: "rgba(239,68,68,0.04)",
            borderColor: "rgba(239,68,68,0.15)",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.mandatoryRules.map((rule, i) => (
              <motion.div
                key={rule.text}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="flex items-start gap-3"
              >
                <span className="text-base flex-shrink-0 mt-0.5">
                  {rule.icon}
                </span>
                <span
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--dbx-text-secondary)" }}
                >
                  {rule.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
