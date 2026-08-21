"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import {
  Add,
  More,
  HambergerMenu,
  Stop,
  VolumeHigh,
  VolumeSlash,
} from "iconsax-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useSpeech } from "@/hooks/use-speech";
import { useTypewriter } from "@/hooks/use-typewriter";
import { speakText, stripMarkdown } from "@/lib/speech-utils";
import { getSharedAudioContext } from "@/lib/audio-context";
import BusinessCard from "@/components/business-card";
import { ImagesBadge } from "@/components/ui/images-badge";

const PortfolioGrid = dynamic(() => import("@/components/portfolio-grid"), { ssr: false });
const ResumeContent = dynamic(() => import("@/components/resume-content"), { ssr: false });
const MarkdownRenderer = dynamic(() => import("@/components/markdown-renderer"), { ssr: false });

type ChatSession = {
  id: string;
  title: string;
  messages: UIMessage[];
};

/* ============ SVG Icons ============ */

function PlusIcon() {
  return <Add size={20} color="currentColor" aria-hidden />;
}

function DotsIcon() {
  return <More size={20} color="currentColor" aria-hidden />;
}

function MenuIcon() {
  return <HambergerMenu size={18} color="currentColor" aria-hidden />;
}

function StopIcon() {
  return <Stop size={16} color="currentColor" aria-hidden />;
}

function SpeakIcon() {
  return <VolumeHigh size={16} color="currentColor" aria-hidden />;
}

/** 每条回复下的朗读按钮:未播放=朗读,正在播这条=停止播放(带状态色) */
function SpeakMessageButton({ speaking, onSpeak }: { speaking: boolean; onSpeak: () => void }) {
  return (
    <button
      className="speak-message-btn"
      title={speaking ? "停止播放本条回复" : "朗读本条回复"}
      aria-label={speaking ? "停止播放本条回复" : "朗读本条回复"}
      onClick={onSpeak}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        marginTop: 8,
        padding: "3px 8px",
        fontSize: 11,
        lineHeight: 1,
        color: speaking ? "var(--dbx-text-primary)" : "var(--dbx-text-tertiary)",
        background: speaking ? "var(--dbx-fill-trans-10)" : "transparent",
        border: "none",
        borderRadius: "var(--dbx-radius-sm)",
        cursor: "pointer",
        transition: "color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!speaking) (e.currentTarget as HTMLButtonElement).style.color = "var(--dbx-text-secondary)";
      }}
      onMouseLeave={(e) => {
        if (!speaking) (e.currentTarget as HTMLButtonElement).style.color = "var(--dbx-text-tertiary)";
      }}
    >
      {speaking ? <StopIcon /> : <SpeakIcon />}
      <span>{speaking ? "停止播放" : "朗读"}</span>
    </button>
  );
}

/** 右上角自动播报开关图标:on=喇叭+声波,off=喇叭+斜杠 */
function SpeakerIcon({ on }: { on: boolean }) {
  return on ? (
    <VolumeHigh size={16} color="currentColor" aria-hidden />
  ) : (
    <VolumeSlash size={16} color="currentColor" aria-hidden />
  );
}

/* ============ Utils ============ */

