/**
 * 朗读文本规范化:修正 TTS 对年份等数字的不自然读法。
 *
 * MiniMax TTS 可能把 "2019" 读成"二千零一十九"(数值式),而中文年份的标准读法是
 * "二零一九"。这里把 4 位年份(1900-2099)及其范围统一转为逐位中文读法,
 * 保证工作经历里的年份(如 2019至今、2017-2019)朗读自然。
 *
 * 同时剥离语气标签:prompts 曾引导 LLM 输出 (breath)(sighs)(laughs)(em) 等标签,
 * 而 MiniMax speech-2.8-hd 原生支持这些标签(会把它们转成笑声/叹气/思考语气),
 * 若直接推送给 TTS,一段朗读里会突然冒出另一个"声音",听起来像多人在读。
 * 朗读前必须把这些标签清掉。
 */

/** MiniMax Speech 2.8 支持的声音/语气标签(会触发变声,朗读前剥离) */
const SPEECH_TAGS =
  /\s*\((?:breath|laughs?|sighs?|em|whispers?|screams?|coughs?|sneezes?|hmm|giggles?|chuckles?|yawns?|loudly|softly)\)\s*/gi;

const CN = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

function yearToCn(s: string): string {
  return s
    .split("")
    .map((d) => CN[Number(d)])
    .join("");
}

/** 把文本中的年份(如 2019、2017-2019)规范为中文逐位读法,并剥离语气标签 */
export function normalizeSpeechText(text: string): string {
  let t = text;
  // 剥离 (laughs)(sighs)(em) 等语气标签,避免 TTS 变声/多声
  t = t.replace(SPEECH_TAGS, " ");
  // 年份范围:2017-2019 / 2017~2019 / 2017—2019 → "二零一七到二零一九"
  t = t.replace(
    /\b(19\d{2}|20\d{2})\s*[-~—–]\s*(19\d{2}|20\d{2})\b/g,
    (_m, a, b) => `${yearToCn(a)}到${yearToCn(b)}`
  );
  // 单个年份
  t = t.replace(/\b(19\d{2}|20\d{2})\b/g, (m) => yearToCn(m));
  // 短数字范围:2-4 / 3-4 → "二到四"/"三到四"(年龄等场景),避免 TTS 读出"二减四"或"二四"
  // 前后断言防止误伤年份及多位数内部的连字符(如 123-456);覆盖多种连字符变体
  t = t.replace(
    /(?<!\d)(\d)\s*[-–—―‑‒~]\s*(\d)(?!\d)/g,
    (_m, a, b) => `${CN[Number(a)]}到${CN[Number(b)]}`
  );
  return t;
}
