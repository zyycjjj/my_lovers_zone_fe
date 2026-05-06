"use client";

import { FieldGroup } from "@/shared/ui/ui";

type Props = {
  viralSource: string;
  viralPlatform: string;
  viralProduct: string;
  viralMyPlatform: string;
  viralStyle: string;
  onViralSourceChange: (value: string) => void;
  onViralPlatformChange: (value: string) => void;
  onViralProductChange: (value: string) => void;
  onViralMyPlatformChange: (value: string) => void;
  onViralStyleChange: (value: string) => void;
};

const platformOptions = [
  { value: "", label: "自动识别" },
  { value: "xiaohongshu", label: "小红书" },
  { value: "douyin", label: "抖音" },
  { value: "kuaishou", label: "快手" },
  { value: "other", label: "其他" },
];

const styleOptions = ["", "种草感", "专业测评", "日常分享", "情绪共鸣", "幽默轻松"];

export function WorkspaceViralFields({
  viralSource,
  viralPlatform,
  viralProduct,
  viralMyPlatform,
  viralStyle,
  onViralSourceChange,
  onViralPlatformChange,
  onViralProductChange,
  onViralMyPlatformChange,
  onViralStyleChange,
}: Props) {
  return (
    <div className="space-y-4">
      <FieldGroup label="来源平台" hint="不选则自动识别">
        <div className="flex flex-wrap gap-2">
          {platformOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                viralPlatform === opt.value
                  ? "border-[#4A3168] bg-[#F5F3F7] text-[#4A3168]"
                  : "border-[#ECECF0] bg-white text-[#52525B] hover:border-[#D4C8E0]"
              }`}
              onClick={() => onViralPlatformChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="你的商品关键词" hint="结合你的商品生成定制版本">
        <input
          className="input-base"
          placeholder="例如：春季连衣裙、厨房收纳架"
          value={viralProduct}
          onChange={(e) => onViralProductChange(e.target.value)}
        />
      </FieldGroup>

      <FieldGroup label="你要发在哪个平台">
        <input
          className="input-base"
          placeholder="例如：小红书、抖音"
          value={viralMyPlatform}
          onChange={(e) => onViralMyPlatformChange(e.target.value)}
        />
      </FieldGroup>

      <FieldGroup label="风格偏好">
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((opt) => (
            <button
              key={opt || "default"}
              type="button"
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                viralStyle === opt
                  ? "border-[#4A3168] bg-[#F5F3F7] text-[#4A3168]"
                  : "border-[#ECECF0] bg-white text-[#52525B] hover:border-[#D4C8E0]"
              }`}
              onClick={() => onViralStyleChange(opt)}
            >
              {opt || "默认"}
            </button>
          ))}
        </div>
      </FieldGroup>
    </div>
  );
}
