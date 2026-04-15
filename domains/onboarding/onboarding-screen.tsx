"use client";

import { OnboardingForm } from "./onboarding-form";
import { useOnboardingPage } from "./use-onboarding-page";

export default function OnboardingPage() {
  const page = useOnboardingPage();

  if (page.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          <p className="text-soft text-sm">正在确认你的建档状态…</p>
        </div>
      </div>
    );
  }

  return <OnboardingForm {...page} />;
}
