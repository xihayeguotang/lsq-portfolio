"use client";

import { MIAODUO_CDN } from "@/data/constants";
import BackButton from "@/components/tv-back-button";

// ── MiaoDuo CDN assets for login screen ──
const MIAO = {
  bg: `${MIAODUO_CDN}/19e6a4743f0074d-059ace50-c1cc-4995-8568-e5eb7a8deb78.svg`,
  logo: `${MIAODUO_CDN}/19e6a4743f5543c-9a27430f-ef32-4653-af78-0f067d5c8318.svg`,
  leafL: `${MIAODUO_CDN}/19e6a4743f52c1c-630a7dfd-45d2-45be-81c4-f845a2ecd911.svg`,
  leafR: `${MIAODUO_CDN}/19e6a4743f5f1df-78672b5b-b19e-4b74-8ec0-9f583fada493.svg`,
  qr: `${MIAODUO_CDN}/19e6a4743f622cd-96df4e08-23e0-4682-b4aa-c70ab9e18f70.svg`,
};

const STATS = [
  { number: "568万+", label: "全球家长科普选择" },
  { number: "5000+", label: "百科科普知识点" },
  { number: "483+城市", label: "中英双语 风靡全球" },
];

const goldGrad = "linear-gradient(180deg, #FFF7E1 0%, #FFE2AC 100%)";

/* ── Gold gradient text helper ── */
function GoldText({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={className}
      style={{
        background: goldGrad,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ── Login screen — strictly scaled from 1920×1080 design (×0.6) ── */
export default function LoginScreen({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ background: "linear-gradient(180deg, #222427 0%, #091016 100%)" }}
    >
      {/* Starry bg — stretch to fill */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${MIAO.bg}")`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      />

      <BackButton onClick={onBack} />

      {/* Content */}
      <div className="relative flex-1 flex items-start justify-center px-4 sm:px-8 pt-8 sm:pt-16">
        <div className="flex items-start justify-center" style={{ gap: 49 }}>
          {/* ── Left: Brand ── */}
          <div className="flex flex-col flex-shrink-0" style={{ gap: 13 }}>
            {/* Logo — 960.58×99.67 → 576×60 */}
            <div
              className="bg-contain bg-no-repeat bg-center"
              style={{
                width: 576,
                height: 60,
                backgroundImage: `url("${MIAO.logo}")`,
              }}
            />

            {/* Stats — gap 8 → 5 */}
            <div className="flex items-stretch" style={{ gap: 5 }}>
              {STATS.map((stat, i) => (
                <div key={stat.number} className="contents">
                  {/* Leading leaf — 19.06×40.8 → 11×24, mt 32.2 → 19, ml 79.6/32 → 48/19 */}
                  <div
                    className="bg-contain bg-no-repeat bg-center flex-shrink-0 self-start"
                    style={{
                      width: 11,
                      height: 24,
                      marginTop: 19,
                      marginLeft: i === 0 ? 48 : 19,
                      backgroundImage: `url("${MIAO.leafL}")`,
                    }}
                  />
                  {/* Stat block */}
                  <div className="flex flex-col items-center">
                    {/* Number — font 32 → 19, lh 42 → 25 */}
                    <GoldText
                      className="font-bold text-center"
                      style={{ fontSize: 19, lineHeight: "25px" }}
                    >
                      {stat.number}
                    </GoldText>
                    {/* Label — font 24 → 14, lh 31 → 19 */}
                    <GoldText
                      className="text-center whitespace-nowrap"
                      style={{ fontSize: 14, lineHeight: "19px" }}
                    >
                      {stat.label}
                    </GoldText>
                  </div>
                  {/* Trailing leaf */}
                  <div
                    className="bg-contain bg-no-repeat bg-center flex-shrink-0 self-start"
                    style={{
                      width: 11,
                      height: 24,
                      marginTop: 19,
                      backgroundImage: `url("${MIAO.leafR}")`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Login card — 716 → 430, br 32 → 19 ── */}
          <div
            className="bg-[#27292B] flex flex-col items-center flex-shrink-0"
            style={{
              width: 430,
              borderRadius: 19,
              gap: 19,
              paddingTop: 48,
              paddingBottom: 48,
            }}
          >
            {/* Tabs — mt 80 → 48 done by card, gap 10 → 6 */}
            <div className="flex justify-center" style={{ gap: 6 }}>
              {/* 微信扫码 — 128w → 77, lh 45 → 27, font ~32 → 19 */}
              <span
                className="text-white text-center font-semibold"
                style={{
                  width: 77,
                  lineHeight: "27px",
                  fontSize: 19,
                  fontFamily: "'PingFang SC', sans-serif",
                }}
              >
                微信扫码
              </span>
              {/* 登录 — 64w → 38, lh 45 → 27 */}
              <span
                className="text-center font-semibold"
                style={{
                  width: 38,
                  lineHeight: "27px",
                  fontSize: 19,
                  fontFamily: "'PingFang SC', sans-serif",
                  color: "rgba(255,255,255,0.70)",
                }}
              >
                登录
              </span>
            </div>

            {/* QR Code — 556×556 → 334×334, mb 80 → 48 done by card */}
            <div
              className="bg-contain bg-no-repeat bg-center flex-shrink-0"
              style={{
                width: 334,
                height: 334,
                backgroundImage: `url("${MIAO.qr}")`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
