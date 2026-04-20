import { ButtonLink, Card, cn } from "../ui";

export function ContentRetentionCard({
  title,
  description,
  actionHref,
  actionText,
  className,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionText: string;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-4 rounded-[28px]", className)}>
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted">内容留存卡</div>
        <div className="text-base font-semibold text-strong">{title}</div>
        <p className="text-sm leading-7 text-soft">{description}</p>
      </div>

      <div className="rounded-[20px] border border-dashed border-[rgba(88,51,175,0.14)] bg-[rgba(112,70,214,0.04)] px-4 py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(112,70,214,0.12)] text-lg">
          ✦
        </div>
        <div className="mt-3 text-sm text-soft">继续这一轮之后，结果和下一步建议都会留下来。</div>
        <ButtonLink className="mt-4 w-full" href={actionHref}>
          {actionText}
        </ButtonLink>
      </div>
    </Card>
  );
}

