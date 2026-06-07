import { tool } from "ai";
import { z } from "zod";
import { getPortfolioItems } from "@/data/portfolio";
import { findWorkExperiences } from "@/data/work-experiences";

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
    description: "获取工作经历，可按公司名称筛选",
    inputSchema: z.object({
      company: z.string().optional().describe("公司名称关键字，留空则返回全部"),
    }),
    execute: async ({ company }) => {
      return findWorkExperiences(company);
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
