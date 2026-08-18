"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { VolumeHigh, Stop } from "iconsax-react";
import { useSpeech } from "@/hooks/use-speech";
import { speakText } from "@/lib/speech-utils";
import type { MetricItem, PortfolioDetail } from "@/data/portfolio-details";

/**
 * 详情页「听讲解」按钮：面试官留在项目页即点即听，不跳转。
 *
 * 数据驱动：从 /api/portfolio-details 拉取项目详情（COS projects/{slug}/detail.json），
 * 组装成一段自然口语的讲解文案，复用站内 TTS 逐句朗读。零维护，所有项目通用。
 */

type MetricEntry = MetricItem | { title?: string; note?: string; items: MetricItem[] };

function isMetricGroup(m: MetricEntry): m is { title?: string; note?: string; items: MetricItem[] } {
  return Array.isArray((m as { items?: unknown }).items);
}

/** 把 metrics（可能是单条数组，也可能是分组对象数组）拍平成朗读句 */
function collectMetricLines(metrics: PortfolioDetail["metrics"]): string[] {
  if (!metrics?.length) return [];
  const lines: string[] = [];
  for (const m of metrics) {
    if (isMetricGroup(m)) {
      const sub = m.items
        .map((it) => `${it.label}${it.value}${it.note ? "，" + it.note : ""}`)
        .join("；");
      if (sub) lines.push(m.title ? `${m.title}：${sub}` : sub);
    } else {
      lines.push(`${m.label}${m.value}${m.note ? "，" + m.note : ""}`);
    }
  }
  return lines.filter(Boolean);
}

/** 把箭头等不适合语音朗读的符号转成口语读法 */
function toSpoken(s: string): string {
  return s.replace(/→/g, "到");
}

/** 讲解开场白：每次随机选一句，像真人随口引出项目，避免千篇一律 */
const OPENERS = [
  "我来给你讲讲《{t}》这个项目。",
  "给你介绍一个我挺有感触的项目，《{t}》。",
  "《{t}》这个项目，我觉得值得好好讲讲。",
  "正好想跟你聊聊，就说说《{t}》这个项目吧。",
  "跟你讲一个我做过的项目，《{t}》。",
  "来，跟你分享一下《{t}》这个项目。",
];

/** 按字数预算裁剪句子列表:从头依次取,累计超预算即停止(保留前面的重点) */
function clipLines(lines: string[], budget: number): string[] {
  const out: string[] = [];
  let used = 0;
  for (const ln of lines) {
    const cost = ln.length;
    if (used + cost > budget) break;
    out.push(ln);
    used += cost;
  }
  return out;
}

/**
 * 把项目详情组装成一段精简的重点讲解（数据驱动）。
 * 详情文案是知识库,只挑核心讲:总览 + 目标 + 设计要点点名 + 模块成果 + 关键数据,
 * 不逐字读全量(背景/调研/渠道/VIP 等长文本略去),单次朗读控制在 ~700 字内,省 TTS 费用。
 */
export function buildExplanation(detail: PortfolioDetail): string {
  const parts: string[] = [];

  const title = detail.title;
  // 开场白必须按 slug 稳定选择(不能随机):同一项目每次讲解文本一致,TTS 服务端磁盘缓存才能命中
  let seed = 0;
  for (const ch of detail.slug ?? "") seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const opener = OPENERS[seed % OPENERS.length].replace("{t}", title);
  parts.push(`${opener}${detail.summary}`);

  if (detail.goals?.length) {
    const goals = clipLines(detail.goals, 120);
    if (goals.length) parts.push(`当时的设计目标主要有：${goals.join("；")}。`);
  }

  // 设计思路只点名,不展开每条 desc,避免长段
  if (detail.approach?.length) {
    const names = clipLines(detail.approach.map((a) => a.title), 100);
    if (names.length) parts.push(`在设计上，重点做了：${names.join("、")}。`);
  }

  // 核心模块只讲"名字 + 一句话成果",不展开每模块的背景/目标/过程
  if (detail.modules?.length) {
    const mods = clipLines(
      detail.modules.map((m) => (m.value ? `${m.name}，${m.value}` : m.name)),
      300
    );
    if (mods.length) parts.push(`项目主要围绕这些模块展开：${mods.join("；")}。`);
  }

  const metrics = clipLines(collectMetricLines(detail.metrics), 260);
  if (metrics.length) parts.push(`落地后的关键数据：${metrics.join("；")}。`);

  return toSpoken(parts.filter(Boolean).join(" "));
}

function SpeakerIcon() {
  return <VolumeHigh size={16} color="currentColor" />;
}

function StopIcon() {
  return <Stop size={16} color="currentColor" />;
}

export function PortfolioExplanationButton({ slug, fallback }: { slug: string; fallback?: string }) {
  const speech = useSpeech();
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setText(null);
    speech.stop(); // 切换项目时中断上一段朗读
    (async () => {
      try {
        const res = await fetch(`/api/portfolio-details?slug=${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error("load detail failed");
        const detail = (await res.json()) as PortfolioDetail;
        if (cancelled) return;
        setText(detail && detail.title ? buildExplanation(detail) : (fallback ?? null));
      } catch {
        if (!cancelled) setText(fallback ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // 无可用讲解数据时隐藏按钮（如 detail.json 缺失且无 fallback）
  if (!loading && !text) return null;

  const isSpeaking = speech.isSpeaking;

  function handleClick() {
    if (isSpeaking) {
      speech.stop();
      return;
    }
    if (text) speakText(speech, text); // 点击是用户手势,connect 内解锁 AudioContext
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer"
      style={{
        color: isSpeaking ? "var(--dbx-text-primary)" : "var(--dbx-text-secondary)",
        background: "var(--dbx-fill-trans-10)",
        border: "1px solid var(--dbx-border-light)",
        opacity: loading ? 0.6 : 1,
      }}
      title={isSpeaking ? "停止讲解" : "听讲解"}
    >
      {isSpeaking ? <StopIcon /> : <SpeakerIcon />}
      <span>{isSpeaking ? "停止讲解" : loading ? "准备中…" : "听讲解"}</span>
    </motion.button>
  );
}
