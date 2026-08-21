import { tool } from "ai";
import { z } from "zod";
import { getPortfolioItems } from "@/data/portfolio";
import { findWorkExperiences } from "@/data/work-experiences";
import { findPortfolioDetail } from "@/data/portfolio-details";

// 工作经历数据已迁移到 COS: WorkExperience/work-experiences.json
// 由 getWorkExperiences() / findWorkExperiences() 异步加载

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
    description:
      "获取工作经历及项目落地成果数据（含激活设备数、转化率、GMV等），可按公司名称筛选；讲解具体项目时务必调用以获取真实数据",
    inputSchema: z.object({
      company: z.string().optional().describe("公司名称关键字，留空则返回全部"),
    }),
    execute: async ({ company }) => {
      return findWorkExperiences(company);
    },
  }),

  getPortfolioDetail: tool({
    description:
      "根据项目 slug 获取项目详情：项目背景、设计目标、设计思路（approach）、关键指标数据（metrics）等。讲解某个具体项目时，在 portfolioSearch 拿到 slug 后调用此工具获取深入文案",
    inputSchema: z.object({
      slug: z
        .string()
        .describe(
          '项目 slug，例如 "baike-ecommerce"、"tv"、"car-system"、"overseas-localization"、"shop-browse" 等'
        ),
    }),
    execute: async ({ slug }) => {
      const detail = await findPortfolioDetail(slug);
      if (!detail) {
        return { found: false, message: `未找到 slug 为 "${slug}" 的项目详情` };
      }
      return { found: true, detail };
    },
  }),

  getResumeSummary: tool({
    description: "获取简历概要信息：姓名、当前职位、设计理念",
    inputSchema: z.object({}),
    execute: async () => ({
      name: "梁松泉",
      currentRole: "UI 设计师",
      currentCompany: "猿辅导（斑马）",
      designPhilosophy: [
        "用户导向 — 让每个设计决策都有据可依",
        "系统思维 — 用系统化方式构建设计，确保多端体验一致",
        "效率驱动 — 通过组件化、自动化手段减少重复工作",
        "全局视角 — 从产品、研发、运营多维度思考设计",
      ],
    }),
  }),
};
