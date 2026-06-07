import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { deepseek } from "@ai-sdk/deepseek";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import { chatTools } from "@/lib/chat-tools";

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey || apiKey === "你的Key") {
    return new Response("请先在 .env.local 中配置 DEEPSEEK_API_KEY", {
      status: 500,
    });
  }

  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response("messages 字段缺失", { status: 400 });
    }

    // Convert UI messages (with id, parts, etc.) to model messages
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: deepseek("deepseek-chat"),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      tools: chatTools,
      stopWhen: stepCountIs(5),
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("服务器内部错误", { status: 500 });
  }
}
