"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PcmPlayer } from "@/lib/pcm-player";

/** TTS 会话参数 */
export type SpeechOptions = {
  voiceId: string;
  speed: number;
  breathing: boolean;
  breathSec: number;
};

export type SpeechState = {
  isConnected: boolean; // WebSocket 已连接
  isStarted: boolean; // 服务端已就绪(task_started),可发句子
  isSpeaking: boolean; // 本次朗读会话进行中(含暂停)
  isPlaying: boolean; // AudioContext 正在出声
  isPaused: boolean; // 朗读已暂停(可续播)
  error: string | null;
};

/**
 * 朗读参数 —— 后台配置,面试官界面无设置入口。
 * 默认值写死于此;如需调整,改 .env.local 里的
 *   NEXT_PUBLIC_TTS_VOICE      (音色,见 MiniMax 音色列表)
 *   NEXT_PUBLIC_TTS_SPEED      (语速 0.5~2.0)
 *   NEXT_PUBLIC_TTS_BREATHING  (句间呼吸停顿 true/false)
 * 改后需重启 dev server。
 */
const TTS_VOICE = process.env.NEXT_PUBLIC_TTS_VOICE || "Chinese (Mandarin)_Gentleman";
const TTS_SPEED = Number(process.env.NEXT_PUBLIC_TTS_SPEED || 1);
const TTS_BREATHING = process.env.NEXT_PUBLIC_TTS_BREATHING !== "false"; // 默认开启

export const DEFAULT_SPEECH_OPTIONS: SpeechOptions = {
  voiceId: TTS_VOICE,
  speed: Number.isFinite(TTS_SPEED) ? TTS_SPEED : 1,
  breathing: TTS_BREATHING,
  breathSec: 0.25,
};

