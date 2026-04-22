export type ActivityEvent = {
  type: "button_used";
  key: string;
  userId: number;
  occurredAt: string;
};

export type Summary = {
  date: string;
  events: { id: number; type: string; toolKey: string; count: number }[];
  latestSignal?: {
    id: number;
    mood: string;
    status: string;
    message?: string;
    createdAt: string;
  } | null;
  echoes: { id: number; text: string; createdAt: string }[];
  photos: { id: number; url: string; createdAt: string }[];
};

export type User = {
  id: number;
  token: string;
  role?: "me" | "girlfriend" | "test" | "user";
  name?: string;
  createdAt: string;
};

export type EventLog = {
  id: number;
  userId: number;
  type: string;
  toolKey: string;
  count: number;
  date: string;
  updatedAt: string;
};

export type SeedUsersResult = {
  me: User;
  girlfriend: User;
  test: User;
};

export type PaymentOrder = {
  id: number;
  orderNo: string;
  userId: number;
  accountId?: number | null;
  planKey: "experience" | "pro" | "team";
  amountFen: number;
  status: "pending" | "paid" | "activated" | "rejected" | "refunded";
  paymentRef?: string | null;
  proofNote?: string | null;
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentConfig = {
  unifiedLink?: string;
  alipayLink?: string;
  wechatLink?: string;
  alipayQrImage?: string;
  wechatQrImage?: string;
  contactText?: string;
};

export type PlanConfigItem = {
  key: "experience" | "pro" | "team";
  name: string;
  desc: string;
  priceFen: number;
  priceText: string;
  suffix: string;
  durationDays: number | null;
  quotaLimit: number;
  quotaWindow: "daily" | "total";
  features: string[];
  action: string;
  enabled: boolean;
  recommended: boolean;
};

export type PlanConfig = {
  plans: PlanConfigItem[];
};

export function maskToken(value: string) {
  if (value.length <= 8) return value;
  return `${value.slice(0, 3)}***${value.slice(-3)}`;
}
