"use client";

import { motion } from "motion/react";
import Image from "next/image";

const images = [
  { src: "/cos/projects/car-system/screenshots/首页_半屏_dark.jpg", alt: "首页" },
  { src: "/cos/projects/car-system/screenshots/登录常态_dark.jpg", alt: "登录" },
  { src: "/cos/projects/car-system/screenshots/授权弹窗_dark.jpg", alt: "授权弹窗" },
  { src: "/cos/projects/car-system/screenshots/加载中_dark.jpg", alt: "加载中" },
  { src: "/cos/projects/car-system/screenshots/我的主题_dark.jpg", alt: "我的主题" },
  { src: "/cos/projects/car-system/screenshots/设置_dark.jpg", alt: "设置" },
  { src: "/cos/projects/car-system/screenshots/扫码成功_dark.jpg", alt: "扫码成功" },
  { src: "/cos/projects/car-system/screenshots/删除数据_dark.jpg", alt: "删除数据" },
  { src: "/cos/projects/car-system/screenshots/冷启动_半屏_dark.jpg", alt: "冷启动" },
  { src: "/cos/projects/car-system/screenshots/试看结束_dark.jpg", alt: "试看结束" },
  { src: "/cos/projects/car-system/screenshots/退出登录_dark.jpg", alt: "退出登录" },
  { src: "/cos/projects/car-system/screenshots/隐私协议_默认_dark.jpg", alt: "隐私协议" },
];

interface MarqueeRowProps {
  images: { src: string; alt: string }[];
  direction: "left" | "right";
  duration: number;
}

function MarqueeRow({ images, direction, duration }: MarqueeRowProps) {
  return (
    <div className="relative flex overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <motion.div
        className="flex gap-4 shrink-0"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {images.concat(images).map((img, i) => (
          <div
            key={i}
            className="relative shrink-0 w-[240px] sm:w-[300px] md:w-[360px] aspect-[16/9] rounded-lg overflow-hidden"
            style={{ border: "1px solid var(--dbx-border-light)" }}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function CarSystemMarquee({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <MarqueeRow images={images} direction="left" duration={200} />
        <MarqueeRow images={images} direction="right" duration={230} />
        <MarqueeRow images={images} direction="left" duration={190} />
      </div>
    );
  }

  return (
    <section className="w-full py-16 sm:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 mb-10 text-center">
        <h2
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--dbx-text-primary)" }}
        >
          Multi-scene Display
        </h2>
        <p style={{ color: "var(--dbx-text-secondary)" }} className="text-sm">
          多场景展示 — 不同方向滚动浏览车机界面
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <MarqueeRow images={images} direction="left" duration={200} />
        <MarqueeRow images={images} direction="right" duration={230} />
        <MarqueeRow images={images} direction="left" duration={190} />
      </div>
    </section>
  );
}
