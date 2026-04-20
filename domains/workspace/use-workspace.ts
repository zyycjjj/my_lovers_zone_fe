"use client";

import { useWorkspaceBootstrap } from "./use-workspace-bootstrap";
import { useWorkspaceTools } from "./use-workspace-tools";

export function useWorkspace() {
  const bootstrap = useWorkspaceBootstrap();
  const toolsState = useWorkspaceTools();

  return { ...bootstrap, ...toolsState };
}
