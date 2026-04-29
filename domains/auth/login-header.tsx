import { BoltBadge } from "./login-icons";

export function LoginHeader({ intent }: { intent: string }) {
  return (
    <div className="text-center">
      <BoltBadge />
      <h1 className="mt-6 text-[30px] font-bold tracking-[-0.04em] text-[#18181b] sm:text-[30px]">
        登录 Memory 工作台
      </h1>
      <p className="mt-2.5 text-[18px] leading-7 text-[#52525a]">登录后继续你上次的内容</p>
      {intent === "trial" ? (
        <div className="mt-4 inline-flex items-center rounded-full bg-[rgba(74,49,104,0.06)] px-4 py-2 text-[13px] font-medium text-[#6a447f]">
          登录后会继续刚才那轮体验内容
        </div>
      ) : null}
    </div>
  );
}
