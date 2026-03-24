// src/lib/analytics/emitFunnelEvent.ts
import "server-only";

import axios, { AxiosError } from "axios";

/**
 * Zoho Analytics import wants flat rows.
 * Extra columns (SalesIQ etc.) are allowed but must be primitive (no objects/arrays).
 */
export type FunnelValue = string | number | boolean | null;

export type FunnelEventRow = {
  event_id: string;
  event_time?: string; // ISO
  source: string;
  funnel_step: string | null; // deprecated, but keep for compatibility with old events

  payment_intent_id?: string | null;
  intent_token?: string | null;
  email?: string | null;
  zoho_contact_id?: string | null;
  zoho_deal_id?: string | null;
  session_id?: string | null;

  site?: string | null;
  landing_page?: string | null;
  page_path?: string | null;
  checkout_variant?: string | null;

  product_type?: string | null;
  product_name?: string | null;
  amount?: number | null; // cents
  currency?: string | null;

  stripe_status?: string | null;
  stripe_error_code?: string | null;
  stripe_error_message?: string | null;
  stripe_customer_id?: string | null;

  delivery_status?: string | null;
  delivery_error?: string | null;
  abandon_reason?: string | null;

  utm_first_source?: string | null;
  utm_first_medium?: string | null;
  utm_first_campaign?: string | null;
  utm_first_content?: string | null;
  utm_first_term?: string | null;

  utm_last_source?: string | null;
  utm_last_medium?: string | null;
  utm_last_campaign?: string | null;
  utm_last_content?: string | null;
  utm_last_term?: string | null;

  device_type?: string | null;
  browser?: string | null;
  country?: string | null;
  scroll_depth?: number | null;
  time_on_page_sec?: number | null;
  chat_opened?: boolean | null;

  // allow extra columns (SalesIQ etc.) — primitives only
  [key: string]: FunnelValue | undefined;
};

type EmitResult =
  | { ok: true; event_id: string; delivered_to_zoho: true }
  | { ok: true; event_id: string; delivered_to_zoho: false; error: string }
  | { ok: false; event_id: string; error: string };

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function safePreview(obj: unknown, max = 1400) {
  try {
    const s = JSON.stringify(obj);
    return s.length > max ? s.slice(0, max) + "…(truncated)" : s;
  } catch {
    return String(obj);
  }
}

function mask(v: string, keepStart = 6, keepEnd = 4) {
  if (!v) return v;
  if (v.length <= keepStart + keepEnd) return "****";
  return `${v.slice(0, keepStart)}…${v.slice(-keepEnd)}`;
}

function errToMessage(e: unknown): string {
  const ax = e as AxiosError | undefined;
  const status = ax?.response?.status;
  const data = ax?.response?.data;

  if (ax?.message) {
    try {
      return status ? `HTTP ${status}: ${JSON.stringify(data)}` : ax.message;
    } catch {
      return ax.message;
    }
  }

  if (e instanceof Error) return e.message;

  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

function cleanRequiredString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s : null;
}

/**
 * Coerce any incoming value into a Zoho-friendly primitive:
 * - strings trimmed (empty => null)
 * - finite numbers only
 * - booleans ok
 * - null ok
 * - undefined removed
 * - objects/arrays => stringified (or null if cannot stringify)
 */
function toFunnelValue(v: unknown): FunnelValue | undefined {
  if (v === undefined) return undefined;
  if (v === null) return null;

  if (typeof v === "string") {
    const s = v.trim();
    return s ? s : null;
  }

  if (typeof v === "number") {
    return Number.isFinite(v) ? v : null;
  }

  if (typeof v === "boolean") {
    return v;
  }

  // objects/arrays: stringify to keep data but stay primitive
  try {
    const s = JSON.stringify(v);
    if (!s) return null;
    // avoid giant payloads
    return s.length > 5000 ? s.slice(0, 5000) + "…(truncated)" : s;
  } catch {
    return null;
  }
}

/**
 * Sanitizes row:
 * - removes undefined
 * - converts everything to FunnelValue (or stringified)
 * - ensures required fields exist
 */
function sanitizeRow(input: FunnelEventRow): FunnelEventRow {
  const out: Record<string, FunnelValue> = {};

  for (const [k, v] of Object.entries(input)) {
    const vv = toFunnelValue(v);
    if (vv === undefined) continue;
    out[k] = vv;
  }

  // required guarantees
  out.event_id = input.event_id;
  out.source = input.source;
  out.funnel_step = input.funnel_step;
  out.event_time = (input.event_time ?? new Date().toISOString()).trim();

  return out as FunnelEventRow;
}

// -------------------------
// Zoho Analytics OAuth token (refresh_token flow)
// -------------------------
let cachedToken: string | null = null;
let cachedTokenExp = 0;

