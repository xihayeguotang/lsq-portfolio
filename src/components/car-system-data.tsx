"use client";

export default function CarSystemData() {
  return (
    <section className="w-full pt-16 sm:pt-24 pb-14">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full">
        <h2
          className="text-center text-lg font-semibold mb-3"
          style={{ color: "var(--dbx-text-primary)" }}
        >
          数据
        </h2>

        <div
          className="w-full rounded-xl p-6"
          style={{
            background: "var(--dbx-bg-float)",
            border: "1px solid var(--dbx-border-light)",
          }}
        >
          {/* 标题 */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-3 mb-6">
            <h3 className="text-base font-semibold" style={{ color: "var(--dbx-text-primary)" }}>
              理想车机
            </h3>
            <span className="text-xs" style={{ color: "var(--dbx-text-tertiary)" }}>
              统计周期：5.27~6.15
            </span>
          </div>

          {/* 指标卡片 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl p-4 text-center flex flex-col items-center" style={{ background: "var(--dbx-bg-base)", border: "1px solid var(--dbx-border-light)" }}>
              <div className="text-xs mb-0.5" style={{ color: "var(--dbx-text-tertiary)" }}>首次激活设备数</div>
              <div className="text-[10px] mb-2 leading-tight" style={{ color: "var(--dbx-text-tertiary)", opacity: 0.6 }}>车机设备维度统计，用户打开百科 APP 即算激活</div>
              <div
                className="text-lg sm:text-xl font-bold mb-1"
                style={{
                  background: "linear-gradient(135deg, #2A9D8F, #45c4a0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                51,845
              </div>
            </div>
            <div className="rounded-xl p-4 text-center flex flex-col items-center" style={{ background: "var(--dbx-bg-base)", border: "1px solid var(--dbx-border-light)" }}>
              <div className="text-xs mb-0.5" style={{ color: "var(--dbx-text-tertiary)" }}>首次登陆新用户数</div>
              <div className="text-[10px] mb-2 leading-tight" style={{ color: "var(--dbx-text-tertiary)", opacity: 0.6 }}>取到手机号后生成真实 UID 的用户</div>
              <div
                className="text-lg sm:text-xl font-bold mb-1"
                style={{
                  background: "linear-gradient(135deg, #2A9D8F, #45c4a0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                16,052
              </div>
            </div>
            <div className="rounded-xl p-4 text-center flex flex-col items-center" style={{ background: "var(--dbx-bg-base)", border: "1px solid var(--dbx-border-light)" }}>
              <div className="text-xs mb-0.5" style={{ color: "var(--dbx-text-tertiary)" }}>首次付费用户数</div>
              <div className="text-[10px] mb-2 leading-tight" style={{ color: "var(--dbx-text-tertiary)", opacity: 0.6 }}>首次激活后在统计周期内购买正价商品的用户</div>
              <div
                className="text-lg sm:text-xl font-bold mb-1"
                style={{
                  background: "linear-gradient(135deg, #2A9D8F, #45c4a0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                404
              </div>
            </div>
            <div className="rounded-xl p-4 text-center flex flex-col items-center" style={{ background: "var(--dbx-bg-base)", border: "1px solid var(--dbx-border-light)" }}>
              <div className="text-xs mb-0.5" style={{ color: "var(--dbx-text-tertiary)" }}>首次登陆转化率</div>
              <div className="text-[10px] mb-2 leading-tight" style={{ color: "var(--dbx-text-tertiary)", opacity: 0.6 }}>付费用户数 / 首次登陆新用户数</div>
              <div
                className="text-lg sm:text-xl font-bold mb-1"
                style={{
                  background: "linear-gradient(135deg, #2A9D8F, #45c4a0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                2.40%
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
