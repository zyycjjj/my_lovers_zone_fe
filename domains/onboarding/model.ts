export type OnboardingStatus = {
  completed: boolean;
  profileExists: boolean;
  workspaceId?: number;
  nextStep: string;
};

export type OnboardingPayload = {
  nickname: string;
  businessRole?: string;
  industry?: string;
  contentDirection?: string;
  targetPlatform?: string;
  experienceLevel?: string;
};

export const industryDelimiter = "、";

export const businessRoles = [
  { id: "individual", label: "个体商家", icon: "🛍️" },
  { id: "streamer", label: "直播主播", icon: "📱" },
  { id: "content", label: "内容运营", icon: "✍️" },
  { id: "team", label: "团队主理人", icon: "👥" },
  { id: "other", label: "其他", icon: "✨" },
];

export const industries = [
  { id: "beauty", label: "美妆护肤", icon: "💄" },
  { id: "fashion", label: "服装饰品", icon: "👗" },
  { id: "food", label: "食品饮料", icon: "🥤" },
  { id: "digital", label: "数码电器", icon: "📱" },
  { id: "home", label: "家居生活", icon: "🪑" },
  { id: "education", label: "知识教育", icon: "📘" },
  { id: "service", label: "服务行业", icon: "🤝" },
  { id: "other", label: "其他", icon: "✨" },
];

export const emptyOnboardingForm: OnboardingPayload = {
  nickname: "",
  businessRole: "",
  industry: "",
  contentDirection: "",
  targetPlatform: "",
  experienceLevel: "",
};

export function splitIndustries(value?: string) {
  return value?.split(industryDelimiter).map((item) => item.trim()).filter(Boolean) ?? [];
}
