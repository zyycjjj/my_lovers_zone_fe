import type { Audience } from "./home-model";
import { HomeSectionTitle } from "./home-section-title";

export function HomeAudiencesSection({ items }: { items: Audience[] }) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4">
        <HomeSectionTitle title="谁在使用AI内容工作台？" description="超过50,000+创作者的选择" />

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white px-6 py-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 hover:border-[rgba(74,49,104,0.14)] hover:shadow-[0_20px_44px_rgba(74,49,104,0.12)]"
            >
              <div className="pointer-events-none absolute -right-4 top-2 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(74,49,104,0.08)_0%,rgba(74,49,104,0)_72%)] opacity-0 blur-2xl group-hover:opacity-100" />
              <div className="text-5xl leading-[48px] group-hover:-translate-y-0.5 group-hover:scale-[1.04]">{item.icon}</div>
              <div className="mt-4 text-[20px] font-semibold leading-[25px] text-[#27272a]">{item.title}</div>
              <div className="mt-2 text-sm leading-5 text-[#737378]">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

