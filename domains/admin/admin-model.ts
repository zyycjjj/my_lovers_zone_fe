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

export const adminPassStorageKey = "love.adminPass";

export function maskToken(value: string) {
  if (value.length <= 8) return value;
  return `${value.slice(0, 3)}***${value.slice(-3)}`;
}

