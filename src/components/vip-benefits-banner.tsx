"use client";

import Image from "next/image";

interface BenefitItem {
  icon: string;
  label: string;
  iconWidth: number;
  iconHeight: number;
  iconMarginTop: number;
  /** Spacing before the icon */
  iconMarginLeft: number;
  /** Spacing between icon and text */
  iconTextGap: number;
}

const benefits: BenefitItem[] = [
  { icon: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/images/vip/icon-theme.svg", label: "全站主题畅看", iconWidth: 26, iconHeight: 24.87, iconMarginTop: 4.56, iconMarginLeft: 44, iconTextGap: 1 },
  { icon: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/images/vip/icon-mini.svg", label: "百科Mini", iconWidth: 28, iconHeight: 23.02, iconMarginTop: 5.49, iconMarginLeft: 26, iconTextGap: 0.98 },
  { icon: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/images/vip/icon-bilingual.svg", label: "中英双语", iconWidth: 26.04, iconHeight: 26.0, iconMarginTop: 4.0, iconMarginLeft: 26.98, iconTextGap: 0.98 },
  { icon: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/images/vip/icon-free.svg", label: "免费内容", iconWidth: 25.5, iconHeight: 23.35, iconMarginTop: 5.33, iconMarginLeft: 27.25, iconTextGap: 1.25 },
  { icon: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/images/vip/icon-new.svg", label: "上新抢先看", iconWidth: 20.74, iconHeight: 25.8, iconMarginTop: 3.94, iconMarginLeft: 32.73, iconTextGap: 0.53 },
];

const firstIconMarginTop = benefits[0].iconMarginTop; // 4.56

export default function VipBenefitsBanner() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 1026,
        height: 172,
        borderRadius: "24px 24px 0 0",
      }}
    >
      {/* Background layer */}
      <div className="absolute inset-0">
        <Image
          src="https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/images/vip/bg.svg"
          alt=""
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/images/vip/bg-blur.svg')",
            backgroundSize: "cover",
            filter: "blur(182px)",
          }}
        />
      </div>

      {/* Content layer */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{
          background: "linear-gradient(0deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.00) 100%)",
        }}
      >
        <div
          className="flex flex-col flex-1"
          style={{
            background:
              "linear-gradient(268.4274deg, rgba(26,28,30,0.40) 0%, rgba(26,28,30,0.00) 100%)",
            gap: 12,
          }}
        >
          {/* Title */}
          <div style={{ padding: "27.5px 0 0 40px" }}>
            <h1
              style={{
                fontFamily: "'zihunxinquhei', 'PingFang SC', sans-serif",
                fontSize: 48,
                fontWeight: 400,
                lineHeight: "58px",
                background: "linear-gradient(7.51deg, #FFBB4E -12%, #FFE2AF 94%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                width: "fit-content",
              }}
            >
              百科会员
            </h1>
          </div>

          {/* Features */}
          <div className="flex items-center" style={{ paddingBottom: 38.5 }}>
            {benefits.map((item) => (
              <div key={item.label} className="flex items-center" style={{ gap: 5 }}>
                {/* Icon */}
                <div
                  style={{
                    marginLeft: item.iconMarginLeft,
                    width: item.iconWidth,
                    height: item.iconHeight,
                    marginTop: item.iconMarginTop - firstIconMarginTop,
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
                {/* Label */}
                <span
                  style={{
                    opacity: 0.8,
                    color: "#FFD48A",
                    fontFamily: "'PingFang SC', 'PingFang SC', sans-serif",
                    fontSize: 24,
                    fontWeight: 500,
                    lineHeight: "34px",
                    marginLeft: item.iconTextGap,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Border overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: "2px solid rgba(255, 223, 164, 0.08)",
          borderRadius: "24px 24px 0 0",
        }}
      />
    </div>
  );
}
