import type { Benefit } from "./home-model";
import { HomeSectionTitle } from "./home-section-title";

export function HomeBenefitsSection({ items }: { items: Benefit[] }) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4">
        <HomeSectionTitle title="为什么选择我们？" description="帮内容人省时间的生成工具" />

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white px-6 py-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-[rgba(74,49,104,0.14)] hover:shadow-[0_22px_48px_rgba(74,49,104,0.12)]"
            >
              <div className="pointer-events-none absolute inset-x-6 top-3 h-16 rounded-full bg-[radial-gradient(circle,rgba(212,102,143,0.14)_0%,rgba(212,102,143,0)_72%)] opacity-0 blur-2xl group-hover:opacity-100" />
              <div className="text-[36px] leading-10 group-hover:-translate-y-1 group-hover:scale-[1.06]">{item.icon}</div>
              <div className="mt-4 text-[20px] font-semibold leading-[27.5px] text-[#27272a]">{item.title}</div>
              <div className="mt-2 text-sm leading-5 text-[#737378]">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

