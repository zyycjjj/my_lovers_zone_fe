"use client";

import { type ReactNode } from "react";
import { Button } from "./ui";

type QuotaExhaustedProps = {
  planKey?: "experience" | "pro" | "team";
  quotaType?: "text_generation" | "script_generation" | "title_generation";
  usedCount?: number;
  limitCount?: number;
  onUpgrade?: () => void;
  onReset?: () => void;
  compact?: boolean;
};

/**
 * 额度不足提示组件
 * 用于在用户额度耗尽时展示升级引导
 */
export function QuotaExhausted({
  planKey = "experience",
  quotaType = "text_generation",
  usedCount = 0,
  limitCount = 5,
  onUpgrade,
  onReset,
  compact = false,
}: QuotaExhaustedProps) {
  const isExperience = planKey === "experience";
  
  if (compact) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-[#FEF2F2] bg-[#FFFBFA] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-lg">⚡</span>
          <p className="text-sm text-[#7C2D12]">
            今日额度已用完（{usedCount}/{limitCount}）
          </p>
        </div>
        {onUpgrade && (
          <Button variant="primary" onClick={onUpgrade} className="rounded-lg px-4 py-1.5 text-xs">
            升级解锁更多
          </Button>
        )}
      </div>
    );
  }

  const quotaLabels: Record<string, string> = {
    text_generation: "文本生成",
    script_generation: "脚本生成",
    title_generation: "标题生成",
  };

  return (
    <div className="mx-auto max-w-[420px] rounded-2xl border border-[#FEF2F2] bg-gradient-to-b from-[#FFFBFA] to-[#FFF7F5] p-6">
      {/* 头部 */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FEF2F2] text-2xl">
          ✨
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[#27272A]">
            {isExperience ? "体验额度已用完" : "今日额度已用完"}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#737378]">
            {isExperience 
              ? `你已经使用了 ${limitCount} 次体验机会，升级后可以获得更多额度和高级功能`
              : `${quotaLabels[quotaType]}额度已达到上限（${usedCount}/${limitCount}），明天自动重置`
            }
          </p>
        </div>
      </div>

      {/* 额度进度 */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-[#A1A1AA] mb-1.5">
          <span>今日已用</span>
          <span>{usedCount} / {limitCount}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#F5F5F7]">
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(100, (usedCount / limitCount) * 100)}%`,
              backgroundColor: usedCount >= limitCount ? '#EF4444' : '#6366F1'
            }}
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-5 flex gap-3">
        {isExperience && onReset && (
          <Button variant="secondary" onClick={onReset} className="flex-1 rounded-xl">
            重置体验次数
          </Button>
        )}
        {onUpgrade && (
          <Button variant="primary" onClick={onUpgrade} className="flex-1 rounded-xl">
            {isExperience ? "立即升级" : "升级套餐"}
          </Button>
        )}
      </div>

      {/* 提示文字 */}
      {!isExperience && (
        <p className="mt-3 text-center text-xs leading-5 text-[#A3A3AD]">
          或等待明天额度自动重置
        </p>
      )}
    </div>
  );
}

/**
 * 额度即将耗尽警告（使用超过80%时显示）
 */
export function QuotaWarning({
  usedCount,
  limitCount,
}: {
  usedCount: number;
  limitCount: number;
}) {
  const percent = Math.round((usedCount / limitCount) * 100);
  
  if (percent < 80) return null;

  return (
    <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-[#FEF9E7] bg-[#FFFCF5] px-4 py-2.5">
      <span className="text-base">💡</span>
      <p className="text-sm text-[#92400E]">
        今日额度剩余 {limitCount - usedCount} 次，合理规划使用哦~
      </p>
    </div>
  );
}

/**
 * 权益卡片 - 展示当前套餐权益信息
 */
export function EntitlementCard(props: {
  planName?: string;
  features?: Array<{ label: string; value: string | number; icon?: string }>;
  expiresAt?: string | null;
}) {
  const { planName = "体验版", features = [], expiresAt } = props;

  return (
    <div className="rounded-xl border border-[#F0F0F2] bg-white p-4">
      {/* 套餐名称 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="font-medium text-[#27272A]">{planName}</span>
        </div>
        {expiresAt && (
          <span className="text-xs text-[#A3A3AD]">
            到期 {new Date(expiresAt).toLocaleDateString("zh-CN")}
          </span>
        )}
      </div>

      {/* 权益列表 */}
      {features.length > 0 && (
        <div className="mt-3 space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-[#737378]">
                <span>{feature.icon || "✓"}</span>
                {feature.label}
              </span>
              <span className="font-medium text-[#27272A]">{feature.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
