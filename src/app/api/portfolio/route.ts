import { COS_BASE } from "@/data/constants";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch(
      `${COS_BASE}/WorkExperience/portfolio-items.json`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "加载作品集数据失败" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Portfolio API error:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
