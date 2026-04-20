import type { Example } from "./home-model";

export function HomeExampleCard({ title, time, content }: Example) {
  return (
    <div className="group rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_4px_6px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-[rgba(74,49,104,0.16)] hover:shadow-[0_22px_44px_rgba(74,49,104,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-medium text-[#27272a]">{title}</div>
          <div className="mt-1 text-xs text-[#737378]">{time}</div>
        </div>
        <div className="inline-flex h-[30px] items-center rounded-full border border-[#10b981] bg-[#d1fae5] px-3 text-sm font-medium text-[#10b981] shadow-[0_8px_18px_rgba(16,185,129,0.12)]">
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          已完成
        </div>
      </div>

      <div className="mt-4 space-y-1 text-base leading-[26px] text-[#3f3f46]">
        {content.map((line, index) => (
          <p key={`${title}-${index}`}>{line || "\u00A0"}</p>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 pt-2">
        <button className="inline-flex h-10 items-center justify-center rounded-2xl border-[1.5px] border-[#4a3168] px-4 text-sm font-medium text-[#4a3168] hover:-translate-y-0.5 hover:bg-[#f7f1fb] hover:shadow-[0_10px_24px_rgba(74,49,104,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4a3168]/12" type="button">
          复制
        </button>
        <button className="inline-flex h-9 items-center justify-center rounded-2xl px-4 text-sm font-medium text-[#4a3168] hover:bg-[rgba(74,49,104,0.06)] hover:text-[#37224c] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4a3168]/10" type="button">
          重新生成
        </button>
      </div>
    </div>
  );
}

