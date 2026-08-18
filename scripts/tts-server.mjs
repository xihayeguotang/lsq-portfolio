/**
 * MiniMax WebSocket 流式 TTS 代理服务 (默认 speech-02-turbo,可用 TTS_MODEL 覆盖)
 *
 * 职责:
 *  - 持有 MINIMAX_API_KEY,禁止前端直连第三方接口
 *  - 前端浏览器通过 WebSocket 连接本服务(经 Nginx 反代),本服务再作为
 *    WebSocket 客户端连接 MiniMax T2A 流式接口,做双向中继
 *  - 音频格式固定为 16kHz / PCM16LE / 单声道
 *
 * 启动:
 *   MINIMAX_API_KEY=sk-xxx node scripts/tts-server.mjs   # 或由 pm2 注入环境变量
 *
 * 双向消息协议:
 *  前端 -> 本服务(JSON 文本):
 *    { type: "config", voice_id?, speed?, breathing?, breath_sec? }  会话参数
 *    { type: "speak",  text: "句子" }                                推送一句文本
 *    { type: "finish" }                                              无更多文本,收尾
 *    前端主动断开连接 = 插话打断(本服务随即关闭 MiniMax 连接)
 *  本服务 -> 前端:
 *    二进制帧                     = 16k PCM16LE 音频块(直接可喂给 Web Audio)
 *    { type: "start" }            = MiniMax 已就绪,可开始 speak
 *    { type: "end" }              = 本次合成完成
 *    { type: "error", message }   = 合成失败
 */
import { WebSocketServer } from "ws";
import WebSocket from "ws";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PORT = Number(process.env.TTS_PORT || 8787);
const HOST = process.env.TTS_HOST || "127.0.0.1"; // 仅本机监听,由 Nginx 反代对外
const API_KEY = process.env.MINIMAX_API_KEY;
const GROUP_ID = process.env.MINIMAX_GROUP_ID;
const MODEL = process.env.TTS_MODEL || "speech-2.8-turbo";
// 朗读情绪:仅 speech-2.8-hd 支持(calm/happy/sad/...);turbo / speech-02 系列无 emotion 参数,传了会报错 → 按模型条件注入
// 默认 calm:避免 happy 的持续上扬情绪让长段朗读听起来音调起伏、像"变声/不是同一个声音"
const EMOTION = process.env.TTS_EMOTION || "calm";
const SUPPORTS_EMOTION = MODEL === "speech-2.8-hd";
// 磁盘缓存:同一文本(model+音色+语速+呼吸)只合成一次,之后所有访客直接读盘,省 MiniMax 费用
const CACHE_DIR = process.env.TTS_CACHE_DIR || path.join(os.homedir(), ".tts-cache");
const CACHE_MAX_MB = Number(process.env.TTS_CACHE_MAX_MB || 1000);
try {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
} catch {}

if (!API_KEY || API_KEY === "你的APIKey") {
  console.error("[tts] 缺少 MINIMAX_API_KEY,请在环境变量或 pm2 中配置");
  process.exit(1);
}

const baseUrl =
  GROUP_ID && GROUP_ID !== "你的GroupId"
    ? `wss://api.minimaxi.com/ws/v1/t2a_v2?GroupId=${encodeURIComponent(GROUP_ID)}`
    : "wss://api.minimaxi.com/ws/v1/t2a_v2";

/** 缓存 key:模型/音色/语速/呼吸参数 + 完整文本,任一变化都视为不同音频 */
function makeCacheKey(voiceId, speed, breathing, breathSec, text) {
  return createHash("sha1")
    .update([MODEL, voiceId, speed, breathing, breathSec, text].join("|"))
    .digest("hex");
}

/** 超过容量上限时删除最旧缓存(LRU),防止系统盘被撑满 */
function enforceCacheLimit() {
  let entries;
  try {
    entries = fs.readdirSync(CACHE_DIR).map((f) => {
      const p = path.join(CACHE_DIR, f);
      const st = fs.statSync(p);
      return { p, mtime: st.mtimeMs, size: st.size };
    });
  } catch {
    return;
  }
  const maxBytes = CACHE_MAX_MB * 1024 * 1024;
  let total = entries.reduce((s, e) => s + e.size, 0);
  if (total <= maxBytes) return;
  entries.sort((a, b) => a.mtime - b.mtime); // 最旧在前
  let removed = 0;
  for (const e of entries) {
    if (total <= maxBytes) break;
    try {
      fs.unlinkSync(e.p);
      total -= e.size;
      removed++;
    } catch {}
  }
  if (removed) console.log(`[tts] 缓存超上限(${CACHE_MAX_MB}MB),已清理 ${removed} 个最旧文件`);
}

