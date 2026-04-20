import type { Plan } from "./home-model";
import { HomePlanCard } from "./home-plan-card";
import { HomeSectionTitle } from "./home-section-title";

export function HomePlansSection({ items }: { items: Plan[] }) {
  return (
    <section className="py-16 lg:py-20" id="plans">
      <div className="mx-auto max-w-[1280px] px-4">
        <HomeSectionTitle badge="限时优惠" title="选择适合你的方案" description="7天无理由退款，零风险试用" />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {items.map((plan) => (
            <HomePlanCard key={plan.name} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

