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

export const portfolioItems: PortfolioItem[] = [
  {
    title: "斑马百科",
    slug: "baike-ecommerce",
    description: "斑马百科全生态产品线全链路UI设计与体验统筹，覆盖移动端、车机、TV大屏、智能硬件、海外产品等多终端业务。",
    image: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/baike-ecommerce/cover.jpg",
    emoji: "🦓",
    gradient: "from-indigo-400/30 via-purple-500/20",
    tags: ["斑马百科"],
  },
  {
    title: "百科车机",
    slug: "car-system",
    description: "负责斑马百科车机端界面设计与体验优化，针对车载场景进行交互适配与视觉重构，保障驾驶安全前提下的内容浏览与学习体验。",
    image: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/car-system/cover.jpg",
    emoji: "🚗",
    gradient: "from-blue-400/30 via-indigo-500/20",
    tags: ["斑马百科", "车机", "车载"],
  },
  {
    title: "百科TV",
    slug: "tv",
    description: "负责斑马百科TV大屏端界面设计，针对电视端操作场景进行远距离交互适配，打造家庭大屏学习体验。",
    emoji: "📺",
    gradient: "from-red-400/30 via-rose-500/20",
    image: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/tv/cover.jpg",
    tags: ["斑马百科", "TV", "大屏"],
  },
  {
    title: "Screenshots",
    slug: "shop-browse",
    description: "Cretapedia 海外应用商店展示图集，涵盖 3D 互动教学、趣味测验等核心功能界面，用于 App Store 及 Google Play 等多渠道上架推广。",
    image: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/shop-browse-cover.png",
    emoji: "🦓",
    gradient: "from-sky-400/30 via-blue-500/20",
    tags: ["斑马百科", "海外", "屏幕快照"],
  },
  {
    title: "Cretapedia 海外官网",
    slug: "overseas-website",
    description: "Cretapedia 海外品牌官网，针对海外用户视觉习惯与浏览体验进行本地化设计，提升品牌在海外的专业形象。",
    image: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/overseas-website/cover.jpg",
    emoji: "🌐",
    gradient: "from-sky-400/30 via-cyan-500/20",
    tags: ["斑马百科", "海外", "官网"],
  },
  {
    title: "Creta Class（クレタクラス）",
    slug: "overseas-localization",
    description: "主导斑马AI学日本版APP及日本官网视觉设计、体验改版与长期迭代，适配海外用户使用习惯与审美偏好。",
    image: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/overseas-localization/cover.jpg",
    emoji: "🌏",
    gradient: "from-rose-400/30 via-pink-500/20",
    tags: ["斑马AI学", "海外", "日本"],
  },
  {
    title: "思维提效插件",
    slug: "sketch-plugin",
    description: "自主研发 Sketch 自动化提效插件，思维交互题设计产能提升 70%，有效释放产研团队人力成本。",
    image: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/sketch-plugin/cover.jpg",
    emoji: "⚡",
    gradient: "from-amber-400/30 via-orange-500/20",
    tags: ["斑马AI学", "思维", "提效", "Sketch插件"],
    detailImages: Array.from({ length: 14 }, (_, i) => ({
      src: `https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/sketch-plugin/${i + 4}.jpg`,
      alt: `Sketch 提效插件 ${i + 1}`,
    })),
  },
  {
    title: "Let's Run",
    slug: "weekend-playground",
    description: "负责周末游乐场业务视觉建设，搭建专属游戏化组件体系，沉淀业务复用资产。",
    image: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/weekend-playground/cover.jpg",
    emoji: "🎮",
    gradient: "from-green-400/30 via-emerald-500/20",
    tags: ["斑马AI学", "周末游乐场", "游戏化"],
  },
  {
    title: "My Family",
    slug: "my-family",
    description: "My Family 主题游戏设计，让孩子在互动中学习家庭成员的英文表达。",
    image: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/my-family/cover.jpg",
    emoji: "👨‍👩‍👧‍👦",
    gradient: "from-rose-400/30 via-pink-500/20",
    tags: ["斑马AI学", "周末游乐场", "游戏化"],
  },
  {
    title: "组件库建设",
    slug: "component-library",
    description: "全程负责斑马官方组件库从搭建、版本迭代到日常维护，统一底层视觉体系，实现多端复用与设计资产长期沉淀。",
    image: "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/component-library/cover.jpg",
    emoji: "📦",
    gradient: "from-cyan-400/30 via-teal-500/20",
    tags: ["组件库", "设计系统", "多端复用"],
    figmaUrl: "https://beta.miaoduo.com/file/kyA440a8UmIOIcVKLknS72N?nodeId=0%3A1&type=design",
  },
];

/** 根据 slug 查找项目 */
export function findPortfolioItem(slug: string) {
  return portfolioItems.find((item) => item.slug === slug) ?? null;
}
