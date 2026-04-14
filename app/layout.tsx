import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI内容工作台",
  description: "3秒生成可直接发布的内容",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[#fafafa] text-[#18181b]">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
