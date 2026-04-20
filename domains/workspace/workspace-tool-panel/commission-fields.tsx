"use client";

import { FieldGroup } from "@/shared/ui/ui";
import { inputClassName } from "../workspace-model";

export function WorkspaceCommissionFields({
  commissionPrice,
  commissionRate,
  platformRate,
  onCommissionPriceChange,
  onCommissionRateChange,
  onPlatformRateChange,
}: {
  commissionPrice: string;
  commissionRate: string;
  platformRate: string;
  onCommissionPriceChange: (value: string) => void;
  onCommissionRateChange: (value: string) => void;
  onPlatformRateChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FieldGroup label="商品价格">
        <input
          className={inputClassName()}
          inputMode="decimal"
          onChange={(event) => onCommissionPriceChange(event.target.value)}
          placeholder="比如：199"
          value={commissionPrice}
        />
      </FieldGroup>
      <FieldGroup label="佣金比例">
        <input
          className={inputClassName()}
          inputMode="decimal"
          onChange={(event) => onCommissionRateChange(event.target.value)}
          placeholder="比如：0.2"
          value={commissionRate}
        />
      </FieldGroup>
      <FieldGroup className="sm:col-span-2" hint="选填" label="平台扣点">
        <input
          className={inputClassName()}
          inputMode="decimal"
          onChange={(event) => onPlatformRateChange(event.target.value)}
          placeholder="比如：0.1"
          value={platformRate}
        />
      </FieldGroup>
    </div>
  );
}

