"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseStyle =
  "rounded-full px-6 py-2 text-sm font-medium transition active:scale-[0.98] disabled:opacity-60";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700",
  secondary:
    "border border-rose-200 text-rose-600 hover:bg-rose-50 active:bg-rose-100",
  ghost: "text-rose-500 hover:text-rose-600 hover:bg-rose-50",
};

export function UiButton({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${baseStyle} ${variantStyles[variant]} ${className ?? ""}`}
    />
  );
}