async function getZohoAccessToken(requestId: string): Promise<string> {
  if (cachedToken && Date.now() < cachedTokenExp) {
    return cachedToken;
  }

  const accountsDomain = env("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
  const clientId = env("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
  const clientSecret = env("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
  const refreshToken = env("ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT");

  const url = `https://${accountsDomain}/oauth/v2/token`;

  console.log("[emitFunnelEvent] token refresh start", {
    requestId,
    accountsDomain,
    clientId: mask(clientId),
    clientSecret: mask(clientSecret),
    refreshToken: mask(refreshToken),
  });

  const res = await axios.post(url, null, {
    params: {
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    },
    timeout: 15000,
  });

  const accessToken = res.data?.access_token as string | undefined;
  const expiresInSec = Number(res.data?.expires_in ?? 0);

  if (!accessToken || !expiresInSec) {
    console.error("[emitFunnelEvent] token refresh failed (bad response)", {
      requestId,
      status: res.status,
      data: safePreview(res.data, 1800),
    });
    throw new Error(`Zoho token refresh failed: ${JSON.stringify(res.data)}`);
  }

  cachedToken = accessToken;
  cachedTokenExp = Date.now() + expiresInSec * 1000 - 60_000;

  console.log("[emitFunnelEvent] token refresh ok", {
    requestId,
    expiresInSec,
  });

  return accessToken;
}

// -------------------------
// Zoho Analytics append 1 row
// -------------------------
async function appendRowToZohoAnalytics(row: FunnelEventRow, requestId: string): Promise<void> {
  const apiDomain = env("ZOHO_ANALYTICS_API_DOMAIN_LILYCHYSTOFAT");
  const orgId = env("ZOHO_ANALYTICS_ORG_ID_LILYCHYSTOFAT");
  const workspaceId = env("ZOHO_ANALYTICS_WORKSPACE_ID_LILYCHYSTOFAT");
  const viewId = env("ZOHO_ANALYTICS_VIEW_ID_LILYCHYSTOFAT");

  const config = {
  importType: "append",
  fileType: "json",
  onError: "SETCOLUMNEMPTY",
  autoIdentify: true,
};

  const url =
    `https://${apiDomain}/restapi/v2/workspaces/${workspaceId}/views/${viewId}/data` +
    `?CONFIG=${encodeURIComponent(JSON.stringify(config))}`;

  const token = await getZohoAccessToken(requestId);

  const body = new URLSearchParams();
  body.set("DATA", JSON.stringify([row]));

  console.log("[emitFunnelEvent] zoho append start", {
    requestId,
    apiDomain,
    orgId,
    workspaceId,
    viewId,
    row_preview: safePreview({
      event_id: row.event_id,
      event_time: row.event_time,
      funnel_step: row.funnel_step,
      source: row.source,
      payment_intent_id: row.payment_intent_id,
      email: row.email,
      site: row.site,
      page_path: row.page_path,
      product_type: row.product_type,
      amount: row.amount,
      currency: row.currency,
    }),
  });

  await axios.post(url, body.toString(), {
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "ZANALYTICS-ORGID": orgId,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    timeout: 20000,
    validateStatus: (s) => s >= 200 && s < 300,
  });
}

// -------------------------
// Public API
// -------------------------
export async function emitFunnelEvent(input: FunnelEventRow): Promise<EmitResult> {
  const requestId = `emit_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  const eventId = cleanRequiredString(input?.event_id);
  if (!eventId) return { ok: false, event_id: "unknown", error: "event_id is required" };

  const source = cleanRequiredString(input?.source);
  const step = cleanRequiredString(input?.funnel_step);
  if (!source) return { ok: false, event_id: eventId, error: "source is required" };
  if (!step) return { ok: false, event_id: eventId, error: "funnel_step is required" };

  const row = sanitizeRow({
    ...input,
    event_id: eventId,
    event_time: cleanRequiredString(input.event_time) || new Date().toISOString(),
    source,
    funnel_step: step,
  });

  console.log("[emitFunnelEvent] start", {
    requestId,
    eventId,
    funnel_step: row.funnel_step,
    source: row.source,
  });

  const maxAttempts = 4;
  const retryDelaysMs = [1500, 3000, 5000];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await appendRowToZohoAnalytics(row, requestId);
      console.log("[emitFunnelEvent] done (delivered_to_zoho=true)", { requestId, eventId, attempt });
      return { ok: true, event_id: eventId, delivered_to_zoho: true };
    } catch (e) {
      const msg = errToMessage(e);
      const isLocked = msg.includes("ZDB_CANOVERRIDEEXCEPTION");

      if (isLocked && attempt < maxAttempts) {
        const delay = retryDelaysMs[attempt - 1];
        console.warn("[emitFunnelEvent] table locked, retrying", { requestId, eventId, attempt, delayMs: delay });
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      console.warn("[emitFunnelEvent] done (delivered_to_zoho=false)", { requestId, eventId, attempt, error: msg });
      return { ok: true, event_id: eventId, delivered_to_zoho: false, error: msg };
    }
  }

  // unreachable, but TypeScript needs it
  return { ok: true, event_id: eventId, delivered_to_zoho: false, error: "max retries exceeded" };
}
