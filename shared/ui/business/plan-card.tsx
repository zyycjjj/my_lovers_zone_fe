import { ButtonLink, Card, SoftBadge, cn } from "../ui";

export function PlanCard({
  name,
  price,
  description,
  features,
  recommended,
  actionText,
  actionHref,
  className,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
  actionText: string;
  actionHref: string;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "space-y-5 rounded-[28px] p-5",
        recommended && "border-[rgba(112,70,214,0.22)] shadow-[0_20px_48px_rgba(88,51,175,0.16)]",
        className,
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-base font-semibold text-strong">{name}</div>
          {recommended ? <SoftBadge tone="brand">推荐</SoftBadge> : null}
        </div>
        <div>
          <span className="text-[34px] font-semibold tracking-[-0.04em] text-strong">{price}</span>
        </div>
        <p className="text-sm leading-7 text-soft">{description}</p>
      </div>

      <ul className="space-y-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm leading-7 text-soft">
            <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--primary-500)]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <ButtonLink className="w-full" href={actionHref} variant={recommended ? "primary" : "secondary"}>
        {actionText}
      </ButtonLink>
    </Card>
  );
}

