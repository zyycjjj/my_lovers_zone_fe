import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "./components/site-header";

export const metadata: Metadata = {
  title: "Memory | 轻陪跑式 AI 内容工作台",
  description: "先给你今天能发出去的一轮内容，再帮你把节奏接下去。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen text-strong">
          <SiteHeader />
          <main className="page-shell mx-auto w-full max-w-[1280px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
