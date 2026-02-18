// src/lib/sessionId.ts
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server";

  const KEY = "ll_session_id";
  const existing = window.localStorage.getItem(KEY);
  if (existing && existing.length >= 12) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `sid_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(KEY, id);
  return id;
}
