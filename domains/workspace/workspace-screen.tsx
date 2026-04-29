"use client";

import { useEffect, useState } from "react";
import { Card, NoticePanel } from "@/shared/ui/ui";
import { apiRequest } from "@/shared/lib/api";
import { WorkspaceGoalPicker } from "./workspace-goal-picker";
import { WorkspaceHeader } from "./workspace-header";
import type { ContentStats } from "@/domains/me/me-screen";
import { WorkspaceResultPanel } from "./workspace-result-panel";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { WorkspaceToolPanel } from "./workspace-tool-panel";
import { useDailyPrompt } from "./use-daily-prompt";
import { useWorkspace } from "./use-workspace";

export default function WorkspaceScreen() {
  const ws = useWorkspace();
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);

  useEffect(() => {
    if (ws.loading) return;
    apiRequest<ContentStats>("/api/content-assets/stats/me")
      .then(setContentStats)
      .catch(() => {});
  }, [ws.loading]);

  const { showPrompt: showDailyPrompt, promptMessage, dismiss: dismissDailyPrompt } = useDailyPrompt(contentStats);

  if (ws.loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-[1200px] rounded-[24px] p-8">
          <p className="text-sm text-[#737378]">正在进入你的工作台…</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <WorkspaceHeader />

      <main className="mx-auto max-w-[1283px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-8 space-y-2">
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#18181B] sm:text-[30px]">
            开始创作你的内容
          </h1>
          <p className="text-base leading-relaxed text-[#737378]">
            输入你的需求，AI 将为你生成专业内容
          </p>
        </section>

        {ws.pageError ? (
          <NoticePanel className="mb-6" tone="rose">
            {ws.pageError}
          </NoticePanel>
        ) : null}

        {ws.resumedDraftPrompt ? (
          <NoticePanel className="mb-6" tone="brand">
            已经把你在体验页那轮内容接过来了，当前先按“脚本生成”帮你继续往下跑。
          </NoticePanel>
        ) : null}

        {ws.pendingSummary?.count ? (
          <NoticePanel className="mb-6" tone="rose">
            你有 {ws.pendingSummary.count} 笔支付订单待处理（最新：{ws.pendingSummary.latest?.status || "pending"}）。
            支付后可前往结算页刷新状态，管理员审核通过后自动开通套餐。
          </NoticePanel>
        ) : null}

        {ws.subscription ? (
          <NoticePanel className="mb-6" tone="brand">
            当前套餐：{ws.entitlement?.planLabel || ws.subscription.planKey}（状态：{ws.subscription.status}
            {ws.subscription.expiredAt ? `，到期：${ws.subscription.expiredAt}` : ""}）
          </NoticePanel>
        ) : null}

        {showDailyPrompt && promptMessage ? (
          <NoticePanel className="mb-6" tone="brand">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-semibold">{promptMessage.title}</span>
                <span className="ml-2 text-sm">{promptMessage.text}</span>
              </div>
              <button
                className="shrink-0 rounded-[12px] bg-white px-3 py-1.5 text-sm font-medium text-[#8961F2] transition-colors hover:bg-[#F5F3F7]"
                onClick={dismissDailyPrompt}
              >
                {promptMessage.actionLabel}
              </button>
            </div>
          </NoticePanel>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,824px)_minmax(0,395px)]">
          <div className="space-y-6">
            <WorkspaceGoalPicker
              activeGoalKey={ws.activeGoalKey}
              activeTool={ws.activeTool}
              onSelect={(goal) => ws.handleGoalSelect(goal)}
              onClear={() => ws.handleGoalClear()}
            />

            <WorkspaceToolPanel
              activeTool={ws.activeTool}
              activeToolMeta={ws.activeToolMeta}
              commissionPrice={ws.commissionPrice}
              commissionRate={ws.commissionRate}
              loadingTool={ws.loadingTool}
              onSubmit={() => void ws.handleSubmitTool()}
              onToolChange={(next) => ws.selectTool(next)}
              platformRate={ws.platformRate}
              refineText={ws.refineText}
              scriptAudience={ws.scriptAudience}
              scriptKeyword={ws.scriptKeyword}
              scriptPrice={ws.scriptPrice}
              scriptScene={ws.scriptScene}
              scriptStyle={ws.scriptStyle}
              setCommissionPrice={ws.setCommissionPrice}
              setCommissionRate={ws.setCommissionRate}
              setPlatformRate={ws.setPlatformRate}
              setRefineText={ws.setRefineText}
              setScriptAudience={ws.setScriptAudience}
              setScriptKeyword={ws.setScriptKeyword}
              setScriptPrice={ws.setScriptPrice}
              setScriptScene={ws.setScriptScene}
              setScriptStyle={ws.setScriptStyle}
              setTitleKeyword={ws.setTitleKeyword}
              setTitleStyle={ws.setTitleStyle}
              titleKeyword={ws.titleKeyword}
              titleStyle={ws.titleStyle}
              toolError={ws.toolError}
            />

            <WorkspaceResultPanel
              activeResultExists={ws.activeResultExists}
              activeTool={ws.activeTool}
              activeToolMeta={ws.activeToolMeta}
              commissionResult={ws.commissionResult}
              copiedText={ws.copiedText || ws.resultActionMessage}
              isSavingAsset={ws.savingAsset}
              examplePrompts={ws.examplePrompts}
              loadingTool={ws.loadingTool}
              onCopy={(text) => void ws.handleCopy(text)}
              onCopyAndComplete={() => void ws.copyAndCompleteCurrentResult()}
              onExampleClick={(example) => ws.handleExampleClick(example)}
              onGenerateTitlesFromScript={() => void ws.generateTitlesFromScript()}
              onRefineCurrentScript={() => void ws.refineCurrentScript()}
              onSaveCurrentResult={() => void ws.saveCurrentResult()}
              nextActions={ws.nextActions}
              refineResult={ws.refineResult}
              resumedDraftPrompt={ws.resumedDraftPrompt}
              scriptResult={ws.scriptResult}
              titleResult={ws.titleResult}
            />
          </div>

          <WorkspaceSidebar
            activeToolMeta={ws.activeToolMeta}
            activeTips={ws.activeTips}
            displayName={ws.displayName}
            entitlement={ws.entitlement}
            me={ws.me}
            onLogout={() => void ws.handleLogout()}
            workspaces={ws.workspaces}
          />
        </section>
      </main>
    </div>
  );
}
