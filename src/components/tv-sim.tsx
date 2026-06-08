"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "motion/react";
import LoginScreen from "@/components/tv-login-screen";
import VipScreen, { OrdersScreen, AgreementScreen } from "@/components/tv-vip-screen";
import PlayerScreen from "@/components/tv-player-screen";
import { MIAODUO_CDN } from "@/data/constants";

// ── 焦点态：绿色 (#00CC66) 6px 外描边 + 辉光 ──
const FOCUS_RING = "0 0 0 3px #00CC66, 0 0 10px rgba(0, 204, 102, 0.30)";
const CARD_SIZE = 174;
const CARD_BR = 24;

// ── 分类数据（节点 3:1056 设计） ──
const categories = [
  { label: "鸟类",     image: `${MIAODUO_CDN}/1860fe1c83cfa6f.jpg` },
  { label: "海洋动物", image: `${MIAODUO_CDN}/187b7c125af4f4c-68d5cb0d-a4ff-4e08-9a15-7406cad6c495.png` },
  { label: "史记",     image: `${MIAODUO_CDN}/1932394b9334572-71e91208-77eb-4024-93e5-a35e50f40eaf.jpeg` },
  { label: "微生物",   image: `${MIAODUO_CDN}/18f5b46f0acc925-42914884-51fe-4c20-9bc1-ca9144fe45dd.jpeg` },
  { label: "史前人类", image: `${MIAODUO_CDN}/194262590e1c196-11554070-b55f-41df-8403-5f293130fbb0.jpeg` },
  { label: "昆虫",     image: `${MIAODUO_CDN}/191bc23344e4d0b-93c7f8e0-2202-4a8d-83de-c64e75897cd7.jpeg` },
];

// ── 导航方向 ──
type Dir = "left" | "right" | "down" | "up";
type Section = "themes" | "banner";

interface Item {
  section: Section;
  index: number;
}

