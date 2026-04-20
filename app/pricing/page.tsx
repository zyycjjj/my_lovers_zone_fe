import Link from "next/link";
import { HomePlansSection } from "@/domains/landing/home-plans-section";
import { plans } from "@/domains/landing/home-model";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#18181b]">
      <header className="sticky top-0 z-20 border-b border-[rgba(0,0,0,0.08)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4">
          <Link className="text-sm font-medium text-[#27272A]" href="/">
            返回首页
          </Link>
          <div className="inline-flex h-[30px] items-center rounded-full border border-[#F9CFE3] bg-[#FDF4F8] px-3 text-sm font-medium text-[#993D63]">
            体验版
          </div>
        </div>
      </header>
      <main>
        <HomePlansSection items={plans} />
      </main>
    </div>
  );
}
