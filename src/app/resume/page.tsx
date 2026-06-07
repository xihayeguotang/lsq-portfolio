"use client";

import { useRouter } from "next/navigation";
import ResumeContent from "@/components/resume-content";

export default function ResumePage() {
  const router = useRouter();

  return (
    <div className="w-full h-full overflow-y-auto" style={{ background: "var(--dbx-bg-base)" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 sm:px-8" style={{ height: "var(--dbx-header-height)", background: "var(--dbx-bg-base)", borderBottom: "1px solid var(--dbx-border-light)", flexShrink: 0 }}>
        <span className="text-lg font-medium" style={{ color: "var(--dbx-text-primary)" }}>个人简历</span>
        <button
          onClick={() => router.push("/chat")}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer"
          style={{
            color: "var(--dbx-text-primary)",
            background: "var(--dbx-fill-trans-10)",
            border: "1px solid var(--dbx-border-light)",
          }}
        >
          AI 助手
        </button>
      </div>

      <ResumeContent />
    </div>
  );
}
