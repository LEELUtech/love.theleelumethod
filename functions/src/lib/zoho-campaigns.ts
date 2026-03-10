// lib/zoho-campaigns.ts
import { configs } from "../configs/env";
import { getCohortData } from "./cohort";

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

  console.log("zoho-campaigns getAccessToken: refreshing token", {
    clientId: configs.zohoClientId ? configs.zohoClientId.slice(0, 6) + "…" : "EMPTY",
    refreshToken: configs.zohoRefreshCampaignsToken ? configs.zohoRefreshCampaignsToken.slice(0, 6) + "…" : "EMPTY",
  });

  const resp = await fetch(url.toString(), { method: "POST" });
  const data = await resp.json();

  console.log("zoho-campaigns getAccessToken: response", {
    status: resp.status,
    hasAccessToken: !!data.access_token,
    error: data.error ?? null,
  });

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

// ─── FETCH EXISTING CONTACT FIELDS ───────────────────────────────────────────

const NAME_FIELDS = ["First Name", "Last Name"];

async function fetchExistingContactFields(email: string, token: string): Promise<Record<string, string>> {
  try {
    const url = new URL("https://campaigns.zoho.com/api/v1.1/json/getcontactdetails");
    url.searchParams.set("resfmt", "JSON");
    url.searchParams.set("email", email);

    const resp = await fetch(url.toString(), { method: "GET", headers: authHeaders(token) });
    const data = await resp.json();

    const details = data?.contact_info?.Contact_Details;
    if (!details || typeof details !== "object") return {};

    const result: Record<string, string> = {};
    for (const [k, v] of Object.entries(details)) {
      if (typeof v === "string" && v.trim()) result[k] = v.trim();
    }
    return result;
  } catch {
    return {};
  }
}

// ─── SUBSCRIBE / UPSERT CONTACT ──────────────────────────────────────────────

async function ensureSubscribed(email: string, meta?: ContactMeta): Promise<void> {
  const token = await getAccessToken();

  // Build as JSON object — avoids issues with colons in URLs
  const contact: Record<string, string> = {
    "Contact Email": email,
  };

  if (meta) {
    // For name fields: only set if the contact doesn't already have them
    const hasNameFields = NAME_FIELDS.some((f) => meta[f] !== undefined && meta[f] !== null && String(meta[f]).trim());
    let existing: Record<string, string> = {};
    if (hasNameFields) {
      existing = await fetchExistingContactFields(email, token);
    }

    for (const [key, value] of Object.entries(meta)) {
      if (value === undefined || value === null) continue;
      const v = String(value).trim();
      if (!v) continue;
      // Skip name fields if contact already has them
      if (NAME_FIELDS.includes(key) && existing[key]) continue;
      contact[key] = v;
    }
  }

  // Auto-inject cohort fields from Firebase if not already provided via meta
  const cohort = await getCohortData();
  if (cohort.date && !contact["Cohort Start Date"]) contact["Cohort Start Date"] = cohort.date;
  if (cohort.label && !contact["Cohort Start Date Name"]) contact["Cohort Start Date Name"] = cohort.label;

  const contactinfo = JSON.stringify(contact);

  const body = new URLSearchParams();
  body.set("resfmt", "JSON");
  body.set("listkey", configs.zohoCampaignsListKey);
  body.set("contactinfo", contactinfo);

  console.log("zoho-campaigns listsubscribe", {
    email,
    listkey: configs.zohoCampaignsListKey ? configs.zohoCampaignsListKey.slice(0, 8) + "…" : "EMPTY",
    metaKeys: meta ? Object.keys(meta) : [],
    contactinfo,
  });

  const resp = await fetch("https://campaigns.zoho.com/api/v1.1/json/listsubscribe", {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const txt = await resp.text();
  console.log("zoho-campaigns listsubscribe response", resp.status, txt);

  // Zoho returns HTTP 200 even on errors — check the JSON body
  try {
    const json = JSON.parse(txt);
    if (json.status === "error") {
      // 2001 = contact unsubscribed/exists — not fatal, continue with tags
      if (json.code === 2001 || json.code === "2001") {
        console.warn(`zoho-campaigns listsubscribe 2001 (skipping): ${json.message}`, { email });
        return;
      }
      throw new Error(`listsubscribe error: ${json.code} ${json.message}`);
    }
  } catch (e: any) {
    if (e.message.startsWith("listsubscribe error")) throw e;
  }

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

// ─── GET ALL CONTACTS FROM LIST ──────────────────────────────────────────────

async function getAllListContacts(): Promise<string[]> {
  const token = await getAccessToken();
  const emails: string[] = [];
  let fromIndex = 1;
  const pageSize = 100;

  while (true) {
    const url = new URL("https://campaigns.zoho.com/api/v1.1/json/getcontactsbylistid");
    url.searchParams.set("resfmt", "JSON");
    url.searchParams.set("listkey", configs.zohoCampaignsListKey);
    url.searchParams.set("fromindex", String(fromIndex));
    url.searchParams.set("toindex", String(fromIndex + pageSize - 1));

    const resp = await fetch(url.toString(), { method: "GET", headers: authHeaders(token) });
    const data = await resp.json();

    if (data.status === "error" || !Array.isArray(data.list_of_details) || !data.list_of_details.length) break;

    for (const contact of data.list_of_details) {
      const email = String(contact["Contact Email"] ?? "").trim().toLowerCase();
      if (email) emails.push(email);
    }

    if (data.list_of_details.length < pageSize) break;
    fromIndex += pageSize;
  }

  return emails;
}

// ─── PUBLIC API ──────────────────────────────────────────────────────────────

// Bulk-update fields for every contact in the list (5 concurrent)
export async function bulkUpdateCampaignsContactField(
  fields: Record<string, string>,
): Promise<{ updated: number; failed: number }> {
  const emails = await getAllListContacts();
  console.log("bulkUpdateCampaignsContactField: contacts fetched", { count: emails.length, fields: Object.keys(fields) });

  let updated = 0;
  let failed = 0;
  const CONCURRENT = 5;

  for (let i = 0; i < emails.length; i += CONCURRENT) {
    const batch = emails.slice(i, i + CONCURRENT);
    const results = await Promise.allSettled(
      batch.map((email) => ensureSubscribed(email, fields)),
    );
    updated += results.filter((r) => r.status === "fulfilled").length;
    failed += results.filter((r) => r.status === "rejected").length;
  }

  return { updated, failed };
}

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