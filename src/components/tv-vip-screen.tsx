"use client";

import { useState } from "react";
import { MIAODUO_CDN } from "@/data/constants";
import VipBenefitsBanner from "@/components/vip-benefits-banner";
import BackButton from "@/components/tv-back-button";

const CDN2 = MIAODUO_CDN;

interface OrderCard {
  image: string;
  name: string;
  date?: string;
  labels?: string[];
  values?: string[];
  price: string;
  status: string;
  itemsText?: string;
  isRefund?: boolean;
  isJpeg?: boolean;
}

function OrderCardInner({ card }: { card: OrderCard }) {
  return (
    <>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.10)", display: "flex", gap: 24, alignItems: "stretch", flexDirection: "row" as const, paddingRight: 21, paddingBottom: 32 }}>
        <div style={{ backgroundImage: `url("${card.image}")`, width: 200, height: 200, backgroundSize: "cover", borderRadius: card.isJpeg ? 27.27 : undefined, backgroundColor: card.isJpeg ? "#fff" : undefined, flexShrink: 0 }} />
        <div style={{ marginTop: card.date ? 48.5 : 6.5, marginBottom: 6.5, gap: 24, display: "flex", flexDirection: "column" as const, alignItems: "stretch" }}>
          <div style={{ color: "rgba(255,255,255,0.90)", fontSize: 32, fontWeight: 600, lineHeight: "45px", whiteSpace: "nowrap" as const }}>{card.name}</div>
          {card.date ? (
            <div style={{ color: "rgba(255,255,255,0.60)", lineHeight: "34px", width: 96 }}>下单时间</div>
          ) : (
            <div style={{ gap: 8, display: "flex", flexDirection: "column" as const, alignItems: "stretch" }}>
              {card.labels?.map((l, i) => <div key={i} style={{ color: "rgba(255,255,255,0.60)", lineHeight: "34px", width: 96 }}>{l}</div>)}
            </div>
          )}
        </div>
        {card.date ? (
          <div style={{ color: "rgba(255,255,255,0.60)", lineHeight: "34px", width: 247, marginTop: 117.5, marginBottom: 48.5, marginLeft: 180 }}>{card.date}</div>
        ) : (
          <div style={{ marginTop: 75.5, marginBottom: 6.5, marginLeft: 180, gap: 8, display: "flex", flexDirection: "column" as const, alignItems: "stretch" }}>
            {card.values?.map((v, i) => <div key={i} style={{ color: "rgba(255,255,255,0.60)", lineHeight: "34px", width: 247 }}>{v}</div>)}
          </div>
        )}
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "row" as const, justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "row" as const, alignItems: "stretch" }}>
          <div style={{ color: "rgba(255,255,255,0.90)", fontSize: 32, lineHeight: "45px", width: 128 }}>商品总价</div>
          {card.itemsText && <div style={{ color: "rgba(255,255,255,0.60)", fontSize: 32, lineHeight: "45px", width: 205 }}>{card.itemsText}</div>}
        </div>
        <div style={{ color: "#FFFFFF", fontSize: 32, fontWeight: 500, lineHeight: "45px", textAlign: "right" as const, width: 76 }}>{card.price}</div>
      </div>
    </>
  );
}

function CardRow({ cards, isLast }: { cards: OrderCard[]; isLast?: boolean }) {
  return (
    <div style={{ marginTop: isLast ? 21 : undefined, marginBottom: isLast ? 75 : undefined, gap: 48, display: "flex", flexDirection: "row" as const, alignItems: "stretch" }}>
      {cards.map((card, ci) => (
        <div key={ci} style={{ background: "#27292B", borderRadius: 32, padding: 32, display: "flex", width: 856, flexDirection: "column" as const, alignItems: "stretch", height: 365, overflow: "hidden", marginLeft: ci === 0 ? 80 : undefined, gap: 24 }}>
          <OrderCardInner card={card} />
        </div>
      ))}
    </div>
  );
}

function Header() {
  return (
    <div style={{ marginTop: 60, display: "flex", flexDirection: "row" as const, justifyContent: "space-between" }}>
      <div style={{ marginLeft: 80, gap: 20, display: "flex", flexDirection: "row" as const, alignItems: "stretch" }}>
        <div style={{ backgroundImage: `url("${CDN2}/19e6eb987ca67f5-93b495b6-f75f-401b-8113-bdc90e20b5c4.svg")`, width: 100, height: 100, backgroundSize: "cover", flexShrink: 0 }} />
        <div style={{ color: "rgba(255,255,255,0.90)", fontSize: 40, fontWeight: 500, lineHeight: "56px", width: 160, marginTop: 22 }}>我的订单</div>
      </div>
      <div style={{ backgroundImage: `url("${CDN2}/19e6eb987cbfd56-b943ec77-5908-455c-bf99-6ce3fbd3e447.svg")`, width: 257.17, height: 64, backgroundSize: "cover", marginRight: 79.83, marginTop: 18, flexShrink: 0 }} />
    </div>
  );
}

