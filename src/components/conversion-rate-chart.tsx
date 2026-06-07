"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const labels = [
  "Mar 17", "Mar 24", "Mar 31", "Apr 7", "Apr 14",
  "Apr 21", "Apr 28", "May 5", "May 12", "May 19",
  "May 26", "Jun 2", "Jun 9", "Jun 16",
];

const dataValues = [
  45, 42, 40, 32, 28,
  35, 42, 44, 49, 42,
  38, 28, 22, 36,
];

const average = (
  dataValues.reduce((a, b) => a + b, 0) / dataValues.length
).toFixed(1);

export default function ConversionRateChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Detect when chart scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Create chart with animation only when in view
  useEffect(() => {
    if (!isInView) return;
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, "rgba(33, 150, 243, 0.15)");
    gradient.addColorStop(1, "rgba(33, 150, 243, 0)");

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Conversion Rate",
            data: dataValues,
            borderColor: "#2196F3",
            backgroundColor: gradient,
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          easing: "easeOutQuart",
          delay: (ctx) => {
            if (ctx.type === "data" && ctx.dataIndex !== undefined) {
              return ctx.dataIndex * 140;
            }
            return 0;
          },
        },
        scales: {
          y: {
            min: 0,
            max: 80,
            ticks: {
              stepSize: 20,
              callback: (value) => value + "%",
              font: { size: 13, family: "'PingFang SC', sans-serif" },
              color: "#888",
            },
            grid: {
              color: "rgba(0,0,0,0.06)",
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 12, family: "'PingFang SC', sans-serif" },
              color: "#888",
            },
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className="rounded-xl p-5 sm:p-6"
      style={{
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <div className="flex items-center gap-1.5">
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#888",
                letterSpacing: "0.05em",
              }}
            >
              CONVERSION RATE
            </span>
            <span
              className="inline-flex items-center justify-center flex-shrink-0"
              style={{
                width: 15,
                height: 15,
                borderRadius: "50%",
                border: "1px solid #bbb",
                color: "#bbb",
                fontSize: 10,
                lineHeight: "15px",
                textAlign: "center",
              }}
            >
              ?
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.1,
              }}
            >
              {average}%
            </span>
            <span
              style={{
                fontSize: 15,
                color: "#888",
                fontWeight: 400,
              }}
            >
              Weekly Average
            </span>
          </div>
        </div>
        {/* Top right controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span
            style={{
              color: "#2196F3",
              fontSize: 14,
              cursor: "default",
            }}
          >
            Weeks ⌄
          </span>
          <span
            className="inline-flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#f0f0f0",
              cursor: "default",
              fontSize: 16,
              color: "#666",
              lineHeight: "28px",
              textAlign: "center",
            }}
          >
            ⋯
          </span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 280, marginTop: 8 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
