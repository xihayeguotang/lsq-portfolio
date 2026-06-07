"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { portfolioItems } from "@/data/portfolio";

function renderHeader(item: (typeof portfolioItems)[number]) {
  if (item.image) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex w-full aspect-video rounded-xl bg-gradient-to-br ${item.gradient ?? "from-gray-400/30 via-gray-500/20"} to-transparent items-center justify-center relative overflow-hidden`}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-white/20 blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-full bg-white/10 blur-lg" />
      </div>
      <motion.span
        className="text-4xl relative z-10"
        whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.4 }}
      >
        {item.emoji ?? "📁"}
      </motion.span>
    </div>
  );
}

function TagChips({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="text-[10px] px-2 py-0.5 rounded-full"
          style={{
            color: "var(--dbx-text-tertiary)",
            background: "var(--dbx-fill-trans-10)",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function PortfolioGrid() {
  const router = useRouter();

  return (
    <BentoGrid className="max-w-6xl mx-auto mt-6">
        {portfolioItems.map((item, i) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="h-full cursor-pointer"
            onClick={() => {
              if (item.figmaUrl) {
                window.open(item.figmaUrl, '_blank');
              } else {
                router.push(`/portfolio/${item.slug}`);
              }
            }}
          >
            <div
              className="!p-0 !rounded-2xl !border-0 overflow-hidden h-full"
              style={{ background: "var(--dbx-bg-float)" }}
            >
              <div className="h-full" style={{ background: "var(--dbx-bg-float)" }}>
                <BentoGridItem
                  title={
                    <span style={{ color: "var(--dbx-text-primary)" }}>
                      {item.title}
                    </span>
                  }
                  description={
                    <>
                      <span className="line-clamp-2" style={{ color: "var(--dbx-text-secondary)" }}>
                        {item.description}
                      </span>
                      <TagChips tags={item.tags} />
                    </>
                  }
                  header={renderHeader(item)}
                  className="!p-4 !rounded-2xl !border-0 transition-all duration-300 h-full flex flex-col"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </BentoGrid>
  );
}