function wsUrl(): string {
  // 本地联调可直接指定代理地址,如 NEXT_PUBLIC_TTS_WS=ws://localhost:8787
  const explicit = process.env.NEXT_PUBLIC_TTS_WS;
  if (explicit) return explicit;
  const proto = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${window.location.host}/ws/tts`;
}

/**
 * 作品集 Agent 语音朗读 Hook:
 *  - 连接 wss://{host}/ws/tts(经 Nginx 反代到 Node TTS 代理)
 *  - speak():逐句推送文本;服务端就绪前自动积压,就绪后冲刷
 *  - stop():插话打断,关闭 WS + 停止音频
 */
export function useSpeech() {
  const [state, setState] = useState<SpeechState>({
    isConnected: false,
    isStarted: false,
    isSpeaking: false,
    isPlaying: false,
    isPaused: false,
    error: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const playerRef = useRef<PcmPlayer | null>(null);
  const pendingRef = useRef<string[]>([]);
  const startedRef = useRef(false);
  const finishQueuedRef = useRef(false);
  // 服务端已发 end、但本地音频队列可能仍在播放。isSpeaking 要等音频播完才复位，
  // 否则本地缓存秒回的场景下按钮提前恢复，声音还在背后播。
  const endedRef = useRef(false);
  // 朗读被用户暂停中。暂停时 playing=false 但会话未结束,isSpeaking 不能被复位。
  const pausedRef = useRef(false);

  const getPlayer = () => {
    if (!playerRef.current) {
      playerRef.current = new PcmPlayer((playing) =>
        setState((s) => ({
          ...s,
          isPlaying: playing,
          // end 已到、音频播完、且非暂停 → 会话真正结束
          isSpeaking: endedRef.current && !pausedRef.current ? playing : s.isSpeaking,
        }))
      );
    }
    return playerRef.current;
  };

  const flushPending = () => {
    if (!startedRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    while (pendingRef.current.length > 0) {
      const text = pendingRef.current.shift()!;
      wsRef.current.send(JSON.stringify({ type: "speak", text }));
    }
    // 文本全部冲刷后再发 finish,避免收尾信号丢失
    if (finishQueuedRef.current) {
      finishQueuedRef.current = false;
      wsRef.current.send(JSON.stringify({ type: "finish" }));
    }
  };

  const connect = useCallback((opts: SpeechOptions) => {
    // 若已有连接,先中断(防止重复朗读叠加)
    try {
      wsRef.current?.close();
    } catch {
      /* ignore */
    }
    getPlayer().stop();
    // 在用户手势内创建 AudioContext,规避自动播放策略导致的静音
    getPlayer().prepare();

    const ws = new WebSocket(wsUrl());
    wsRef.current = ws;
    pendingRef.current = [];
    startedRef.current = false;
    finishQueuedRef.current = false;
    endedRef.current = false;
    pausedRef.current = false;
    setState((s) => ({ ...s, isConnected: false, isStarted: false, isSpeaking: true, isPaused: false, error: null }));

    ws.onopen = () => {
      setState((s) => ({ ...s, isConnected: true }));
      // 字段名与代理协议一致:voice_id / breath_sec(勿改驼峰,代理侧不识别)
      ws.send(
        JSON.stringify({
          type: "config",
          voice_id: opts.voiceId,
          speed: opts.speed,
          breathing: opts.breathing,
          breath_sec: opts.breathSec,
        })
      );
      flushPending();
    };

    ws.onmessage = (e: MessageEvent) => {
      const data = e.data;
      if (data instanceof Blob) {
        void data.arrayBuffer().then((buf) => getPlayer().push(buf));
      } else if (data instanceof ArrayBuffer) {
        getPlayer().push(data);
      } else {
        try {
          const msg = JSON.parse(String(data));
          if (msg.type === "start") {
            startedRef.current = true;
            setState((s) => ({ ...s, isStarted: true }));
            flushPending();
          } else if (msg.type === "end") {
            // 服务端不再发数据,但本地音频队列可能还在播。播完由 getPlayer 回调复位,
            // 没在播(无音频/极短)且未暂停则立即复位。
            endedRef.current = true;
            if (!playerRef.current?.isPlaying && !pausedRef.current) {
              setState((s) => ({ ...s, isSpeaking: false }));
            }
          } else if (msg.type === "error") {
            endedRef.current = false;
            pausedRef.current = false;
            setState((s) => ({ ...s, error: msg.message, isSpeaking: false, isPaused: false }));
          }
        } catch {
          /* 忽略非协议消息 */
        }
      }
    };

    ws.onclose = () => {
      // 仅当前连接关闭才复位状态;若已被新连接替换(connect 里 close 旧连接),
      // 旧连接的关闭不应触碰新会话的 isSpeaking,否则切换朗读时按钮状态被误复位。
      if (wsRef.current !== ws) return;
      wsRef.current = null;
      startedRef.current = false;
      getPlayer().stop();
      setState((s) => ({ ...s, isConnected: false, isStarted: false, isSpeaking: false, isPaused: false }));
    };

    ws.onerror = () => {
      setState((s) => ({ ...s, error: "语音连接失败，请稍后再试" }));
    };
  }, []);

  /** 推送一句文本到 TTS(自动朗读时按句调用) */
  const speak = useCallback((text: string) => {
    if (!text) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !startedRef.current) {
      pendingRef.current.push(text);
      return;
    }
    wsRef.current.send(JSON.stringify({ type: "speak", text }));
  }, []);

  /** 文本全部推送完毕,收尾 */
  const finish = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && startedRef.current) {
      wsRef.current.send(JSON.stringify({ type: "finish" }));
    } else {
      finishQueuedRef.current = true; // 尚未就绪,等 task_started 后由 flushPending 补发
    }
  }, []);

  /** 在用户手势内提前解锁 AudioContext(自动朗读依赖,规避浏览器自动播放策略) */
  const warmup = useCallback(() => {
    getPlayer().prepare();
  }, []);

  /** 暂停朗读:冻结当前播放位置,调用 resume() 可无缝续播 */
  const pause = useCallback(() => {
    pausedRef.current = true;
    getPlayer().pause();
    setState((s) => ({ ...s, isPaused: true }));
  }, []);

  /** 续播:从暂停位置继续朗读 */
  const resume = useCallback(() => {
    pausedRef.current = false;
    getPlayer().resume();
    setState((s) => ({ ...s, isPaused: false }));
  }, []);

  /** 插话打断:立刻关闭 WS + 停止播放 */
  const stop = useCallback(() => {
    const ws = wsRef.current;
    wsRef.current = null;
    startedRef.current = false;
    pendingRef.current = [];
    endedRef.current = false;
    pausedRef.current = false;
    try {
      ws?.close();
    } catch {
      /* ignore */
    }
    getPlayer().stop();
    setState((s) => ({ ...s, isConnected: false, isStarted: false, isSpeaking: false, isPaused: false, error: null }));
  }, []);

  // 卸载时清理
  useEffect(() => {
    return () => {
      try {
        wsRef.current?.close();
      } catch {
        /* ignore */
      }
      playerRef.current?.close();
    };
  }, []);

  return { ...state, connect, speak, finish, stop, pause, resume, warmup };
}
