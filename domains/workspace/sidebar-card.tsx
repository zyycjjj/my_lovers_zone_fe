import type { ReactNode } from "react";
import { Card, cn } from "@/shared/ui/ui";

export function SidebarCard({
  title,
  eyebrow,
  children,
  className,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "space-y-4 rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      <div className="space-y-1">
        {eyebrow ? <div className="text-xs font-medium text-[#737378]">{eyebrow}</div> : null}
        <div className="text-base font-semibold text-[#27272A]">{title}</div>
      </div>
      {children}
    </Card>
  );
}