export function OrdersScreen({ onBack }: { onBack: () => void }) {
  const orders: OrderCard[] = [
    { image: CDN2+"/19e6e98bcd3e682-537ac424-f0a8-41fe-88f5-09d377fcbd94.svg", name: "微生物", date: "2023-01-06 20:38:22", price: "¥799", status: "已订购" },
    { image: CDN2+"/19e6e98bce4ac04-9b3ef7d0-0ff3-40d7-b2c7-0fa33d9f94b0.svg", name: "植物", labels: ["下单时间","生效时间","失效日期"], values: ["2023-01-06 20:38:22","20230106346741640","2024-01-07 20:38:22"], price: "¥799", status: "已订购", itemsText: "（共1件商品）" },
    { image: CDN2+"/19e6e98bced08d1-351dd5d1-3ab1-42fa-a863-017ff40db895.svg", name: "史记", labels: ["下单时间","生效时间","失效日期"], values: ["2023-01-06 20:38:22","20230106346741640","2024-01-07 20:38:22"], price: "¥799", status: "已订购", itemsText: "（共1件商品）" },
    { image: CDN2+"/1967629a16a7072-719c2f26-8021-46e5-bf8e-e711ec7a11f1.jpeg", name: "百科 vip年卡", labels: ["下单时间","生效时间","失效日期"], values: ["2023-01-06 20:38:22","20230106346741640","2024-01-07 20:38:22"], price: "¥799", status: "已退款", itemsText: "（共1件商品）", isJpeg: true, isRefund: true },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ background: "#1A1C1E" }}>
      <BackButton onClick={onBack} />
      <div style={{ transform: "scale(0.6)", transformOrigin: "center center", width: 1920, height: 1080, flexShrink: 0 }}>
        <div style={{ background: "#1A1C1E", width: 1920, overflow: "hidden", gap: 47, display: "flex", flexDirection: "column" as const, alignItems: "stretch", position: "relative" as const }}>
          <Header />
          <CardRow cards={orders.slice(0, 2)} />
          <CardRow cards={orders.slice(2, 4)} isLast />

          {/* Row 1 badges */}
          <div style={{ position: "absolute" as const, left: 784, top: 207, width: 1056, overflow: "hidden", display: "flex", flexDirection: "row" as const, justifyContent: "space-between", pointerEvents: "none" }}>
            {orders.slice(0, 2).map((card, i) => (
              <div key={i} style={{ backgroundImage: `url("${CDN2}/19e6eb98803841c-30d1c98d-2d24-4920-ab13-f85ec90bba26.svg")`, width: 152, height: 72, backgroundSize: "cover", flexShrink: 0 }}>
                <div style={{ width: 152, display: "flex", alignItems: "flex-start", minHeight: 72, paddingLeft: 52, paddingTop: 10 }}>
                  <div style={{ width: 72, color: card.isRefund ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.90)", fontWeight: 500, lineHeight: "34px", minHeight: 34, fontSize: 24 }}>{card.status}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 badges */}
          <div style={{ position: "absolute" as const, left: 784, bottom: 367, width: 1056, overflow: "hidden", display: "flex", flexDirection: "row" as const, justifyContent: "space-between", pointerEvents: "none" }}>
            {orders.slice(2, 4).map((card, i) => (
              <div key={i} style={{ backgroundImage: `url("${CDN2}/19e6eb98803841c-30d1c98d-2d24-4920-ab13-f85ec90bba26.svg")`, width: 152, height: 72, backgroundSize: "cover", flexShrink: 0 }}>
                <div style={{ width: 152, display: "flex", alignItems: "flex-start", minHeight: 72, paddingLeft: 52, paddingTop: 10 }}>
                  <div style={{ width: 72, color: card.isRefund ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.90)", fontWeight: 500, lineHeight: "34px", minHeight: 34, fontSize: 24 }}>{card.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgreementScreen({ onBack }: { onBack: () => void }) {
  const CDN = MIAODUO_CDN;
  const [rowHovered, setRowHovered] = useState(-1);

  const rows = [
    { label: "用户隐私政策", width: 168 },
    { label: "用户服务协议", width: 168 },
    { label: "儿童隐私保护政策", width: 224 },
    { label: "个人信息收集清单", width: 224 },
    { label: "第三方信息共享清单", width: 252 },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ background: "#1A1C1E" }}>
      <BackButton onClick={onBack} />

      <div
        className="flex-shrink-0"
        style={{
          width: 1920,
          height: 1080,
          transform: "scale(0.6)",
          transformOrigin: "center center",
          position: "relative",
          fontFamily: "'PingFang SC', sans-serif",
        }}
      >
        <div style={{ background: "#1A1C1E", width: 1920, overflow: "hidden", fontStyle: "normal", fontSize: 28, fontWeight: 600, gap: 106, display: "flex", flexDirection: "column" as const, alignItems: "stretch" }}>
          {/* Header: centered icon + title */}
          <div style={{ marginTop: 124, gap: 19, display: "flex", flexDirection: "row" as const, alignItems: "stretch" }}>
            <div style={{ backgroundImage: `url("${CDN}/19e6fb0db9c931e-a622cb2d-7f47-4967-af48-22e90a30403d.svg")`, width: 80, height: 80, marginLeft: 789, backgroundSize: "cover", flexShrink: 0 }} />
            <div style={{ backgroundImage: `url("${CDN}/19e6fb0db9d6e92-a7072417-a506-4f03-a61c-821763fb1805.svg")`, width: 242.27, height: 52, marginTop: 13, marginLeft: 0.73, backgroundSize: "cover", flexShrink: 0 }} />
          </div>

          {/* Content rows: centered container */}
          <div style={{ marginBottom: 86, marginLeft: 610, marginRight: 610, gap: 24, display: "flex", flexDirection: "column" as const, alignItems: "stretch" }}>
            {/* Row 1: Version info */}
            <div style={{ background: "#27292B", borderRadius: 20, display: "flex", justifyContent: "space-between", flexDirection: "row" as const, paddingLeft: 32, paddingRight: 32, paddingTop: 29, paddingBottom: 29 }}>
              <div style={{ color: "rgba(255,255,255,0.90)", lineHeight: "36px", fontSize: 28 }}>
                当前版本：2.7.0
              </div>
              <div style={{ opacity: 0.60, color: "rgba(255,255,255,0.90)", lineHeight: "36px", fontSize: 28 }}>
                已是最新版
              </div>
            </div>

            {/* Rows 2-6: Policy links */}
            {rows.map((row, i) => (
              <div key={i} style={{ background: rowHovered === i ? "rgba(255,255,255,0.90)" : "#27292B", borderRadius: rowHovered === i ? 22 : 20, display: "flex", justifyContent: "space-between", flexDirection: "row" as const, paddingLeft: 32, paddingRight: 32, paddingTop: 29, paddingBottom: 29 }} onMouseEnter={() => setRowHovered(i)} onMouseLeave={() => setRowHovered(-1)}>                <div style={{ color: rowHovered === i ? "#000000" : "rgba(255,255,255,0.90)", lineHeight: "36px", textAlign: "center", width: row.width, justifyContent: "center", alignItems: "center", display: "flex", minHeight: 36, fontSize: 28 }}>
                  {row.label}
                </div>
                <div style={{ backgroundImage: `url("${CDN}/${rowHovered === i ? "19e71dc2e5eca40-b8715d8e-fdf2-46c7-89c2-846bef660a18" : "19e6fb0db9d211e-b204782f-13f2-4660-9c4e-a3d979a9ce8c"}.svg")`, width: 28, height: 28, marginTop: 4, backgroundSize: "cover", flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── VIP screen — scaled via CSS transform from original 1920×1080 design ── */
export default function VipScreen({ onBack, onOrders, onAgreement }: { onBack: () => void; onOrders: () => void; onAgreement: () => void }) {
  const CDN = MIAODUO_CDN;
  const [orderBtnHovered, setOrderBtnHovered] = useState(false);
  const [agreementBtnHovered, setAgreementBtnHovered] = useState(false);
  const [plan0Hovered, setPlan0Hovered] = useState(false);
  const [plan1Hovered, setPlan1Hovered] = useState(false);
  const [plan2Hovered, setPlan2Hovered] = useState(false);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ background: "#1A1C1E" }}>
      <BackButton onClick={onBack} />

      {/* ═══ 1920×1080 design container scaled by CSS transform ═══ */}
      <div
        className="flex-shrink-0"
        style={{
          width: 1920,
          height: 1080,
          transform: "scale(0.6)",
          transformOrigin: "center center",
          position: "relative",
          fontFamily: "'PingFang SC', sans-serif",
        }}
      >
        {/* ── All content from the original 1920×1080 design, no manual scaling ── */}

        {/* Flexible background + main column */}
        <div
          style={{
            background: "#1A1C1E",
            width: 1920,
            overflow: "hidden",
            gap: 32,
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "stretch",
          }}
        >
          {/* ══ Profile Row — mt 60, gap 20 ══ */}
          <div
            style={{
              marginTop: 60,
              gap: 20,
              display: "flex",
              flexDirection: "row" as const,
              alignItems: "stretch",
            }}
          >
            {/* Avatar — 100×100 at ml 80, mt 0.5 */}
            <div
              className="bg-contain bg-no-repeat bg-center flex-shrink-0"
              style={{
                width: 100,
                height: 100,
                marginTop: 0.5,
                marginLeft: 80,
                backgroundImage: `url("${CDN}/19e6a634d94632b-57d04e99-fa82-43e6-be21-a1cf245a0e78.svg")`,
              }}
            />
            {/* Name + badge + membership text */}
            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "stretch" }}>
              {/* Name + badge row — gap 10 */}
              <div style={{ gap: 10, display: "flex", flexDirection: "row" as const, alignItems: "stretch", paddingRight: 14 }}>
                {/* 斑马宝贝 — 40px, lh 56, w 160 */}
                <div
                  style={{
                    color: "rgba(255,255,255,0.90)",
                    fontSize: 40,
                    lineHeight: "56px",
                    width: 160,
                    minHeight: 56,
                    fontFamily: "'PingFang SC', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  斑马宝贝
                </div>
                {/* VIP badge — 100×32, mt 12 */}
                <div
                  className="bg-contain bg-no-repeat bg-center flex-shrink-0"
                  style={{
                    width: 100,
                    height: 32,
                    marginTop: 12,
                    backgroundImage: `url("${CDN}/19e6a634d94617a-8ef06d27-ff33-43f7-b1de-2bce90aaafb3.svg")`,
                  }}
                />
              </div>
              {/* 会员还剩 28 天到期 — 32px, lh 45, opacity 0.60, w 284 */}
              <div style={{ opacity: 0.60, width: 284, minHeight: 45 }}>
                <span style={{ color: "rgba(255,255,255,0.90)", fontSize: 32, lineHeight: "45px", fontWeight: 400 }}>会员还剩 </span>
                <span style={{ color: "rgba(255,255,255,0.90)", fontSize: 32, lineHeight: "45px", fontWeight: 500 }}>28</span>
                <span style={{ color: "rgba(255,255,255,0.90)", fontSize: 32, lineHeight: "45px", fontWeight: 400 }}> 天到期</span>
              </div>
            </div>
          </div>

          {/* ══ Main Content Row — mb 80, gap 80 ══ */}
          <div
            style={{
              marginBottom: 80,
              gap: 80,
              display: "flex",
              flexDirection: "row" as const,
              alignItems: "stretch",
            }}
          >
          {/* ── Left column: VIP card + bottom buttons ── */}
          <div
            style={{
              marginLeft: 80,
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "stretch",
              gap: 27,
              width: 1026,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "stretch",
                background: "rgba(255,255,255,0.06)",
                borderRadius: 24,
              }}
            >
              <VipBenefitsBanner />

              {/* ── Pricing plans container (no gap between plans) ── */}
              <div style={{ display: "flex", flexDirection: "column" as const }}>

              {/* ─── Pricing: 1st plan — ¥799 1年卡 ─── */}
              <div
                onMouseEnter={() => setPlan0Hovered(true)}
                onMouseLeave={() => setPlan0Hovered(false)}
                style={{
                  background: plan0Hovered ? "linear-gradient(90deg, #FFDCA3 30%, #FFE2AF 96%)" : "transparent",
                  borderRadius: plan0Hovered ? 24 : 0,
                  transition: "background 0.2s ease",
                  borderBottom: "0.5px solid rgba(255,255,255,0.10)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 0,
                    alignItems: "stretch",
                    flexDirection: "row" as const,
                  }}
                >
                  {/* Price column with light gradient background */}
                  <div
                    style={{
                      position: "relative",
                      width: 320,
                      height: 174,
                      flexShrink: 0,
                      overflow: "hidden",
                      borderRadius: "24px 0 0 24px",
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    {/* Light gradient background (hover only) */}
                    {plan0Hovered && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(114.25718deg, #FFF2CF -75%, #FFFAEE 53%, #FFEBC8 121%)",
                          borderRadius: "24px 0 0 24px",
                        }}
                      />
                    )}
                    {/* Decorative SVG (hover only) */}
                    {plan0Hovered && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: 170,
                          height: 171,
                          backgroundImage: `url("${MIAODUO_CDN}/19e72f12ec66132-9f69bc4b-951a-4321-9c4a-ba8abe1e575b.svg")`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    {/* Price content */}
                    <div style={{ position: "relative", zIndex: 1, gap: 2, display: "flex", flexDirection: "column" as const, alignItems: "stretch", paddingLeft: 66.5, paddingTop: 18.5, paddingBottom: 18.5 }}>
                      <div style={{ gap: 11, display: "flex", flexDirection: "row" as const, alignItems: "stretch" }}>
                        <div
                          style={{
                            color: plan0Hovered ? "#B63D00" : "rgba(255,255,255,0.90)",
                            lineHeight: "67px",
                            textAlign: "center" as const,
                            width: 20,
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 23,
                            minHeight: 67,
                            fontSize: 28,
                            fontWeight: 500,
                            transition: "color 0.2s ease",
                          }}
                        >
                          ¥
                        </div>
                        <div
                          style={{
                            color: plan0Hovered ? "#B63D00" : "rgba(255,255,255,0.90)",
                            fontSize: 64,
                            fontWeight: 600,
                            lineHeight: "90px",
                            textAlign: "center" as const,
                            width: 113,
                            display: "flex",
                            justifyContent: "center",
                            minHeight: 90,
                            transition: "color 0.2s ease",
                          }}
                        >
                          799
                        </div>
                        <div
                          style={{
                            color: plan0Hovered ? "#B63D00" : "rgba(255,255,255,0.90)",
                            lineHeight: "74px",
                            textAlign: "center" as const,
                            width: 32,
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 16,
                            minHeight: 74,
                            fontSize: 28,
                            fontWeight: 500,
                            transition: "color 0.2s ease",
                          }}
                        >
                          元
                        </div>
                      </div>
                      <div
                        style={{
                          color: plan0Hovered ? "rgba(182,61,0,0.60)" : "rgba(255,255,255,0.60)",
                          fontWeight: 400,
                          lineHeight: "45px",
                          textDecoration: "line-through",
                          width: 154,
                          transition: "color 0.2s ease",
                          marginLeft: 16.5,
                          marginRight: 16.5,
                          minHeight: 45,
                          fontSize: 28,
                        }}
                      >
                        原价899元
                      </div>
                    </div>
                  </div>
                  {/* Plan name column */}
                  <div style={{ gap: 4, display: "flex", flexDirection: "column" as const, alignItems: "stretch", paddingTop: 32, paddingBottom: 32, paddingLeft: 146 }}>
                    <div style={{ gap: 16, display: "flex", flexDirection: "row" as const, alignItems: "stretch" }}>
                      <div
                        style={{
                          color: plan0Hovered ? "#B63D00" : "rgba(255,255,255,0.90)",
                          fontSize: 48,
                          fontWeight: 600,
                          lineHeight: "67px",
                          letterSpacing: "-0.96px",
                          textAlign: "center" as const,
                          width: 113,
                          display: "flex",
                          justifyContent: "center",
                          minHeight: 67,
                          transition: "color 0.2s ease",
                        }}
                      >
                        1年卡
                      </div>
                      <div
                        style={{
                          background: plan0Hovered ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.06)",
                          borderRadius: 177,
                          width: 194,
                          marginTop: 13.5,
                          marginBottom: 13.5,
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "flex-end",
                          minHeight: 40,
                          paddingRight: 15,
                          paddingTop: 7,
                          position: "relative",
                          overflow: "hidden",
                          transition: "background 0.2s ease",
                        }}
                      >
                        {/* Decorative SVG icon on the left */}
                        {plan0Hovered ? (
                          <svg
                            width="70"
                            height="40"
                            viewBox="0 0 70 40"
                            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                          >
                            <defs>
                              <clipPath id="hoverClip0">
                                <path d="M0 0L70 0L70 40L0 40L0 0Z" fill-rule="nonzero" />
                              </clipPath>
                              <linearGradient id="hoverGrad0_1" x1="0" y1="0.5" x2="1" y2="0.5" gradientTransform="matrix(-36.8239 -28.4072 49.7252 -64.4628 40.8236 75.6413)" gradientUnits="userSpaceOnUse">
                                <stop offset="0" stop-color="rgb(255, 176, 55)" />
                                <stop offset="1" stop-color="rgb(255, 138, 53)" />
                              </linearGradient>
                              <linearGradient id="hoverGrad0_3" x1="0" y1="0.5" x2="1" y2="0.5" gradientTransform="matrix(-0 -30 30 0 0 30)" gradientUnits="userSpaceOnUse">
                                <stop offset="0" stop-color="rgb(255, 193, 89)" />
                                <stop offset="1" stop-color="rgb(255, 160, 0)" />
                              </linearGradient>
                              <mask id="hoverMask0_2" style={{ maskType: "alpha" }}>
                                <rect width="30" height="30" x="10" y="5" fill="url(#hoverGrad0_3)" />
                              </mask>
                              <linearGradient id="hoverGrad0_4" x1="0" y1="0.5" x2="1" y2="0.5" gradientTransform="matrix(-3.96312 8.14135 -3.05459 -1.48694 7.10475 1.44453)" gradientUnits="userSpaceOnUse">
                                <stop offset="0.30737686" stop-color="rgb(255, 250, 190)" />
                                <stop offset="0.97788787" stop-color="rgb(255, 255, 255)" />
                              </linearGradient>
                              <mask id="hoverMask0_5" style={{ maskType: "alpha" }}>
                                <path d="M0 1.65354C0 0.740314 0.740314 0 1.65354 0L1.66165 0C5.95149 0 9.42098 3.4776 9.42098 7.76744L9.42098 21.9693C9.42098 23.7037 8.01501 25.1096 6.28065 25.1096L6.27243 25.1096C2.80372 25.1096 0 22.2977 0 18.829L0 1.65354Z" fill="rgb(0, 0, 0)" transform="matrix(0.885798 -0.464071 0.464071 0.885798 10.575 11.3656)" />
                              </mask>
                              <linearGradient id="hoverGrad0_6" x1="0" y1="0.5" x2="1" y2="0.5" gradientTransform="matrix(9.62421 16.7202 -17.6371 10.152 13.4649 -5.07604)" gradientUnits="userSpaceOnUse">
                                <stop offset="0" stop-color="rgb(255, 230, 137)" />
                                <stop offset="1" stop-color="rgb(255, 230, 137)" stop-opacity="0.56" />
                              </linearGradient>
                              <linearGradient id="hoverGrad0_7" x1="0" y1="0.5" x2="1" y2="0.5" gradientTransform="matrix(1.45412 16.7214 -8.20065 0.713143 7.16329 -1.19273)" gradientUnits="userSpaceOnUse">
                                <stop offset="0.6007393" stop-color="rgb(255, 250, 190)" />
                                <stop offset="0.97788787" stop-color="rgb(255, 255, 255)" />
                              </linearGradient>
                            </defs>
                            <g clipPath="url(#hoverClip0)">
                              <path d="M20 0C8.9543 0 0 8.9543 0 20L0 20.03C0 31.0757 8.9543 40 20 40L50 40L50 20.0669C50 8.98425 41.0157 0 29.9331 0L20 0ZM50.0024 20.3157L50.0024 40L70 40C59.0597 40 50.1711 31.2158 50.0024 20.3157Z" fill="url(#hoverGrad0_1)" fill-rule="evenodd" />
                              <g mask="url(#hoverMask0_2)">
                                <path d="M0 1.65354C0 0.740314 0.740314 0 1.65354 0L1.66165 0C5.95149 0 9.42098 3.4776 9.42098 7.76744L9.42098 21.9693C9.42098 23.7037 8.01501 25.1096 6.28065 25.1096L6.27243 25.1096C2.80372 25.1096 0 22.2977 0 18.829L0 1.65354Z" fill="url(#hoverGrad0_4)" fill-rule="nonzero" transform="matrix(0.885798 -0.464071 0.464071 0.885798 10.575 11.3656)" />
                                <g mask="url(#hoverMask0_5)">
                                  <path d="M10.6223 1.4199C6.76515 -1.15153 1.69626 0.348271 0 1.41959L8.75113 18.8773L19.9125 14.9371C16.6986 10.2947 10.6223 1.41995 10.6223 1.4199Z" fill="url(#hoverGrad0_6)" fill-rule="nonzero" transform="matrix(1 2.38701e-10 -2.38692e-10 1 13.751 16.1221)" />
                                </g>
                                <path d="M0.175229 2.19556C0.190337 0.978601 1.18116 0 2.39821 0L2.40657 0C6.39697 0 9.62347 3.23486 9.62347 7.22525L9.62347 8.69432C9.62347 10.0242 8.90902 11.2516 7.7526 11.9083L2.06986 15.1354C1.15274 15.6563 0.0164555 14.9854 0.0295475 13.9307L0.175229 2.19556Z" fill="url(#hoverGrad0_7)" fill-rule="nonzero" transform="matrix(-0.849634 -0.527372 -0.527372 0.849634 39.3544 11.3192)" />
                              </g>
                            </g>
                          </svg>
                        ) : (
                          <svg
                            width="70"
                            height="40"
                            viewBox="0 0 70 40"
                            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                          >
                            <path
                              d="M0 20C0 8.9543 8.9543 0 20 0L29.9331 0C41.0157 0 50 8.98425 50 20.0669L50 40L20 40C8.9543 40 0 31.0757 0 20.03L0 20ZM37.3237 10.0543C38.3578 10.6962 38.6835 12.0501 38.0546 13.0921L31.9895 23.1395C31.4445 24.0425 30.1252 24.0133 29.6207 23.0871L26.4943 17.3482C25.8582 16.1804 25.8984 14.7608 26.5997 13.6309L27.3745 12.3827C29.4789 8.99237 33.9262 7.94549 37.3166 10.0499L37.3237 10.0543ZM11.3513 12.8307C10.9275 12.0218 11.2397 11.0225 12.0487 10.5987L12.0558 10.5949C15.8558 8.6041 20.5429 10.0745 22.5337 13.8744L29.1244 26.4544C29.9292 27.9907 29.3363 29.8885 27.8 30.6934L27.7927 30.6972C24.7201 32.3069 20.9317 31.1173 19.3219 28.0447L11.3513 12.8307ZM50.0024 40L50.0024 20.3157C50.1711 31.2158 59.0597 40 70 40L50.0024 40Z"
                              fill="rgb(255, 255, 255)"
                              fillOpacity={0.12}
                              fillRule="evenodd"
                            />
                          </svg>
                        )}
                        <div
                          style={{
                            width: 114,
                            color: plan0Hovered ? "#FF711F" : "rgba(255,255,255,0.60)",
                            fontSize: 20,
                            fontWeight: 600,
                            lineHeight: "28px",
                            textAlign: "center" as const,
                            display: "flex",
                            justifyContent: "center",
                            minHeight: 28,
                            transition: "color 0.2s ease",
                          }}
                        >
                          低至66/一月
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        color: plan0Hovered ? "rgba(182,61,0,0.80)" : "rgba(255,255,255,0.60)",
                        fontWeight: 400,
                        lineHeight: "39px",
                        width: 370,
                        minHeight: 39,
                        fontSize: 28,
                        transition: "color 0.2s ease",
                      }}
                    >
                      38⼥神节，购会员享限时加赠
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Pricing: 2nd plan — ¥1499 2年卡 ─── */}
              <div
                onMouseEnter={() => setPlan1Hovered(true)}
                onMouseLeave={() => setPlan1Hovered(false)}
                style={{
                  background: plan1Hovered ? "linear-gradient(90deg, #FFDCA3 30%, #FFE2AF 96%)" : "transparent",
                  borderRadius: plan1Hovered ? 24 : 0,
                  transition: "background 0.2s ease",
                  borderBottom: "0.5px solid rgba(255,255,255,0.10)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 0,
                    alignItems: "stretch",
                    flexDirection: "row" as const,
                  }}
                >
                  {/* Left price column with light gradient background */}
                  <div
                    style={{
                      position: "relative",
                      width: 320,
                      height: 174,
                      flexShrink: 0,
                      overflow: "hidden",
                      borderRadius: "24px 0 0 24px",
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    {/* Light gradient background (hover only) */}
                    {plan1Hovered && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(114.25718deg, #FFF2CF -75%, #FFFAEE 53%, #FFEBC8 121%)",
                          borderRadius: "24px 0 0 24px",
                        }}
                      />
                    )}
                    {/* Decorative SVG (hover only) */}
                    {plan1Hovered && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: 170,
                          height: 171,
                          backgroundImage: `url("${MIAODUO_CDN}/19e72f12ec66132-9f69bc4b-951a-4321-9c4a-ba8abe1e575b.svg")`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    {/* Price content */}
                    <div style={{ position: "relative", zIndex: 1, gap: 2, display: "flex", flexDirection: "column" as const, alignItems: "stretch", paddingLeft: 66.5, paddingTop: 18.5, paddingBottom: 18.5 }}>
                      <div style={{ gap: 11, display: "flex", flexDirection: "row" as const, alignItems: "stretch" }}>
                        <div
                          style={{
                            color: plan1Hovered ? "#B63D00" : "rgba(255,255,255,0.90)",
                            lineHeight: "67px",
                            textAlign: "center" as const,
                            width: 20,
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 23,
                            minHeight: 67,
                            fontSize: 28,
                            fontWeight: 500,
                            transition: "color 0.2s ease",
                          }}
                        >
                          ¥
                        </div>
                        <div
                          style={{
                            color: plan1Hovered ? "#B63D00" : "rgba(255,255,255,0.90)",
                            fontSize: 64,
                            fontWeight: 600,
                            lineHeight: "90px",
                            textAlign: "center" as const,
                            width: 140,
                            display: "flex",
                            justifyContent: "center",
                            minHeight: 90,
                            transition: "color 0.2s ease",
                          }}
                        >
                          1499
                        </div>
                        <div
                          style={{
                            color: plan1Hovered ? "#B63D00" : "rgba(255,255,255,0.90)",
                            lineHeight: "74px",
                            textAlign: "center" as const,
                            width: 32,
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 16,
                            minHeight: 74,
                            fontSize: 28,
                            fontWeight: 500,
                            transition: "color 0.2s ease",
                          }}
                        >
                          元
                        </div>
                      </div>
                      <div
                        style={{
                          color: plan1Hovered ? "rgba(182,61,0,0.60)" : "rgba(255,255,255,0.60)",
                          fontWeight: 400,
                          lineHeight: "45px",
                          textDecoration: "line-through",
                          width: 154,
                          marginLeft: 16.5,
                          marginRight: 16.5,
                          minHeight: 45,
                          fontSize: 28,
                          transition: "color 0.2s ease",
                        }}
                      >
                        原价1899元
                      </div>
                    </div>
                  </div>
                  {/* Plan name column */}
                  <div
                    style={{
                      gap: 4,
                      display: "flex",
                      flexDirection: "column" as const,
                      alignItems: "stretch",
                      paddingTop: 32,
                      paddingBottom: 32,
                      paddingLeft: 146,
                    }}
                  >
                    <div style={{ gap: 16, display: "flex", flexDirection: "row" as const, alignItems: "stretch" }}>
                      <div
                        style={{
                          color: plan1Hovered ? "#B63D00" : "rgba(255,255,255,0.90)",
                          fontSize: 48,
                          fontWeight: 600,
                          lineHeight: "67px",
                          letterSpacing: "-0.96px",
                          textAlign: "center" as const,
                          width: 122,
                          display: "flex",
                          justifyContent: "center",
                          minHeight: 67,
                          transition: "color 0.2s ease",
                        }}
                      >
                        2年卡
                      </div>
                    </div>
                    <div
                      style={{
                        color: plan1Hovered ? "rgba(182,61,0,0.80)" : "rgba(255,255,255,0.60)",
                        fontWeight: 400,
                        lineHeight: "39px",
                        width: 370,
                        minHeight: 39,
                        fontSize: 28,
                        transition: "color 0.2s ease",
                      }}
                    >
                      38⼥神节，购会员享限时加赠
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Pricing: 3rd plan — ¥2199 3年卡 (no badge) ─── */}
              <div
                onMouseEnter={() => setPlan2Hovered(true)}
                onMouseLeave={() => setPlan2Hovered(false)}
                style={{
                  background: plan2Hovered ? "linear-gradient(90deg, #FFDCA3 30%, #FFE2AF 96%)" : "transparent",
                  borderRadius: plan2Hovered ? 24 : 0,
                  marginTop: 0.5,
                  transition: "background 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 0,
                    alignItems: "stretch",
                    flexDirection: "row" as const,
                  }}
                >
                  {/* Left price column with light gradient background */}
                  <div
                    style={{
                      position: "relative",
                      width: 320,
                      height: 174,
                      flexShrink: 0,
                      overflow: "hidden",
                      borderRadius: "24px 0 0 24px",
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    {/* Light gradient background (hover only) */}
                    {plan2Hovered && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(114.25718deg, #FFF2CF -75%, #FFFAEE 53%, #FFEBC8 121%)",
                          borderRadius: "24px 0 0 24px",
                        }}
                      />
                    )}
                    {/* Decorative SVG (hover only) */}
                    {plan2Hovered && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: 170,
                          height: 171,
                          backgroundImage: `url("${MIAODUO_CDN}/19e72f12ec66132-9f69bc4b-951a-4321-9c4a-ba8abe1e575b.svg")`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    {/* Price content */}
                    <div style={{ position: "relative", zIndex: 1, gap: 2, display: "flex", flexDirection: "column" as const, alignItems: "stretch", paddingLeft: 66.5, paddingTop: 18.5, paddingBottom: 18.5 }}>
                      <div style={{ gap: 11, display: "flex", flexDirection: "row" as const, alignItems: "stretch" }}>
                        <div
                          style={{
                            color: plan2Hovered ? "#B63D00" : "rgba(255,255,255,0.90)",
                            lineHeight: "67px",
                            textAlign: "center" as const,
                            width: 20,
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 23,
                            minHeight: 67,
                            fontSize: 28,
                            fontWeight: 500,
                            transition: "color 0.2s ease",
                          }}
                        >
                          ¥
                        </div>
                        <div
                          style={{
                            color: plan2Hovered ? "#B63D00" : "rgba(255,255,255,0.90)",
                            fontSize: 64,
                            fontWeight: 600,
                            lineHeight: "90px",
                            textAlign: "center" as const,
                            width: 140,
                            display: "flex",
                            justifyContent: "center",
                            minHeight: 90,
                            transition: "color 0.2s ease",
                          }}
                        >
                          2199
                        </div>
                        <div
                          style={{
                            color: plan2Hovered ? "#B63D00" : "rgba(255,255,255,0.90)",
                            lineHeight: "74px",
                            textAlign: "center" as const,
                            width: 32,
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 16,
                            minHeight: 74,
                            fontSize: 28,
                            fontWeight: 500,
                            transition: "color 0.2s ease",
                          }}
                        >
                          元
                        </div>
                      </div>
                      <div
                        style={{
                          color: plan2Hovered ? "rgba(182,61,0,0.60)" : "rgba(255,255,255,0.60)",
                          fontWeight: 400,
                          lineHeight: "45px",
                          textDecoration: "line-through",
                          width: 154,
                          marginLeft: 16.5,
                          marginRight: 16.5,
                          minHeight: 45,
                          fontSize: 28,
                          transition: "color 0.2s ease",
                        }}
                      >
                        原价2999元
                      </div>
                    </div>
                  </div>
                  {/* Plan name column — no badge for 3年卡 */}
                  <div
                    style={{
                      gap: 4,
                      display: "flex",
                      flexDirection: "column" as const,
                      alignItems: "stretch",
                      paddingTop: 32,
                      paddingBottom: 32,
                      paddingLeft: 146,
                    }}
                  >
                    <div style={{ width: 370, display: "flex", alignItems: "flex-start", minHeight: 67 }}>
                      <div
                        style={{
                          color: plan2Hovered ? "#B63D00" : "rgba(255,255,255,0.90)",
                          fontSize: 48,
                          fontWeight: 600,
                          lineHeight: "67px",
                          letterSpacing: "-0.96px",
                          textAlign: "center" as const,
                          width: 122,
                          display: "flex",
                          justifyContent: "center",
                          minHeight: 67,
                          transition: "color 0.2s ease",
                        }}
                      >
                        3年卡
                      </div>
                    </div>
                    <div
                      style={{
                        color: plan2Hovered ? "rgba(182,61,0,0.80)" : "rgba(255,255,255,0.60)",
                        fontWeight: 400,
                        lineHeight: "39px",
                        width: 370,
                        minHeight: 39,
                        fontSize: 28,
                        transition: "color 0.2s ease",
                      }}
                    >
                      38⼥神节，购会员享限时加赠
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ── Bottom buttons — outside VIP card → no bg ── */}
          <div style={{ gap: 24, display: "flex", flexDirection: "row" as const, alignItems: "stretch", justifyContent: "center" }}>
            {/* 我的订单 */}
            <div
              onClick={onOrders}
              onMouseEnter={() => setOrderBtnHovered(true)}
              onMouseLeave={() => setOrderBtnHovered(false)}
              style={{
                background: orderBtnHovered
                  ? "linear-gradient(90deg, #FFDCA3 30%, #FFE2AF 96%)"
                  : "rgba(255,255,255,0.06)",
                borderRadius: 24,
                display: "flex",
                width: 497,
                justifyContent: "center",
                alignItems: "center",
                height: 88,
                overflow: "hidden",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            >
              <div
                style={{
                  color: orderBtnHovered ? "#B63D00" : "rgba(255,255,255,0.60)",
                  fontWeight: orderBtnHovered ? 500 : 400,
                  lineHeight: "43px",
                  textAlign: "center" as const,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 43,
                  fontSize: 30.8,
                  transition: "color 0.2s ease",
                }}
              >
                我的订单
              </div>
            </div>
            {/* 会员服务协议 */}
            <div
              onClick={onAgreement}
              onMouseEnter={() => setAgreementBtnHovered(true)}
              onMouseLeave={() => setAgreementBtnHovered(false)}
              style={{
                background: agreementBtnHovered
                  ? "linear-gradient(90deg, #FFDCA3 30%, #FFE2AF 96%)"
                  : "rgba(255,255,255,0.06)",
                borderRadius: 24,
                display: "flex",
                width: 497,
                justifyContent: "center",
                alignItems: "center",
                height: 88,
                overflow: "hidden",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            >
              <div
                style={{
                  color: agreementBtnHovered ? "#B63D00" : "rgba(255,255,255,0.60)",
                  fontWeight: agreementBtnHovered ? 500 : 400,
                  lineHeight: "43px",
                  textAlign: "center" as const,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 43,
                  fontSize: 30.8,
                  transition: "color 0.2s ease",
                }}
              >
                会员服务协议
              </div>
            </div>
          </div>
          </div>

            {/* ── Right: White Payment Card — w 654, h 807, br 24 ── */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 24,
                width: 654,
                height: 807,
                overflow: "hidden",
                gap: 28,
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "stretch",
              }}
            >
              {/* Header row */}
              <div style={{ marginTop: 32, gap: 8, display: "flex", flexDirection: "row" as const, alignItems: "stretch" }}>
                <div
                  style={{
                    color: "#1A1A1A",
                    fontSize: 32,
                    fontWeight: 600,
                    lineHeight: "74px",
                    textAlign: "center" as const,
                    width: 304,
                    display: "flex",
                    justifyContent: "center",
                    textOverflow: "ellipsis",
                    marginTop: 16,
                    marginLeft: 95,
                    minHeight: 74,
                  }}
                >
                  支付宝/微信扫码支付
                </div>
                <div
                  style={{
                    color: "#FF3333",
                    fontSize: 64,
                    fontWeight: 600,
                    lineHeight: "90px",
                    textAlign: "center" as const,
                    width: 113,
                    display: "flex",
                    justifyContent: "center",
                    textOverflow: "ellipsis",
                    minHeight: 90,
                  }}
                >
                  799
                </div>
                <div
                  style={{
                    color: "#1A1A1A",
                    fontSize: 32,
                    fontWeight: 600,
                    lineHeight: "74px",
                    textAlign: "center" as const,
                    width: 32,
                    display: "flex",
                    justifyContent: "center",
                    textOverflow: "ellipsis",
                    marginTop: 16,
                    minHeight: 74,
                  }}
                >
                  元
                </div>
              </div>

              {/* Divider line */}
              <div
                className="bg-contain bg-no-repeat bg-center"
                style={{
                  width: 492,
                  height: 4,
                  marginTop: 4,
                  marginLeft: "auto",
                  marginRight: "auto",
                  backgroundImage: `url("${CDN}/19e6a634d95fa0e-4655bfe7-df40-4ace-9185-c0b5d59c07b5.svg")`,
                }}
              />

              {/* QR Code placeholder + SVG overlay */}
              <div
                className="bg-contain bg-no-repeat bg-center"
                style={{
                  width: 500,
                  height: 500,
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: 24,
                  backgroundImage: `url("${CDN}/19e6a634d9537f7-41e56183-4491-4664-b808-cd876e1b0230.svg")`,
                }}
              />

              {/* Footer text */}
              <div
                style={{
                  color: "rgba(0,0,0,0.40)",
                  fontSize: 24,
                  fontWeight: 400,
                  lineHeight: "34px",
                  textAlign: "center" as const,
                  width: 408,
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 25,
                  marginLeft: "auto",
                  marginRight: "auto",
                  minHeight: 68,
                }}
              >
                收款账号主体：华数传媒⽹络有限公司<br />备案号：视听备 [2025] A0909
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
