import type { ReactNode } from "react";
import { cn } from "./cn";

export function ChoicePill({
  active,
  children,
  onClick,
  className,
}: {
  active: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button className={cn("ui-pill", active && "ui-pill-active", className)} onClick={onClick} type="button">
      {children}
    </button>
  );
}

export function FieldGroup({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("space-y-2.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-strong">{label}</span>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

