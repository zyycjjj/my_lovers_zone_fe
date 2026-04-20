import type { ReactNode } from "react";
import { cn } from "./cn";

export function SoftBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "sage" | "rose";
}) {
  const toneClass =
    tone === "brand"
      ? "ui-badge-brand"
      : tone === "sage"
        ? "ui-badge-sage"
        : tone === "rose"
          ? "ui-badge-rose"
          : "ui-badge-neutral";

  return <span className={cn("ui-badge", toneClass)}>{children}</span>;
}

