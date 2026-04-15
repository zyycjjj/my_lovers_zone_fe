"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "./ui";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "ui-btn-primary",
  secondary: "ui-btn-secondary",
  ghost: "ui-btn-ghost",
};

export function UiButton({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "ui-btn",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