/** MiniMax 错误码 -> 友好提示 */
function mapMiniMaxError(evt) {
  const base = evt?.base_resp ?? evt?.data?.base_resp ?? evt?.data ?? {};
  const code = base.status_code;
  const msg = base.status_msg ?? "";
  if (code === 1004) return "语音服务鉴权失败，请检查 API Key";
  if (code === 1008 || String(msg).toLowerCase().includes("balance"))
    return "语音账户余额不足，请到 MiniMax 控制台充值";
  if (code === 1002) return "语音请求过于频繁，请稍后再试";
  return `语音合成失败${code ? ` (${code})` : ""}`;
}

const wss = new WebSocketServer({ port: PORT, host: HOST });
console.log(`[tts] MiniMax TTS 代理已启动 → ws://${HOST}:${PORT} (${MODEL}, 16k-PCM)`);

wss.on("connection", (frontWs) => {
  const peer = `${frontWs._socket?.remoteAddress ?? "?"}:${frontWs._socket?.remotePort ?? "?"}`;
  console.log(`[tts] 新连接: ${peer} @ ${new Date().toLocaleTimeString()}`);
  const state = {
    mm: null, // MiniMax 客户端
    started: false, // 已收到 task_started
    queue: [], // 待发送文本(等 task_started 后冲刷)
    sentAny: false, // 是否已发出过文本(用于句间停顿标记)
    finishQueued: false, // finish 已到但 MiniMax 未就绪,等冲刷完队列再收尾
    voiceId: "Chinese (Mandarin)_Gentleman",
    speed: 1.0,
    breathing: false,
    breathSec: 0.25,
    // 诊断统计
    spokeCount: 0, // 前端发来的 speak 句数
    pcmBytes: 0, // 回传给前端的 PCM 字节数
    startedOnce: false, // 是否收到过 task_started
    // 磁盘缓存:finish 到齐后按批处理,命中读盘 / 未命中合成后写盘
    texts: [], // 累积的 speak 文本(缓存 key 需要完整文本)
    pendingKey: null, // 当前合成批次的缓存 key(合成完成写盘用)
    pcmChunks: [], // 当前合成批次收集的 hex 音频片段
  };

  function sendJson(obj) {
    if (frontWs.readyState === WebSocket.OPEN) frontWs.send(JSON.stringify(obj));
  }
  function sendPcm(hex) {
    if (frontWs.readyState === WebSocket.OPEN) frontWs.send(Buffer.from(hex, "hex"));
  }

  function openMiniMax() {
    if (state.mm) return;
    const mm = new WebSocket(baseUrl, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    state.mm = mm;

    mm.on("open", () => {
      // 注意:MiniMax 服务端事件字段名为 event(非 type)
      // task_start 不带 text,所有文本经 task_continue 发送:
      // 实测若首句放进 task_start 后立即 task_finish,会中断该句音频(返回 0 帧)。
      // 全部走 task_continue 后,task_finish 会等待所有句子合成完成。
      mm.send(
        JSON.stringify({
          event: "task_start",
          model: MODEL,
          text: "",
          stream: true,
          voice_setting: SUPPORTS_EMOTION
            ? { voice_id: state.voiceId, speed: state.speed, vol: 1.0, pitch: 0, emotion: EMOTION }
            : { voice_id: state.voiceId, speed: state.speed, vol: 1.0, pitch: 0 },
          audio_setting: { sample_rate: 16000, channel: 1, format: "pcm" },
          output_format: "hex",
        })
      );
    });

    mm.on("message", (raw) => {
      let evt;
      try {
        evt = JSON.parse(raw.toString());
      } catch {
        return;
      }
      switch (evt.event) {
        case "task_started":
          state.started = true;
          state.startedOnce = true;
          sendJson({ type: "start" });
          flush();
          break;
        case "task_continued": {
          const hex = evt.data?.audio;
          if (hex) {
            state.pcmBytes += hex.length;
            state.pcmChunks.push(hex); // 收集本次 batch 音频,合成完成后写盘
            sendPcm(hex);
          }
          break;
        }
        case "task_finished":
          if (state.pendingKey && state.pcmChunks.length > 0) {
            try {
              const buf = Buffer.from(state.pcmChunks.join(""), "hex");
              fs.writeFileSync(path.join(CACHE_DIR, `${state.pendingKey}.pcm`), buf);
              enforceCacheLimit();
              console.log(`[tts] 缓存已写入 ${state.pendingKey}.pcm (${(buf.length / 1024).toFixed(0)}KB)`);
            } catch (e) {
              console.error("[tts] 写缓存失败:", e.message);
            }
          }
          state.pendingKey = null;
          state.pcmChunks = [];
          sendJson({ type: "end" });
          mm.close();
          break;
        case "task_failed":
          console.error("[tts] MiniMax 合成失败:", evt.data ?? evt);
          sendJson({ type: "error", message: mapMiniMaxError(evt) });
          mm.close();
          break;
        default:
          break;
      }
    });

    mm.on("error", (e) => {
      console.error("[tts] MiniMax 连接错误:", e.message);
      sendJson({ type: "error", message: "语音服务连接失败，请稍后再试" });
    });
    mm.on("close", () => {
      state.mm = null;
      state.started = false;
      state.finishQueued = false;
    });
  }

  function flush() {
    while (state.started && state.queue.length > 0) {
      const text = state.queue.shift();
      // 呼吸停顿:在句子间插入 MiniMax 原生停顿标记(必须位于两段可发音文本之间)
      const final = state.breathing && state.sentAny ? `<#${state.breathSec}#>${text}` : text;
      state.sentAny = true;
      state.mm.send(JSON.stringify({ event: "task_continue", text: final }));
    }
    // 队列冲刷完毕且 finish 已排队 → 收尾
    if (state.started && state.finishQueued && state.queue.length === 0) {
      state.finishQueued = false;
      state.mm.send(JSON.stringify({ event: "task_finish" }));
    }
  }

  frontWs.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }
    if (!msg || typeof msg !== "object") return;

    if (msg.type === "config") {
      // 兼容 voice_id(snake) 与 voiceId(camel),breath_sec 与 breathSec
      state.voiceId = msg.voice_id || msg.voiceId || state.voiceId;
      if (typeof msg.speed === "number") state.speed = msg.speed;
      if (typeof msg.breathing === "boolean") state.breathing = msg.breathing;
      if (msg.breath_sec) state.breathSec = msg.breath_sec;
      if (msg.breathSec) state.breathSec = msg.breathSec;
      console.log(`[tts] config: voice=${state.voiceId} speed=${state.speed} breathing=${state.breathing} @ ${new Date().toLocaleTimeString()}`);
      // 收到会话配置即预连接 MiniMax:前端要等 task_started 才冲刷待发句子,
      // 若等到 speak 才连,双方会互相等待而死锁
      if (!state.mm) openMiniMax();
    } else if (msg.type === "speak") {
      if (!msg.text) return;
      state.spokeCount++;
      // 不再立即入队合成:等 finish 到齐后按批处理,才能用完整文本算缓存 key
      state.texts.push(msg.text);
      if (!state.mm) openMiniMax();
    } else if (msg.type === "finish") {
      const texts = state.texts;
      state.texts = [];
      const fullText = texts.join("");
      if (!fullText) {
        sendJson({ type: "end" });
        return;
      }

      const key = makeCacheKey(state.voiceId, state.speed, state.breathing, state.breathSec, fullText);
      const cachePath = path.join(CACHE_DIR, `${key}.pcm`);
      if (fs.existsSync(cachePath)) {
        // 命中缓存:直接读盘发送,不调用 MiniMax,零费用
        console.log(`[tts] 缓存命中 ${key.slice(0, 8)} (${texts.length}句, ${(fs.statSync(cachePath).size / 1024).toFixed(0)}KB)`);
        sendJson({ type: "start" });
        try {
          const buf = fs.readFileSync(cachePath);
          const hex = buf.toString("hex");
          // 分块发送(64KB/块),避免单帧过大
          for (let i = 0; i < hex.length; i += 65536 * 2) sendPcm(hex.slice(i, i + 65536 * 2));
          state.pcmBytes += hex.length;
        } catch (e) {
          console.error("[tts] 读缓存失败:", e.message);
        }
        sendJson({ type: "end" });
        return;
      }

      // 未命中:入队合成,记录本次 batch 的 key 供合成完成后写盘
      state.queue.push(...texts);
      state.pendingKey = key;
      state.pcmChunks = [];
      if (state.mm && state.started) {
        state.finishQueued = true;
        flush(); // 冲刷句子;flush 末尾因 finishQueued 自动 task_finish
      } else if (state.mm) {
        state.finishQueued = true; // MiniMax 未就绪,等 task_started 后冲刷并收尾
      } else {
        openMiniMax();
        state.finishQueued = true;
      }
    }
  });

  // 插话打断:前端断开 -> 立即关闭 MiniMax 连接,停止合成
  frontWs.on("close", () => {
    state.mm?.close();
    console.log(
      `[tts] 前端连接关闭 @ ${new Date().toLocaleTimeString()}，已中断合成 ` +
      `(speak=${state.spokeCount}, pcmBytes=${state.pcmBytes}, started=${state.startedOnce}, queue=${state.queue.length})`
    );
  });
  frontWs.on("error", () => state.mm?.close());
});