export default function TvSim() {
  const [screen, setScreen] = useState<"home" | "login" | "vip" | "orders" | "agreement" | "player">("home");
  const [focused, setFocused] = useState<Item>({ section: "themes", index: 0 });
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loginHovered, setLoginHovered] = useState(false);
  const [vipHovered, setVipHovered] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const LEN: Record<Section, number> = {
    themes: categories.length,
    banner: 1,
  };
  const SECTIONS: Section[] = ["themes", "banner"];

  // ── 焦点移动 ──
  const moveFocus = useCallback((dir: Dir) => {
    setFocused((prev) => {
      let { section, index } = prev;
      if (dir === "right" && index < LEN[section] - 1)
        return { section, index: index + 1 };
      if (dir === "left" && index > 0)
        return { section, index: index - 1 };
      if (dir === "down") {
        const si = SECTIONS.indexOf(section);
        if (si < SECTIONS.length - 1) {
          const next = SECTIONS[si + 1];
          return { section: next, index: Math.min(index, LEN[next] - 1) };
        }
      }
      if (dir === "up") {
        const si = SECTIONS.indexOf(section);
        if (si > 0) {
          const prevSec = SECTIONS[si - 1];
          return { section: prevSec, index: Math.min(index, LEN[prevSec] - 1) };
        }
      }
      return prev;
    });
  }, []);

  // ── 键盘 ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowRight: "right",
        ArrowLeft: "left",
        ArrowDown: "down",
        ArrowUp: "up",
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        moveFocus(dir);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [moveFocus]);

  // ── 获焦态自动滚入视野 ──
  useEffect(() => {
    if (focused.section === "themes") {
      cardsRef.current[focused.index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [focused]);

  const isFocused = (sec: Section, idx: number) =>
    focused.section === sec && focused.index === idx;

  return (
    <div className="w-full flex flex-col items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-6xl"
      >
        {/* Ambient glow */}
        <div className="absolute -bottom-4 left-[10%] right-[10%] h-8 bg-black/5 dark:bg-white/5 blur-2xl rounded-full" />

        {/* Bezel */}
        <div
          className="relative rounded-lg sm:rounded-xl p-[2px] sm:p-[3px] shadow-2xl"
          style={{
            background: "#111",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* Screen */}
          <div
            className="relative overflow-hidden rounded-[6px] sm:rounded-[10px]"
            style={{ aspectRatio: "16/9" }}
          >
            {/* Edge reflection */}
            <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-b from-white/[0.03] via-transparent to-black/[0.15]" />

            {screen === "login" ? (
              <LoginScreen onBack={() => setScreen("home")} />
            ) : screen === "vip" ? (
              <VipScreen onBack={() => setScreen("home")} onOrders={() => setScreen("orders")} onAgreement={() => setScreen("agreement")} />
            ) : screen === "orders" ? (
              <OrdersScreen onBack={() => setScreen("vip")} />
            ) : screen === "agreement" ? (
              <AgreementScreen onBack={() => setScreen("vip")} />
            ) : screen === "player" ? (
            <PlayerScreen onBack={() => setScreen("home")} category={categories[selectedCategory!]} />
            ) : (
              /* ======== TV App Home Content ======== */
              <div
                className="absolute inset-0 flex flex-col"
                style={{ background: "#1A1C1E" }}
              >
                {/* ===== Nav Bar ===== */}
                <div className="flex items-center justify-between px-10 pt-4 pb-1">
                  <div className="flex items-center" style={{ gap: 29 }}>
                    {/* 头像 + 登录 */}
                    <div
                      className="flex items-center rounded-full transition-all duration-300 cursor-pointer"
                      style={{
                        background: loginHovered
                          ? "rgba(255,255,255,0.90)"
                          : "rgba(255,255,255,0.06)",
                        boxShadow: loginHovered
                          ? "0 0 14px rgba(255,255,255,0.24)"
                          : undefined,
                        gap: 7,
                        padding: "1px 19px 1px 1px",
                        width: 102,
                      }}
                      onMouseEnter={() => setLoginHovered(true)}
                      onMouseLeave={() => setLoginHovered(false)}
                      onClick={() => setScreen("login")}
                    >
                      <div
                        className="rounded-full bg-cover bg-center flex-shrink-0"
                        style={{
                          width: 36,
                          height: 36,
                          backgroundImage: loginHovered
                            ? `url('${MIAODUO_CDN}/19e65469a0d138c-b89c7176-e1d1-4880-acdf-82c28bcc963b.svg')`
                            : `url('${MIAODUO_CDN}/19e654c23361033-2f9914d7-5a02-4324-bd50-142cae7f83ba.svg')`,
                        }}
                      />
                      <span
                        className="font-medium whitespace-nowrap"
                        style={{
                          color: loginHovered
                            ? "rgba(0,0,0,0.9)"
                            : "#FFFFFF",
                          fontSize: 19,
                          lineHeight: "27px",
                          fontFamily: "'PingFang SC', sans-serif",
                        }}
                      >
                        登录
                      </span>
                    </div>
                    {/* VIP 新朋友年卡特惠 */}
                    <div
                      className="relative flex items-center justify-center transition-all duration-300 cursor-pointer"
                      style={{
                        width: 200,
                        height: 38,
                        borderRadius: 52,
                        background: "rgba(255,255,255,0.06)",
                        filter: vipHovered
                          ? "drop-shadow(0 0 14px rgba(255,255,255,0.24))"
                          : undefined,
                        boxShadow: vipHovered
                          ? "inset -1px -1px 5px rgba(255, 184, 42, 0.30)"
                          : undefined,
                      }}
                      onMouseEnter={() => setVipHovered(true)}
                      onMouseLeave={() => setVipHovered(false)}
                      onClick={() => setScreen("vip")}
                    >
                      {/* 默认态 SVG */}
                      <div
                        className="bg-contain bg-no-repeat bg-center"
                        style={{
                          width: 176,
                          height: 16,
                          backgroundImage:
                            `url('${MIAODUO_CDN}/19e64eade034436-16131d89-0dc8-4445-b14d-5c6865458f7d.svg')`,
                        }}
                      />
                      {/* 悬浮态 SVG（覆盖层） */}
                      <div
                        className="absolute bg-cover bg-no-repeat bg-center transition-all duration-300"
                        style={{
                          width: 229,
                          height: 67,
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          opacity: vipHovered ? 1 : 0,
                          borderRadius: 60,
                          backgroundImage:
                            `url('${MIAODUO_CDN}/19e6553af52cbdd-30edcb51-fac5-4202-91d5-85178f2f0e74.svg')`,
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  </div>
                  {/* 右侧图标 */}
                  <div
                    className="bg-contain bg-no-repeat bg-center"
                    style={{
                      width: 154,
                      height: 38,
                      backgroundImage:
                        `url('${MIAODUO_CDN}/19e654efbeb3e2f-7259e0b9-5ef8-43ab-866c-ca13887f51d9.svg')`,
                    }}
                  />
                </div>

                {/* ===== 我的主题 ===== */}
                <div className="px-10 pt-4 pb-2">
                  <h2 className="text-white text-xl font-medium tracking-wide">
                    我的主题
                  </h2>
                </div>

                {/* ===== 主题卡片（横向滑动，图+文一体） ===== */}
                <div className="overflow-x-auto px-10 py-2 hide-scrollbar">
                  <div className="flex gap-6">
                    {categories.map((cat, i) => {
                      return (
                        <div
                          key={cat.label}
                          ref={(el) => {
                            cardsRef.current[i] = el;
                          }}
                          className="flex-shrink-0"
                          style={{ width: CARD_SIZE }}
                        >
                          {/* 卡片图 */}
                          <div
                            className="relative cursor-pointer outline-none group border-2 border-transparent hover:border-[#00CC66] transition-transform duration-500 hover:scale-105"
                            style={{
                              width: CARD_SIZE,
                              height: CARD_SIZE,
                              borderRadius: CARD_BR,
                              background: "#1A1C1E",
                            }}
                            tabIndex={-1} onClick={() => { setSelectedCategory(i); setScreen("player"); }}
                          >
                            <div
                              className="absolute bg-cover bg-center"
                              style={{
                                inset: 3,
                                borderRadius: CARD_BR - 3,
                                backgroundImage: `url('${cat.image}')`,
                              }}
                            />
                          </div>
                          {/* 标签 */}
                          <span
                            className="block text-center text-[15px] leading-7"
                            style={{ color: "rgba(255,255,255,0.85)" }}
                          >
                            {cat.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ===== 重磅上新 ===== */}
                <div className="px-10 pt-2 pb-2">
                  <h2 className="text-white text-xl font-medium tracking-wide">
                    重磅上新
                  </h2>
                </div>

                {/* ===== Banner ===== */}
                <div className="px-10 flex-1 min-h-0">
                  <div
                    className="relative w-full h-full cursor-pointer outline-none group border-2 border-transparent hover:border-[#00CC66] transition-transform duration-500 hover:scale-[1.02] rounded-t-[24px] overflow-hidden"
                    style={{
                      boxShadow: isFocused("banner", 0) ? FOCUS_RING : undefined,
                    }}
                    tabIndex={-1}
                  >
                    <div
                      className="absolute bg-cover bg-no-repeat bg-top overflow-hidden rounded-t-[21px]"
                      style={{
                        top: 3,
                        left: 3,
                        right: 3,
                        bottom: 0,
                        backgroundImage:
                          "url('https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/banner-new.jpg')",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TV Legs */}
        <div className="flex justify-between mt-0.5 px-[10%] sm:px-[12%]">
          <div className="flex flex-col items-center">
            <div
              className="w-[3px] sm:w-[4px] h-3 sm:h-4"
              style={{ background: "linear-gradient(180deg, #333, #222)" }}
            />
            <div
              className="w-8 sm:w-12 h-[2px] rounded-sm"
              style={{ background: "linear-gradient(90deg, #444, #555)" }}
            />
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-[3px] sm:w-[4px] h-3 sm:h-4"
              style={{ background: "linear-gradient(180deg, #333, #222)" }}
            />
            <div
              className="w-8 sm:w-12 h-[2px] rounded-sm"
              style={{ background: "linear-gradient(90deg, #555, #444)" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
