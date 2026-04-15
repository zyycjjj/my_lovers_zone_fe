"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/ui/ui";
import { modeOptions, type FormMode } from "./login-model";

export function ModeSwitch({
  mode,
  onChange,
}: {
  mode: FormMode;
  onChange: (mode: FormMode) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-[18px] bg-[#f5f2f8] p-1">
      {modeOptions.map((item) => {
        const active = item.value === mode;
        return (
          <button
            key={item.value}
            className={cn(
              "flex h-10 items-center justify-center rounded-[14px] text-sm font-medium",
              active
                ? "bg-white text-[#4a3168] shadow-[0_8px_22px_rgba(74,49,104,0.08)]"
                : "text-[#737378] hover:text-[#4a3168]",
            )}
            onClick={() => onChange(item.value)}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-[14px] font-medium text-[#3f3f46]">{label}</div>
      <div className="mt-2">{children}</div>
      <div className="min-h-[20px] pt-2 text-[13px] leading-5 text-[#ef4444]">{error || ""}</div>
    </label>
  );
}

export function AuthInput({
  icon,
  error,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  icon: ReactNode;
  error?: string;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a3a3ab]">
        {icon}
      </div>
      <input
        {...props}
        className={cn(
          "h-[50px] w-full rounded-[16px] border bg-white pl-12 pr-4 text-[16px] text-[#18181b] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] placeholder:text-[#a3a3ab] focus:border-[#4a3168] focus:shadow-[0_0_0_4px_rgba(74,49,104,0.08)]",
          error ? "border-[#ef4444]" : "border-[rgba(0,0,0,0.08)]",
          className,
        )}
      />
    </div>
  );
}

export function AuthPrimaryButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className="flex h-[60px] w-full items-center justify-center rounded-[16px] bg-[#4a3168] text-[18px] font-medium text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-[#5a3b7b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a3168] disabled:cursor-not-allowed disabled:opacity-60"
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
