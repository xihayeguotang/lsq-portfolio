"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import PortfolioGrid from "@/components/portfolio-grid";
import ResumeContent from "@/components/resume-content";
import BusinessCard from "@/components/business-card";
import { ImagesBadge } from "@/components/ui/images-badge";

type ChatSession = {
  id: string;
  title: string;
  messages: UIMessage[];
};

/* ============ SVG Icons ============ */

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="5.5" r="1" fill="currentColor" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
      <circle cx="10" cy="14.5" r="1" fill="currentColor" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 4.5H15M3 9H15M3 13.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 5V9.5L11.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
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
  "介绍一下你的工作经历",
  "斑马百科全生态产品是如何设计的",
  "你搭建的设计体系如何落地到多端产品",
];

/* ============ Components ============ */

function Sidebar({ sessions, currentSessionId, onNewChat, onSelectSession, activeView, onNavigate, isLoading }: { sessions: ChatSession[]; currentSessionId: string | null; onNewChat: () => void; onSelectSession: (id: string) => void; activeView: string; onNavigate: (view: string) => void; isLoading: boolean }) {
  const router = useRouter();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-text">梁松泉</span>
      </div>

      <motion.div
        className="new-chat-btn"
        onClick={onNewChat}
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
          onClick={() => onNavigate('resume')}
        >
          <DotsIcon />
          <span>个人简历</span>
        </div>
        <div
          className={"sidebar-nav-item" + (activeView === 'portfolio' ? ' active' : '')}
          title="作品集"
          onClick={() => onNavigate('portfolio')}
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
            onClick={() => onSelectSession(session.id)}
          >
            <span className="history-item-text">{session.title}</span>
          </div>
        ))}
      </div>

      <BusinessCard />
    </aside>
  );
}

function MainContent({ messages, isLoading, onSend, error }: { messages: UIMessage[]; isLoading: boolean; onSend: (text: string) => void; error?: Error }) {
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

  return (
    <div className="main-content h-full flex flex-col"
      style={{ background: "var(--dbx-bg-base)" }}
    >
      <Header />
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
                        <div className="markdown-body">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {getMessageText(msg)}
                          </ReactMarkdown>
                        </div>
                      </>
                    ) : (
                      getMessageText(msg)
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="message message-assistant"
                >
                  <div className="message-content">
                    <div className="flex items-center gap-2.5">
                      {/* Typing bars */}
                      <div className="flex items-center gap-[3px] h-5">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-[3px] rounded-full"
                            style={{ background: "var(--dbx-text-tertiary)" }}
                            animate={{
                              height: ["6px", "16px", "6px"],
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.15,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="text-xs"
                        style={{ color: "var(--dbx-text-tertiary)" }}
                      >
                        正在思考...
                      </span>
                    </div>
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

function Header() {
  return (
    <motion.div
      className="main-header"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="header-left">
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
              <span className="input-guide-chip" onClick={() => handleGuideClick("介绍一下你的工作经历")}>介绍一下你的工作经历</span>
              <span className="input-guide-chip" onClick={() => handleGuideClick("展示项目案例")}>展示项目案例</span>
              <span className="input-guide-chip" onClick={() => handleGuideClick("你的设计理念")}>你的设计理念</span>
            </div>
            )}
          </div>

          {/* Toolbar */}
          <div className="input-toolbar">
            <div className="toolbar-right">
              <button className={"send-btn" + (animating ? " disabled" : "")} title="发送" onClick={vanishAndSubmit} disabled={animating}>
                <svg width="20" height="20" viewBox="-35 0 1063 1024" fill="currentColor" style={{ transform: "translate(-2px, 0.5px)" }}>
                  <path d="M313.615229 601.21217l-1.969202-1.772282 344.059103-287.424833-457.879022 184.671834L12.996738 329.777264a39.384055 39.384055 0 0 1 16.226231-67.267966l978.693764-261.116284a39.384055 39.384055 0 0 1 47.969779 48.836228l-260.722443 909.29906a39.384055 39.384055 0 0 1-64.274778 18.392354l-253.160705-228.585055-164.113357 164.073973v-312.197404z" />
                </svg>
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
  const currentSessionIdRef = useRef<string | null>(null);

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

  function createSession(firstMsg: string): string {
    const id = Date.now().toString();
    const title = firstMsg.length > 22 ? firstMsg.slice(0, 22) + '...' : firstMsg;
    setSessions((prev) => [...prev, { id, title, messages: [] }]);
    setCurrentSessionId(id);
    return id;
  }

  function onSend(text: string) {
    if (!text.trim() || isLoading) return;

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
            setCurrentSessionId(null);
            setMessages([]);
          }
        }}
        isLoading={isLoading}
      />
      {view === 'chat' ? (
        <MainContent messages={messages} isLoading={isLoading} onSend={onSend} error={error} />
      ) : view === 'portfolio' ? (
        <div className="flex-1 flex flex-col overflow-hidden portfolio-content min-h-0" style={{ background: "var(--dbx-bg-base)" }}>
          <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-6 lg:px-8 pb-8">
            <div style={{ paddingTop: '32px' }}>
              <PortfolioGrid />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0" style={{ background: "var(--dbx-bg-base)" }}>
          <div className="flex-1 overflow-y-auto min-h-0">
            <ResumeContent />
          </div>
        </div>
      )}
    </div>
  );
}
