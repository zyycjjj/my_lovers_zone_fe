export type Benefit = {
  icon: string;
  title: string;
  description: string;
};

export type Example = {
  title: string;
  time: string;
  content: string[];
};

export type Audience = {
  icon: string;
  title: string;
  description: string;
};

export type Plan = {
  key: "experience" | "pro" | "team";
  name: string;
  desc: string;
  price: string;
  priceFen?: number;
  suffix: string;
  durationDays?: number | null;
  quotaLimit?: number;
  quotaWindow?: "daily" | "total";
  features: string[];
  action: string;
  enabled?: boolean;
  recommended?: boolean;
  checkoutMode?: boolean;
};

export type Stat = {
  value: string;
  label: string;
};

export const benefits: Benefit[] = [
  { icon: "⚡", title: "3秒出稿", description: "告别熬夜写文案，AI帮你秒出结果" },
  { icon: "🎯", title: "直接可用", description: "生成即可发布，无需二次修改" },
  { icon: "📈", title: "数据支持", description: "基于10万+爆款案例训练" },
  { icon: "💪", title: "持续陪跑", description: "不只是工具，更是你的内容助手" },
];

export const examples: Example[] = [
  {
    title: "小红书种草文案",
    time: "刚刚生成",
    content: [
      "🌸 姐妹们！终于找到了这款神仙面膜！",
      "",
      "用了一周，皮肤状态真的肉眼可见变好了！毛孔细腻了，痘印也淡了不少～",
      "",
      "💕 最爱它的温和配方，敏感肌也能用！睡前敷20分钟，早上起来皮肤水润透亮，妆容都服帖了！",
      "",
      "📦 现在还有新人优惠，姐妹们冲！",
    ],
  },
  {
    title: "直播话术脚本",
    time: "2分钟前",
    content: [
      "【开场白】",
      "各位宝宝们晚上好！我是你们的老朋友小美～今天给大家带来了超级福利！",
      "",
      "【产品介绍】",
      "这款\"熬夜党救星面膜\"真的是我近期挖到的宝！一个大礼盒里有整整7片超值装！",
      "",
      "它的核心成分是",
      "以熬夜修护著称的专研配方，敷上脸冰冰凉凉超舒服！坚持用真的能感受到肤色更均匀哦～",
      "",
      "【价格对比】",
      "今天直播间专属价！限时限量！买1件到手还送了赠品！护肤真的别不舍得，早投资！",
      "",
      "【行动引导】",
      "宝们可以直接点购物袋，现在拍立减！库存不多了，喜欢的真的别犹豫～",
    ],
  },
];

export const audiences: Audience[] = [
  { icon: "🛍️", title: "个体商家", description: "快速生成产品文案" },
  { icon: "📱", title: "直播主播", description: "一键生成话术脚本" },
  { icon: "✍️", title: "内容运营", description: "批量创作营销内容" },
  { icon: "👥", title: "团队主理人", description: "高效管理内容产出" },
];

export const plans: Plan[] = [
  {
    key: "experience",
    name: "体验版",
    desc: "先看结果，再决定是否继续",
    price: "¥1",
    suffix: "/7天",
    features: ["3条内容生成", "1次爆款复刻", "结果截断预览", "7天体验期", "可升级正式套餐"],
    action: "立即体验",
  },
  {
    key: "pro",
    name: "专业版",
    desc: "适合持续做内容的个人创作者",
    price: "¥9.9",
    suffix: "/月",
    features: ["每日10条生成", "完整内容解锁", "模板保存", "社群入口", "适合稳定日更"],
    action: "立即订阅",
    recommended: true,
  },
  {
    key: "team",
    name: "终身版",
    desc: "适合长期轻量使用",
    price: "¥66",
    suffix: "/终身",
    features: ["每日5条生成", "永久模板", "完整内容解锁", "社群入口", "长期复用"],
    action: "立即购买",
  },
];

export const stats: Stat[] = [
  { value: "50,000+", label: "创作者用户" },
  { value: "1,000,000+", label: "内容生成量" },
  { value: "98%", label: "用户满意度" },
  { value: "4.9", label: "用户评分" },
];
