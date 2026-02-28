import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "./components/top-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Love Zone | 轻信号与带货小助手",
  description: "送给她的温柔工具箱：带货工具、轻信号与回声。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-100 text-slate-900">
          <header className="border-b border-rose-100/70 bg-white/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white">
                  ❤
                </span>
                <span className="text-lg">Love Zone</span>
              </Link>
              <TopNav />
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl px-6 py-8">
            {children}
          </main>
          <footer className="border-t border-rose-100/70 bg-white/70">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-500">
              <span>爱意小站 · 轻信号与带货工具箱</span>
              <span>愿你每一天都被温柔对待</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
