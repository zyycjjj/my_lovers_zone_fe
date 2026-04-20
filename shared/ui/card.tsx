import type { ReactNode } from "react";
import { cn } from "./cn";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("ui-card p-5 sm:p-6", className)}>{children}</section>;
}

