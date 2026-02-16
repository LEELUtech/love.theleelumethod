// functions/src/lib/analytics/emitFunnelEvent.ts
import axios, { AxiosError } from "axios";

export type FunnelValue = string | number | boolean | null;

export type FunnelEventRow = {
  event_id: string;
  event_time?: string; // ISO
  source: string;
  funnel_step: string;

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

  // allow extra columns (SalesIQ etc.) — primitives only
  [key: string]: FunnelValue | undefined;
};

type EmitResult =
  | { ok: true; event_id: string; delivered_to_zoho: true }
  | { ok: true; event_id: string; delivered_to_zoho: false; error: string }
  | { ok: false; event_id: string; error: string };

// -------------------------
// tiny helpers
// -------------------------
function env(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

function trimOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") {
    const s = v.trim();
    return s ? s : null;
  }
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : null;
  if (typeof v === "boolean") return String(v);

  try {
    const s = JSON.stringify(v);
    return s ? s : null;
  } catch {
    return null;
  }
}

function toFunnelValue(v: unknown): FunnelValue | undefined {
  if (v === undefined) return undefined;
  if (v === null) return null;

  if (typeof v === "string") {
    const s = v.trim();
    return s ? s : null;
  }
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "boolean") return v;

  try {
    const s = JSON.stringify(v);
    if (!s) return null;
    return s.length > 5000 ? s.slice(0, 5000) + "…(truncated)" : s;
  } catch {
    return null;
  }
}

function sanitizeRow(input: FunnelEventRow): FunnelEventRow {
  const out: Record<string, FunnelValue> = {};

  for (const [k, v] of Object.entries(input)) {
    const vv = toFunnelValue(v);
    if (vv === undefined) continue;
    out[k] = vv;
  }

  // required
  out.event_id = input.event_id;
  out.source = input.source;
  out.funnel_step = input.funnel_step;
  out.event_time = (input.event_time ?? new Date().toISOString()).trim();

  return out as FunnelEventRow;
}

function safePreview(obj: unknown, max = 1600) {
  try {
    const s = JSON.stringify(obj);
    return s.length > max ? s.slice(0, max) + "…(truncated)" : s;
  } catch {
    return String(obj);
  }
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

function isZohoInvalidToken(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false;

  const status = err.response?.status;
  const data = err.response?.data as unknown;

  const obj = (data && typeof data === "object" ? (data as Record<string, unknown>) : {}) as Record<
    string,
    unknown
  >;

  const code =
    (typeof obj.code === "string" ? obj.code : undefined) ||
    (typeof obj.error === "string" ? obj.error : undefined) ||
    (typeof obj.errorCode === "string" ? obj.errorCode : undefined);

  return status === 401 || code === "INVALID_TOKEN" || code === "AUTHENTICATION_FAILURE";
}

// -------------------------
// Zoho Analytics OAuth token (refresh_token flow)
// -------------------------
let cachedToken: string | null = null;
let cachedTokenExp = 0;

function clearTokenCache() {
  cachedToken = null;
  cachedTokenExp = 0;
}

async function refreshZohoAccessToken(requestId: string): Promise<string> {
  const accountsDomain = env("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
  const clientId = env("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
  const clientSecret = env("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
  const refreshToken = env("ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT");

  const url = `https://${accountsDomain}/oauth/v2/token`;

  const res = await axios.post(url, null, {
    params: {
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    },
    timeout: 15000,
    validateStatus: () => true,
  });

  if (res.status < 200 || res.status >= 300) {
    console.error("[emitFunnelEvent] token refresh HTTP error", {
      requestId,
      status: res.status,
      data: safePreview(res.data, 2000),
    });
    throw new Error(`Zoho token refresh HTTP ${res.status}: ${safePreview(res.data, 2000)}`);
  }

  const accessToken = (res.data as any)?.access_token as string | undefined;
  const expiresInSec = Number((res.data as any)?.expires_in ?? 0);

  if (!accessToken || !expiresInSec) {
    throw new Error(`Zoho token refresh failed: ${safePreview(res.data, 2000)}`);
  }

  cachedToken = accessToken;
  cachedTokenExp = Date.now() + expiresInSec * 1000 - 60_000;

  return accessToken;
}

async function getZohoAccessToken(requestId: string): Promise<string> {
  if (cachedToken && Date.now() < cachedTokenExp) return cachedToken;
  return refreshZohoAccessToken(requestId);
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

  const body = new URLSearchParams();
  body.set("DATA", JSON.stringify([row]));

  const doRequest = async (token: string) => {
    console.log("[emitFunnelEvent] >>> REQUEST START", {
      requestId,
      url,
      orgId,
      config,
      headersPreview: {
        Authorization: `Zoho-oauthtoken ${token.slice(0, 12)}…`,
        "ZANALYTICS-ORGID": orgId,
      },
      row_keys: Object.keys(row),
      row_preview: safePreview(row, 800),
    });

    const res = await axios.post(url, body.toString(), {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "ZANALYTICS-ORGID": orgId,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 20000,
      validateStatus: () => true,
    });

    console.log("[emitFunnelEvent] <<< RESPONSE", {
      requestId,
      status: res.status,
      statusText: res.statusText,
      data: safePreview(res.data, 2000),
    });

    if (res.status < 200 || res.status >= 300) {
      const err = new Error(`Zoho Analytics HTTP ${res.status}: ${safePreview(res.data, 2000)}`);
      (err as any).response = res;
      throw err;
    }
  };

  // 1) first try
  try {
    const token = await getZohoAccessToken(requestId);
    await doRequest(token);
    return;
  } catch (e) {
    // 2) retry once if invalid token
    if (!isZohoInvalidToken(e)) throw e;

    console.warn("[emitFunnelEvent] invalid token -> retry once", { requestId });
    clearTokenCache();

    const token2 = await refreshZohoAccessToken(requestId);
    await doRequest(token2);
  }
}

// -------------------------
// Public API
// -------------------------
export async function emitFunnelEvent(input: FunnelEventRow): Promise<EmitResult> {
  const requestId = `emit_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  const eventId = trimOrNull(input?.event_id);
  if (!eventId) return { ok: false, event_id: "unknown", error: "event_id is required" };

  const source = trimOrNull(input?.source);
  const step = trimOrNull(input?.funnel_step);
  if (!source) return { ok: false, event_id: eventId, error: "source is required" };
  if (!step) return { ok: false, event_id: eventId, error: "funnel_step is required" };

  const row = sanitizeRow({
    ...input,
    event_id: eventId,
    event_time: trimOrNull(input.event_time) || new Date().toISOString(),
    source,
    funnel_step: step,
  });

  try {
    await appendRowToZohoAnalytics(row, requestId);
    return { ok: true, event_id: eventId, delivered_to_zoho: true };
  } catch (e) {
    return { ok: true, event_id: eventId, delivered_to_zoho: false, error: errToMessage(e) };
  }
}
