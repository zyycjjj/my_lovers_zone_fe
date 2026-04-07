"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "./ui";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[--text-strong] text-white shadow-[0_12px_32px_rgba(17,24,39,0.16)] hover:bg-[#0f172a]",
  secondary:
    "border border-[--border-strong] bg-white/80 text-[--text-strong] hover:bg-white",
  ghost: "text-[--text-soft] hover:text-[--text-strong]",
};

export function UiButton({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
