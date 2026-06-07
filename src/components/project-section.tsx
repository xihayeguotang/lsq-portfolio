"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { PortfolioItem } from "@/data/portfolio";
interface ProjectSectionProps {
  item: PortfolioItem;
  images: { src: string; alt: string }[];
  /** 可选的图片点击回调，开启后可点击放大查看 */
  onImageClick?: (index: number) => void;
  /** 可选的视频内容，渲染在标题和图片之间 */
  video?: React.ReactNode;
}

export default function ProjectSection({ item, images, onImageClick, video }: ProjectSectionProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-10 sm:pt-16 pb-14">
      <div className="flex flex-col items-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl font-bold md:text-4xl lg:text-6xl mb-3"
          style={{ color: "var(--dbx-text-primary)" }}
        >
          {item.title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center text-base md:text-lg max-w-xl leading-relaxed mb-4"
          style={{ color: "var(--dbx-text-secondary)" }}
        >
          {item.description}
        </motion.p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  color: "var(--dbx-text-tertiary)",
                  background: "var(--dbx-fill-trans-10)",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}
      </div>

      {/* 可选视频 */}
      {video}

      {/* Images */}
      <div className="flex flex-col gap-6">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className={`relative w-full group ${onImageClick ? 'cursor-pointer' : ''}`}
            onClick={() => onImageClick?.(i)}
          >
            <div
              className="relative overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
              style={{
                background: "var(--dbx-bg-float)",
                border: "1px solid var(--dbx-border-light)",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={896}
                height={504}
                className="w-full h-auto object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
