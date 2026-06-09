"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Breadcrumb from "@/components/ui/breadcrumb";
import HorizontalCarousel from "@/components/ui/horizontal-carousel";
import ImageLightbox from "@/components/ui/image-lightbox";
import ShopBrowseHero from "@/components/hero-section-shop-browse";
import { Card } from "@/components/ui/card";
import ProjectSection from "@/components/project-section";
import OverseasWebsiteSim from "@/components/overseas-website-sim";
import TvHero from "@/components/hero-section-demo-1";
import ConversionRateChart from "@/components/conversion-rate-chart";
import TvBackgroundGoals from "@/components/tv-background-goals";
import TvDesignApproach from "@/components/tv-design-approach";
import TvDataMetrics from "@/components/tv-data-metrics";
import CarSystemData from "@/components/car-system-data";
import HeroSectionCarSystem from "@/components/hero-section-car-system";
import HeroSectionOverseasLocalization from "@/components/hero-section-overseas-localization";
import OverseasDesignResearch from "@/components/overseas-design-research";
import HeroSectionEcommerceGrowth from "@/components/hero-section-ecommerce-growth";
import { findPortfolioItem, getPortfolioItems, type PortfolioItem } from "@/data/portfolio";

const shopBrowseHeroImages: { src: string; alt: string }[] = [
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/zebra-baike/1.jpg", alt: "商店浏览图 1" },
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/zebra-baike/2.jpg", alt: "商店浏览图 2" },
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/zebra-baike/3.jpg", alt: "商店浏览图 3" },
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/zebra-baike/4.jpg", alt: "商店浏览图 4" },
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/zebra-baike/5.jpg", alt: "商店浏览图 5" },
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/zebra-baike/6.jpg", alt: "商店浏览图 6" },
];

