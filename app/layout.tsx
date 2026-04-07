import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "./components/site-header";

const notoSans = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSerif = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Memory | 轻陪跑式 AI 内容工作台",
  description:
    "先把账号、建档和工作入口接稳，再用更轻一点的方式帮你持续把内容做下去。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSans.variable} ${notoSerif.variable}`}>
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
