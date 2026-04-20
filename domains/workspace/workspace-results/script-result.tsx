"use client";

import { Button } from "@/shared/ui/ui";

export function WorkspaceScriptResult({
  script,
  onCopy,
}: {
  script: string;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="space-y-4">
      <pre className="whitespace-pre-wrap rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-4 py-4 text-sm leading-7 text-[#27272A]">
        {script}
      </pre>
      <Button onClick={() => onCopy(script)} type="button" variant="secondary">
        复制这版脚本
      </Button>
    </div>
  );
}

