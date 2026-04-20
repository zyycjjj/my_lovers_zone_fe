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
  name: string;
  desc: string;
  price: string;
  suffix: string;
  features: string[];
  action: string;
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
    name: "体验版",
    desc: "新用户专享，体验全部功能",
    price: "¥1",
    suffix: "/7天",
    features: ["每日50次生成", "全部AI模型", "10+内容模板", "7天历史记录", "社群支持"],
    action: "立即体验",
  },
  {
    name: "专业版",
    desc: "适合个人和小团队",
    price: "¥99",
    suffix: "/月",
    features: ["每日200次生成", "高级AI模型", "50+内容模板", "无限历史记录", "优先客服", "自定义模板"],
    action: "立即订阅",
    recommended: true,
  },
  {
    name: "团队版",
    desc: "适合团队协作使用",
    price: "¥299",
    suffix: "/月",
    features: ["无限次生成", "顶级AI模型", "无限模板库", "团队协作", "专属客服", "API接入"],
    action: "联系客服",
  },
];

export const stats: Stat[] = [
  { value: "50,000+", label: "创作者用户" },
  { value: "1,000,000+", label: "内容生成量" },
  { value: "98%", label: "用户满意度" },
  { value: "4.9", label: "用户评分" },
];
