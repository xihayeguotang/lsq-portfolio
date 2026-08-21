import { normalizeSpeechText } from "@/lib/speech-text";
import { DEFAULT_SPEECH_OPTIONS, type SpeechOptions } from "@/hooks/use-speech";

/**
 * 朗读通用工具：把一段（可能带 markdown 的）文本清洗后逐句推送给 TTS。
 * 供 chat-app（朗读 AI 回复）与作品集详情页「听讲解」复用，避免重复实现。
 */

/** useSpeech 返回对象的结构子集，speakText 只依赖这三个方法 */
export type SpeechLike = {
  connect: (opts: SpeechOptions) => void;
  speak: (text: string) => void;
  finish: () => void;
};

/** 按句子边界切分文本，用于逐句推送 TTS */
export function splitSentences(text: string): string[] {
  const out: string[] = [];
  let buf = "";
  for (const ch of text) {
    buf += ch;
    if (/[。！？!?\n]/.test(ch)) {
      const s = buf.trim();
      if (s) out.push(s);
      buf = "";
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

/** 去除 markdown 标记，输出适合 TTS 朗读的纯文本 */
export function stripMarkdown(src: string): string {
  let t = src;
  // 代码块:保留内容,去掉围栏 ``` 与语言标识
  t = t.replace(/```[\w-]*\n([\s\S]*?)```/g, "$1");
  // 行内代码
  t = t.replace(/`([^`]+)`/g, "$1");
  // 图片 ![alt](url) → alt
  t = t.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  // 链接 [text](url) / [text][ref] → text
  t = t.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  t = t.replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1");
  // 删除线 ~~text~~
  t = t.replace(/~~([^~]+)~~/g, "$1");
  // 粗体 **text** / __text__(先于斜体,避免被 _ 规则误伤)
  t = t.replace(/\*\*([^*]+)\*\*/g, "$1");
  t = t.replace(/__([^_]+)__/g, "$1");
  // 斜体 *text* / _text_
  t = t.replace(/\*([^*]+)\*/g, "$1");
  t = t.replace(/_([^_]+)_/g, "$1");
  // 标题 # 前缀
  t = t.replace(/^\s{0,3}#{1,6}\s+/gm, "");
  // 引用
  t = t.replace(/^\s{0,3}>\s?/gm, "");
  // 列表标记 - * + 与数字序号
  t = t.replace(/^\s{0,3}(?:[-*+]\s|\d+[.、]\s)/gm, "");
  // 分隔线 --- / *** / ___
  t = t.replace(/^\s*[-*_]{3,}\s*$/gm, "");
  // 表格分隔行 | --- | :--: | → 整行删除
  t = t.replace(/^\s*\|[\s\-:|]+\|\s*$/gm, "");
  // 表格分隔符 → 空格
  t = t.replace(/\|/g, " ");
  // 压缩连续空白与换行
  t = t.replace(/[ \t]+/g, " ");
  t = t.replace(/\n{3,}/g, "\n\n");
  return t.trim();
}

/** 朗读一段文本：清洗 → 逐句推送 TTS → 收尾。需在用户手势内调用以解锁音频。 */
export function speakText(
  speech: SpeechLike,
  text: string,
  opts: SpeechOptions = DEFAULT_SPEECH_OPTIONS
): void {
  const clean = normalizeSpeechText(stripMarkdown(text));
  if (!clean) return;
  const sentences = splitSentences(clean);
  speech.connect(opts);
  sentences.forEach((s) => speech.speak(s));
  speech.finish();
}
