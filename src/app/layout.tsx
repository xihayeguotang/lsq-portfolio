import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "梁松泉 · UI 设计作品集",
  description: "梁松泉的个人 UI 设计作品集",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={cn("dark", "h-full", "font-sans", geist.variable)}>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
