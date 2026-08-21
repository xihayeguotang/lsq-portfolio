"use client";

/**
 * 「国内组件 1.0」封面
 * 来源：Figma「国内组件」文件 0:1 封面节点
 */
export default function DomesticCover() {
  return (
    <div
      className="relative aspect-[680/364] w-full max-w-[680px] overflow-hidden rounded-[20px] select-none"
      style={{
        backgroundImage:
          "linear-gradient(126.7deg, rgb(21, 221, 121) 6.35%, rgb(0, 204, 102) 87.95%)",
      }}
    >
      {/* 装饰矢量图形 */}
      <img
        src="/figma/domestic-cover-vector.svg"
        alt=""
        draggable={false}
        className="pointer-events-none absolute right-[-1px] top-1/2 w-[348px] max-w-none -translate-y-1/2 rotate-180"
      />

      {/* 小标题 */}
      <p className="absolute left-[60px] top-[74px] whitespace-nowrap text-[20px] font-medium tracking-[0.4px] text-white opacity-40">
        国内
      </p>

      {/* 大标题 */}
      <h3 className="absolute left-[60px] top-[123px] whitespace-nowrap text-[48px] font-medium leading-none tracking-[0.96px] text-white">
        {"国内&组件 1.0"}
      </h3>

      {/* 装饰线 */}
      <div className="absolute left-[62px] top-[263px] h-[4px] w-[38px] bg-white opacity-40" />

      {/* 团队 */}
      <p className="absolute left-[60px] top-[290px] whitespace-nowrap text-[20px] font-medium text-white opacity-40">
        斑马课程体验组
      </p>

      {/* 年份 */}
      <p className="absolute right-[52px] top-[290px] whitespace-nowrap text-right text-[20px] font-normal text-white/50">
        2023
      </p>
    </div>
  );
}
