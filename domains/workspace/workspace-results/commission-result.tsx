"use client";

import { Button, NoticePanel } from "@/shared/ui/ui";
import type { CommissionResult } from "../workspace-model";

export function WorkspaceCommissionResult({
  commission,
  onCopy,
}: {
  commission: CommissionResult;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="space-y-4">
      <NoticePanel className="rounded-[16px] px-4 py-4" tone="gold">
        <div className="text-xs uppercase tracking-[0.2em]">预计佣金</div>
        <div className="mt-2 text-[32px] font-semibold leading-none">{commission.commission} 元</div>
        <div className="mt-3 text-sm leading-7">{commission.sellingPoint}</div>
      </NoticePanel>

      <div className="space-y-3">
        {commission.comparisons.map((item) => (
          <div
            key={`${item.price}-${item.commission}`}
            className="flex items-center justify-between rounded-[16px] border border-[rgba(0,0,0,0.08)] px-4 py-4 text-sm"
          >
            <span className="text-[#737378]">售价 {item.price} 元</span>
            <span className="font-semibold text-[#27272A]">佣金 {item.commission} 元</span>
          </div>
        ))}
      </div>

      <Button
        onClick={() =>
          onCopy(
            [
              `预计佣金：${commission.commission} 元`,
              commission.sellingPoint,
              ...commission.comparisons.map(
                (item) => `售价 ${item.price} 元，佣金 ${item.commission} 元`,
              ),
            ].join("\n"),
          )
        }
        type="button"
        variant="secondary"
      >
        复制测算结果
      </Button>
    </div>
  );
}

