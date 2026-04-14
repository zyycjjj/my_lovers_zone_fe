"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "./ui";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(135deg,_#6d48eb_0%,_#4d2bb8_100%)] text-white shadow-[0_16px_34px_rgba(93,63,211,0.28)] hover:brightness-[1.03]",
  secondary:
    "border border-[rgba(93,63,211,0.18)] bg-white/86 text-strong hover:bg-white",
  ghost: "bg-transparent text-soft hover:bg-white/55 hover:text-strong",
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
