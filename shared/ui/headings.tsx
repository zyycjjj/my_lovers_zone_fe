import { cn } from "./cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-3", align === "center" && "text-center")}>
      {eyebrow ? (
        <span className="text-[13px] font-semibold tracking-[0.08em] text-[var(--primary-700)]">
          {eyebrow}
        </span>
      ) : null}
      <div
        className={cn(
          "max-w-4xl text-[34px] font-semibold tracking-[-0.04em] text-strong sm:text-[42px] lg:text-[52px]",
          align === "center" && "mx-auto",
        )}
      >
        {title}
      </div>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-[15px] leading-7 text-soft sm:text-base",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

