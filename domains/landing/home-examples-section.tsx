import type { Example } from "./home-model";
import { HomeExampleCard } from "./home-example-card";
import { HomeSectionTitle } from "./home-section-title";

export function HomeExamplesSection({ items }: { items: Example[] }) {
  return (
    <section className="bg-[linear-gradient(107deg,#fafafa_0%,rgba(245,243,247,0.2)_100%)] py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4">
        <HomeSectionTitle title="看看AI生成的效果" description="真实案例，开箱即用" />

        <div className="mx-auto mt-12 flex max-w-[768px] flex-col gap-6">
          {items.map((example) => (
            <HomeExampleCard key={example.title} {...example} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#d4668f_0%,#e288aa_100%)] px-6 text-base font-medium text-white shadow-[0_14px_32px_rgba(212,102,143,0.22)] hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(212,102,143,0.28)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d4668f]/16" type="button">
            查看更多示例
          </button>
        </div>
      </div>
    </section>
  );
}

