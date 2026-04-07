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
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,237,224,0.9),_transparent_38%),linear-gradient(180deg,_#fcfaf6_0%,_#f7f4ef_100%)] text-[--text-strong]">
          <SiteHeader />
          <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
