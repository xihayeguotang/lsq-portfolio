"use client";

import React from "react";
import { motion } from "motion/react";

interface HorizontalCarouselProps {
  /** 轮播内容区域 id，用于箭头点击定位 */
  id?: string;
  /** 每张卡片的宽度（px），用于计算箭头滚动步进 */
  cardWidth: number;
  /** 子元素（卡片列表） */
  children: React.ReactNode;
  /** 自定义 className */
  className?: string;
}

function CarouselArrows({
  scrollRef,
  cardWidth,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  cardWidth: number;
}) {
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, [scrollRef]);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const gap = 16;
    el.scrollBy({
      left: dir === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  };

  return (
    <>
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm disabled:opacity-30 transition-opacity dark:bg-neutral-800/80"
        style={{ color: "var(--dbx-text-primary)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18L9 12L15 6" />
        </svg>
      </button>
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm disabled:opacity-30 transition-opacity dark:bg-neutral-800/80"
        style={{ color: "var(--dbx-text-primary)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18L15 12L9 6" />
        </svg>
      </button>
    </>
  );
}

export default function HorizontalCarousel({
  id,
  cardWidth,
  children,
  className = "",
}: HorizontalCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={`relative ${className}`}>
      <CarouselArrows scrollRef={scrollRef} cardWidth={cardWidth} />
      <div
        id={id}
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 scroll-smooth [scrollbar-width:none] pb-2"
      >
        {children}
      </div>
    </div>
  );
}
