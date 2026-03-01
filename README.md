This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 使用说明

### 1) 管理员初始化

1. 打开 `http://localhost:3000/admin`
2. 填写 `Admin Pass`（与后端 `ADMIN_PASS` 一致）
3. 点击“一键生成三人 Token”
4. 再点击“获取汇总”，用户列表里会出现随机 Token

这些 Token 会写入浏览器本地缓存，用于前端自动带入链接和输入框。

### 1.1) 环境变量（后端）

基础必填：

- DATABASE_URL：数据库连接串
- ADMIN_PASS：管理口令

可选（用于生成类功能脚本/标题/提炼）：

- AI_BASE_URL
- AI_API_KEY
- AI_MODEL（可选，默认 gpt-4o-mini）

未配置 AI 时，生成类功能会返回本地模板结果，便于开发期测试。

### 2) 三个角色入口

在首页「当前访问 Token」里输入对应 Token，或使用自动生成的链接：

- 我（me）：拥有所有功能和活动流查看权限
- 女朋友（girlfriend）：只能操作轻信号/回声相关功能
- 测试（test）：可查看活动流

### 3) 功能入口

- 脚本生成：输入关键词，生成口播脚本
- 标题生成：输入关键词与卖点，生成标题
- 佣金计算：输入价格和佣金比例，计算收益
- 话术提炼：粘贴话术，生成合规提示与优化建议
- 轻信号：选择心情/状态并提交

### 4) 回声与活动流

- 回声：首页会展示最新回声
- 活动流：仅 me/test 可见，输入 Admin Pass 后开启

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
