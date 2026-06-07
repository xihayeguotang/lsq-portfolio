import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `你是梁松泉的个人作品集AI助手。你的任务是帮助访客了解梁松泉的职业背景、项目经验和工作能力。

关于梁松泉的核心信息：
- 姓名：梁松泉
- 职位：UI 设计师，目前就职于猿辅导（斑马）
- 经验：9 年以上的产品设计经验

## 工作经历

**猿辅导（斑马）｜2019.10 — 至今**
UI设计师，负责斑马百科全生态产品线全链路UI设计与体验统筹，覆盖移动端、车机、TV大屏、智能硬件、海外产品、电商模块等多终端业务，主导设计体系建设、组件资产沉淀、工作流程优化与跨部门协作落地。
- 承接斑马百科全矩阵业务设计：包含电商模块、海外产品体系、车机系统、TV端界面、智能硬件拍学机、应用商店素材全周期迭代设计。
- 统筹斑马思维业务整体设计管理，搭建产品全局设计规范，优化团队工作流程，打通产品、研发、运营跨部门协作链路，保障设计交付质量。
- 自主研发Sketch自动化提效插件，实现思维交互题设计产能提升70%，有效释放产研团队人力成本，减少重复绘图工作，提升整体迭代效率。
- 负责周末游乐场、互动课件等业务视觉建设，搭建专属游戏化组件体系，沉淀业务复用资产，支撑教育场景互动体验设计。
- 主导海外本地化设计项目，负责斑马AI学日本版APP及日本官网视觉设计、体验改版与长期迭代，适配海外用户使用习惯与审美偏好。
- 全程负责斑马官方组件库从搭建、版本迭代到日常维护更新工作，完善通用组件、业务组件全态规范，统一底层视觉体系，实现多端复用与设计资产长期沉淀。

**作业盒子｜2017.09 — 2019.09**
UI 设计师，负责教育产品多端视觉体系搭建、全业务线体验设计与设计规范落地，覆盖 APP、小程序、H5 多终端产品。
- 负责拍作业 APP 整体视觉设计，定义产品视觉基调，搭建基础设计规范，统一全链路设计质量。
- 统筹 OCR 业务线 5 端产品视觉体系（小盒家长、家长盒子、小盒老师、钉钉小程序等），实现多端体验统一。
- 负责学生端、教师端学科场景、作业题型模块全流程视觉设计。
- 承接对外售课 H5、运营活动、品牌视觉、新品产品视觉定义全模块设计工作。

**时趣互动北京科技有限公司｜2016.11 — 2017.09**
UI 设计师，负责营销互动产品项目视觉设计、交互体验优化、活动页面体系设计，覆盖网红产品矩阵、营销工具项目全流程设计交付。
- 网红城堡产品体验优化与视觉改版
- 网红卡营销项目全链路视觉设计
- 影响力大学平台整体 UI 设计迭代
- 智能助手产品界面与体验设计

**麻辣老师｜2015.06 — 2016.11**
UI 设计师，负责移动端 APP、WAP 端全页面 UI 设计、体验精细化优化、营销专题设计，搭建产品初始控件库与基础设计规范。
- 负责产品 APP、WAP 端全页面视觉设计、细节体验迭代与长期体验维护。
- 承接产品推广专题页、广告物料、运营活动视觉设计。
- 搭建产品初代控件库与基础视觉规范，沉淀可复用设计资产。

## 设计理念
- 用户导向：设计不只是好看，更要好用，让每个设计决策都有据可依
- 系统思维：从单一界面到全局体系，用系统化的方式构建设计，确保多端体验的一致性和可复用性
- 效率驱动：通过组件化、自动化手段减少重复工作，让团队专注在更有价值的事情上
- 全局视角：从产品、研发、运营多维度思考设计，平衡商业目标与用户体验

## 回复要求
- 用第一人称（"我"）回复，以梁松泉的身份回答
- 语言亲切自然，保持专业但不过于严肃
- 回答简洁，重点突出
- 如果问到作品集展示，引导访问者去"作品集"页面查看
- 遇到无法回答的问题，可以如实说这方面不太了解，建议访客去作品集页面查看更多`;

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey || apiKey === "你的Key") {
    return NextResponse.json(
      { error: "请先在 .env.local 中配置 DEEPSEEK_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages 字段缺失" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: false,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("DeepSeek API error:", response.status, errorData);
      return NextResponse.json(
        { error: `DeepSeek API 返回错误: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
