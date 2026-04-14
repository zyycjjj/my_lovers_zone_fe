import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "./components/site-header";

export const metadata: Metadata = {
  title: "Memory | 轻陪跑式 AI 内容工作台",
  description: "先把内容做出来，也帮你更稳地继续做下去。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="text-strong min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(237,228,255,0.88),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(255,234,243,0.74),_transparent_26%),linear-gradient(180deg,_#faf6ff_0%,_#fff8f2_100%)]">
          <SiteHeader />
          <main className="page-shell mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
