"use client";

import { Card, NoticePanel } from "@/shared/ui/ui";
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceResultPanel } from "./workspace-result-panel";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { WorkspaceToolPanel } from "./workspace-tool-panel";
import { useWorkspace } from "./use-workspace";

export default function WorkspaceScreen() {
  const ws = useWorkspace();

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

        <section className="grid gap-6 lg:grid-cols-[minmax(0,824px)_minmax(0,395px)]">
          <div className="space-y-6">
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
              copiedText={ws.copiedText}
              examplePrompts={ws.examplePrompts}
              onCopy={(text) => void ws.handleCopy(text)}
              onExampleClick={(example) => ws.handleExampleClick(example)}
              refineResult={ws.refineResult}
              scriptResult={ws.scriptResult}
              titleResult={ws.titleResult}
            />
          </div>

          <WorkspaceSidebar
            activeToolMeta={ws.activeToolMeta}
            activeTips={ws.activeTips}
            displayName={ws.displayName}
            me={ws.me}
            onLogout={() => void ws.handleLogout()}
            workspaces={ws.workspaces}
          />
        </section>
      </main>
    </div>
  );
}
