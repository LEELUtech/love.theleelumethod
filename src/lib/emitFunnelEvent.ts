// src/lib/analytics/emitFunnelEvent.ts
import "server-only";

import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

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

function cleanRequiredString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s : null;
}

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

  out.event_id = input.event_id;
  out.source = input.source;
  out.funnel_step = input.funnel_step;
  out.event_time = (input.event_time ?? new Date().toISOString()).trim();

  return out as FunnelEventRow;
}

export async function emitFunnelEvent(input: FunnelEventRow): Promise<EmitResult> {
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

  try {
    await addDoc(collection(db, "funnel_events_queue"), {
      ...row,
      _queued_at: new Date().toISOString(),
      _sent: false,
      _attempts: 0,
    });
    console.log("[emitFunnelEvent] queued", { eventId });
    return { ok: true, event_id: eventId, delivered_to_zoho: false, error: "queued" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[emitFunnelEvent] failed to queue", { eventId, error: msg });
    return { ok: false, event_id: eventId, error: msg };
  }
}
