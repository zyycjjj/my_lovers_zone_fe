import type { RefineResult } from "../workspace-model";

export function buildRefineCopyText(result: RefineResult) {
  return [
    `一句话总结：${result.summaryLine}`,
    "",
    "卖点提炼：",
    ...result.sellingPoints.map((item) => `- ${item}`),
    "",
    "合规建议：",
    ...result.suggestions.map((item) => `- ${item}`),
    "",
    "更稳妥的表达：",
    ...result.safeRewrites.map((item) => `- ${item}`),
  ].join("\n");
}

