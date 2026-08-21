/**
 * 16kHz / PCM16LE / 单声道 流式播放器（基于 Web Audio API）
 *
 * 无需解码器:每一块二进制 PCM 直接填入 AudioBuffer,用 AudioBufferSourceNode
 * 前瞻调度顺序播放,无缝拼接,首字延迟最低。
 */

import { getSharedAudioContext } from "./audio-context";

export class PcmPlayer {
  private sources: AudioBufferSourceNode[] = [];
  private nextTime = 0;
  private playing = false;
  private paused = false;
  private stopped = false;
  private ctx: AudioContext | null = null;
  private onStateChange: ((playing: boolean) => void) | null = null;

  constructor(cb?: (playing: boolean) => void) {
    this.onStateChange = cb ?? null;
  }

  private emit() {
    this.onStateChange?.(this.playing);
  }

  private ensureCtx(): AudioContext {
    // 复用全局共享 AudioContext:首页点「听我介绍」时已在用户手势内预热为 running,
    // 跨路由自动朗读因此不被浏览器自动播放策略静音。
    // 注意:缓存在实例上,暂停后 push 走这里会绕过 getSharedAudioContext 的
    // 「suspended 时自动 resume」逻辑,避免暂停被后续音频帧悄悄解停。
    if (!this.ctx) this.ctx = getSharedAudioContext();
    return this.ctx;
  }

  /**
   * 在用户手势内调用(如点击朗读),提前创建并恢复 AudioContext。
   * 若等首块 PCM 到达时才创建,已错过手势窗口,浏览器会以自动播放策略静音。
   */
  prepare(): void {
    this.ensureCtx();
  }

  /** 推送一块 16k PCM16LE 数据并立即开始播放 */
  push(pcm: ArrayBuffer): void {
    if (this.stopped) {
      // 上一轮主动停止后重新启用
      this.stopped = false;
      this.nextTime = 0;
    }
    const ctx = this.ensureCtx();
    const int16 = new Int16Array(pcm);
    if (int16.length === 0) return;

    const float = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float[i] = int16[i] / 32768;

    const buf = ctx.createBuffer(1, float.length, 16000);
    buf.copyToChannel(float, 0);

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);

    const startAt = Math.max(ctx.currentTime + 0.05, this.nextTime); // 前瞻 50ms 消除间隙
    src.start(startAt);
    this.nextTime = startAt + buf.duration;
    this.sources.push(src);

    if (!this.playing) {
      this.playing = true;
      this.emit();
    }

    src.onended = () => {
      this.sources = this.sources.filter((s) => s !== src);
      if (this.sources.length === 0 && !this.stopped) {
        this.playing = false;
        this.emit();
      }
    };
  }

  /**
   * 暂停播放:挂起共享 AudioContext,已排队未播完的声源冻结在当前位置,
   * 队列与 nextTime 保留,调用 resume() 可无缝续播。
   */
  pause(): void {
    if (this.paused) return;
    this.paused = true;
    this.playing = false;
    // ensureCtx 返回实例缓存的 ctx(播放中必已缓存),不会触发 getSharedAudioContext 的自动 resume
    const ctx = this.ensureCtx();
    if (ctx.state === "running") void ctx.suspend();
    this.emit();
  }

  /** 续播:恢复 AudioContext,继续播放队列中未播完的音频 */
  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    this.playing = this.sources.length > 0;
    const ctx = this.ensureCtx();
    if (ctx.state === "suspended") void ctx.resume();
    this.emit();
  }

  get isPaused(): boolean {
    return this.paused;
  }

  /** 主动停止:清空队列、静默全部声源 */
  stop(): void {
    this.stopped = true;
    this.playing = false;
    this.paused = false;
    this.nextTime = 0;
    // 若暂停中停止,先恢复时钟,避免 AudioContext 永久停留在 suspended 态
    const ctx = this.ensureCtx();
    if (ctx.state === "suspended") void ctx.resume();
    for (const s of this.sources) {
      try {
        s.stop();
      } catch {
        /* already stopped */
      }
    }
    this.sources = [];
    this.emit();
  }

  get isPlaying(): boolean {
    return this.playing;
  }

  /** 组件卸载时调用:停止播放(共享 AudioContext 由全局持有,不在此关闭) */
  close(): void {
    this.stop();
  }
}
