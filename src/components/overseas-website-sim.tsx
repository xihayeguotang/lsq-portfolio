"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "motion/react";

const navLinks: { label: string; active?: boolean; dropdown?: string[] }[] = [
  { label: "Home", active: true },
  {
    label: "Course",
    dropdown: [
      "Human Body",
      "Dinosaurs",
      "Rocks and Minerals",
      "Space",
      "Weather and Climate",
    ],
  },
  { label: "Blog" },
  { label: "Pages" },
  { label: "FAQ" },
];

export default function OverseasWebsiteSim() {
  const [openDropdown, setOpenDropdown] = useState(false);

  // ======== 滚动触发动画 ========
  const animRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-anim"));
            if (!isNaN(idx)) {
              setVisible((prev) => new Set(prev).add(idx));
            }
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    for (const el of animRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const setAnimRef = useCallback((idx: number) => (el: HTMLDivElement | null) => {
    animRefs.current[idx] = el;
  }, []);

  return (
    <div className="w-full min-h-full bg-white flex flex-col" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* ======== Navbar ======== */}
      <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-xl">
        <div className="max-w-[1000px] mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Image
                src="/cos/logo.svg"
                alt="Cretapedia"
                width={164}
                height={40}
                className="w-auto h-10"
              />
            </div>

            {/* Nav Links */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.dropdown && setOpenDropdown(true)}
                  onMouseLeave={() => setOpenDropdown(false)}
                >
                  <button
                    className={`nav-link relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      link.active
                        ? "text-[#00CC66] font-bold active"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                    {link.dropdown && (
                      <svg
                        className="inline-block ml-1 w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Dropdown */}
                  {link.dropdown && openDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      {link.dropdown.map((item) => (
                        <button
                          key={item}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-[#00CC66] hover:bg-green-50 transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA */}
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00CC66] text-white text-sm font-semibold rounded-full shadow-lg hero-cta">
              <motion.span
                className="inline-block"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                Download Now
              </motion.span>
            </button>
          </div>
        </div>
      </header>

      {/* ======== Hero Section ======== */}
      <section
        className="w-full relative overflow-hidden"
        style={{ height: "500px", background: "linear-gradient(90deg, #35A4FF, #57B2F6)" }}
      >
        {/* 图片绝对定位叠加在右侧，底部对齐 */}
        <div className="absolute bottom-0 right-0 anim-float" style={{ width: "800px", height: "450px" }}>
          <Image
            src="/cos/projects/overseas-website/hero-element.png"
            alt="Hero"
            fill
            className="object-contain object-right"
            priority
          />
        </div>

        <div className="max-w-[1000px] mx-auto px-8 h-full flex items-center relative z-10">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-snug mb-4"
              style={{ animation: "fade-in-up 0.7s ease-out forwards" }}>
              Cretapedia<br />
              <span className="text-white">— Best Science Learning App</span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-lg mb-8 leading-relaxed"
              style={{ animation: "fade-in-up 0.7s ease-out 0.2s forwards", opacity: 0 }}>
              Interactive learning through<br />
              3D animation and quizzes!
            </p>
            <div
              style={{ animation: "fade-in-up 0.7s ease-out 0.35s forwards", opacity: 0 }}
            >
              <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#00CC66] font-bold rounded-full shadow-lg text-base hero-cta">
                <motion.div
                  className="inline-flex items-center gap-2"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <span>Start it for Free</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======== Awards / 奖项 logo 模块 ======== */}
      <section className="bg-white py-8" data-anim="0" ref={setAnimRef(0)}>
        <div className="max-w-[1000px] mx-auto px-8">
          <div className={`flex items-center justify-between gap-6 ${visible.has(0) ? "in-view" : ""} anim-stagger`}>
            <div className="flex-1 flex items-center justify-center anim-fade-up">
              <Image
                src="/cos/projects/overseas-website/award-1.png"
                alt="Award 1"
                width={200}
                height={60}
                className="object-contain"
              />
            </div>
            <div className="flex-1 flex items-center justify-center anim-fade-up">
              <Image
                src="/cos/projects/overseas-website/award-2.png"
                alt="Award 2"
                width={200}
                height={60}
                className="object-contain"
              />
            </div>
            <div className="flex-1 flex items-center justify-center anim-fade-up">
              <Image
                src="/cos/projects/overseas-website/award-3.png"
                alt="Award 3"
                width={200}
                height={60}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======== 功能模块 1：3D 视觉教学 ======== */}
      <section className="bg-white py-[128px]" data-anim="1" ref={setAnimRef(1)}>
        <div className="max-w-[1000px] mx-auto px-8">
          {/* 居中标题 */}
          <h2 className={`text-2xl md:text-3xl lg:text-[40px] font-bold text-center mb-20 leading-tight ${visible.has(1) ? "in-view" : ""} anim-fade-up`} style={{ color: "#00CC66" }}>
            Science comes alive with 3D visuals
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* 左侧文本 */}
            <div className={`flex-1 ${visible.has(1) ? "in-view" : ""} anim-fade-left`}>
              <p className="text-xl md:text-2xl lg:text-[40px] text-gray-700 leading-snug max-w-md font-medium">
                Fun animation boosts learning efficiency<br />
                10 minutes a day, quality screen time
              </p>
            </div>

            {/* 右侧图片 — 圆角卡片 */}
            <div className={`flex-1 ${visible.has(1) ? "in-view" : ""} anim-fade-right`}>
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/cos/projects/overseas-website/feature-3d.png"
                  alt="3D 心脏解剖教学"
                  width={640}
                  height={480}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== 功能模块 2：互动测验 ======== */}
      <section className="py-[128px]" style={{ background: "#FFFDE1" }} data-anim="2" ref={setAnimRef(2)}>
        <div className="max-w-[1000px] mx-auto px-8">
          <h2 className={`text-2xl md:text-3xl lg:text-[40px] font-bold text-center mb-20 leading-tight ${visible.has(2) ? "in-view" : ""} anim-fade-up`} style={{ color: "#00CC66" }}>
            Real-time practice with immediate feedback
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* 左侧图片 */}
            <div className={`flex-1 ${visible.has(2) ? "in-view" : ""} anim-fade-left`}>
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/cos/projects/overseas-website/feature-quiz.png"
                  alt="互动测验"
                  width={640}
                  height={480}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* 右侧文本 */}
            <div className={`flex-1 ${visible.has(2) ? "in-view" : ""} anim-fade-right`}>
              <p className="text-xl md:text-2xl lg:text-[40px] text-gray-700 leading-snug max-w-md font-medium">
                Interactive quizzes help children lock in learning results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======== 功能模块 3：Empower explorers ======== */}
      <section className="bg-white py-[128px]" data-anim="3" ref={setAnimRef(3)}>
        <div className="max-w-[1000px] mx-auto px-8">
          <h2 className={`text-2xl md:text-3xl lg:text-[40px] font-bold text-center mb-20 leading-tight ${visible.has(3) ? "in-view" : ""} anim-fade-up`} style={{ color: "#00CC66" }}>
            Empower and inspire young explorers
          </h2>

          <div className={`w-full ${visible.has(3) ? "in-view" : ""} anim-fade-up`}>
            <div className="rounded-2xl overflow-hidden bg-white w-full">
              <Image
                src="/cos/projects/overseas-website/feature-explorers.png"
                alt="Empower explorers"
                width={1170}
                height={700}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======== 功能模块 4：3D catalog ======== */}
      <section className="py-[128px]" style={{ background: "#FFF3E2" }} data-anim="4" ref={setAnimRef(4)}>
        <div className="max-w-[1000px] mx-auto px-8">
          <h2 className={`text-2xl md:text-3xl lg:text-[40px] font-bold text-center mb-20 leading-tight ${visible.has(4) ? "in-view" : ""} anim-fade-up`} style={{ color: "#00CC66" }}>
            3D catalog for deeper exploration
          </h2>

          <div className={`w-full ${visible.has(4) ? "in-view" : ""} anim-fade-up`}>
            <div className="rounded-2xl overflow-hidden w-full">
              <Image
                src="/cos/projects/overseas-website/feature-catalog.png"
                alt="3D catalog"
                width={1170}
                height={700}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-row-1 { animation: scroll-left 45s linear infinite; }
        .marquee-row-2 { animation: scroll-right 50s linear infinite; }
        .marquee-row-3 { animation: scroll-left 40s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-left {
          0% { opacity: 0; transform: translateX(-40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-right {
          0% { opacity: 0; transform: translateX(40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .anim-fade-up { opacity: 0; }
        .anim-fade-up.in-view { animation: fade-in-up 0.7s ease-out forwards; }
        .anim-fade-left { opacity: 0; }
        .anim-fade-left.in-view { animation: fade-in-left 0.7s ease-out forwards; }
        .anim-fade-right { opacity: 0; }
        .anim-fade-right.in-view { animation: fade-in-right 0.7s ease-out forwards; }
        .anim-float { animation: float 3s ease-in-out infinite; }

        .anim-stagger > *:nth-child(1) { animation-delay: 0s; }
        .anim-stagger > *:nth-child(2) { animation-delay: 0.15s; }
        .anim-stagger > *:nth-child(3) { animation-delay: 0.3s; }

        .nav-link.active {
          font-size: 1.05rem;
          font-weight: 800;
        }

        .hero-cta {
          transition: transform 0.3s ease;
        }
        .hero-cta:hover {
          transform: scale(1.06);
        }
      `}</style>

      {/* ======== 课程滚动模块 ======== */}
      <section className="bg-white py-[128px]" data-anim="5" ref={setAnimRef(5)}>
        <div className="mb-20 px-8 max-w-[1000px] mx-auto">
          <h2 className={`text-2xl md:text-3xl lg:text-[40px] font-bold text-center mb-4 leading-tight ${visible.has(5) ? "in-view" : ""} anim-fade-up`} style={{ color: "#00CC66" }}>
            Your all-in-one science education solution
          </h2>
          <p className={`text-lg text-gray-500 text-center ${visible.has(5) ? "in-view" : ""} anim-fade-up`}>
            27+ Courses, monthly updates
          </p>
        </div>

        {/* 三行滚动 */}
        {[0, 1, 2].map((rowIdx) => {
          const imagesPerRow = rowIdx < 2 ? 7 : 6;
          const startIdx = rowIdx * 7;
          const rowImages = Array.from({ length: imagesPerRow }, (_, i) => {
            const idx = startIdx + i;
            return idx === 0 ? "图片.jpg" : `图片-${idx}.jpg`;
          });
          // 复制一份用于无缝滚动
          const doubled = [...rowImages, ...rowImages];

          return (
            <div key={rowIdx} className="overflow-hidden mb-4 last:mb-0">
              <div className={`flex gap-3 marquee-row-${rowIdx + 1} marquee-track`}>
                {doubled.map((src, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 rounded-xl overflow-hidden"
                  >
                    <Image
                      src={`/cos/projects/overseas-website/courses/${src}`}
                      alt={`Course ${i + 1}`}
                      width={160}
                      height={160}
                      className="w-auto h-[160px] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ======== 用户评价模块 ======== */}
      <section className="py-[128px]" style={{ background: "#F5F5F5" }} data-anim="6" ref={setAnimRef(6)}>
        <div className="mb-20 px-8 max-w-[1000px] mx-auto">
          <h2 className={`text-2xl md:text-3xl lg:text-[40px] font-bold text-center leading-tight ${visible.has(6) ? "in-view" : ""} anim-fade-up`} style={{ color: "#00CC66" }}>
            Parents Love Us...
          </h2>
        </div>

        <style>{`
          @keyframes scroll-left-reviews {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .reviews-track { animation: scroll-left-reviews 60s linear infinite; }
          .reviews-track:hover { animation-play-state: paused; }
        `}</style>

        <div className="overflow-hidden">
          <div className="flex gap-5 reviews-track">
            {/* 重复两次内容实现无缝滚动 */}
            {[0, 1].map((dup) => (
              <div key={dup} className="flex gap-5">
                {[
                  { type: "review", name: "Sarah M.", avatar: "SM", rating: 5, date: "2026-03-15", text: "My daughter absolutely loves the dinosaur module! She spends hours exploring fossils and learning about different species. The 3D animations make it feel like a real museum tour, and I love that she's actually learning while having fun. Best educational app we've ever tried!" },
                  { type: "scene", src: "review-scene-1" },
                  { type: "review", name: "James K.", avatar: "JK", rating: 5, date: "2026-03-10", text: "Finally, an app that makes screen time truly educational. The 3D visuals are incredible — my son was completely mesmerized by the space module. He's been telling everyone about the planets and even taught his little sister about the solar system. Highly recommend for curious kids!" },
                  { type: "review", name: "Emma L.", avatar: "EL", rating: 4, date: "2026-03-05", text: "My son's science grades have improved significantly since we started using Cretapedia. The interactive quizzes really help reinforce what he learns. I especially appreciate that each topic has different difficulty levels, so he can progress at his own pace. Would love to see more advanced content added soon." },
                  { type: "scene", src: "review-scene-2" },
                  { type: "review", name: "David R.", avatar: "DR", rating: 5, date: "2026-02-28", text: "The interactive quizzes are absolutely brilliant! My child stays engaged for hours without me having to remind her to focus. The immediate feedback feature helps her understand where she went wrong, and she loves trying to beat her own scores. This app has transformed our homeschooling experience." },
                  { type: "review", name: "Lisa T.", avatar: "LT", rating: 5, date: "2026-02-20", text: "Worth every penny! The quality of the content is outstanding — every module is beautifully designed with rich visuals and age-appropriate explanations. My daughter went from saying 'science is boring' to asking me to buy her extra books on geology. The rocks and minerals section sparked a genuine passion!" },
                  { type: "scene", src: "review-scene-3" },
                  { type: "review", name: "Michael P.", avatar: "MP", rating: 4, date: "2026-02-15", text: "Both my kids (ages 6 and 9) absolutely enjoy Cretapedia, which is rare because they usually disagree on everything! The different difficulty levels mean each of them can learn at their own pace. The weather and climate module is their current favorite — they've been tracking our local weather every day now." },
                ].map((item, i) =>
                  item.type === "review" ? (
                    <div
                      key={`${dup}-${i}`}
                      className="flex-shrink-0 w-[340px] bg-white rounded-2xl p-6 mx-2.5"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#00CC66] flex items-center justify-center text-white text-sm font-bold">
                          {(item as any).avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{(item as any).name}</p>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }, (_, s) => (
                              <svg key={s} className="w-3.5 h-3.5" fill={s < (item as any).rating ? "#FFB800" : "#E0E0E0"} viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-gray-400">{(item as any).date}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{(item as any).text}</p>
                    </div>
                  ) : (
                    <div key={`${dup}-${i}`} className="flex-shrink-0 w-[280px] rounded-2xl overflow-hidden mx-2.5">
                      <Image
                        src={`/cos/projects/overseas-website/${(item as any).src}.jpg`}
                        alt="Scene"
                        width={280}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== Footer ======== */}
      <footer className="mt-auto w-full bg-[#00CC66] flex justify-center py-20">
        <div className="max-w-[1000px] w-full">
          <Image
            src="/cos/projects/overseas-website/footer-bg.jpg"
            alt="Footer"
            width={1000}
            height={394}
            className="w-full h-auto object-contain"
          />
        </div>
      </footer>
    </div>
  );
}
