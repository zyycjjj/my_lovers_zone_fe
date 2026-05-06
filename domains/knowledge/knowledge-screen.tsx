"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/shared/lib/api";
import { getAuthSessionSnapshot } from "@/shared/lib/session-store";
import { Button, Card } from "@/shared/ui/ui";
import { ErrorBoundary } from "@/shared/ui/error-boundary";

// ─── 类型 ───

type UserPreferences = {
  contentStyle: string | null;
  defaultAudience: string | null;
  brandKeywords: string | null;
  industry: string | null;
  targetPlatform: string | null;
  contentDirection: string | null;
  businessRole: string | null;
  currentGoal: string | null;
  experienceLevel: string | null;
};

type ProductProfile = {
  id: number;
  name: string;
  category: string | null;
  price: string | null;
  sellingPoints: string | null;
  targetAudience: string | null;
  platform: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProductFormData = {
  name: string;
  category: string;
  price: string;
  sellingPoints: string;
  targetAudience: string;
  platform: string;
  notes: string;
};

const emptyProductForm: ProductFormData = {
  name: "",
  category: "",
  price: "",
  sellingPoints: "",
  targetAudience: "",
  platform: "",
  notes: "",
};

const platformOptions = ["小红书", "抖音", "快手", "视频号", "淘宝直播", "其他"];

// ─── 组件 ───

export function KnowledgeScreen() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [products, setProducts] = useState<ProductProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductProfile | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState<ProductFormData>(emptyProductForm);
  const [activeTab, setActiveTab] = useState<"preferences" | "products">("products");

  // 偏好编辑状态
  const [prefForm, setPrefForm] = useState({
    contentStyle: "",
    defaultAudience: "",
    brandKeywords: "",
  });

  const loadData = useCallback(async () => {
    const session = getAuthSessionSnapshot();
    if (!session) return;
    try {
      const [prefRes, prodRes] = await Promise.all([
        apiRequest<UserPreferences>("/api/knowledge/preferences"),
        apiRequest<ProductProfile[]>("/api/knowledge/products"),
      ]);
      setPreferences(prefRes);
      setProducts(prodRes);
      setPrefForm({
        contentStyle: prefRes.contentStyle || "",
        defaultAudience: prefRes.defaultAudience || "",
        brandKeywords: prefRes.brandKeywords || "",
      });
    } catch {
      // 静默处理
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── 偏好保存 ───

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const updated = await apiRequest<UserPreferences>("/api/knowledge/preferences", {
        method: "PATCH",
        body: prefForm,
      });
      setPreferences(updated);
    } catch {
      // 静默
    } finally {
      setSaving(false);
    }
  };

  // ─── 商品 CRUD ───

  const handleSaveProduct = async () => {
    if (!productForm.name.trim()) return;
    setSaving(true);
    try {
      if (editingProduct) {
        const updated = await apiRequest<ProductProfile>(
          `/api/knowledge/products/${editingProduct.id}`,
          {
            method: "PATCH",
            body: productForm,
          },
        );
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        );
      } else {
        const created = await apiRequest<ProductProfile>("/api/knowledge/products", {
          method: "POST",
          body: productForm,
        });
        setProducts((prev) => [created, ...prev]);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm(emptyProductForm);
    } catch {
      // 静默
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("确定删除这个商品档案吗？")) return;
    try {
      await apiRequest(`/api/knowledge/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // 静默
    }
  };

  const openEditProduct = (product: ProductProfile) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category || "",
      price: product.price || "",
      sellingPoints: product.sellingPoints || "",
      targetAudience: product.targetAudience || "",
      platform: product.platform || "",
      notes: product.notes || "",
    });
    setShowProductForm(true);
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setShowProductForm(true);
  };

  // ─── 渲染 ───

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8FC]">
        <div className="text-[#737378]">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8FC]">
      {/* 顶栏 */}
      <header className="border-b border-[rgba(0,0,0,0.06)] bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <button
            onClick={() => router.back()}
            className="mr-3 text-[#737378] transition-colors hover:text-[#4A3168]"
          >
            ← 返回
          </button>
          <h1 className="text-lg font-semibold text-[#27272A]">我的知识库</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <ErrorBoundary>
          {/* Tab 切换 */}
          <div className="mb-6 flex gap-1 rounded-2xl bg-[#F5F3F7] p-1">
            {(["products", "preferences"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-white text-[#4A3168] shadow-sm"
                    : "text-[#737378] hover:text-[#4A3168]"
                }`}
              >
                {tab === "products" ? "商品档案" : "内容偏好"}
              </button>
            ))}
          </div>

          {/* 商品档案 Tab */}
          {activeTab === "products" && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#27272A]">商品档案</h2>
                  <p className="mt-1 text-sm text-[#737378]">
                    添加你的商品信息，AI生成内容时自动结合
                  </p>
                </div>
                <Button onClick={openNewProduct} className="shrink-0">
                  + 添加商品
                </Button>
              </div>

              {/* 商品列表 */}
              {products.length === 0 ? (
                <Card className="rounded-[20px] border border-dashed border-[rgba(0,0,0,0.12)] bg-[#FAFAFA] p-8 text-center">
                  <div className="text-4xl">📦</div>
                  <div className="mt-3 text-base font-medium text-[#27272A]">
                    还没有商品档案
                  </div>
                  <div className="mt-1 text-sm text-[#737378]">
                    添加你的商品信息，AI生成内容时会自动参考
                  </div>
                  <Button onClick={openNewProduct} className="mt-4">
                    添加第一个商品
                  </Button>
                </Card>
              ) : (
                <div className="space-y-3">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className="rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-colors hover:border-[#8961F2]/20"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-[#27272A]">
                              {product.name}
                            </span>
                            {product.category && (
                              <span className="rounded-full bg-[#F5F3F7] px-2 py-0.5 text-xs text-[#4A3168]">
                                {product.category}
                              </span>
                            )}
                            {product.price && (
                              <span className="text-sm font-medium text-[#D4668F]">
                                ¥{product.price}
                              </span>
                            )}
                          </div>
                          {product.sellingPoints && (
                            <div className="mt-1 text-sm text-[#6B5A78]">
                              卖点：{product.sellingPoints}
                            </div>
                          )}
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#737378]">
                            {product.targetAudience && (
                              <span>受众：{product.targetAudience}</span>
                            )}
                            {product.platform && <span>平台：{product.platform}</span>}
                          </div>
                          {product.notes && (
                            <div className="mt-1 text-xs text-[#737378]">
                              {product.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            onClick={() => openEditProduct(product)}
                            className="rounded-lg px-2 py-1 text-xs text-[#8961F2] transition-colors hover:bg-[#F5F3F7]"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="rounded-lg px-2 py-1 text-xs text-red-400 transition-colors hover:bg-red-50"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* 新增/编辑商品弹窗 */}
              {showProductForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <Card className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-xl">
                    <h3 className="text-lg font-semibold text-[#27272A]">
                      {editingProduct ? "编辑商品" : "添加商品"}
                    </h3>
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-[#27272A]">
                          商品名称 *
                        </label>
                        <input
                          value={productForm.name}
                          onChange={(e) =>
                            setProductForm((f) => ({ ...f, name: e.target.value }))
                          }
                          className="input-base"
                          placeholder="例如：春季连衣裙"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-[#27272A]">
                            类目
                          </label>
                          <input
                            value={productForm.category}
                            onChange={(e) =>
                              setProductForm((f) => ({ ...f, category: e.target.value }))
                            }
                            className="input-base"
                            placeholder="例如：服饰"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-[#27272A]">
                            价格
                          </label>
                          <input
                            value={productForm.price}
                            onChange={(e) =>
                              setProductForm((f) => ({ ...f, price: e.target.value }))
                            }
                            className="input-base"
                            placeholder="例如：199"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-[#27272A]">
                          卖点
                        </label>
                        <textarea
                          value={productForm.sellingPoints}
                          onChange={(e) =>
                            setProductForm((f) => ({
                              ...f,
                              sellingPoints: e.target.value,
                            }))
                          }
                          className="input-base min-h-[72px] resize-none"
                          placeholder="面料舒服、版型显瘦、颜色百搭"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-[#27272A]">
                          目标受众
                        </label>
                        <input
                          value={productForm.targetAudience}
                          onChange={(e) =>
                            setProductForm((f) => ({
                              ...f,
                              targetAudience: e.target.value,
                            }))
                          }
                          className="input-base"
                          placeholder="例如：25-35岁女性"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-[#27272A]">
                          主推平台
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {platformOptions.map((p) => (
                            <button
                              key={p}
                              onClick={() =>
                                setProductForm((f) => ({
                                  ...f,
                                  platform: f.platform === p ? "" : p,
                                }))
                              }
                              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                                productForm.platform === p
                                  ? "bg-[#4A3168] text-white"
                                  : "bg-[#F5F3F7] text-[#6B5A78] hover:bg-[#EDE8F3]"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-[#27272A]">
                          备注
                        </label>
                        <input
                          value={productForm.notes}
                          onChange={(e) =>
                            setProductForm((f) => ({ ...f, notes: e.target.value }))
                          }
                          className="input-base"
                          placeholder="其他备注信息"
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <Button
                        onClick={handleSaveProduct}
                        disabled={saving || !productForm.name.trim()}
                        className="flex-1"
                      >
                        {saving ? "保存中..." : "保存"}
                      </Button>
                      <button
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                        }}
                        className="flex-1 rounded-xl border border-[rgba(0,0,0,0.08)] py-2.5 text-sm font-medium text-[#737378] transition-colors hover:bg-[#FAFAFA]"
                      >
                        取消
                      </button>
                    </div>
                  </Card>
                </div>
              )}
            </section>
          )}

          {/* 内容偏好 Tab */}
          {activeTab === "preferences" && (
            <section>
              <div className="mb-4">
                <h2 className="text-base font-semibold text-[#27272A]">内容偏好</h2>
                <p className="mt-1 text-sm text-[#737378]">
                  设置你的风格和受众偏好，AI生成内容时会自动参考
                </p>
              </div>

              {/* 只读的建档信息 */}
              {preferences && (
                <Card className="mb-4 rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] p-4">
                  <div className="mb-2 text-xs font-medium text-[#737378]">
                    建档时填写的信息（在建档页修改）
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {preferences.industry && (
                      <div>
                        <span className="text-[#737378]">行业：</span>
                        <span className="text-[#27272A]">{preferences.industry}</span>
                      </div>
                    )}
                    {preferences.businessRole && (
                      <div>
                        <span className="text-[#737378]">角色：</span>
                        <span className="text-[#27272A]">{preferences.businessRole}</span>
                      </div>
                    )}
                    {preferences.targetPlatform && (
                      <div>
                        <span className="text-[#737378]">主平台：</span>
                        <span className="text-[#27272A]">{preferences.targetPlatform}</span>
                      </div>
                    )}
                    {preferences.contentDirection && (
                      <div>
                        <span className="text-[#737378]">内容方向：</span>
                        <span className="text-[#27272A]">{preferences.contentDirection}</span>
                      </div>
                    )}
                    {preferences.currentGoal && (
                      <div>
                        <span className="text-[#737378]">当前目标：</span>
                        <span className="text-[#27272A]">{preferences.currentGoal}</span>
                      </div>
                    )}
                    {preferences.experienceLevel && (
                      <div>
                        <span className="text-[#737378]">经验：</span>
                        <span className="text-[#27272A]">{preferences.experienceLevel}</span>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <Card className="rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#27272A]">
                      内容风格
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["种草感", "专业测评", "生活分享", "口播带货", "知识科普", "剧情故事"].map(
                        (style) => (
                          <button
                            key={style}
                            onClick={() =>
                              setPrefForm((f) => ({
                                ...f,
                                contentStyle: f.contentStyle === style ? "" : style,
                              }))
                            }
                            className={`rounded-full px-3 py-1 text-xs transition-colors ${
                              prefForm.contentStyle === style
                                ? "bg-[#4A3168] text-white"
                                : "bg-[#F5F3F7] text-[#6B5A78] hover:bg-[#EDE8F3]"
                            }`}
                          >
                            {style}
                          </button>
                        ),
                      )}
                    </div>
                    <input
                      value={prefForm.contentStyle}
                      onChange={(e) =>
                        setPrefForm((f) => ({ ...f, contentStyle: e.target.value }))
                      }
                      className="input-base mt-2"
                      placeholder="或自定义风格"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#27272A]">
                      默认目标受众
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["18-25岁女性", "25-35岁女性", "宝妈群体", "学生党", "职场白领", "通用"].map(
                        (aud) => (
                          <button
                            key={aud}
                            onClick={() =>
                              setPrefForm((f) => ({
                                ...f,
                                defaultAudience: f.defaultAudience === aud ? "" : aud,
                              }))
                            }
                            className={`rounded-full px-3 py-1 text-xs transition-colors ${
                              prefForm.defaultAudience === aud
                                ? "bg-[#4A3168] text-white"
                                : "bg-[#F5F3F7] text-[#6B5A78] hover:bg-[#EDE8F3]"
                            }`}
                          >
                            {aud}
                          </button>
                        ),
                      )}
                    </div>
                    <input
                      value={prefForm.defaultAudience}
                      onChange={(e) =>
                        setPrefForm((f) => ({ ...f, defaultAudience: e.target.value }))
                      }
                      className="input-base mt-2"
                      placeholder="或自定义受众描述"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#27272A]">
                      品牌关键词
                    </label>
                    <input
                      value={prefForm.brandKeywords}
                      onChange={(e) =>
                        setPrefForm((f) => ({ ...f, brandKeywords: e.target.value }))
                      }
                      className="input-base"
                      placeholder="例如：性价比、日常实用、小众好物"
                    />
                    <div className="mt-1 text-xs text-[#737378]">
                      多个关键词用逗号分隔，AI生成时会参考这些关键词
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="mt-5 w-full"
                >
                  {saving ? "保存中..." : "保存偏好"}
                </Button>
              </Card>
            </section>
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}
