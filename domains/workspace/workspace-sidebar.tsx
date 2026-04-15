"use client";

import { Button, ButtonLink } from "@/shared/ui/ui";
import {
  getWorkspaceRoleLabel,
  getWorkspaceTypeLabel,
  tools,
  type AuthMe,
  type WorkspaceSummary,
} from "./workspace-model";
import { SidebarCard } from "./sidebar-card";

type ToolMeta = {
  label: string;
  short: string;
};

type Props = {
  activeToolMeta: ToolMeta;
  activeTips: string[];
  displayName: string;
  me: AuthMe | null;
  onLogout: () => void;
  workspaces: WorkspaceSummary[];
};

export function WorkspaceSidebar({
  activeToolMeta,
  activeTips,
  displayName,
  me,
  onLogout,
  workspaces,
}: Props) {
  return (
    <aside className="space-y-6">
      <SidebarCard eyebrow="工作台概览" title="创作状态">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[34px] font-semibold tracking-[-0.04em] text-[#27272A]">
              {tools.length}
            </div>
            <div className="text-sm text-[#737378]">已接入创作能力</div>
          </div>
          <div className="text-right text-sm text-[#737378]">
            <div>空间数量</div>
            <div className="mt-1 text-[20px] font-semibold text-[#993D63]">{workspaces.length}</div>
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#F5F3F7]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#D4668F_0%,#4A3168_100%)]"
            style={{ width: `${(tools.length / 4) * 100}%` }}
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          <div className="rounded-[16px] bg-[#FAFAFA] px-3 py-3">
            <div className="text-xs text-[#A3A3AB]">当前空间</div>
            <div className="mt-1 text-sm font-semibold text-[#27272A]">
              {me?.currentWorkspace?.name || "个人空间"}
            </div>
          </div>
          <div className="rounded-[16px] bg-[#FAFAFA] px-3 py-3">
            <div className="text-xs text-[#A3A3AB]">空间身份</div>
            <div className="mt-1 text-sm font-semibold text-[#27272A]">
              {getWorkspaceRoleLabel(me?.currentWorkspace?.role)}
            </div>
          </div>
          <div className="rounded-[16px] bg-[#FAFAFA] px-3 py-3">
            <div className="text-xs text-[#A3A3AB]">空间类型</div>
            <div className="mt-1 text-sm font-semibold text-[#27272A]">
              {getWorkspaceTypeLabel(me?.currentWorkspace?.type)}
            </div>
          </div>
        </div>
      </SidebarCard>

      <SidebarCard
        className="bg-[linear-gradient(180deg,rgba(255,249,252,1)_0%,rgba(253,244,248,1)_100%)]"
        eyebrow="推荐入口"
        title={`现在适合先做「${activeToolMeta.label}」`}
      >
        <div className="space-y-3">
          <div className="rounded-[16px] border border-[#F9CFE3] bg-white/80 px-4 py-3 text-sm text-[#993D63]">
            {activeToolMeta.short}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3">
              <div className="text-sm font-semibold text-[#27272A]">账号资料</div>
              <div className="mt-1 text-sm text-[#737378]">
                {displayName}
                {me?.onboardingCompleted ? " · 已完成建档" : " · 待完善"}
              </div>
            </div>
            <div className="rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3">
              <div className="text-sm font-semibold text-[#27272A]">登录手机号</div>
              <div className="mt-1 text-sm text-[#737378]">{me?.account.phone || "当前账号已登录"}</div>
            </div>
          </div>
        </div>
      </SidebarCard>

      <section className="rounded-[20px] bg-[#4A3168] p-5 text-white shadow-[0_12px_32px_rgba(74,49,104,0.2)]">
        <div className="space-y-4">
          <div className="text-base font-semibold">💡 专业提示</div>
          <div className="space-y-3">
            {activeTips.map((tip) => (
              <div
                key={tip}
                className="rounded-[14px] border border-white/10 bg-white/8 px-4 py-3 text-sm leading-7 text-white/88"
              >
                {tip}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SidebarCard eyebrow="空间管理" title="保持你的资料和空间状态更新">
        <div className="space-y-4">
          <div className="rounded-[999px] bg-[linear-gradient(135deg,#F5F3F7_0%,#FDF4F8_100%)] p-3 text-center text-[#4A3168]">
            当前可用：标题生成、脚本生成、话术提炼、佣金测算
          </div>
          <div className="space-y-3">
            <ButtonLink className="w-full" href="/onboarding">
              修改资料
            </ButtonLink>
            {workspaces.length > 1 ? (
              <ButtonLink className="w-full" href="/workspace/select" variant="secondary">
                切换空间
              </ButtonLink>
            ) : null}
            <Button className="w-full" onClick={onLogout} type="button" variant="ghost">
              退出登录
            </Button>
          </div>
        </div>
      </SidebarCard>
    </aside>
  );
}
