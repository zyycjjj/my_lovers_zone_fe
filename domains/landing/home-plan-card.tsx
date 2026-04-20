import Link from "next/link";
import type { Plan } from "./home-model";

export function HomePlanCard({
  name,
  desc,
  price,
  suffix,
  features,
  action,
  recommended,
}: Plan) {
  const buttonClass = recommended
    ? "bg-[linear-gradient(135deg,#4a3168_0%,#6f4d96_100%)] text-white shadow-[0_16px_34px_rgba(74,49,104,0.22)] hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(74,49,104,0.3)]"
    : "border-[1.5px] border-[#4a3168] bg-white text-[#4a3168] hover:-translate-y-0.5 hover:bg-[#f8f4fb] hover:shadow-[0_14px_28px_rgba(74,49,104,0.12)]";

  return (
    <div
      className={`relative rounded-[20px] border bg-white p-6 shadow-[0_4px_6px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.08)] ${
        recommended
          ? "border-2 border-[#4a3168] bg-[linear-gradient(180deg,#ffffff_0%,#fcf9ff_100%)] shadow-[0_18px_48px_rgba(74,49,104,0.2)] hover:-translate-y-3 hover:shadow-[0_28px_68px_rgba(74,49,104,0.28)]"
          : "border-[rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-[rgba(74,49,104,0.16)] hover:shadow-[0_24px_56px_rgba(74,49,104,0.14)]"
      }`}
    >
      {recommended ? (
        <div className="pointer-events-none absolute inset-x-6 top-5 h-20 rounded-full bg-[radial-gradient(circle,rgba(212,102,143,0.18)_0%,rgba(212,102,143,0)_72%)] opacity-80 blur-2xl" />
      ) : null}

      {recommended ? (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="inline-flex h-[22px] items-center rounded-full border border-[#f9cfe3] bg-[#fdf4f8] px-2 text-xs font-medium text-[#993d63]">
            推荐
          </div>
        </div>
      ) : null}

      <div className="text-[20px] font-semibold text-[#27272a]">{name}</div>
      <div className="mt-2 text-sm text-[#737378]">{desc}</div>

      <div className="mt-6 flex items-end gap-1">
        <div className="text-4xl font-bold leading-10 text-[#4a3168]">{price}</div>
        <div className="pb-1 text-base text-[#737378]">{suffix}</div>
      </div>

      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-[#3f3f46]">
            <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#eaf8f1] text-xs text-[#10b981]">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={action === "联系客服" ? "/login" : "/trial"}
        className={`mt-6 inline-flex h-[51px] w-full items-center justify-center rounded-2xl text-base font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4a3168]/14 ${buttonClass}`}
      >
        {action}
      </Link>
    </div>
  );
}

