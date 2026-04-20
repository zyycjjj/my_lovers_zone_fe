"use client";

import { apiRequest } from "@/shared/lib/api";
import type { CommissionResult, RefineResult, ScriptResult, TitleResult, ToolKind } from "./workspace-model";

export type WorkspaceToolInputs = {
  titleKeyword: string;
  titleStyle: string;
  scriptKeyword: string;
  scriptPrice: string;
  scriptAudience: string;
  scriptScene: string;
  scriptStyle: "short" | "live";
  refineText: string;
  commissionPrice: string;
  commissionRate: string;
  platformRate: string;
};

export type WorkspaceToolResult =
  | { kind: "title"; titleResult: string[] }
  | { kind: "script"; scriptResult: string }
  | { kind: "refine"; refineResult: RefineResult }
  | { kind: "commission"; commissionResult: CommissionResult };

export async function submitWorkspaceTool(
  activeTool: ToolKind,
  inputs: WorkspaceToolInputs,
): Promise<WorkspaceToolResult> {
  if (activeTool === "title") {
    if (!inputs.titleKeyword.trim()) throw new Error("先填一个商品关键词，再开始生成标题。");
    const data = await apiRequest<TitleResult>("/api/tool/title", {
      method: "POST",
      body: {
        keyword: inputs.titleKeyword.trim(),
        style: inputs.titleStyle.trim() || undefined,
      },
    });
    return { kind: "title", titleResult: data.titles ?? [] };
  }

  if (activeTool === "script") {
    if (!inputs.scriptKeyword.trim()) throw new Error("先填一个商品关键词，再开始生成脚本。");
    const data = await apiRequest<ScriptResult>("/api/tool/script", {
      method: "POST",
      body: {
        keyword: inputs.scriptKeyword.trim(),
        price: inputs.scriptPrice ? Number(inputs.scriptPrice) : undefined,
        audience: inputs.scriptAudience.trim() || undefined,
        scene: inputs.scriptScene.trim() || undefined,
        style: inputs.scriptStyle,
      },
    });
    return { kind: "script", scriptResult: data.text || "" };
  }

  if (activeTool === "refine") {
    if (!inputs.refineText.trim()) throw new Error("先贴一段你要整理的话术。");
    const data = await apiRequest<RefineResult>("/api/tool/refine", {
      method: "POST",
      body: { text: inputs.refineText.trim() },
    });
    return { kind: "refine", refineResult: data };
  }

  if (!inputs.commissionPrice || !inputs.commissionRate) {
    throw new Error("先把商品价格和佣金比例填上。");
  }

  const data = await apiRequest<CommissionResult>("/api/tool/commission", {
    method: "POST",
    body: {
      price: Number(inputs.commissionPrice),
      commissionRate: Number(inputs.commissionRate),
      platformRate: inputs.platformRate ? Number(inputs.platformRate) : undefined,
    },
  });

  return { kind: "commission", commissionResult: data };
}
