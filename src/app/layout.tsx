import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "智客AI - 智能客服系统",
  description: "AI优先的智能客服产品，多平台消息聚合、AI自动回复、智能留资转化",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
