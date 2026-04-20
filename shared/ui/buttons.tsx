import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "./cn";

const baseButtonClass = "ui-btn";

type ButtonVariant = "primary" | "secondary" | "ghost";

function variantClass(variant: ButtonVariant) {
  return variant === "primary" ? "ui-btn-primary" : variant === "secondary" ? "ui-btn-secondary" : "ui-btn-ghost";
}

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: ComponentProps<typeof Link> & {
  className?: string;
  variant?: ButtonVariant;
}) {
  return <Link className={cn(baseButtonClass, variantClass(variant), className)} {...props} />;
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ComponentProps<"button"> & {
  className?: string;
  variant?: ButtonVariant;
}) {
  return <button className={cn(baseButtonClass, variantClass(variant), className)} {...props} />;
}

