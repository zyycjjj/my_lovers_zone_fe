"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, NoticePanel } from "@/shared/ui/ui";
import { apiRequest, ApiClientError } from "@/shared/lib/api";
import { getAuthSessionSnapshot } from "@/shared/lib/session-store";
import type { ViralResult, ViralStructure, ViralMyVersion } from "../workspace/workspace-model";
import { SiteHeader } from "@/shared/ui/site-header";

type Props = {};

export default function ViralScreen({}: Props) {
  const router = useRouter();
  const [source, setSource] = useState("");
  const [platform, setPlatform] = useState("");
  const [myProduct, setMyProduct] = useState("");
  const [myPlatform, setMyPlatform] = useState("");
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ViralResult | null>(null);
  const [copiedText, setCopiedText] = useState("");

  useEffect(() => {
    const session = getAuthSessionSnapshot();
    if (!session?.sessionToken) {
      router.replace("/login");
    }
  }, [router]);

  async function handleSubmit() {
    if (!source.trim()) {
      setError("先贴入爆款内容的链接或原文。");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const data = await apiRequest<ViralResult>("/api/viral/analyze", {
        method: "POST",
        timeoutMs: 45000,
        body: {
          source: source.trim(),
          sourcePlatform: platform || undefined,
          myProduct: myProduct.trim() || undefined,
          myPlatform: myPlatform.trim() || undefined,
          style: style.trim() || undefined,
        },
      });
      setResult(data);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "拆解失败，请稍后再试。",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText("已复制");
      setTimeout(() => setCopiedText(""), 1800);
    } catch {
      setCopiedText("复制失败");
      setTimeout(() => setCopiedText(""), 1800);
    }
  }

  const platformOptions = [
    { value: "", label: "自动识别" },
    { value: "xiaohongshu", label: "小红书" },
    { value: "douyin", label: "抖音" },
    { value: "kuaishou", label: "快手" },
    { value: "other", label: "其他" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SiteHeader />

      <main className="mx-auto max-w-[900px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-8 space-y-2">
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#18181B] sm:text-[30px]">
            爆款复刻
          </h1>
          <p className="text-base leading-relaxed text-[#737378]">
            贴入爆款内容，AI拆解结构并生成你的定制版本
          </p>
        </section>

        {/* 输入区 */}
        <Card className="mb-6 rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(245,243,247,0.3)_100%)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-[25px]">
          <div className="space-y-5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-strong">爆款内容链接或原文</span>
                <span className="text-xs text-muted">必填</span>
              </div>
              <textarea
                className="input-base min-h-[120px] resize-none"
                placeholder="粘贴小红书/抖音/快手的爆款笔记链接，或直接贴入原文内容..."
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>

            <div className="space-y-2.5">
              <span className="text-sm font-medium text-strong">来源平台</span>
              <div className="flex flex-wrap gap-2">
                {platformOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      platform === opt.value
                        ? "border-[#4A3168] bg-[#F5F3F7] text-[#4A3168]"
                        : "border-[#ECECF0] bg-white text-[#52525B] hover:border-[#D4C8E0]"
                    }`}
                    onClick={() => setPlatform(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <span className="text-sm font-medium text-strong">你的商品关键词</span>
                <input
                  className="input-base"
                  placeholder="例如：春季连衣裙"
                  value={myProduct}
                  onChange={(e) => setMyProduct(e.target.value)}
                />
              </div>
              <div className="space-y-2.5">
                <span className="text-sm font-medium text-strong">你要发在哪个平台</span>
                <input
                  className="input-base"
                  placeholder="例如：小红书"
                  value={myPlatform}
                  onChange={(e) => setMyPlatform(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="text-sm font-medium text-strong">风格偏好</span>
              <div className="flex flex-wrap gap-2">
                {["", "种草感", "专业测评", "日常分享", "情绪共鸣", "幽默轻松"].map((opt) => (
                  <button
                    key={opt || "default"}
                    type="button"
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      style === opt
                        ? "border-[#4A3168] bg-[#F5F3F7] text-[#4A3168]"
                        : "border-[#ECECF0] bg-white text-[#52525B] hover:border-[#D4C8E0]"
                    }`}
                    onClick={() => setStyle(opt)}
                  >
                    {opt || "默认"}
                  </button>
                ))}
              </div>
            </div>

            {error ? <NoticePanel tone="rose">{error}</NoticePanel> : null}

            <div className="flex justify-end">
              <Button
                className="rounded-[16px] bg-[#4A3168] px-6 py-3 text-white hover:bg-[#3D2856]"
                disabled={loading}
                onClick={handleSubmit}
                type="button"
              >
                {loading ? "正在拆解..." : "开始拆解"}
              </Button>
            </div>
          </div>
        </Card>

        {/* 结果区 */}
        {result ? (
          <div className="space-y-6">
            {/* 拆解结果 */}
            <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-[25px]">
              <StructureSection structure={result.structure} />
            </Card>

            {/* 我的定制版本 */}
            {result.myVersion ? (
              <Card className="rounded-[20px] border border-[rgba(212,102,143,0.12)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-[25px]">
                <MyVersionSection myVersion={result.myVersion} onCopy={handleCopy} />
              </Card>
            ) : (
              <NoticePanel tone="brand">
                拆解完成，但生成你的定制版本时出了点问题。你可以直接参考拆解结果，自己调整一下。
              </NoticePanel>
            )}
          </div>
        ) : null}

        {copiedText ? (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-[12px] bg-[#4A3168] px-4 py-2 text-sm text-white shadow-lg">
            {copiedText}
          </div>
        ) : null}
      </main>
    </div>
  );
}

