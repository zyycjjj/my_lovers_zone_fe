import type { Stat } from "./home-model";

export function HomeStatsSection({ items }: { items: Stat[] }) {
  return (
    <section className="border-t border-[rgba(0,0,0,0.08)] bg-white py-16 lg:py-[65px]">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-[30px] font-bold leading-9 text-[#4a3168] lg:text-4xl lg:leading-10">
                {item.value}
              </div>
              <div className="mt-2 text-sm text-[#737378]">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

