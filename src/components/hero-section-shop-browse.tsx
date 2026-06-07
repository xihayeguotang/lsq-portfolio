"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import HorizontalCarousel from "@/components/ui/horizontal-carousel";
import ImageLightbox from "@/components/ui/image-lightbox";

interface HeroSectionOneProps {
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  images?: { src: string; alt: string }[];
}

export default function HeroSectionOne({
  title,
  description,
  tags,
  images,
}: HeroSectionOneProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
    <section className="mx-auto my-8 flex max-w-6xl flex-col items-center justify-center px-6 sm:px-8">
      <div className="w-full py-10 md:py-16">
        <h1
          className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold md:text-4xl lg:text-6xl"
          style={{ color: "var(--dbx-text-primary)" }}
        >
          {title.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.03,
                ease: "easeInOut",
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-base font-normal md:text-lg"
          style={{ color: "var(--dbx-text-secondary)" }}
        >
          {description}
        </motion.p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-2"
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  color: "var(--dbx-text-tertiary)",
                  background: "var(--dbx-fill-trans-10)",
                  border: "1px solid var(--dbx-border-light)",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Preview carousel — 一排轮播 */}
        {images && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            className="relative z-10 mt-8 w-full max-w-6xl mx-auto"
          >
            <HorizontalCarousel cardWidth={280}>
              {images.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex-shrink-0 relative group cursor-pointer p-2"
                  style={{ width: 260 }}
                  onClick={() => setLightboxIndex(i)}
                >
                  {/* Phone frame */}
                  <div
                    className="relative rounded-[32px] p-[10px] shadow-md transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{
                      background: "linear-gradient(145deg, #1c1c1e, #2c2c2e)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Screen area */}
                    <div className="overflow-hidden rounded-3xl border border-gray-600/50">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={260}
                        height={564}
                        className="aspect-[9/19.5] h-auto w-full object-cover"
                      />
                    </div>
                    {/* Front camera notch */}
                    <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-black/40 border border-white/10" />
                    {/* Inner shadow for depth */}
                    <div className="absolute inset-[10px] rounded-3xl ring-1 ring-inset ring-black/10 pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </HorizontalCarousel>
          </motion.div>
        )}
      </div>
    </section>

      {/* Lightbox */}
      {lightboxIndex !== null && images && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
