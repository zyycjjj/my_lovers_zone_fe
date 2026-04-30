import { cn } from "@/shared/ui/ui";

export type WorkspaceSummary = {
  id: number;
  name: string;
  type: string;
  role: string;
  status: string;
};

export type AuthMe = {
  account: {
    id: number;
    phone?: string;
    displayName?: string;
    status: string;
  };
  currentWorkspace: WorkspaceSummary | null;
  onboardingCompleted: boolean;
};

export type RoutingResult = {
  routeType: "onboarding" | "workspace_home" | "workspace_select";
  workspaceId?: number;
  reason: string;
};

export type WorkspaceList = {
  items: WorkspaceSummary[];
};

export type EntitlementStatus = {
  active: boolean;
  planKey: "experience" | "pro" | "team" | null;
  planLabel: string;
  limitWindow: "daily" | "total";
  limit: number;
  used: number;
  remaining: number;
  date: string;
  resetHint: string;
};

export type ToolKind = "title" | "script" | "refine" | "commission";

export type TitleResult = {
  titles: string[];
  assetId?: number;
};

export type ScriptResult = {
  text: string;
  assetId?: number;
};

export type RefineRisk = {
  type: string;
  matches: string[];
};

export type RefineResult = {
  summaryLine: string;
  sellingPoints: string[];
  risks: RefineRisk[];
  suggestions: string[];
  safeRewrites: string[];
  assetId?: number;
};

export type CommissionResult = {
  commission: number;
  comparisons: Array<{ price: number; commission: number }>;
  sellingPoint: string;
};

export const tools: Array<{
  key: ToolKind;
  icon: string;
  label: string;
  promptLabel: string;
  promptPlaceholder: string;
  emptyTitle: string;
  emptyDescription: string;
}> = [
  {
    key: "title",
    icon: "文",
    label: "标题生成",
    promptLabel: "描述你要生成的标题方向",
    promptPlaceholder: "例如：春季连衣裙上新，想要更适合小红书的种草标题",
    emptyTitle: "准备好了，开始生成标题吧！",
    emptyDescription: "在上方输入框描述你的商品和标题方向，先给你一组可直接参考的标题。",
  },
  {
    key: "script",
    icon: "稿",
    label: "脚本生成",
    promptLabel: "描述你要生成的脚本内容",
    promptPlaceholder: "例如：帮我写一篇春季新品发布的小红书文案，产品是连衣裙，强调设计感和舒适度...",
    emptyTitle: "准备好了，开始写吧！",
    emptyDescription: "在上方输入框描述你的需求，直接生成内容。",
  },
  {
    key: "refine",
    icon: "改",
    label: "话术提炼",
    promptLabel: "贴入你要提炼的话术",
    promptPlaceholder: "例如：这是我直播间准备讲的一段话术，想更有说服力也更稳妥",
    emptyTitle: "准备好了，开始整理吧！",
    emptyDescription: "把已有话术贴进来，帮你找卖点、识别风险、换更稳的表达。",
  },
  {
    key: "commission",
    icon: "算",
    label: "佣金测算",
    promptLabel: "补充测算背景",
    promptPlaceholder: "例如：这款商品想看高客单和低客单两种情况下的佣金空间",
    emptyTitle: "准备好了，开始测算吧！",
    emptyDescription: "填好价格、佣金和扣点信息后，帮你算清这单值不值得推。",
  },
];

export function getWorkspaceTypeLabel(type?: string) {
  return type === "team" ? "团队空间" : "个人空间";
}

export function getWorkspaceRoleLabel(role?: string) {
  if (role === "admin") return "管理员";
  if (role === "editor") return "编辑成员";
  return "主理人";
}

export function inputClassName(multiline = false) {
  return cn("input-base", multiline ? "min-h-[144px] resize-none" : "");
}

export function parseCommissionExample(example: string) {
  const priceMatch = example.match(/(\d+(?:\.\d+)?)\s*元/);
  const commissionMatch = example.match(/佣金\s*(\d+(?:\.\d+)?)%/);
  const platformMatch = example.match(/扣点\s*(\d+(?:\.\d+)?)%/);

  return {
    price: priceMatch?.[1] ?? "",
    commissionRate: commissionMatch?.[1]
      ? String(Number(commissionMatch[1]) / 100)
      : "",
    platformRate: platformMatch?.[1] ? String(Number(platformMatch[1]) / 100) : "",
  };
}

export function buildActiveTips(activeTool: ToolKind) {
  if (activeTool === "title") {
    return ["描述越详细，生成内容越精准", "可以指定平台、风格、字数等", "对生成结果不满意可重新生成"];
  }
  if (activeTool === "script") {
    return ["描述越详细，生成内容越精准", "可以指定平台、风格、字数等", "对生成结果不满意可重新生成"];
  }
  if (activeTool === "refine") {
    return ["描述越详细，生成内容越精准", "可以指定平台、风格、字数等", "对生成结果不满意可重新生成"];
  }
  return ["描述越详细，生成内容越精准", "可以指定平台、风格、字数等", "对生成结果不满意可重新生成"];
}

export function buildExamplePrompts(activeTool: ToolKind) {
  if (activeTool === "title") {
    return [
      "春季连衣裙上新，想要更适合小红书的种草标题",
      "厨房收纳架，突出省空间和实用感",
      "夏季凉感被，想做一组高点击直播预热标题",
      "香薰蜡烛，偏治愈氛围感的文案标题",
    ];
  }
  if (activeTool === "script") {
    return [
      "小红书美妆种草",
      "直播带货话术",
      "抖音短视频脚本",
      "产品详情页文案",
    ];
  }
  if (activeTool === "refine") {
    return [
      "这款面膜补水特别快，基本敷完就感觉皮肤状态很好，适合熬夜后急救。",
      "这双鞋真的巨显瘦，而且穿一天都不累，直播间很多姐妹都在回购。",
      "这个锅不挑灶台，热得快，清洗也方便，厨房新手也能轻松上手。",
    ];
  }
  return [
    "爆款零食 39.9 元，佣金 25%，平台扣点 5%",
    "家居小电器 199 元，佣金 18%，平台扣点 8%",
    "护肤套装 299 元，佣金 30%，平台扣点 10%",
  ];
}
