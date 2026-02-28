"use client";

import { useState } from "react";
import { apiRequest } from "../lib/api";
import { useClientToken } from "../lib/use-client-token";

type CommissionResult = {
  commission: number;
  comparisons: { price: number; commission: number }[];
  sellingPoint: string;
};

export default function CommissionPage() {
  const { token, setToken } = useClientToken();
  const [price, setPrice] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [platformRate, setPlatformRate] = useState("");
  const [result, setResult] = useState<CommissionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!token) {
      setError("请先填写 token");
      return;
    }
    if (!price || !commissionRate) {
      setError("请填写价格和佣金比例");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<CommissionResult>("/api/tool/commission", {
        token,
        body: {
          price: Number(price),
          commissionRate: Number(commissionRate),
          platformRate: platformRate ? Number(platformRate) : undefined,
        },
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "计算失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">佣金计算</h1>
        <p className="mt-2 text-sm text-slate-500">
          快速预估收益与多价位对比
        </p>
        <div className="mt-5 grid gap-4">
          <div>
            <label className="text-sm text-slate-600">访问 Token</label>
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="mt-2 w-full rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-600">商品价格</label>
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
                placeholder="例如：199"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">佣金比例</label>
              <input
                value={commissionRate}
                onChange={(event) => setCommissionRate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
                placeholder="例如：0.2"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-600">平台扣点（可选）</label>
            <input
              value={platformRate}
              onChange={(event) => setPlatformRate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
              placeholder="例如：0.1"
            />
          </div>
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
              {error}
            </div>
          ) : null}
          <button
            onClick={submit}
            disabled={loading}
            className="rounded-full bg-rose-500 px-6 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-60"
          >
            {loading ? "计算中..." : "计算佣金"}
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">计算结果</h2>
        {result ? (
          <div className="mt-4 space-y-4 text-sm text-slate-700">
            <div className="rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-3">
              <div className="text-base font-semibold text-rose-600">
                预计佣金：{result.commission} 元
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {result.sellingPoint}
              </div>
            </div>
            <div className="grid gap-2">
              {result.comparisons.map((item) => (
                <div
                  key={item.price}
                  className="flex items-center justify-between rounded-xl border border-rose-100 bg-white px-4 py-2"
                >
                  <span>售价 {item.price} 元</span>
                  <span className="font-medium text-rose-600">
                    佣金 {item.commission} 元
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-slate-500">等待计算...</div>
        )}
      </div>
    </div>
  );
}
