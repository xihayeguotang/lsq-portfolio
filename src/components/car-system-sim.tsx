"use client";

import { useState } from "react";
import { Compare } from "@/components/ui/compare";
import CarSystemMarquee from "@/components/car-system-marquee";

export default function CarSystemSim() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  return (
    <div className="w-full flex flex-col items-center">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full">
        {/* ===== 模块 1：中控与副驾屏幕框架布局 ===== */}
        <div className="py-16 sm:py-24">
          <div className="text-center mb-10">
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--dbx-text-primary)" }}
            >
              Center And Passenger Screen Frame Layout
            </h2>
            <p style={{ color: "var(--dbx-text-secondary)" }} className="text-sm">
              中控与副驾屏幕框架布局
            </p>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-10">
            {/* 中控屏 */}
            <div
              className="flex-1 min-w-0 rounded-lg overflow-hidden flex flex-col"
              style={{
                background: "#102A26",
                border: "1px dashed #2A9D8F",
              }}
            >
              <div className="flex-1 flex min-h-[280px]">
                <div
                  className="w-[35%] flex flex-col items-center justify-center p-3"
                  style={{ borderRight: "1px dashed #2A9D8F" }}
                >
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-medium" style={{ color: "#2A9D8F" }}>
                      Autopilot Area
                    </div>
                    <div className="text-xs sm:text-sm mt-0.5" style={{ color: "#2A9D8F", opacity: 0.8 }}>
                      自动驾驶区域
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-3">
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-medium" style={{ color: "#2A9D8F" }}>
                      Application Area
                    </div>
                    <div className="text-xs sm:text-sm mt-0.5" style={{ color: "#2A9D8F", opacity: 0.8 }}>
                      应用区域
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="h-10 flex items-center justify-center"
                style={{ borderTop: "1px dashed #2A9D8F" }}
              >
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-medium" style={{ color: "#2A9D8F" }}>
                    Shortcut Bottom Bar Area
                  </div>
                  <div className="text-[10px] sm:text-xs" style={{ color: "#2A9D8F", opacity: 0.8 }}>
                    快捷底栏区域
                  </div>
                </div>
              </div>
            </div>

            {/* 副驾屏 */}
            <div
              className="flex-1 min-w-0 rounded-lg overflow-hidden flex flex-col"
              style={{
                background: "#102A26",
                border: "1px dashed #2A9D8F",
              }}
            >
              <div className="flex-1 flex flex-col items-center justify-center p-3 min-h-[280px]">
                <div className="text-center">
                  <div className="text-base sm:text-lg font-medium" style={{ color: "#2A9D8F" }}>
                    Content Stream Area
                  </div>
                  <div className="text-xs sm:text-sm mt-0.5" style={{ color: "#2A9D8F", opacity: 0.8 }}>
                    内容流区域
                  </div>
                </div>
              </div>
              <div
                className="h-10 flex items-center justify-center"
                style={{ borderTop: "1px dashed #2A9D8F" }}
              >
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-medium" style={{ color: "#2A9D8F" }}>
                    Shortcut Bottom Bar Area
                  </div>
                  <div className="text-[10px] sm:text-xs" style={{ color: "#2A9D8F", opacity: 0.8 }}>
                    快捷底栏区域
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== 模块 2：L 系列驾舱屏幕布局 ===== */}
        <div className="py-16 sm:py-24">
          <div className="text-center mb-10">
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--dbx-text-primary)" }}
            >
              L-Series Cockpit Screen Layout
            </h2>
            <p style={{ color: "var(--dbx-text-secondary)" }} className="text-sm">
              L 系列驾舱屏幕布局
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 sm:gap-10 w-full">
            {/* 顶行：驾驶员区域（含中控屏）+ 副驾区域 */}
            <div className="w-full flex flex-col sm:flex-row items-stretch gap-6">
              {/* 驾驶员区域（左右布局：左边抬头显示 + 右边中控） */}
              <div
                className="rounded-lg p-5 flex flex-col relative flex-[1.6]"
                style={{ border: "1px dashed #666", minHeight: 320 }}
              >
                <div className="flex flex-row items-stretch gap-4 h-full min-h-[280px]">
                  {/* 左侧：抬头显示 + 驾驶交互屏 */}
                  <div className="flex flex-col items-center justify-center gap-4 flex-1">
                    <div
                      className="flex flex-col items-center justify-center rounded-lg px-4"
                      style={{
                        background: "#102A26",
                        border: "1px solid #2A9D8F",
                        width: 180,
                        height: 70,
                      }}
                    >
                      <div className="text-base sm:text-lg font-medium" style={{ color: "#2A9D8F" }}>HUD</div>
                      <div className="text-xs sm:text-sm" style={{ color: "#2A9D8F", opacity: 0.8 }}>抬头显示</div>
                    </div>
                    <div
                      className="rounded-lg"
                      style={{
                        background: "#102A26",
                        border: "1px solid #2A9D8F",
                        width: 90,
                        height: 18,
                      }}
                    />
                    <div className="text-center">
                      <div className="text-sm font-medium" style={{ color: "#2A9D8F" }}>Driver Interactive Screen</div>
                      <div className="text-xs" style={{ color: "#2A9D8F", opacity: 0.8 }}>驾驶交互屏</div>
                    </div>
                  </div>

                  {/* 右侧：中控屏 */}
                  <div className="flex items-center justify-center flex-1">
                    <div
                      className="flex flex-col items-center justify-center rounded-lg px-4 w-full max-w-[260px]"
                      style={{
                        background: "#102A26",
                        border: "1px solid #2A9D8F",
                        minHeight: 140,
                      }}
                    >
                      <div className="text-base sm:text-lg font-medium" style={{ color: "#2A9D8F" }}>Center Screen</div>
                      <div className="text-xs sm:text-sm" style={{ color: "#2A9D8F", opacity: 0.8 }}>中控屏</div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-3 text-xs" style={{ color: "#666" }}>
                  <div>Driver Area</div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>驾驶员区域</div>
                </div>
              </div>

              {/* 副驾区域 */}
              <div
                className="rounded-lg p-5 flex items-center justify-center relative flex-1"
                style={{ border: "1px dashed #666" }}
              >
                <div
                  className="flex flex-col items-center justify-center rounded-lg px-4 w-full max-w-[260px]"
                  style={{
                    background: "#102A26",
                    border: "1px solid #2A9D8F",
                    minHeight: 140,
                  }}
                >
                  <div className="text-base sm:text-lg font-medium" style={{ color: "#2A9D8F" }}>Passenger Screen</div>
                  <div className="text-xs sm:text-sm" style={{ color: "#2A9D8F", opacity: 0.8 }}>副驾屏</div>
                </div>
                <div className="absolute top-2 right-3 text-xs" style={{ color: "#666" }}>
                  <div>Passenger Area</div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>副驾区域</div>
                </div>
              </div>
            </div>

            {/* 后排区域 */}
            <div
              className="rounded-lg p-5 flex flex-col items-center gap-3 relative w-full"
              style={{ border: "1px dashed #666" }}
            >
              <div
                className="flex flex-col items-center justify-center rounded-lg px-4 w-full max-w-[260px]"
                style={{
                  background: "#102A26",
                  border: "1px solid #2A9D8F",
                  minHeight: 140,
                }}
              >
                <div className="text-base sm:text-lg font-medium" style={{ color: "#2A9D8F" }}>Rear Screen</div>
                <div className="text-xs sm:text-sm" style={{ color: "#2A9D8F", opacity: 0.8 }}>后排屏</div>
              </div>
              <div className="text-center text-xs" style={{ color: "#666" }}>
                <div>Rear Area</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>后排区域</div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== 模块 3：车机首页效果展示 ===== */}
        <div className="py-16 sm:py-24">
          <div className="text-center mb-10">
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--dbx-text-primary)" }}
            >
              Home Screen Preview
            </h2>
            <p style={{ color: "var(--dbx-text-secondary)" }} className="text-sm">
              车机首页效果展示 — 拖拽滑块对比深色/浅色模式
            </p>
          </div>

          <div className="w-full flex flex-col items-center gap-4">
            {/* 半屏/全屏切换 */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFullScreen(false)}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${!isFullScreen ? "bg-[#2A9D8F] text-white" : "text-[#666] hover:text-white"}`}
                style={{ background: !isFullScreen ? "#2A9D8F" : "var(--dbx-border-light)", color: !isFullScreen ? "#fff" : "var(--dbx-text-tertiary)" }}
              >
                半屏
              </button>
              <button
                onClick={() => setIsFullScreen(true)}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${isFullScreen ? "bg-[#2A9D8F] text-white" : "text-[#666] hover:text-white"}`}
                style={{ background: isFullScreen ? "#2A9D8F" : "var(--dbx-border-light)", color: isFullScreen ? "#fff" : "var(--dbx-text-tertiary)" }}
              >
                全屏
              </button>
            </div>

            <div className="w-full">
              <Compare
                firstImage={isFullScreen ? "/cos/projects/car-system/home-full-dark.jpg" : "/cos/projects/car-system/home-half-dark.jpg"}
                secondImage={isFullScreen ? "/cos/projects/car-system/home-full-light.jpg" : "/cos/projects/car-system/home-light.jpg"}
                className="w-full h-auto aspect-[16/9] rounded-lg"
                slideMode="drag"
                initialSliderPercentage={50}
              />
            </div>
          </div>

          {/* 跑马灯：多场景滚动展示 */}
          <div className="w-full mt-14">
            <h3
              className="text-center text-sm font-medium mb-6"
              style={{ color: "var(--dbx-text-secondary)" }}
            >
              效果图
            </h3>
            <CarSystemMarquee compact />
          </div>
        </div>
      </div>
    </div>
  );
}
