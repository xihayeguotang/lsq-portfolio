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

    // Ensure messages have the `parts` field (AI SDK v6 format).
    // Old persisted messages from localStorage may lack it.
    const normalizedMessages = messages.map((m: Record<string, unknown>) => {
      if (m.parts) return m;
      const content = (m.content as string) ?? "";
      return {
        ...m,
        parts: [{ type: "text", text: content }],
      };
    });

    const modelMessages = await convertToModelMessages(normalizedMessages as Parameters<typeof convertToModelMessages>[0]);

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
