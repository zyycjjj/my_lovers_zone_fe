import { ButtonLink, cn } from "../ui";

export function CommunityEntryCard({
  title,
  description,
  actionText,
  actionHref,
  className,
}: {
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
  className?: string;
}) {
  return (
    <section className={cn("ui-card-dark p-5 sm:p-6", className)}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-sm">
            社
          </span>
          <div className="text-sm font-medium text-white/78">社群入口卡</div>
        </div>

        <div className="space-y-2">
          <div className="text-lg font-semibold text-white">{title}</div>
          <p className="text-sm leading-7 text-white/76">{description}</p>
        </div>

        <div className="flex -space-x-2">
          {["#f0b8d0", "#d4c2ff", "#f5d397"].map((color, index) => (
            <span
              key={index}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-[#281a49]"
              style={{ backgroundColor: color }}
            >
              {index + 1}
            </span>
          ))}
        </div>

        <ButtonLink className="w-full" href={actionHref}>
          {actionText}
        </ButtonLink>
      </div>
    </section>
  );
}