const shopBrowseHDImages: { src: string; alt: string }[] = [
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/zebra-baike-hd/1.jpg", alt: "HD 浏览图 1" },
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/zebra-baike-hd/2.jpg", alt: "HD 浏览图 2" },
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/zebra-baike-hd/3.jpg", alt: "HD 浏览图 3" },
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/zebra-baike-hd/4.jpg", alt: "HD 浏览图 4" },
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/zebra-baike-hd/5.jpg", alt: "HD 浏览图 5" },
  { src: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/zebra-baike-hd/6.jpg", alt: "HD 浏览图 6" },
];

const myFamilyImages: { src: string; alt: string }[] = Array.from(
  { length: 6 },
  (_, i) => ({
    src: `https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/my-family/${i + 1}.jpg`,
    alt: `My Family ${i + 1}`,
  }),
);

const weekendPlaygroundImages: { src: string; alt: string }[] = Array.from(
  { length: 15 },
  (_, i) => ({
    src: `https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/weekend-playground/${i + 1}.png`,
    alt: `周末游乐场 ${i + 1}`,
  }),
);

type LightboxState = { key: "hd" | "weekend" | "my-family"; index: number } | null;

function renderItemPage(
  item: PortfolioItem,
  slug: string,
  router: ReturnType<typeof useRouter>,
  lightbox: LightboxState,
  setLightbox: (state: LightboxState) => void,
  prevItem: PortfolioItem | null = null,
  nextItem: PortfolioItem | null = null,
) {
  const isShopBrowse = slug === "shop-browse";
  const isOverseasWebsite = slug === "overseas-website";
  const isWeekendPlayground = slug === "weekend-playground";
  const isMyFamily = slug === "my-family";
  const isSketchPlugin = slug === "sketch-plugin";
  const isTv = slug === "tv";
  const isBaikeEcommerce = slug === "baike-ecommerce";
  const isCarSystem = slug === "car-system";
  const isOverseasLocalization = slug === "overseas-localization";
  const hasCommonContent = !isShopBrowse && !isOverseasWebsite && !isWeekendPlayground && !isMyFamily && !isSketchPlugin && !isTv && !isCarSystem && !isOverseasLocalization && !isBaikeEcommerce;

  return (
    <>
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "var(--dbx-bg-base)" }}
    >
      {/* ======== Header ======== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center justify-between px-4 sm:px-8"
        style={{ height: "var(--dbx-header-height)", flexShrink: 0 }}
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/portfolio")}
            className="flex items-center gap-1.5 cursor-pointer group"
            style={{ color: "var(--dbx-text-tertiary)" }}
            title="返回作品集"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span
              className="text-xs transition-all duration-200 opacity-0 group-hover:opacity-100 whitespace-nowrap"
              style={{ color: "var(--dbx-text-tertiary)" }}
            >
              作品集
            </span>
          </motion.button>
          <Breadcrumb
            items={[
              { label: "作品集", href: "/portfolio" },
              { label: item.title },
            ]}
          />
        </div>
      </motion.div>

      {/* ======== Content ======== */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Banner — 仅 shop-browse */}
        {isShopBrowse && (
          <ShopBrowseHero
            title={item.title}
            description={item.description}
            tags={item.tags}
            images={shopBrowseHeroImages}
          />
        )}

        {/* HD 浏览图展示 — 仅 shop-browse */}
        {isShopBrowse && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto px-6 sm:px-8 pb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--dbx-text-primary)" }}
              >
                HD 浏览图
              </h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  color: "var(--dbx-text-tertiary)",
                  background: "var(--dbx-fill-trans-10)",
                }}
              >
                高清
              </span>
              <span
                className="flex-1 h-px"
                style={{ background: "var(--dbx-border-light)" }}
              />
            </div>
            <HorizontalCarousel cardWidth={540}>
                {shopBrowseHDImages.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="relative flex-shrink-0 group cursor-pointer p-[6px]"
                    style={{ width: 520 }}
                    onClick={() => setLightbox({ key: "hd", index: i })}
                  >
                    {/* iPad frame */}
                    <div
                      className="relative rounded-[32px] p-[10px] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                      style={{
                        background: "linear-gradient(145deg, #1c1c1e, #2c2c2e)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {/* Screen area */}
                      <div
                        className="relative overflow-hidden rounded-3xl"
                        style={{ aspectRatio: "4/3" }}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 520px"
                        />
                      </div>
                      {/* Camera dot on top bezel */}
                      <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-black/40 border border-white/10" />
                      {/* Shadow edge for depth */}
                      <div className="absolute inset-[10px] rounded-3xl ring-1 ring-inset ring-black/10 pointer-events-none" />
                    </div>
                  </motion.div>
                ))}
            </HorizontalCarousel>
          </motion.section>
        )}

        {/* ======== 海外官网仿真 ======== */}
        {isOverseasWebsite && (
          <div className="w-full pb-14">
            <OverseasWebsiteSim />
          </div>
        )}

        {/* ======== 百科 TV 仿真 ======== */}
        {isTv && (
          <div className="w-full flex flex-col">
            {/* Hero Banner + TV 模拟 */}
            <TvHero />

            <TvBackgroundGoals />
            <TvDesignApproach />
            <TvDataMetrics />
          </div>
        )}

        {/* ======== 百科车机 ======== */}
        {isCarSystem && (
          <div className="w-full flex flex-col">
            <HeroSectionCarSystem />
            <CarSystemData />
          </div>
        )}

        {/* ======== Creta Class（クレタクラス） ======== */}
        {isOverseasLocalization && (
          <div className="w-full">
            <HeroSectionOverseasLocalization />
            <OverseasDesignResearch />
          </div>
        )}

        {/* ======== 电商增长 ======== */}
        {isBaikeEcommerce && (
          <div className="w-full">
            <HeroSectionEcommerceGrowth />
          </div>
        )}

        {/* ======== 周末游乐场 ======== */}
        {isWeekendPlayground && (
          <ProjectSection
            item={item}
            images={weekendPlaygroundImages}
            onImageClick={(i) => setLightbox({ key: "weekend", index: i })}
            video={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6"
              >
                <Card className="overflow-hidden p-0">
                  <video
                    src="https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/weekend-playground/lets-run-demo.mov"
                    controls
                    playsInline
                    className="w-full h-auto"
                    style={{ maxHeight: "70vh" }}
                  >
                    您的浏览器不支持视频播放
                  </video>
                </Card>
              </motion.div>
            }
          />
        )}

        {/* ======== My Family ======== */}
        {isMyFamily && (
          <ProjectSection
            item={item}
            images={myFamilyImages}
            onImageClick={(i) => setLightbox({ key: "my-family", index: i })}
          />
        )}

        {/* ======== Sketch 提效插件 ======== */}
        {isSketchPlugin && (
          <ProjectSection
            item={item}
            images={item.detailImages!}
          />
        )}

        <div className={`max-w-6xl mx-auto px-6 sm:px-8 ${hasCommonContent ? 'pt-10 sm:pt-16 pb-14' : ''}`}>
          {/* Cover — 不包含各自主渲染的项目 */}
          {hasCommonContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 896px"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${item.gradient ?? "from-gray-400/30 via-gray-500/20"} to-transparent`}
                  >
                    <motion.span
                      className="text-7xl"
                      whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      {item.emoji ?? "📁"}
                    </motion.span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Title & Tags — 各自主渲染项目已在各自区域中显示 */}
          {hasCommonContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-6">
                <h1
                  className="text-2xl sm:text-3xl font-bold mb-3"
                  style={{ color: "var(--dbx-text-primary)" }}
                >
                  {item.title}
                </h1>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          color: "var(--dbx-text-tertiary)",
                          background: "var(--dbx-fill-trans-10)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Description — 各自主渲染项目已在各自区域中显示 */}
          {hasCommonContent && (
            <div
              className="text-base leading-relaxed mb-10"
              style={{ color: "var(--dbx-text-secondary)" }}
            >
              <p>{item.description}</p>
            </div>
          )}

          {/* 设计稿链接 */}
          {item.figmaUrl && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--dbx-text-primary)" }}
              >
                设计稿
              </h2>
              <motion.a
                href={item.figmaUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-3 px-5 py-4 rounded-xl transition-colors cursor-pointer"
                style={{
                  background: "var(--dbx-fill-trans-10)",
                  border: "1px solid var(--dbx-border-light)",
                  color: "var(--dbx-text-primary)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" x2="21" y1="14" y2="3" />
                </svg>
                <span className="flex-1 text-sm">在浏览器中打开设计稿</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </motion.a>
            </motion.section>
          )}

          {/* Detail Images — 不包含各自主渲染的项目 */}
          {item.detailImages && item.detailImages.length > 0 && !isWeekendPlayground && !isMyFamily && !isSketchPlugin && !isCarSystem && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--dbx-text-primary)" }}
              >
                项目展示
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {item.detailImages.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="relative aspect-video rounded-xl overflow-hidden"
                    style={{
                      background: "var(--dbx-bg-float)",
                      border: "1px solid var(--dbx-border-light)",
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

          {/* 转化率折线图 — 放置于页面最下方 */}
          {isShopBrowse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto px-6 sm:px-8 pb-14"
            >
              <ConversionRateChart />
              <div className="mt-6 space-y-3 text-sm leading-relaxed" style={{ color: "var(--dbx-text-secondary)" }}>
                <p><strong className="font-semibold" style={{ color: "var(--dbx-text-primary)" }}>前期（3 月中 - 4 月中）</strong>：转化率从约 45% 逐步下滑，4 月 14 日周达到阶段性低点（约 30% 以下）。</p>
                <p><strong className="font-semibold" style={{ color: "var(--dbx-text-primary)" }}>中期（4 月中 - 5 月中）</strong>：触底后回升，5 月 12 日周达到小高峰（接近 50%）（4 月 25 配置新浏览图）。</p>
                <p><strong className="font-semibold" style={{ color: "var(--dbx-text-primary)" }}>后期（5 月中 - 6 月中）</strong>：又呈下降趋势，6 月 9 日周跌至低点（20%+），但 6 月 16 日周有小幅反弹，需持续观察后续走势。</p>
              </div>
            </motion.div>
          )}

      {/* 上一个/下一个项目导航 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-6 sm:px-8 pb-10 sm:pb-16 pt-10"
      >
        {(prevItem || nextItem) && (
          <div className="flex flex-row items-center">
              {prevItem && (
                <Link
                  href={`/portfolio/${prevItem.slug}`}
                  className="flex items-center gap-2 p-2.5 rounded-xl transition-all duration-200 group w-auto bg-[var(--dbx-bg-float)] border border-[var(--dbx-border-light)] hover:bg-white/[0.1] hover:border-white/25"
                >
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
                    style={{ color: "var(--dbx-text-tertiary)" }}
                  >
                    <path d="M19 12H5" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <div className="min-w-0">
                    <div className="text-xs" style={{ color: "var(--dbx-text-tertiary)" }}>
                      上一个
                    </div>
                    <div className="text-sm font-medium truncate max-w-[200px] group-hover:text-white transition-colors duration-200" style={{ color: "var(--dbx-text-primary)" }}>
                      {prevItem.title}
                    </div>
                  </div>
                </Link>
              )}

              {nextItem && (
                <Link
                  href={`/portfolio/${nextItem.slug}`}
                  className="flex items-center gap-2 p-2.5 rounded-xl transition-all duration-200 group w-auto ml-auto bg-[var(--dbx-bg-float)] border border-[var(--dbx-border-light)] hover:bg-white/[0.1] hover:border-white/25"
                >
                  <div className="min-w-0 text-right">
                    <div className="text-xs" style={{ color: "var(--dbx-text-tertiary)" }}>
                      下一个
                    </div>
                    <div className="text-sm font-medium truncate max-w-[200px] group-hover:text-white transition-colors duration-200" style={{ color: "var(--dbx-text-primary)" }}>
                      {nextItem.title}
                    </div>
                  </div>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                    style={{ color: "var(--dbx-text-tertiary)" }}
                  >
                    <path d="M5 12h14" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              )}
            </div>
        )}
      </motion.div>

      </div>

    </div>

      {/* HD Lightbox */}
      {lightbox?.key === "hd" && (
        <ImageLightbox
          images={shopBrowseHDImages}
          currentIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(i) => setLightbox({ key: "hd", index: i })}
        />
      )}

      {/* Weekend Playground Lightbox */}
      {lightbox?.key === "weekend" && (
        <ImageLightbox
          images={weekendPlaygroundImages}
          currentIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(i) => setLightbox({ key: "weekend", index: i })}
        />
      )}

      {/* My Family Lightbox */}
      {lightbox?.key === "my-family" && (
        <ImageLightbox
          images={myFamilyImages}
          currentIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(i) => setLightbox({ key: "my-family", index: i })}
        />
      )}
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3"
      style={{ background: "var(--dbx-bg-base)" }}
    >
      <div className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
        style={{ borderTopColor: "var(--dbx-text-tertiary)", borderRightColor: "var(--dbx-text-tertiary)" }}
      />
      <p className="text-sm" style={{ color: "var(--dbx-text-tertiary)" }}>加载中...</p>
    </div>
  );
}

function NotFound({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-4"
      style={{ background: "var(--dbx-bg-base)" }}
    >
      <span className="text-5xl">🔍</span>
      <p style={{ color: "var(--dbx-text-secondary)" }}>
        未找到该项目
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/portfolio")}
        className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
        style={{
          color: "var(--dbx-text-primary)",
          background: "var(--dbx-fill-trans-10)",
          border: "1px solid var(--dbx-border-light)",
        }}
      >
        返回作品集
      </motion.button>
    </div>
  );
}

export default function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [prevItem, setPrevItem] = useState<PortfolioItem | null>(null);
  const [nextItem, setNextItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  useEffect(() => {
    async function load() {
      const [target, all] = await Promise.all([
        findPortfolioItem(slug),
        getPortfolioItems(),
      ]);
      setItem(target);
      if (target) {
        const idx = all.findIndex((p) => p.slug === slug);
        setPrevItem(idx > 0 ? all[idx - 1] : null);
        setNextItem(idx < all.length - 1 ? all[idx + 1] : null);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return <LoadingSkeleton />;
  if (!item) return <NotFound router={router} />;

  return renderItemPage(item, slug, router, lightbox, setLightbox, prevItem, nextItem);
}
