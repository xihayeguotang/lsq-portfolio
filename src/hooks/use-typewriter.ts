"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 打字机 Hook —— 让流式回答像真人打字一样逐字出现。
 *
 * 核心设计:把"流式累积的完整文本"当作 target,内部用一个自增的长度
 * 逐步逼近 target.length。effect 只依赖 target.length 而非 target,
 * 因此流式期间文本增量到达时会"续打"而不重置;已显示的进度不丢。
 *
 * - active=false 时不打字,text 直接返回完整 target(用于非打字场景)
 * - done=true 表示已打完整;skip() 可立即跳到末尾(点击气泡全显)
 */
export function useTypewriter(
  target: string,
  active: boolean,
  opts?: { cps?: number }
) {
  const [len, setLen] = useState(active ? 0 : target.length);
  const lenRef = useRef(active ? 0 : target.length);
  const targetRef = useRef(target);
  targetRef.current = target;
  const cps = opts?.cps ?? 40; // 中文字符/秒,读起来像真人
  const done = len >= target.length;

  useEffect(() => {
    if (!active) {
      // 非打字状态(流已结束/未开始):直接显示完整文本
      lenRef.current = target.length;
      setLen(target.length);
      return;
    }
    if (target.length === 0) return;
    // target 若变短(极端情况)则收敛长度,避免越界
    lenRef.current = Math.min(lenRef.current, target.length);
    const intervalMs = 24;
    const step = Math.max(1, Math.round((cps * intervalMs) / 1000));
    const id = setInterval(() => {
      lenRef.current = Math.min(targetRef.current.length, lenRef.current + step);
      setLen(lenRef.current);
      if (lenRef.current >= targetRef.current.length) clearInterval(id);
    }, intervalMs);
    return () => clearInterval(id);
  }, [active, target.length, cps]);

  /** 立即显示完整文本(跳过动画) */
  const skip = useCallback(() => {
    lenRef.current = targetRef.current.length;
    setLen(lenRef.current);
  }, []);

  return { text: target.slice(0, len), done, skip };
}
