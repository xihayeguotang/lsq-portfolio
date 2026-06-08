import { NextResponse } from "next/server";

const COS_JSON_BASE = "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch(
      `${COS_JSON_BASE}/WorkExperience/work-experiences.json`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "加载工作经历数据失败" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Work experience API error:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
