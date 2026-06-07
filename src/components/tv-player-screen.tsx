"use client";

import { useState, useRef } from "react";
import { MIAODUO_CDN } from "@/data/constants";
import BackButton from "@/components/tv-back-button";

export default function PlayerScreen({ onBack, category }: { onBack: () => void; category: { label: string; image: string } }) {
  const [playing, setPlaying] = useState(true);
  const [trialEnded, setTrialEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);
    if (t >= 15 && !trialEnded) {
      setTrialEnded(true);
      videoRef.current.pause();
      setPlaying(false);
    }
  };
  const onLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const seek = (e: React.MouseEvent) => {
    if (!videoRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * (videoRef.current.duration || 1);
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ background: "#000000" }}>
      <BackButton onClick={onBack} />

      <div
        className="flex-shrink-0"
        style={{
          width: 1920,
          height: 1080,
          transform: "scale(0.6)",
          transformOrigin: "center center",
          position: "relative",
          fontFamily: "'PingFang SC', sans-serif",
        }}
      >
        <div style={{ background: "#000000", width: 1920, height: 1080, overflow: "hidden", display: "flex", flexDirection: "column" as const, alignItems: "stretch" }}>
          <div style={{ flex: 1, background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" as const }}>
            <video
              ref={videoRef}
              src="https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/video-clip.mp4"
              autoPlay
              loop
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={onLoadedMetadata}
            />

            {trialEnded && (
              <div style={{ position: "absolute" as const, inset: 0, background: "#000000", zIndex: 40 }}>
                <img src="https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/trial-end-overlay.png?v=2" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            {!trialEnded && (
              <div style={{ position: "absolute" as const, bottom: 0, left: 0, right: 0, height: 220, background: "linear-gradient(0deg, #000000 0%, rgba(0,0,0,0) 100%)", display: "flex", flexDirection: "row" as const, alignItems: "center", gap: 40, paddingRight: 68 }}>
                <div
                  onClick={togglePlay}
                  style={{ width: 32, height: 38, marginLeft: 68, cursor: "pointer", flexShrink: 0 }}
                >
                  <div style={{
                    width: 32, height: 38,
                    backgroundImage: `url("${MIAODUO_CDN}/${playing ? "19e7203504e2f70-e162b9f8-bb49-41e9-ab16-a80eb9503756" : "19e72abfbb6e59f-7a0cad22-e96c-419f-b6a1-5e66d689c43a"}.svg")`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center"
                  }} />
                </div>
                <div
                  ref={progressRef}
                  onClick={seek}
                  style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.10)", borderRadius: 4, cursor: "pointer", position: "relative" as const }}
                >
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: "#FFFFFF",
                    borderRadius: 4,
                    transition: "width 0.1s linear",
                  }} />
                </div>
                <div style={{ color: "#FFFFFF", fontSize: 26, lineHeight: "46px", flexShrink: 0, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" as const }}>
                  {fmt(currentTime)}/{fmt(512)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
