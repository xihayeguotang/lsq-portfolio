export interface PortfolioItem {
  title: string;
  description: string;
  /** URL-friendly slug */
  slug: string;
  /** 封面图片 URL，省略则显示渐变色背景 + emoji */
  image?: string;
  /** 没有 image 时的占位 emoji */
  emoji?: string;
  /** 渐变背景色方案，仅无 image 时生效 */
  gradient?: string;
  /** 标签 */
  tags?: string[];
  /** 详情页长文介绍 */
  detail?: string;
  /** 详情页配图 */
  detailImages?: { src: string; alt: string }[];
  /** Figma 设计稿嵌入链接 */
  figmaUrl?: string;
}

const PORTFOLIO_URL = "/api/portfolio";

let cache: PortfolioItem[] | null = null;

/** 从 COS 加载作品集数据（带全局缓存） */
async function loadPortfolio(): Promise<PortfolioItem[]> {
  if (cache) return cache;

  const res = await fetch(PORTFOLIO_URL);

  if (!res.ok) {
    throw new Error(`加载作品集数据失败: ${res.status}`);
  }

  const items: PortfolioItem[] = await res.json();

  // 补全代码内计算的字段
  for (const item of items) {
    if (item.slug === "sketch-plugin") {
      item.detailImages = Array.from({ length: 14 }, (_, i) => ({
        src: `https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/sketch-plugin/${i + 4}.jpg`,
        alt: `Sketch 提效插件 ${i + 1}`,
      }));
    }
  }

  cache = items;
  return cache;
}

/** 获取全部作品集项目 */
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  return loadPortfolio();
}

/** 根据 slug 查找项目 */
export async function findPortfolioItem(
  slug: string
): Promise<PortfolioItem | null> {
  const items = await loadPortfolio();
  return items.find((item) => item.slug === slug) ?? null;
}
