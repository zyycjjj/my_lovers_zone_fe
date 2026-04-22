"use client";

import { benefits, audiences, examples, stats } from "./home-model";
import { HomeAudiencesSection } from "./home-audiences-section";
import { HomeBenefitsSection } from "./home-benefits-section";
import { HomeExamplesSection } from "./home-examples-section";
import { HomeHeader } from "./home-header";
import { HomeHeroSection } from "./home-hero-section";
import { HomeMobileCtaBar } from "./home-mobile-cta";
import { HomePlansSection } from "./home-plans-section";
import { HomeStatsSection } from "./home-stats-section";
import { usePublicPlans } from "./use-public-plans";

export default function HomePage() {
  return <HomeScreen />;
}

function HomeScreen() {
  const plans = usePublicPlans();

  return (
    <div className="bg-[#fafafa] text-[#18181b]">
      <HomeHeader />

      <main className="pt-16 lg:pt-[65px]">
        <HomeHeroSection />
        <HomeBenefitsSection items={benefits} />
        <HomeExamplesSection items={examples} />
        <HomeAudiencesSection items={audiences} />
        <HomePlansSection items={plans} />
        <HomeStatsSection items={stats} />
      </main>

      <HomeMobileCtaBar />
    </div>
  );
}
