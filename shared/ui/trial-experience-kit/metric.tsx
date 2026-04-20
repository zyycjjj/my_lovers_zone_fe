"use client";

export function ExperienceMetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-white/80 bg-white/60 px-[13px] py-[13px]">
      <div className="text-xs leading-4 text-[#737378]">{label}</div>
      <div className="mt-[4px] text-[20px] font-bold leading-7 tracking-[-0.02em] text-[#4a3168]">{value}</div>
    </div>
  );
}