/** Extract plain text from a UIMessage's parts array */
function getMessageText(msg: UIMessage): string {
  if (!msg.parts) return "";
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

/* ============ Data ============ */

const navItems = [
  { name: "个人简历", path: "/resume" },
  { name: "作品集", path: "/portfolio" },
  { name: "更多", path: "" },
];

const suggestions = [
  "做个简单的自我介绍吧",
  "你最有代表性的项目是哪个？为什么这么觉得？",
  "你在项目里一般怎么和产品、研发协作？",
];

/* ============ 首次引导文案 ============ */

/** 「听我介绍」入口：一段有温度的自我介绍（插入对话 + TTS 朗读） */
const INTRO_SCRIPT = `你好，我是梁松泉，一名 UI 设计师，目前在猿辅导做设计。很荣幸你能花时间了解我的作品集。我擅长把复杂的业务需求，转化为清晰、好用又有质感的产品体验，做过车载系统、大屏电视、电商增长这些不同类型的产品设计。你可以顺着往下看我的作品，也可以直接问我任何问题，比如某个项目是怎么思考的、我的设计体系怎么落地，或者我平时怎么和研发、产品协作。想从哪里开始聊？`;

/** 主动开场白：直接进入 /chat(无参数、无历史)时插入的短问候,带互动引导 */
const OPENING_SCRIPT = `你好，我是梁松泉，一名 UI 设计师。想了解我的工作经历、某个项目是怎么从零到一落地的，或者我在设计体系和研发协作上的思考，都可以直接问我。比如说，你是想先听一段我的整体介绍，还是想直奔某个具体的项目？`;

/* ============ Components ============ */

function Sidebar({ sessions, currentSessionId, onNewChat, onSelectSession, activeView, onNavigate, isLoading, sidebarOpen, onClose }: { sessions: ChatSession[]; currentSessionId: string | null; onNewChat: () => void; onSelectSession: (id: string) => void; activeView: string; onNavigate: (view: string) => void; isLoading: boolean; sidebarOpen: boolean; onClose: () => void; }) {
  const router = useRouter();
  return (
    <aside className={"sidebar" + (sidebarOpen ? " open" : "")}>
      <div className="sidebar-logo">
        <span className="sidebar-logo-text">梁松泉</span>
      </div>

      <motion.div
        className="new-chat-btn"
        onClick={() => { onNewChat(); onClose(); }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="new-chat-inner">
          <div className="new-chat-text">
            <PlusIcon />
            <span>新对话</span>
          </div>
          <span className="new-chat-shortcut">⌘ K</span>
        </div>
      </motion.div>

      <div className="sidebar-nav">
        <div
          className={"sidebar-nav-item" + (activeView === 'resume' ? ' active' : '')}
          title="个人简历"
          onClick={() => { onNavigate('resume'); onClose(); }}
        >
          <DotsIcon />
          <span>个人简历</span>
        </div>
        <div
          className={"sidebar-nav-item" + (activeView === 'portfolio' ? ' active' : '')}
          title="作品集"
          onClick={() => { onNavigate('portfolio'); onClose(); }}
        >
          <DotsIcon />
          <span>作品集</span>
        </div>
      </div>

      <div className="history-header">
        <span className="history-header-text">历史对话</span>
      </div>

      <div className="history-list">
        {[...sessions].reverse().map((session) => (
          <div
            key={session.id}
            className={"history-item" + (session.id === currentSessionId ? " active" : "")}
            title={session.title}
            onClick={() => { onSelectSession(session.id); onClose(); }}
          >
            <span className="history-item-text">{session.title}</span>
          </div>
        ))}
      </div>

      <BusinessCard />
    </aside>
  );
}

/* ============ 打字机 / 思考指示 ============ */

/** 思考阶段轮播文案(纯文案,不读 reasoning 内容) */
const THINKING_LABELS = ["正在分析你的问题…", "正在回忆项目细节…", "正在核对数据…"];

/** 消息正文渲染:流式(typing)时用打字机逐字显示,流结束后切 Markdown 保真 */
function AssistantText({ text, typing }: { text: string; typing: boolean }) {
  const { text: shown, done, skip } = useTypewriter(text, typing);
  if (typing && !done) {
    return (
      <div className="markdown-body typing-text" onClick={skip} title="点击显示全部">
        {shown}
        <span className="typewriter-caret" />
      </div>
    );
  }
  return <MarkdownRenderer content={text} />;
}

/** 思考中的打字条 + 轮播文案(仅在 AI 尚未输出正文时显示) */
function ThinkingIndicator() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % THINKING_LABELS.length), 2500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-2.5">
      {/* Typing bars */}
      <div className="flex items-center gap-[3px] h-5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full"
            style={{ background: "var(--dbx-text-tertiary)" }}
            animate={{ height: ["6px", "16px", "6px"] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
      <span className="text-xs" style={{ color: "var(--dbx-text-tertiary)" }}>
        {THINKING_LABELS[idx]}
      </span>
    </div>
  );
}

function MainContent({
  messages,
  isLoading,
  onSend,
  error,
  onToggleSidebar,
  onSpeakMessage,
  speakingMsgId,
  autoSpeak,
  onToggleAutoSpeak,
}: {
  messages: UIMessage[];
  isLoading: boolean;
  onSend: (text: string) => void;
  error?: Error;
  onToggleSidebar: () => void;
  onSpeakMessage: (msg: UIMessage) => void;
  speakingMsgId: string | null;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Generate follow-up suggestions based on AI response content
  function getFollowUps(content: string): string[] {
    const all: { keywords: string[]; questions: string[] }[] = [
      {
        keywords: ["工作经历", "从业", "职业"],
        questions: ["斑马百科项目做了什么", "你搭建的设计体系是怎样的"],
      },
      {
        keywords: ["斑马", "百科", "猿辅导", "思维"],
        questions: ["你做过哪些海外项目", "你开发过什么提效工具", "你的设计理念是什么"],
      },
      {
        keywords: ["海外", "日本", "本地化"],
        questions: ["介绍一下你的工作经历", "斑马百科项目做了什么"],
      },
      {
        keywords: ["设计体系", "设计规范", "组件库", "设计系统"],
        questions: ["介绍一下你的工作经历", "你开发过什么提效工具"],
      },
      {
        keywords: ["提效", "插件", "Sketch", "自动化", "产能"],
        questions: ["斑马百科项目做了什么", "你搭建的设计体系是怎样的"],
      },
      {
        keywords: ["作业盒子", "拍作业"],
        questions: ["介绍一下你的工作经历", "你在时趣互动做了什么"],
      },
    ];

    for (const group of all) {
      if (group.keywords.some((k) => content.includes(k))) {
        return group.questions.slice(0, 2);
      }
    }
    return ["介绍一下你的工作经历", "斑马百科项目做了什么"];
  }

  // 最后一条 assistant 消息正在流式输出正文 → 该条走打字机渲染
  const lastMsg = messages[messages.length - 1];
  const lastIsAssistantStreaming =
    isLoading &&
    lastMsg?.role === "assistant" &&
    getMessageText(lastMsg).length > 0;

  return (
    <div className="main-content h-full flex flex-col"
      style={{ background: "var(--dbx-bg-base)" }}
    >
      <Header
        onToggleSidebar={onToggleSidebar}
        autoSpeak={autoSpeak}
        onToggleAutoSpeak={onToggleAutoSpeak}
      />
      <div className={"chat-area" + (messages.length === 0 ? " empty-state" : "")}>
        {/* Messages scroll area */}
        <div className={"chat-scroll" + (messages.length > 0 ? " has-messages" : "")} ref={scrollRef}>
          {messages.length > 0 && (
            <div className="messages">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id || i}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`message message-${msg.role}`}>
                  <div className="message-content">
                    {msg.role === "assistant" ? (
                      <>
                        <AssistantText
                          text={getMessageText(msg)}
                          typing={lastIsAssistantStreaming && i === messages.length - 1}
                        />
                        <SpeakMessageButton
                          speaking={speakingMsgId === msg.id}
                          onSpeak={() => onSpeakMessage(msg)}
                        />
                      </>
                    ) : (
                      getMessageText(msg)
                    )}
                  </div>
                </motion.div>
              ))}
              {!isLoading &&
                messages.length > 0 &&
                (() => {
                  const last = messages[messages.length - 1];
                  if (last?.role !== "assistant") return null;
                  const followUps = getFollowUps(getMessageText(last));
                  if (!followUps.length) return null;
                  return (
                    <div className="followup-chips" key={`fu-${last.id}-${messages.length}`}>
                      <span className="followup-label">你可以接着问：</span>
                      {followUps.map((q) => (
                        <motion.button
                          key={q}
                          className="suggestion-card followup-chip"
                          onClick={() => onSend(q)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          {q}
                        </motion.button>
                      ))}
                    </div>
                  );
                })()}
              {isLoading && !lastIsAssistantStreaming && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="message message-assistant"
                >
                  <div className="message-content">
                    <ThinkingIndicator />
                  </div>
                </motion.div>
              )}
            </div>
          )}
          {/* Error state */}
          {error && messages.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="message message-assistant"
            >
              <div className="message-content">
                <span style={{ color: "var(--dbx-accent)" }}>
                  抱歉，请求出错了，请稍后重试。
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input section - centered when no messages, bottom when messages exist */}
        <div className="chat-input-section">
          {messages.length === 0 && (
            <div className="chat-empty-group">
              <motion.div
                className="chat-greeting-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <span className="inline-flex items-center">
                  <ImagesBadge
                    text=""
                    images={[
                      "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/car-system/cover.jpg",
                      "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/tv/cover.jpg",
                      "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/projects/baike-ecommerce/cover.jpg",
                    ]}
                    folderSize={{ width: 36, height: 27 }}
                    teaserImageSize={{ width: 22, height: 16 }}
                    hoverImageSize={{ width: 52, height: 36 }}
                    hoverTranslateY={-30}
                    hoverSpread={16}
                    hoverRotation={12}
                    className="mr-2"
                  />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: "linear-gradient(135deg, var(--dbx-text-primary) 40%, #6366f1 70%, #8b5cf6 100%)",
                      backgroundSize: "200% 200%",
                      animation: "gradientShift 4s ease infinite",
                    }}
                  >
                    梁松泉・作品集
                  </span>
                </span>
              </motion.div>
              <ChatInput onSend={onSend} isLoading={isLoading} />
              <motion.div
                className="suggestion-grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              >
                {suggestions.slice(0, 3).map((text) => (
                  <motion.div
                    key={text}
                    className="suggestion-card"
                    onClick={() => onSend(text)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <span>{text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
          {messages.length > 0 && <ChatInput onSend={onSend} isLoading={isLoading} />}
        </div>
      </div>
    </div>
  );
}

function Header({
  onToggleSidebar,
  autoSpeak,
  onToggleAutoSpeak,
}: {
  onToggleSidebar: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
}) {
  return (
    <motion.div
      className="main-header"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="header-left">
        <button className="header-icon-btn mobile-menu-btn" onClick={onToggleSidebar} aria-label="展开菜单">
          <MenuIcon />
        </button>
      </div>
      <div className="header-center">
        <span className="header-title">新对话</span>
        <motion.span
          className="w-1.5 h-1.5 rounded-full ml-2 inline-block"
          style={{ background: "rgb(34, 197, 94)" }}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="header-right">
        <button
          className={"header-icon-btn speaker-btn" + (autoSpeak ? " active" : "")}
          title={autoSpeak ? "自动播报已开启，点击关闭" : "自动播报已关闭，点击开启"}
          aria-label="自动播报开关"
          onClick={onToggleAutoSpeak}
        >
          <SpeakerIcon on={autoSpeak} />
        </button>
      </div>
    </motion.div>
  );
}

function ChatInput({ onSend, isLoading }: { onSend: (text: string) => void; isLoading?: boolean }) {
  const [hasText, setHasText] = useState(false);
  const [animating, setAnimating] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const pendingTextRef = useRef<string>("");

  function handleInput(e: React.FormEvent<HTMLDivElement>) {
    const text = (e.target as HTMLDivElement).innerText || "";
    setHasText(text.trim().length > 0);
  }

  function handleGuideClick(text: string) {
    if (editorRef.current) {
      editorRef.current.innerText = text;
      setHasText(true);
      editorRef.current.focus();
    }
  }

  const captureTextPixels = useCallback((text: string) => {
    const canvas = canvasRef.current;
    const editor = editorRef.current;
    if (!canvas || !editor) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fixed 800x800 canvas matching Aceternity reference
    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);

    const style = getComputedStyle(editor);
    const fontSize = parseFloat(style.fontSize) || 15;
    const lineHeight = parseFloat(style.lineHeight) || 24;

    const offsetX = 0;
    const offsetY = lineHeight - fontSize; // in canvas pixels (2x CSS)

    // 2x font + scale(0.5) for crisp text — use actual text color
    ctx.font = `${fontSize * 2}px ${style.fontFamily || "sans-serif"}`;
    ctx.fillStyle = "#FFF";
    ctx.textBaseline = "top";
    // Handle multi-line text - fillText doesn't render \n
    const lines = text.split('\n');
    const canvasLineHeight = lineHeight * 2; // match editor line-height at 2x scale
    lines.forEach((line, i) => {
      ctx.fillText(line, offsetX, offsetY + i * canvasLineHeight);
    });

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: any[] = [];

    // Scan 800x800 grid matching reference
    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        let e = i + 4 * n;
        // AND check - all three RGB channels must be non-zero (white text on transparent bg)
        if (pixelData[e] !== 0 && pixelData[e + 1] !== 0 && pixelData[e + 2] !== 0) {
          newData.push({
            x: n,
            y: t,
            color: [pixelData[e], pixelData[e + 1], pixelData[e + 2], pixelData[e + 3]],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, []);

  const runVanishSweep = useCallback((startX: number) => {
    const animateFrame = (pos: number) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const p = newDataRef.current[i];
          if (p.x < pos) {
            // Pixels to the left of sweep line are preserved
            newArr.push(p);
          } else {
            // Pixels to the right of sweep line scatter and vanish
            if (p.r <= 0) {
              continue;
            }
            p.x += Math.random() > 0.5 ? 1 : -1;
            p.y += Math.random() > 0.5 ? 1 : -1;
            p.r -= 0.05 * Math.random();
            newArr.push(p);
          }
        }
        newDataRef.current = newArr;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx && canvas) {
          // Only clear to the right of the sweep line - left side keeps original fillText
          ctx.clearRect(pos, 0, canvas.width, canvas.height);
          // Only draw scattered pixels to the right of the sweep line
          for (const p of newDataRef.current) {
            if (p.x > pos) {
              ctx.beginPath();
              ctx.rect(p.x, p.y, p.r, p.r);
              ctx.fillStyle = p.color;
              ctx.fill();
            }
          }
        }

        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setAnimating(false);
          if (editorRef.current) editorRef.current.innerHTML = "";
          setHasText(false);
          const text = pendingTextRef.current;
          pendingTextRef.current = "";
          if (text.trim()) onSend(text);
        }
      });
    };
    animateFrame(startX);
  }, [onSend]);

  const vanishAndSubmit = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const text = editor.innerText || "";
    if (!text.trim()) return;

    // 30字以上的内容跳过消失动画，直接发送
    if (text.length > 30) {
      if (editorRef.current) editorRef.current.innerHTML = "";
      setHasText(false);
      onSend(text);
      return;
    }

    pendingTextRef.current = text;
    captureTextPixels(text);
    setAnimating(true);
    // Use setTimeout to ensure React has rendered with animating=true before starting the animation
    setTimeout(() => {
      // Find the rightmost pixel X position
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      );
      runVanishSweep(maxX);
    }, 50);
  }, [captureTextPixels, runVanishSweep, onSend]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" && !e.shiftKey && !animating && !isLoading) {
      e.preventDefault();
      vanishAndSubmit();
    }
  }

  return (
    <div className="chat-input-wrapper">
      <div className={"chat-input-container" + (hasText ? " has-text" : "")}>
        <div className="chat-input-inner">
          {/* Text editor */}
          <div className="input-editor-row" style={{ position: "relative" }}>
            <div
              ref={editorRef}
              className={"editor" + (animating ? " animating" : "")}
              role="textbox"
              contentEditable={!animating}
              data-placeholder="向梁松泉提问"
              onInput={handleInput}
              onKeyDown={handleKeyDown}
            />
            <canvas
              ref={canvasRef}
              className="input-vanish-canvas"
            />
            {!hasText && !animating && (
            <div className="input-guide">
              {suggestions.map((text) => (
                <span key={text} className="input-guide-chip" onClick={() => handleGuideClick(text)}>{text}</span>
              ))}
            </div>
            )}
          </div>

          {/* Toolbar */}
          <div className="input-toolbar">
            <div className="toolbar-right">
              <button className={"send-btn" + (animating ? " disabled" : "")} title="发送" onClick={vanishAndSubmit} disabled={animating}>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABR0lEQVR4AdRUQRLCIAy0vsy+rO3LWl9WdzMhJTQw4IwHHQKBbHYTRJ+PH3/+Q+A8zxctuoyvOiCZ2o71BPFOow9b4dvoFkCiVIlVyMDA9YW1HAswdt4UIBDGKkmWzJJL5mxvmFAApKw2J7SEjKTlHinoBALihKutMwIbzI1pmmIBoFh1b7VzToTccFgHqN59+yH6OhRyzVmuY/FcRyaAkLUFvzVa5MxzPCag7Tp1ogvbiKtULlDGxdHJBLhHcIVN8GtCfOP8nsprQYqMW54TEAgmiORCrmWEW4+gxD5CAZDIUCE+RZqctSbgxwQSmSbeklNc19v18LzZAQGZhQRZPCygW0C7yPice9Ti3QJKF1aJ2BsWjlGB6JpYffVfYEhAr6EUKfeukyEBZkKE1fLZimFfuzbC278DQQQTSZMFYXc03IHL7th8AAAA///F8qI3AAAABklEQVQDAAoSfzE/BJkXAAAAAElFTkSuQmCC"
                  alt="发送"
                  width={20}
                  height={20}
                  style={{ display: "block" }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ Main Export ============ */

export default function ChatApp() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [view, setView] = useState<'chat' | 'portfolio' | 'resume'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // 自动播报开关:开启时 AI 回复完成后自动朗读最后一条(右上角喇叭控制,状态持久化)
  const [autoSpeak, setAutoSpeak] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      return localStorage.getItem("chat-auto-speak") !== "false";
    } catch {
      return true;
    }
  });
  const currentSessionIdRef = useRef<string | null>(null);

  const speech = useSpeech();
  // 当前正在播放朗读的消息 id(音频播完或停止时复位,用于各消息按钮显示播放状态)
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // 朗读会话结束(音频播完/被停止)时,复位消息按钮的播放状态
  useEffect(() => {
    if (!speech.isSpeaking) setSpeakingMsgId(null);
  }, [speech.isSpeaking]);

  const { messages, setMessages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onFinish: ({ messages: newMessages }) => {
      // Save completed messages to session store AND persist to localStorage
      const sid = currentSessionIdRef.current;
      if (sid) {
        setSessions(prev => {
          const updated = prev.map(s =>
            s.id === sid ? { ...s, messages: newMessages } : s
          );
          // 立即持久化，防止导航离开时丢失
          try {
            localStorage.setItem("chat-sessions", JSON.stringify(updated));
            localStorage.setItem("chat-current-session-id", sid);
          } catch {}
          return updated;
        });
      }
      // 自动播报:回复完成后朗读最后一条助手消息(右上角喇叭可关闭)
      if (autoSpeakRef.current) {
        const lastAssistant = [...newMessages].reverse().find(m => m.role === "assistant");
        if (lastAssistant) {
          const text = getMessageText(lastAssistant);
          if (stripMarkdown(text)) speakMessage(lastAssistant.id, text);
        }
      }
    },
    onError: (err) => {
      console.error('Chat error:', err);
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Keep refs in sync with state
  useEffect(() => {
    currentSessionIdRef.current = currentSessionId;
  }, [currentSessionId]);

  // 供 onFinish 等闭包读取最新的自动播报开关
  const autoSpeakRef = useRef(autoSpeak);
  useEffect(() => {
    autoSpeakRef.current = autoSpeak;
  }, [autoSpeak]);

  // 自动播报开关持久化
  useEffect(() => {
    try {
      localStorage.setItem("chat-auto-speak", autoSpeak ? "true" : "false");
    } catch {}
  }, [autoSpeak]);

  // 从 localStorage 恢复历史会话
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chat-sessions");
      const savedId = localStorage.getItem("chat-current-session-id");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          // 恢复最后活跃的会话
          if (savedId) {
            const target = parsed.find((s: { id: string }) => s.id === savedId);
            setCurrentSessionId(savedId);
            if (target?.messages) {
              setMessages(target.messages);
            }
          }
        }
      }
    } catch {}
  }, []);

  // 会话变化时持久化到 localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("chat-sessions", JSON.stringify(sessions));
      if (currentSessionId) {
        localStorage.setItem("chat-current-session-id", currentSessionId);
      }
    }
  }, [sessions, currentSessionId]);

  // 组件卸载时（导航离开）保护保存
  const latestSessionIdRef = useRef(currentSessionId);
  latestSessionIdRef.current = currentSessionId;
  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;
  useEffect(() => {
    return () => {
      const s = sessionsRef.current;
      if (s.length > 0) {
        try {
          localStorage.setItem("chat-sessions", JSON.stringify(s));
          if (latestSessionIdRef.current) {
            localStorage.setItem("chat-current-session-id", latestSessionIdRef.current);
          }
        } catch {}
      }
    };
  }, []);

  // 页面可见性变化时（用户切换 Tab 或导航回来时）重新保存
  useEffect(() => {
    function save() {
      if (sessions.length > 0) {
        localStorage.setItem("chat-sessions", JSON.stringify(sessions));
        localStorage.setItem("chat-current-session-id", currentSessionId ?? "");
      }
    }
    document.addEventListener("visibilitychange", save);
    return () => document.removeEventListener("visibilitychange", save);
  }, [sessions, currentSessionId]);

  useEffect(() => {
    // 读取 URL 参数自动切换到对应视图
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    if (viewParam === "portfolio" || viewParam === "resume") {
      setView(viewParam);
      window.history.replaceState(null, "", "/chat");
    }
  }, []);

  // 从首页引导卡跳转而来：intro=listen 时新建会话并插入自我介绍（历史会话保留在侧栏）
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const intro = params.get("intro");
      if (intro !== "listen") return;
      window.history.replaceState(null, "", "/chat");
      // 语音播报入口进入时:右上角自动播报默认开启(即使上次手动关闭过)
      setAutoSpeak(true);
      // 尊重用户明确意图：即使浏览器有历史会话，也新建会话承载自我介绍
      // 避免旧逻辑的 `prev.length>0` 守卫把自助讲解静默拦掉导致无声音
      const introMsg: UIMessage = {
        id: `intro-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: "assistant",
        parts: [{ type: "text", text: INTRO_SCRIPT }],
      };
      createSession("自助讲解");
      setMessages([introMsg]);
      speakMessage(introMsg.id, INTRO_SCRIPT);
    }, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 主动开场：直接进入 /chat(无参数、无历史)时插入短问候;音频已解锁才自动朗读
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("intro") === "listen") return; // intro=listen 由上面逻辑负责
      let inserted = false;
      let insertedMsgId: string | null = null;
      setMessages((prev) => {
        if (prev.length > 0) return prev; // 已恢复历史会话则不打扰
        inserted = true;
        const msg: UIMessage = {
          id: `opening-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          role: "assistant",
          parts: [{ type: "text", text: OPENING_SCRIPT }],
        };
        insertedMsgId = msg.id;
        return [...prev, msg];
      });
      if (inserted) {
        // 直接进入无用户手势预热 AudioContext,通常为 suspended;仅就绪时自动朗读
        try {
          if (getSharedAudioContext().state === "running" && insertedMsgId) {
            speakMessage(insertedMsgId, OPENING_SCRIPT);
          }
        } catch {
          /* 忽略 */
        }
      }
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function createSession(firstMsg: string): string {
    const id = Date.now().toString();
    const title = firstMsg.length > 22 ? firstMsg.slice(0, 22) + '...' : firstMsg;
    setSessions((prev) => [...prev, { id, title, messages: [] }]);
    setCurrentSessionId(id);
    return id;
  }

  /** 朗读一条完整消息:记录正在播放的消息 id,先过滤 markdown 标记,再逐句推送 TTS */
  function speakMessage(msgId: string, text: string) {
    setSpeakingMsgId(msgId);
    speakText(speech, text);
  }

  function stopSpeaking() {
    speech.stop();
    setSpeakingMsgId(null);
  }

  /** 每条回复下的播放按钮:正在播这条则停止,否则播放这条(自动切走当前朗读) */
  function handleSpeakMessage(msg: UIMessage) {
    if (speakingMsgId === msg.id) stopSpeaking();
    else speakMessage(msg.id, getMessageText(msg));
  }

  function toggleAutoSpeak() {
    const next = !autoSpeak;
    setAutoSpeak(next);
    if (next) {
      // 开启时在用户手势内提前解锁音频,确保回复自动播报不被浏览器静音
      speech.warmup();
    } else {
      // 关闭时立即停止当前播报,消息按钮复位为「朗读」
      speech.stop();
      setSpeakingMsgId(null);
    }
  }

  function onSend(text: string) {
    if (!text.trim() || isLoading) return;

    // 插话打断:立刻停止当前朗读,关闭 TTS 连接
    speech.stop();
    // 自动播报依赖:在发送手势内提前解锁 AudioContext(自动播放策略)
    if (autoSpeakRef.current) speech.warmup();

    // Create or use existing session
    let sid = currentSessionId;
    if (!sid) {
      sid = createSession(text.trim());
      currentSessionIdRef.current = sid;
    }

    // Send user message and trigger AI response
    sendMessage({
      text: text.trim(),
    });
  }

  function handleNewChat() {
    // Save current session messages before switching away
    const sid = currentSessionId;
    if (sid && messages.length > 0) {
      setSessions(prev => prev.map(s =>
        s.id === sid ? { ...s, messages } : s
      ));
    }
    if (isLoading) stop();
    speech.stop();
    setCurrentSessionId(null);
    setMessages([]);
    setView('chat');
  }

  function selectSession(id: string) {
    // Save current session messages before switching
    const sid = currentSessionId;
    if (sid && messages.length > 0) {
      setSessions(prev => prev.map(s =>
        s.id === sid ? { ...s, messages } : s
      ));
    }
    if (isLoading) stop();
    speech.stop();

    setCurrentSessionId(id);
    const target = sessions.find(s => s.id === id);
    setMessages(target?.messages ?? []);
    setView('chat');
  }

  return (
    <div className="app-container">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectSession={selectSession}
        activeView={view}
        onNavigate={(v: string) => {
          setView(v as 'chat' | 'portfolio' | 'resume');
          if (v !== 'chat') {
            speech.stop();
            setCurrentSessionId(null);
            setMessages([]);
          }
        }}
        isLoading={isLoading}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Mobile sidebar backdrop */}
      <div
        className={"sidebar-backdrop" + (sidebarOpen ? " open" : "")}
        onClick={() => setSidebarOpen(false)}
      />
      {view === 'chat' ? (
        <MainContent
          messages={messages}
          isLoading={isLoading}
          onSend={onSend}
          error={error}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          onSpeakMessage={handleSpeakMessage}
          speakingMsgId={speakingMsgId}
          autoSpeak={autoSpeak}
          onToggleAutoSpeak={toggleAutoSpeak}
        />
      ) : view === 'portfolio' ? (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0" style={{ background: "var(--dbx-bg-base)" }}>
          <div className="main-header">
            <div className="header-left">
              <button className="header-icon-btn mobile-menu-btn" onClick={() => setSidebarOpen(prev => !prev)} aria-label="展开菜单">
                <MenuIcon />
              </button>
            </div>
            <div className="header-center">
              <span className="header-title">作品集</span>
            </div>
            <div className="header-right" />
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-6 lg:px-8 pb-8">
            <div style={{ paddingTop: '32px' }}>
              <PortfolioGrid />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0" style={{ background: "var(--dbx-bg-base)" }}>
          <div className="main-header">
            <div className="header-left">
              <button className="header-icon-btn mobile-menu-btn" onClick={() => setSidebarOpen(prev => !prev)} aria-label="展开菜单">
                <MenuIcon />
              </button>
            </div>
            <div className="header-center">
              <span className="header-title">个人简历</span>
            </div>
            <div className="header-right" />
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            <ResumeContent />
          </div>
        </div>
      )}
    </div>
  );
}
