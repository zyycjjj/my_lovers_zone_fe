"use client";

import { type ReactNode } from "react";
import { Button } from "./ui";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  secondaryActionLabel?: string;
  secondaryActionOnClick?: () => void;
};

/**
 * 空状态组件
 * 用于列表、内容区域等无数据时的占位展示
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  secondaryActionLabel,
  secondaryActionOnClick,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-4 py-10">
      {/* 图标 */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5F5F7] text-3xl">
        {icon || (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
            <polyline points="13,2 13,9 20,9" />
          </svg>
        )}
      </div>

      {/* 标题 */}
      <h3 className="mt-4 text-base font-semibold text-[#27272A]">{title}</h3>

      {/* 描述 */}
      {description && (
        <p className="mt-2 max-w-[340px] text-center text-sm leading-6 text-[#737378]">
          {description}
        </p>
      )}

      {/* 操作按钮 */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex gap-3">
          {secondaryActionLabel && (
            <Button variant="secondary" onClick={secondaryActionOnClick} className="rounded-xl px-5">
              {secondaryActionLabel}
            </Button>
          )}
          {actionLabel && (
            actionHref ? (
              <a href={actionHref}>
                <Button variant="primary" className="rounded-xl px-5">
                  {actionLabel}
                </Button>
              </a>
            ) : (
              <Button variant="primary" onClick={actionOnClick} className="rounded-xl px-5">
                {actionLabel}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 预设的空状态变体
 */
export const emptyStates = {
  // 内容资产空状态
  noContentAssets: (
    <EmptyState
      icon={
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      }
      title="还没有保存的内容"
      description="生成的内容会保存在这里，方便下次接着用"
      actionLabel="开始生成"
      actionHref="/workspace"
    />
  ),

  // 计划空状态
  noPlans: (
    <EmptyState
      icon={
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      }
      title="还没有制定计划"
      description="创建一个7天内容计划，每天一个任务，内容产出有章法"
      actionLabel="创建计划"
    />
  ),

  // 搜索无结果
  noSearchResults: (
    <EmptyState
      icon={
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      }
      title="没有找到相关内容"
      description="换个关键词试试，或者查看全部内容"
      secondaryActionLabel="清除筛选"
    />
  ),
};
