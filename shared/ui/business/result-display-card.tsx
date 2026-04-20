import type { ReactNode } from "react";
import { Card, cn } from "../ui";

export function ResultDisplayCard({
  title,
  description,
  badge,
  children,
  className,
}: {
  title: string;
  description: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-5 rounded-[32px]", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-base font-semibold text-strong">{title}</div>
          <div className="text-sm text-soft">{description}</div>
        </div>
        {badge}
      </div>
      {children}
    </Card>
  );
}

