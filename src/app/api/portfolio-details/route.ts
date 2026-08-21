import { NextResponse } from "next/server";

const COS_JSON_BASE = "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

/** 作品集项目详情代理：COS 不支持浏览器跨域 fetch，需走同源 route（镜像 /api/portfolio） */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "缺少 slug 参数" }, { status: 400 });
  }

  try {
    const res = await fetch(`${COS_JSON_BASE}/projects/${slug}/detail.json`);

    if (!res.ok) {
      return NextResponse.json(
        { error: "加载项目详情失败" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Portfolio details API error:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
