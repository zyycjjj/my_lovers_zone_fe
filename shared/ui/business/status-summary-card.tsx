import type { ReactNode } from "react";
import { Card, cn } from "../ui";

export function StatusSummaryCard({
  title,
  description,
  rows,
  footer,
  className,
}: {
  title: string;
  description: string;
  rows: ReactNode[];
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-5 rounded-[32px]", className)}>
      <div className="space-y-2">
        <div className="text-base font-semibold text-strong">{title}</div>
        <p className="text-sm leading-7 text-soft">{description}</p>
      </div>
      <div className="grid gap-3">{rows}</div>
      {footer}
    </Card>
  );
}

