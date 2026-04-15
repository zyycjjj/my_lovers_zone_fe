export type Signal = {
  id: number;
  mood: string;
  status: string;
  message?: string;
  createdAt: string;
};

export type Photo = {
  id: number;
  url: string;
  createdAt: string;
};

export const moods = [
  { label: "甜甜的", value: "sweet" },
  { label: "元气满满", value: "energetic" },
  { label: "有点累", value: "tired" },
  { label: "需要抱抱", value: "hug" },
];

export const statuses = [
  { label: "很忙但想你", value: "busy" },
  { label: "心情不错", value: "happy" },
  { label: "有点焦虑", value: "anxious" },
  { label: "想安静", value: "quiet" },
];

