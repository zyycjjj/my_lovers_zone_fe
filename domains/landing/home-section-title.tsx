export function HomeSectionTitle({
  badge,
  title,
  description,
}: {
  badge?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {badge ? (
        <div className="inline-flex h-[30px] items-center justify-center rounded-full border border-[#f9cfe3] bg-[#fdf4f8] px-3 text-xs font-medium text-[#993d63]">
          {badge}
        </div>
      ) : null}
      <h2 className="text-[20px] font-semibold leading-[25px] tracking-[-0.01em] text-[#18181b] lg:text-[24px] lg:leading-[30px] lg:tracking-[-0.24px]">
        {title}
      </h2>
      <p className="text-base leading-[26px] text-[#737378]">{description}</p>
    </div>
  );
}