function StructureSection({ structure }: { structure: ViralStructure }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(74,49,104,0.1)] text-sm">
          🔍
        </span>
        <h3 className="text-lg font-semibold text-[#18181B]">爆款拆解</h3>
      </div>

      {structure.title ? (
        <div className="rounded-[14px] bg-[#F8F4FB] px-4 py-3">
          <div className="text-xs font-medium text-[#8961F2]">原标题</div>
          <div className="mt-1 text-sm text-[#27272A]">{structure.title}</div>
        </div>
      ) : null}

      {structure.hook ? (
        <div>
          <div className="text-xs font-medium text-[#8961F2]">开场钩子策略</div>
          <div className="mt-1 text-sm leading-7 text-[#27272A]">{structure.hook}</div>
        </div>
      ) : null}

      {structure.structure.length > 0 ? (
        <div className="space-y-2">
          <div className="text-xs font-medium text-[#8961F2]">内容结构</div>
          {structure.structure.map((step, i) => (
            <div key={i} className="flex gap-3 rounded-[12px] border border-[rgba(74,49,104,0.08)] bg-white px-3 py-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4A3168] text-xs font-semibold text-white">
                {i + 1}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-[#27272A]">{step.step}</div>
                <div className="text-xs leading-5 text-[#737378]">{step.description}</div>
                <div className="mt-0.5 text-xs text-[#8961F2]">技巧：{step.technique}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        {structure.rhythmStrategy ? (
          <div className="rounded-[12px] border border-[rgba(74,49,104,0.08)] px-3 py-2.5">
            <div className="text-xs font-medium text-[#8961F2]">节奏策略</div>
            <div className="mt-1 text-xs leading-5 text-[#27272A]">{structure.rhythmStrategy}</div>
          </div>
        ) : null}
        {structure.ctaAction ? (
          <div className="rounded-[12px] border border-[rgba(74,49,104,0.08)] px-3 py-2.5">
            <div className="text-xs font-medium text-[#8961F2]">转化动作</div>
            <div className="mt-1 text-xs leading-5 text-[#27272A]">{structure.ctaAction}</div>
          </div>
        ) : null}
        {structure.emotionalTrigger ? (
          <div className="rounded-[12px] border border-[rgba(74,49,104,0.08)] px-3 py-2.5">
            <div className="text-xs font-medium text-[#8961F2]">情绪触发</div>
            <div className="mt-1 text-xs leading-5 text-[#27272A]">{structure.emotionalTrigger}</div>
          </div>
        ) : null}
        {structure.targetAudience ? (
          <div className="rounded-[12px] border border-[rgba(74,49,104,0.08)] px-3 py-2.5">
            <div className="text-xs font-medium text-[#8961F2]">目标受众</div>
            <div className="mt-1 text-xs leading-5 text-[#27272A]">{structure.targetAudience}</div>
          </div>
        ) : null}
      </div>

      {structure.sellingPoints.length > 0 ? (
        <div>
          <div className="text-xs font-medium text-[#8961F2]">卖点</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {structure.sellingPoints.map((sp, i) => (
              <span key={i} className="rounded-full bg-[#F5F3F7] px-3 py-1 text-xs text-[#4A3168]">{sp}</span>
            ))}
          </div>
        </div>
      ) : null}

      {structure.viralFactors.length > 0 ? (
        <div>
          <div className="text-xs font-medium text-[#8961F2]">为什么会火</div>
          <ul className="mt-1 space-y-1">
            {structure.viralFactors.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#27272A]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4668F]" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {structure.risks.length > 0 ? (
        <NoticePanel tone="gold">
          <div className="text-xs font-semibold">合规风险提示</div>
          <ul className="mt-1 space-y-0.5">
            {structure.risks.map((r, i) => (
              <li key={i} className="text-xs">{r}</li>
            ))}
          </ul>
        </NoticePanel>
      ) : null}
    </div>
  );
}

function MyVersionSection({ myVersion, onCopy }: { myVersion: ViralMyVersion; onCopy: (text: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(212,102,143,0.12)] text-sm">
          ✨
        </span>
        <h3 className="text-lg font-semibold text-[#18181B]">我的定制版本</h3>
      </div>

      {myVersion.title ? (
        <div className="rounded-[14px] bg-[rgba(212,102,143,0.06)] px-4 py-3">
          <div className="text-xs font-medium text-[#D4668F]">生成标题</div>
          <div className="mt-1 text-sm font-medium text-[#27272A]">{myVersion.title}</div>
        </div>
      ) : null}

      {myVersion.hook ? (
        <div>
          <div className="text-xs font-medium text-[#D4668F]">3秒钩子</div>
          <div className="mt-1 text-sm leading-7 text-[#27272A]">{myVersion.hook}</div>
        </div>
      ) : null}

      {myVersion.content30s ? (
        <div>
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-[#D4668F]">30秒版本</div>
            <button
              type="button"
              className="rounded-[10px] bg-white px-2.5 py-1 text-xs text-[#4A3168] hover:bg-[#F5F3F7]"
              onClick={() => onCopy(myVersion.content30s)}
            >
              复制
            </button>
          </div>
          <div className="mt-1 rounded-[12px] border border-[rgba(212,102,143,0.12)] px-3 py-2.5 text-sm leading-7 text-[#27272A]">
            {myVersion.content30s}
          </div>
        </div>
      ) : null}

      {myVersion.content60s ? (
        <div>
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-[#D4668F]">60秒版本</div>
            <button
              type="button"
              className="rounded-[10px] bg-white px-2.5 py-1 text-xs text-[#4A3168] hover:bg-[#F5F3F7]"
              onClick={() => onCopy(myVersion.content60s)}
            >
              复制
            </button>
          </div>
          <div className="mt-1 rounded-[12px] border border-[rgba(212,102,143,0.12)] px-3 py-2.5 text-sm leading-7 text-[#27272A]">
            {myVersion.content60s}
          </div>
        </div>
      ) : null}

      {myVersion.sellingPoints.length > 0 ? (
        <div>
          <div className="text-xs font-medium text-[#D4668F]">适配卖点</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {myVersion.sellingPoints.map((sp, i) => (
              <span key={i} className="rounded-full bg-[rgba(212,102,143,0.1)] px-3 py-1 text-xs text-[#D4668F]">{sp}</span>
            ))}
          </div>
        </div>
      ) : null}

      {myVersion.ctaLine ? (
        <div>
          <div className="text-xs font-medium text-[#D4668F]">转化引导</div>
          <div className="mt-1 text-sm text-[#27272A]">{myVersion.ctaLine}</div>
        </div>
      ) : null}

      {myVersion.adaptationNotes.length > 0 ? (
        <div>
          <div className="text-xs font-medium text-[#8961F2]">适配说明</div>
          <ul className="mt-1 space-y-1">
            {myVersion.adaptationNotes.map((n, i) => (
              <li key={i} className="text-xs leading-5 text-[#737378]">• {n}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
