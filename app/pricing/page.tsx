"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HomePlansSection } from "@/domains/landing/home-plans-section";
import { usePublicPlans } from "@/domains/landing/use-public-plans";
import { apiRequest } from "@/shared/lib/api";
import type { EntitlementStatus } from "@/domains/workspace/workspace-model";

export default function PricingPage() {
  const plans = usePublicPlans();
  const [planLabel, setPlanLabel] = useState<string>("体验版");

  useEffect(() => {
    apiRequest<EntitlementStatus>("/api/payments/entitlement/me")
      .then((entitlement) => {
        if (entitlement?.planLabel) {
          setPlanLabel(entitlement.planLabel);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#18181b]">
      <header className="sticky top-0 z-20 border-b border-[rgba(0,0,0,0.08)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4">
          <Link className="text-sm font-medium text-[#27272A]" href="/">
            返回首页
          </Link>
          <div className="inline-flex h-[30px] items-center rounded-full border border-[#F9CFE3] bg-[#FDF4F8] px-3 text-sm font-medium text-[#993D63]">
            {planLabel}
          </div>
        </div>
      </header>
      <main>
        <HomePlansSection checkoutMode items={plans} />
      </main>
    </div>
  );
}
