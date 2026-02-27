// lib/zoho-campaigns.ts
import { configs } from "../configs/env";

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedAccessToken && now < tokenExpiresAt) return cachedAccessToken;

  const url = new URL("https://accounts.zoho.com/oauth/v2/token");
  url.searchParams.set("refresh_token", configs.zohoRefreshCampaignsToken);
  url.searchParams.set("client_id", configs.zohoClientId);
  url.searchParams.set("client_secret", configs.zohoClientSecret);
  url.searchParams.set("grant_type", "refresh_token");

  const resp = await fetch(url.toString(), { method: "POST" });
  const data = await resp.json();

  if (!resp.ok || !data.access_token) {
    throw new Error(`Failed to refresh Zoho access token: ${JSON.stringify(data)}`);
  }

  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + (Number(data.expires_in ?? 3600) - 60) * 1000;
  return cachedAccessToken!;
}

function authHeaders(token: string) {
  return { Authorization: `Zoho-oauthtoken ${token}` };
}

export type ContactMeta = Record<string, string | number | boolean | null | undefined>;

function sanitizeContactInfoValue(v: unknown): string {
  return String(v)
    .replace(/[{}]/g, "")
    .replace(/\r?\n/g, " ")
    .trim();
}

async function ensureSubscribed(email: string, meta?: ContactMeta): Promise<void> {
  const token = await getAccessToken();

  const pairs: string[] = [`Contact Email:${sanitizeContactInfoValue(email)}`];

  if (meta) {
    for (const [keyRaw, value] of Object.entries(meta)) {
      if (value === undefined || value === null) continue;

      const key = sanitizeContactInfoValue(keyRaw);
      if (!key) continue;

      const v = sanitizeContactInfoValue(value);
      if (!v) continue;

      pairs.push(`${key}:${v}`);
    }
  }

  const contactinfo = `{${pairs.join(",")}}`;

  const body = new URLSearchParams();
  body.set("resfmt", "JSON");
  body.set("listkey", configs.zohoCampaignsListKey);
  body.set("contactinfo", contactinfo);

  console.log("zoho-campaigns listsubscribe", {
    email,
    metaKeys: meta ? Object.keys(meta) : [],
  });

  const resp = await fetch("https://campaigns.zoho.com/api/v1.1/json/listsubscribe", {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const txt = await resp.text();
  console.log("zoho-campaigns listsubscribe response", resp.status, txt);

  if (!resp.ok) {
    throw new Error("listsubscribe failed " + txt);
  }
}

// ─── TAG HELPERS ─────────────────────────────────────────────────────────────

async function ensureTag(tag: string): Promise<void> {
  const token = await getAccessToken();
  const url = new URL("https://campaigns.zoho.com/api/v1.1/tag/add");
  url.searchParams.set("tagName", tag);

  const resp = await fetch(url.toString(), { method: "GET", headers: authHeaders(token) });
  const txt = await resp.text();
  console.log("zoho-campaigns ensureTag", tag, resp.status, txt);
}

async function addTag(tag: string, email: string): Promise<void> {
  const token = await getAccessToken();
  const url = new URL("https://campaigns.zoho.com/api/v1.1/tag/associate");
  url.searchParams.set("resfmt", "JSON");
  url.searchParams.set("tagName", tag);
  url.searchParams.set("lead_email", email);

  const resp = await fetch(url.toString(), { method: "GET", headers: authHeaders(token) });
  const txt = await resp.text();
  console.log("zoho-campaigns addTag", tag, email, resp.status, txt);

  if (!resp.ok) {
    throw new Error("associate tag failed " + txt);
  }
}

async function removeTag(tag: string, email: string): Promise<void> {
  const token = await getAccessToken();
  const url = new URL("https://campaigns.zoho.com/api/v1.1/tag/disassociate");
  url.searchParams.set("resfmt", "JSON");
  url.searchParams.set("tagName", tag);
  url.searchParams.set("lead_email", email);

  const resp = await fetch(url.toString(), { method: "GET", headers: authHeaders(token) });
  const txt = await resp.text();
  console.log("zoho-campaigns removeTag", tag, email, resp.status, txt);

  if (!resp.ok) {
    throw new Error("disassociate tag failed " + txt);
  }
}

// ─── PUBLIC API ──────────────────────────────────────────────────────────────

// Subscribe + add tags (used in sendEmail.ts etc.)
export async function upsertContactAndAddTags(
  email: string,
  tags: string[],
  meta?: ContactMeta,
): Promise<void> {
  const uniq = Array.from(new Set(tags)).filter(Boolean);

  // Always upsert contact/meta even if no tags
  await ensureSubscribed(email, meta);

  if (!uniq.length) return;

  for (const tag of uniq) {
    await ensureTag(tag);
    await addTag(tag, email);
  }
}

// Subscribe + add/remove tags (used in purchase + webhooks etc.)
export async function upsertContactAndUpdateTags(
  email: string,
  delta: { add?: string[]; remove?: string[] },
  meta?: ContactMeta,
): Promise<void> {
  const add = Array.from(new Set(delta.add ?? [])).filter(Boolean);
  const remove = Array.from(new Set(delta.remove ?? [])).filter(Boolean);

  // Always upsert contact/meta so custom fields get written
  await ensureSubscribed(email, meta);

  for (const tag of add) {
    await ensureTag(tag);
    await addTag(tag, email);
  }

  for (const tag of remove) {
    await removeTag(tag, email);
  }
}