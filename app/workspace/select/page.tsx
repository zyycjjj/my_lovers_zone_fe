"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";
import { useAuthSession } from "../../lib/session-store";
import { Button, Card, SectionHeading, SoftBadge } from "../../components/ui";

type WorkspaceSummary = {
  id: number;
  name: string;
  type: string;
  role: string;
  status: string;
};

type WorkspaceList = {
  items: WorkspaceSummary[];
};

export default function WorkspaceSelectPage() {
  const router = useRouter();
  const session = useAuthSession();
  const [items, setItems] = useState<WorkspaceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.sessionToken) {
      router.replace("/login");
      return;
    }

    let active = true;

    apiRequest<WorkspaceList>("/api/workspaces")
      .then((response) => {
        if (!active) return;
        const nextItems = response.items || [];
        setItems(nextItems);
        setLoading(false);

        if (nextItems.length <= 1) {
          router.replace("/workspace");
        }
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router, session?.sessionToken]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="rounded-[32px]">
        <div className="space-y-4">
          <SoftBadge tone="brand">选择工作空间</SoftBadge>
          <SectionHeading
            eyebrow="Workspace Switch"
            title="选一个你要继续的空间"
            description="多空间场景下，先回到你这次要继续的那个空间。"
          />
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-[28px]">
          <p className="text-sm text-[--text-soft]">正在加载空间列表…</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id} className="rounded-[28px]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-base font-semibold text-[--text-strong]">
                    {item.name}
                  </div>
                  <div className="mt-1 text-sm text-[--text-soft]">
                    {item.type} / {item.role} / {item.status}
                  </div>
                </div>
                <Button onClick={() => router.push("/workspace")} type="button">
                  进入这个空间
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
