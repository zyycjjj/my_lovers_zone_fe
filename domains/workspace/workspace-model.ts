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

export type ToolKind = "title" | "script" | "refine" | "commission";

export type TitleResult = {
  titles: string[];
};

export type ScriptResult = {
  text: string;
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
  short: string;
  description: string;
  promptLabel: string;
  promptPlaceholder: string;
  emptyTitle: string;
  emptyDescription: string;
}> = [
  {
    key: "title",
    icon: "文",
    label: "标题生成",
    short: "20 条可直接挑选的标题",
    description: "先用一个关键词，把今天要发的标题方向定下来。",
    promptLabel: "描述你要生成的标题方向",
    promptPlaceholder: "例如：春季连衣裙上新，想要更适合小红书的种草标题",
    emptyTitle: "准备好了，开始生成标题吧！",
    emptyDescription: "在上方输入框描述你的商品和标题方向，AI 会先给你一组可直接参考的标题。",
  },
  {
    key: "script",
    icon: "稿",
    label: "脚本生成",
    short: "短视频和直播口播都能先出一版",
    description: "先把可讲的内容搭起来，再决定要不要继续细修。",
    promptLabel: "描述你要生成的脚本内容",
    promptPlaceholder: "例如：家用小风扇，面向租房上班族，想做一版直播口播脚本",
    emptyTitle: "准备好了，开始创作吧！",
    emptyDescription: "在上方输入框描述你的需求，AI 将为你生成一版结构清晰的内容脚本。",
  },
  {
    key: "refine",
    icon: "改",
    label: "话术提炼",
    short: "把已有话术变得更清楚、更稳妥",
    description: "适合你已经有一版话术，想更顺、更合规地表达。",
    promptLabel: "贴入你要提炼的话术",
    promptPlaceholder: "例如：这是我直播间准备讲的一段话术，想更有说服力也更稳妥",
    emptyTitle: "准备好了，开始整理吧！",
    emptyDescription: "把已有话术贴进来，我会帮你提炼卖点、识别风险并给出更顺的表达。",
  },
  {
    key: "commission",
    icon: "算",
    label: "佣金测算",
    short: "先算明白，再决定推不推",
    description: "把价格、佣金和扣点算清楚，避免盲目上链接。",
    promptLabel: "补充测算背景",
    promptPlaceholder: "例如：这款商品想看高客单和低客单两种情况下的佣金空间",
    emptyTitle: "准备好了，开始测算吧！",
    emptyDescription: "填写价格、佣金和扣点信息后，AI 会帮你快速算清这单值不值得推。",
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
    return [
      "把商品、卖点和平台场景一起写上，标题会更贴近发布场景。",
      "如果你想要情绪感或转化感，可以直接写进需求里。",
      "先出一组，再挑两条继续细化，效率更高。",
    ];
  }
  if (activeTool === "script") {
    return [
      "先写清商品、人群和场景，脚本会更具体。",
      "直播口播建议补充价格和转化目标。",
      "先跑一版，再拿结果去微调节奏和开场。",
    ];
  }
  if (activeTool === "refine") {
    return [
      "原始话术越完整，提炼后的建议越准确。",
      "把你最担心的表达问题直接写进来，会更有针对性。",
      "结果里会同时给到卖点、风险和替代表达。",
    ];
  }
  return [
    "价格和佣金比例是必填，平台扣点建议一起补上。",
    "如果想比较不同售价，可以看测算结果里的对比区。",
    "先算佣金空间，再决定主推哪一档链接更稳。",
  ];
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
      "家用小风扇，适合租房党和办公室场景",
      "美白精华，想做一版直播口播脚本",
      "厨房收纳盒，突出使用前后对比",
      "防晒衣，适合通勤女生的短视频脚本",
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

