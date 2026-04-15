import { BoltBadge } from "./login-icons";

export function LoginHeader({ intent }: { intent: string }) {
  return (
    <div className="text-center">
      <BoltBadge />
      <h1 className="mt-6 text-[32px] font-bold tracking-[-0.04em] text-[#18181b] sm:text-[30px]">
        欢迎来到AI内容工作台
      </h1>
      <p className="mt-3 text-[17px] text-[#52525a]">让我们开始你的创作之旅</p>
      {intent === "trial" ? (
        <div className="mt-4 inline-flex items-center rounded-full bg-[rgba(74,49,104,0.06)] px-4 py-2 text-[13px] font-medium text-[#6a447f]">
          登录后会继续刚才那轮体验内容
        </div>
      ) : null}
    </div>
  );
}
