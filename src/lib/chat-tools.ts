import { tool } from "ai";
import { z } from "zod";
import { getPortfolioItems } from "@/data/portfolio";

const workExperiences = [
  {
    company: "猿辅导（斑马）",
    period: "2019.10 — 至今",
    role: "UI设计师",
    highlights: [
      "斑马百科全生态产品线全链路UI设计，覆盖移动端、车机、TV大屏、智能硬件、海外产品、电商模块",
      "统筹斑马思维业务整体设计管理，搭建产品全局设计规范",
      "自主研发Sketch自动化提效插件，实现思维交互题设计产能提升70%",
      "主导海外本地化设计项目（斑马AI学日本版APP及日本官网）",
      "全程负责斑马官方组件库从搭建、版本迭代到日常维护更新",
    ],
  },
  {
    company: "作业盒子",
    period: "2017.09 — 2019.09",
    role: "UI 设计师",
    highlights: [
      "负责拍作业APP整体视觉设计，搭建基础设计规范",
      "统筹OCR业务线5端产品视觉体系（小盒家长、家长盒子、小盒老师、钉钉小程序等）",
      "负责学生端、教师端学科场景、作业题型模块全流程视觉设计",
    ],
  },
  {
    company: "时趣互动北京科技有限公司",
    period: "2016.11 — 2017.09",
    role: "UI 设计师",
    highlights: [
      "网红城堡产品体验优化与视觉改版",
      "网红卡营销项目全链路视觉设计",
      "影响力大学平台整体UI设计迭代",
      "智能助手产品界面与体验设计",
    ],
  },
  {
    company: "麻辣老师",
    period: "2015.06 — 2016.11",
    role: "UI 设计师",
    highlights: [
      "移动端APP、WAP端全页面UI设计、细节体验迭代",
      "搭建产品初代控件库与基础视觉规范",
    ],
  },
];

export const chatTools = {
  portfolioSearch: tool({
    description:
      "按关键字搜索作品集项目，支持空格分隔多关键词（OR逻辑），返回项目标题、描述、标签和详情页链接slug",
    inputSchema: z.object({
      query: z.string().describe(
        '搜索关键字，支持空格分隔多个关键词（如"车机 TV 海外"），命中任一关键词即返回'
      ),
    }),
    execute: async ({ query }) => {
      const keywords = query.trim().split(/\s+/).filter(Boolean);
      const portfolioItems = await getPortfolioItems();

      const results = portfolioItems.filter((item) =>
        keywords.some(
          (kw) =>
            item.title.includes(kw) ||
            item.description.includes(kw) ||
            item.tags?.some((tag) => tag.includes(kw))
        )
      );

      return {
        total: results.length,
        items: results.map(({ title, description, tags, slug }) => ({
          title,
          description,
          tags,
          slug,
        })),
      };
    },
  }),

  getWorkExperience: tool({
    description: "获取工作经历，可按公司名称筛选",
    inputSchema: z.object({
      company: z.string().optional().describe("公司名称关键字，留空则返回全部"),
    }),
    execute: async ({ company }) => {
      if (!company) return workExperiences;
      return workExperiences.filter((e) => e.company.includes(company));
    },
  }),

  getResumeSummary: tool({
    description: "获取简历概要信息：姓名、当前职位、经验年限、设计理念",
    inputSchema: z.object({}),
    execute: async () => ({
      name: "梁松泉",
      currentRole: "UI 设计师",
      currentCompany: "猿辅导（斑马）",
      totalExperience: "9年+",
      designPhilosophy: [
        "用户导向 — 让每个设计决策都有据可依",
        "系统思维 — 用系统化方式构建设计，确保多端体验一致",
        "效率驱动 — 通过组件化、自动化手段减少重复工作",
        "全局视角 — 从产品、研发、运营多维度思考设计",
      ],
    }),
  }),
};
