"use client";

import { ChoicePill, FieldGroup } from "@/shared/ui/ui";
import { inputClassName } from "../workspace-model";

export function WorkspaceScriptFields({
  scriptAudience,
  scriptPrice,
  scriptScene,
  scriptStyle,
  onScriptAudienceChange,
  onScriptPriceChange,
  onScriptSceneChange,
  onScriptStyleChange,
}: {
  scriptPrice: string;
  scriptAudience: string;
  scriptScene: string;
  scriptStyle: "short" | "live";
  onScriptPriceChange: (value: string) => void;
  onScriptAudienceChange: (value: string) => void;
  onScriptSceneChange: (value: string) => void;
  onScriptStyleChange: (value: "short" | "live") => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FieldGroup hint="选填" label="价格">
        <input
          className={inputClassName()}
          inputMode="decimal"
          onChange={(event) => onScriptPriceChange(event.target.value)}
          placeholder="比如：99"
          value={scriptPrice}
        />
      </FieldGroup>
      <FieldGroup hint="选填" label="目标人群">
        <input
          className={inputClassName()}
          onChange={(event) => onScriptAudienceChange(event.target.value)}
          placeholder="比如：租房党、上班族"
          value={scriptAudience}
        />
      </FieldGroup>
      <FieldGroup className="sm:col-span-2" hint="选填" label="使用场景">
        <input
          className={inputClassName()}
          onChange={(event) => onScriptSceneChange(event.target.value)}
          placeholder="比如：办公室、宿舍、通勤"
          value={scriptScene}
        />
      </FieldGroup>
      <FieldGroup className="sm:col-span-2" label="输出风格">
        <div className="flex flex-wrap gap-3">
          <ChoicePill active={scriptStyle === "short"} onClick={() => onScriptStyleChange("short")}>
            短视频种草
          </ChoicePill>
          <ChoicePill active={scriptStyle === "live"} onClick={() => onScriptStyleChange("live")}>
            直播口播
          </ChoicePill>
        </div>
      </FieldGroup>
    </div>
  );
}

