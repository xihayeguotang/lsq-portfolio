// MiniMax Speech T2A 语音合成接口（服务端代理，key 不暴露到浏览器）
export const runtime = "nodejs";

const MINIMAX_ENDPOINT = "https://api.minimaxi.com/v1/t2a_v2";
const MODEL = "speech-2.8-hd";
// 音色：可在「账户管理 > 音色库」试听选择，如 female-chengshu / female-tianmei / male-qn-qingse
const VOICE_ID = "Chinese (Mandarin)_Gentleman";
const MAX_TEXT = 8000;

/** MiniMax 错误码 → 友好提示 */
function mapMiniMaxError(code: number, msg?: string): string {
  if (code === 1004) return "语音服务鉴权失败，请检查 API Key";
  if (code === 1008 || (msg && msg.toLowerCase().includes("balance"))) {
    return "语音账户余额不足，请到 MiniMax 控制台充值";
  }
  if (code === 1002) return "语音请求过于频繁，请稍后再试";
  return "语音合成失败，请稍后再试";
}

export async function POST(request: Request) {
  const groupId = process.env.MINIMAX_GROUP_ID;
  const apiKey = process.env.MINIMAX_API_KEY;

  // 新版 sk- API Key 不要求 GroupId，GroupId 仅在旧版接口必填
  if (!apiKey || apiKey === "你的APIKey") {
    return new Response("语音服务未配置", { status: 500 });
  }

  try {
    const body = await request.json();
    const { text } = body as { text?: string };
    if (!text || typeof text !== "string" || !text.trim()) {
      return new Response("text 字段缺失", { status: 400 });
    }

    const clean = text.trim().slice(0, MAX_TEXT);

    const endpoint =
      groupId && groupId !== "你的GroupId"
        ? `${MINIMAX_ENDPOINT}?GroupId=${encodeURIComponent(groupId)}`
        : MINIMAX_ENDPOINT;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        text: clean,
        stream: false,
        voice_setting: {
          voice_id: VOICE_ID,
          speed: 1.0,
          vol: 1.0,
          pitch: 0,
        },
        audio_setting: {
          format: "mp3",
          sample_rate: 32000,
          bitrate: 128000,
          channel: 1,
        },
      }),
    });

    if (!res.ok) {
      console.error("MiniMax TTS HTTP error:", res.status);
      return new Response("语音合成失败，请稍后再试", { status: 502 });
    }

    const data = await res.json();
    if (data.base_resp?.status_code !== 0) {
      const code = data.base_resp?.status_code as number;
      console.error("MiniMax TTS error:", code, data.base_resp?.status_msg);
      return new Response(mapMiniMaxError(code, data.base_resp?.status_msg), { status: 502 });
    }

    const hexAudio = data.data?.audio as string | undefined;
    if (!hexAudio) {
      return new Response("语音服务响应异常", { status: 502 });
    }

    const buffer = Buffer.from(hexAudio, "hex");
    return new Response(new Uint8Array(buffer), {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return new Response("语音合成失败，请稍后再试", { status: 500 });
  }
}
