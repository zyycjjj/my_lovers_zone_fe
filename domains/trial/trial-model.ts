"use client";

export const maxPromptLength = 500;

export type TrialPreview = {
  title: string;
  previewText: string;
  truncated: boolean;
  hiddenChars: number;
  continueHint: string;
};

export const examplePrompts = [
  "小红书美妆种草",
  "直播带货话术",
  "抖音短视频脚本",
  "产品详情页文案",
];

export const promptTemplates: Record<string, string> = {
  小红书美妆种草:
    "帮我写一篇春季新品发布的小红书文案，产品是连衣裙，强调设计感和舒适度，语气真实自然一点。",
  直播带货话术:
    "帮我写一段直播带货话术，产品是补水面膜，突出适合熬夜党和敏感肌，节奏要利落一些。",
  抖音短视频脚本:
    "帮我写一个抖音短视频脚本，产品是便携榨汁杯，强调上班族早晨快速做早餐的场景。",
  产品详情页文案:
    "帮我整理一版产品详情页文案，产品是轻薄防晒衣，要突出透气、防晒和通勤穿搭感。",
};

export function formatMonthDay(date: Date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}
