"use client";

interface PhoneMockupProps {
  src: string;
  alt: string;
  /** 可选的底部覆盖图（如按钮） */
  bottom?: string;
  className?: string;
}

/**
 * 通用的手机模型容器，带圆角边框、前置摄像头圆点和可滚动屏幕区域。
 * 宽度通过 className 控制（如 `w-[200px] sm:w-[240px]`）。
 */
export default function PhoneMockup({ src, alt, bottom, className }: PhoneMockupProps) {
  return (
    <div
      className={`relative rounded-[32px] shadow-md overflow-hidden ${className ?? ""}`}
      style={{
        background: "linear-gradient(145deg, #1c1c1e, #2c2c2e)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* 屏幕区域 */}
      <div className="m-[8px] overflow-hidden rounded-3xl border border-gray-600/50 relative">
        <div
          className="overflow-y-auto aspect-[9/19.5] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <img src={src} alt={alt} className="w-full h-auto" />
        </div>
        {bottom && (
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <img src={bottom} alt="" className="w-full h-auto" />
          </div>
        )}
      </div>
      {/* 前置摄像头 */}
      <div className="absolute top-[16px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-black/40 border border-white/10" />
    </div>
  );
}
