"use client";

import { FieldGroup } from "@/shared/ui/ui";
import { inputClassName } from "../workspace-model";

export function WorkspaceTitleStyleField({
  titleStyle,
  onTitleStyleChange,
}: {
  titleStyle: string;
  onTitleStyleChange: (value: string) => void;
}) {
  return (
    <FieldGroup hint="选填" label="风格方向">
      <input
        className={inputClassName()}
        onChange={(event) => onTitleStyleChange(event.target.value)}
        placeholder="比如：口语感、情绪感、强转化"
        value={titleStyle}
      />
    </FieldGroup>
  );
}

