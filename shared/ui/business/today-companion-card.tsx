import { Card, SoftBadge, cn } from "../ui";

export function TodayCompanionCard({
  title,
  description,
  items,
  className,
}: {
  title: string;
  description: string;
  items: Array<{
    title: string;
    description?: string;
    meta?: string;
    tone?: "brand" | "rose" | "sage";
  }>;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-4 rounded-[28px]", className)}>
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted">今日陪跑卡</div>
        <div className="text-base font-semibold text-strong">{title}</div>
        <p className="text-sm leading-7 text-soft">{description}</p>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-[18px] border border-[rgba(88,51,175,0.08)] bg-white px-4 py-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-strong">{item.title}</div>
              {item.meta ? <SoftBadge tone={item.tone ?? "brand"}>{item.meta}</SoftBadge> : null}
            </div>
            {item.description ? <div className="mt-1 text-sm leading-7 text-soft">{item.description}</div> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

