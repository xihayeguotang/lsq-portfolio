export interface WorkExperience {
  company: string;
  period: string;
  role: string;
  highlights: string[];
}

const WORK_URL = "/api/work-experiences";

let cache: WorkExperience[] | null = null;

/** 从 COS 加载工作经历数据（带全局缓存） */
async function loadWorkExperiences(): Promise<WorkExperience[]> {
  if (cache) return cache;

  const res = await fetch(WORK_URL);

  if (!res.ok) {
    throw new Error(`加载工作经历数据失败: ${res.status}`);
  }

  const items: WorkExperience[] = await res.json();
  cache = items;
  return items;
}

/** 获取全部工作经历 */
export async function getWorkExperiences(): Promise<WorkExperience[]> {
  return loadWorkExperiences();
}

/** 按公司名称筛选工作经历 */
export async function findWorkExperiences(
  company?: string
): Promise<WorkExperience[]> {
  const items = await loadWorkExperiences();
  if (!company) return items;
  return items.filter((e) => e.company.includes(company));
}
