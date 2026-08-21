/** 作品集项目详情数据结构（对应 COS: WorkExperience/portfolio-details.json） */

export interface MetricItem {
  label: string;
  value: string;
  note?: string;
}

export interface ApproachItem {
  title: string;
  desc: string;
}

export interface ModuleItem {
  name: string;
  background?: string;
  goals?: string[];
  metrics?: MetricItem[];
  highlights?: string[];
  value?: string;
  advantages?: string[];
  disadvantages?: string[];
}

export interface ResearchData {
  intro?: string;
  categories?: string[];
  methods?: string[];
  visualOverview?: string;
  cultureRules?: string[];
  mandatoryRules?: string;
}

export interface PortfolioDetail {
  title: string;
  slug: string;
  summary: string;
  tagline?: string;
  background?: string | string[];
  goals?: string[];
  approach?: ApproachItem[];
  metrics?: MetricItem[] | { title: string; note?: string; items: MetricItem[] }[];
  modules?: ModuleItem[];
  channels?: string[];
  conversionAnalysis?: string[];
  research?: ResearchData;
  vipBenefits?: string[];
}

export type PortfolioDetailsMap = Record<string, PortfolioDetail>;

// 项目详情存于 COS projects/{slug}/detail.json，每个项目一个文件，此处聚合加载
// 该模块仅被服务端（AI 工具）使用，直连 COS（route handler 内相对路径 fetch 不可用）
const PROJECT_BASE =
  "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects";
const PROJECT_SLUGS = [
  "baike-ecommerce",
  "tv",
  "car-system",
  "overseas-localization",
  "shop-browse",
  "overseas-website",
  "sketch-plugin",
  "weekend-playground",
  "my-family",
  "component-library",
];

let cache: PortfolioDetailsMap | null = null;

/** 从 COS 加载作品集详情数据（聚合各项目 detail.json，带全局缓存） */
async function loadPortfolioDetails(): Promise<PortfolioDetailsMap> {
  if (cache) return cache;

  const results = await Promise.all(
    PROJECT_SLUGS.map(async (slug) => {
      const res = await fetch(`${PROJECT_BASE}/${slug}/detail.json`);
      if (!res.ok) {
        throw new Error(`加载项目 ${slug} 失败: ${res.status}`);
      }
      return [slug, (await res.json()) as PortfolioDetail] as const;
    })
  );

  const merged: PortfolioDetailsMap = {};
  for (const [slug, detail] of results) merged[slug] = detail;
  cache = merged;
  return merged;
}

/** 根据 slug 查找项目详情（含背景/目标/设计思路/数据），找不到返回 null */
export async function findPortfolioDetail(
  slug: string
): Promise<PortfolioDetail | null> {
  const details = await loadPortfolioDetails();
  return details[slug] ?? null;
}
