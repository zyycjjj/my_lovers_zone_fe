import { Card, cn } from "../ui";

export function QuotaCard({
  title = "对话额度卡",
  used,
  total,
  items,
  className,
}: {
  title?: string;
  used: number;
  total: number;
  items: Array<{ label: string; value: string; tone?: "brand" | "rose" | "neutral" }>;
  className?: string;
}) {
  const percent = Math.max(0, Math.min(100, total ? (used / total) * 100 : 0));

  return (
    <Card className={cn("space-y-4 rounded-[28px]", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-muted">{title}</div>
          <div className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-strong">
            {Math.max(total - used, 0)}
          </div>
          <div className="text-sm text-soft">今日剩余额度</div>
        </div>

        <div className="text-right text-sm text-soft">
          <div>今日已使用</div>
          <div className="mt-1 text-[20px] font-semibold text-[var(--secondary-600)]">{used}</div>
        </div>
      </div>

      <div className="ui-progress-track">
        <div className="ui-progress-fill-rose" style={{ width: `${percent}%` }} />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="ui-card-muted rounded-[18px] px-3 py-3">
            <div className="text-xs text-muted">{item.label}</div>
            <div
              className={cn(
                "mt-1 text-sm font-semibold",
                item.tone === "rose"
                  ? "text-[var(--secondary-700)]"
                  : item.tone === "brand"
                    ? "text-[var(--primary-700)]"
                    : "text-strong",
              )}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

