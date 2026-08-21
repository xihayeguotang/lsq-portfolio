/**
 * 全局共享 AudioContext —— 解决跨页自动朗读被浏览器自动播放策略静音的问题。
 *
 * 浏览器只允许在"用户手势窗口"内 resume AudioContext;跨路由跳转后窗口已过期,
 * 从首页点「听我介绍」进入 /chat 时自动朗读会被静音。
 *
 * 解法:在首页点击(用户手势)内先把共享 context 预热成 running,
 * 后续 /chat 的所有播放复用这个已运行的 context,即可自动出声,无需访客二次操作。
 */

let sharedCtx: AudioContext | null = null;

function createCtx(): AudioContext {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return new Ctor();
}

/** 获取共享 AudioContext;首次调用会创建并尝试恢复(须在用户手势内完成首次预热) */
export function getSharedAudioContext(): AudioContext {
  if (!sharedCtx) {
    sharedCtx = createCtx();
  }
  if (sharedCtx.state === "suspended") {
    // 手势内调用会成功;窗口过期后可能被拒,但首次预热一定发生在用户手势内
    void sharedCtx.resume();
  }
  return sharedCtx;
}

/** 在用户手势内预热音频(首页「听我介绍」点击时调用) */
export function warmupAudio(): void {
  getSharedAudioContext();
}
