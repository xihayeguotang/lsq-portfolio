import { NextResponse } from "next/server";

const COS_BASE = "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch(
      `${COS_BASE}/OverseasDesignResearch/overseas-design-research.json`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "加载设计调研数据失败" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Overseas design research API error:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
