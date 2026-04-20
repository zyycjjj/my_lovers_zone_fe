import type { ReactNode } from "react";
import { Card, SoftBadge, cn } from "../ui";

export function PromptInputCard({
  title,
  description,
  badge,
  children,
  footer,
  className,
}: {
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-6 rounded-[32px]", className)}>
      <div className="space-y-4">
        {badge ? <SoftBadge tone="brand">{badge}</SoftBadge> : null}
        <div className="text-[24px] font-semibold tracking-[-0.03em] text-strong">{title}</div>
        <p className="max-w-2xl text-sm leading-7 text-soft">{description}</p>
      </div>

      <div className="space-y-5">{children}</div>
      {footer ? <div className="flex flex-wrap gap-3">{footer}</div> : null}
    </Card>
  );
}

