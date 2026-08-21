// 临时预览页：用于预览从 Figma「国内组件」文件拉取的组件效果
import DomesticCover from "@/components/domestic-cover";

export default function PreviewPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-8 p-8 bg-neutral-100 dark:bg-neutral-950">
      <h1 className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
        Figma「国内组件」组件预览
      </h1>
      <DomesticCover />
    </main>
  );
}
