// functions/src/utils/stripeCircleWebhook.helpers.ts
import Stripe from "stripe";
import { db } from "../configs/firebase";
import { configs } from "../configs/env";

import { handleCompatibilityReport } from "../utils/compatibility-report/compatibility-report";
import { handleProtocolEssentials } from "../utils/protocol-essentials/protocol-essentials";

export type ProductType =
  | "compatibility_report"
  | "protocol_essentials"
  | "guided_breakthrough"
  | "vip_immersion";

export type ProcessingStatus = "processing" | "completed" | "failed";
export type DeliveryStatus = "not_started" | "delivered" | "failed";

export type FunnelStep =
  | "unknown"
  | "lead_captured"
  | "checkout_started"
  | "paid"
  | "delivered"
  | "failed";

/**
 * payments/{payment_intent_id}
 * 1 документ = 1 покупка
 */
export interface PaymentRecord {
  stripe_payment_intent_id: string;
  stripe_event_id: string;

  email: string;
  product_type: ProductType;

  amount: number | null; // cents
  currency: string | null;
  status: string;

  customer_id?: string | null;

  site?: string | null;
  page_path?: string | null;
  checkout_variant?: string | null;

  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;

  metadata: Record<string, string>;

  processing_status: ProcessingStatus;
  funnel_step: FunnelStep;

  delivery_status: DeliveryStatus;
  delivery_error?: string | null;

  zoho_contact_id?: string | null;
  zoho_deal_id?: string | null;
  zoho_synced_at?: Date | null;

  locked_by?: string | null;
  lock_expires_at?: Date | null;

  attempts: number;

  created_at: Date;
  processed_at: Date;

  error?: string | null;
}

let stripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripe) {
    if (!configs.stripeSecretKeyTest) {
      throw new Error("Stripe secret key (test) is not configured");
    }
    stripe = new Stripe(configs.stripeSecretKeyTest, {
      apiVersion: "2025-04-30.basil",
    });
  }
  return stripe;
}

// --- tiny helpers ---
export function cleanStr(v: unknown): string | undefined {
  const s = String(v ?? "").trim();
  return s ? s : undefined;
}

export function normalizeHost(raw?: string): string | undefined {
  const s = (raw || "").trim();
  if (!s) return undefined;

  try {
    if (s.startsWith("http://") || s.startsWith("https://")) {
      return new URL(s).host.toLowerCase();
    }
  } catch {
    // ignore
  }

  // also remove trailing slashes
  return s.replace(/\/+$/, "").toLowerCase();
}

export function splitName(full?: string) {
  const s = (full || "").trim();
  if (!s) return { firstName: undefined, lastName: undefined };
  const parts = s.split(/\s+/);
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ") || undefined,
  };
}

export function getProductName(productType: ProductType): string {
  const names: Record<ProductType, string> = {
    compatibility_report: "Compatibility Report",
    protocol_essentials: "Protocol Essentials",
    guided_breakthrough: "Guided Breakthrough",
    vip_immersion: "VIP Immersion",
  };
  return names[productType] || productType;
}

export function validatePaymentIntent(pi: Stripe.PaymentIntent): {
  isValid: boolean;
  email: string;
  productType: ProductType | "";
  errors: string[];
} {
  const errors: string[] = [];

  const productType = (pi.metadata?.product_type || "") as ProductType | "";
  const emailRaw = pi.metadata?.email || pi.receipt_email || "";
  const email = String(emailRaw || "").trim().toLowerCase();

  if (!productType) errors.push("Missing product_type in metadata");
  if (!email) errors.push("Missing email in metadata or receipt_email");

  const validProductTypes: ProductType[] = [
    "compatibility_report",
    "protocol_essentials",
    "guided_breakthrough",
    "vip_immersion",
  ];

  if (productType && !validProductTypes.includes(productType as ProductType)) {
    errors.push(`Invalid product_type: ${productType}`);
  }

  return { isValid: errors.length === 0, email, productType, errors };
}

/**
 * Delivery handlers (Circle etc.)
 */
export async function processPayment(pi: Stripe.PaymentIntent): Promise<void> {
  const productType = pi.metadata?.product_type as ProductType;

  switch (productType) {
  case "compatibility_report":
    await handleCompatibilityReport(pi);
    break;
  case "protocol_essentials":
    await handleProtocolEssentials(pi);
    break;
  case "guided_breakthrough":
    console.log("Guided Breakthrough handler is currently disabled.");
    break;
  case "vip_immersion":
    console.log("VIP Immersion handler is currently disabled.");
    break;
  default:
    throw new Error(`Unsupported product type: ${productType}`);
  }
}

function nowPlusMs(ms: number): Date {
  return new Date(Date.now() + ms);
}

function toDateMaybe(v: any): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v?.toDate === "function") return v.toDate();
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

export function errToMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

/**
 * Lease lock:
 * - prevents parallel webhook executions from creating multiple deals
 * - also supports retries after lock expiry
 */
export async function acquirePaymentLease(
  pi: Stripe.PaymentIntent,
  eventId: string,
  leaseId: string,
  leaseMs = 2 * 60 * 1000, // 2 minutes
): Promise<
  | { state: "already_completed"; record: PaymentRecord }
  | { state: "locked_by_other"; record: PaymentRecord }
  | { state: "acquired"; record: PaymentRecord }
> {
  const paymentRef = db.collection("payments").doc(pi.id);

  const email = String(pi.metadata?.email || pi.receipt_email || "").trim().toLowerCase();
  if (!email) throw new Error("Email is required but missing in PaymentIntent");

  const metadata = (pi.metadata || {}) as Record<string, string>;
  const site = normalizeHost(cleanStr(metadata.site)) || "unknown";

  const recordBase = {
    stripe_payment_intent_id: pi.id,
    stripe_event_id: eventId,
    email,
    product_type: metadata.product_type as ProductType,
    amount: typeof pi.amount === "number" ? pi.amount : null,
    currency: pi.currency ?? null,
    status: pi.status,
    customer_id: pi.customer ? String(pi.customer) : null,

    site,
    page_path: cleanStr(metadata.page_path) ?? null,
    checkout_variant: cleanStr(metadata.checkout_variant) ?? null,

    utm_source: cleanStr(metadata.utm_source) ?? null,
    utm_medium: cleanStr(metadata.utm_medium) ?? null,
    utm_campaign: cleanStr(metadata.utm_campaign) ?? null,
    utm_content: cleanStr(metadata.utm_content) ?? null,
    utm_term: cleanStr(metadata.utm_term) ?? null,

    metadata,
    processed_at: new Date(),
  };

  const out = await db.runTransaction(async (tx) => {
    const snap = await tx.get(paymentRef);

    if (!snap.exists) {
      const fresh: PaymentRecord = {
        ...recordBase,
        processing_status: "processing",
        funnel_step: "paid",
        delivery_status: "not_started",
        delivery_error: null,

        zoho_contact_id: null,
        zoho_deal_id: null,
        zoho_synced_at: null,

        locked_by: leaseId,
        lock_expires_at: nowPlusMs(leaseMs),

        attempts: 1,
        created_at: new Date(),
        error: null,
      };

      tx.set(paymentRef, fresh);
      return { state: "acquired" as const, record: fresh };
    }

    const existing = snap.data() as PaymentRecord;

    if (existing.processing_status === "completed") {
      tx.update(paymentRef, { stripe_event_id: eventId, processed_at: new Date() });
      return { state: "already_completed" as const, record: existing };
    }

    const lockExpires = toDateMaybe(existing.lock_expires_at);
    const lockActive =
      !!existing.locked_by &&
      !!lockExpires &&
      lockExpires.getTime() > Date.now() &&
      existing.locked_by !== leaseId;

    if (lockActive) {
      tx.update(paymentRef, { stripe_event_id: eventId, processed_at: new Date() });
      return { state: "locked_by_other" as const, record: existing };
    }

    tx.update(paymentRef, {
      ...recordBase,
      processing_status: "processing",
      funnel_step: "paid",
      locked_by: leaseId,
      lock_expires_at: nowPlusMs(leaseMs),
      attempts: (existing.attempts || 0) + 1,
      error: null,
    });

    return {
      state: "acquired" as const,
      record: {
        ...existing,
        ...recordBase,
        processing_status: "processing",
        locked_by: leaseId,
        lock_expires_at: nowPlusMs(leaseMs),
      } as PaymentRecord,
    };
  });

  return out;
}

export async function getPaymentRecord(paymentIntentId: string): Promise<PaymentRecord | null> {
  const snap = await db.collection("payments").doc(paymentIntentId).get();
  return snap.exists ? (snap.data() as PaymentRecord) : null;
}

export async function markFunnelStep(paymentIntentId: string, step: FunnelStep): Promise<void> {
  await db.collection("payments").doc(paymentIntentId).update({
    funnel_step: step,
    processed_at: new Date(),
  });
}

export async function updateDeliveryStatus(
  paymentIntentId: string,
  status: "delivered" | "failed",
  error?: string,
): Promise<void> {
  await db.collection("payments").doc(paymentIntentId).update({
    delivery_status: status,
    delivery_error: error || null,
    processed_at: new Date(),
  });
}

export async function updateZohoContactId(paymentIntentId: string, contactId: string): Promise<void> {
  await db.collection("payments").doc(paymentIntentId).update({
    zoho_contact_id: contactId,
    zoho_synced_at: new Date(),
    processed_at: new Date(),
  });
}

export async function updateZohoDealId(paymentIntentId: string, dealId: string): Promise<void> {
  await db.collection("payments").doc(paymentIntentId).update({
    zoho_deal_id: dealId,
    zoho_synced_at: new Date(),
    processed_at: new Date(),
  });
}

export async function updatePaymentStatus(
  paymentIntentId: string,
  processingStatus: "completed" | "failed",
  error?: string,
): Promise<void> {
  const updates: Partial<PaymentRecord> = {
    processing_status: processingStatus,
    processed_at: new Date(),
    locked_by: null,
    lock_expires_at: null,
  };
  if (error) updates.error = error;

  await db.collection("payments").doc(paymentIntentId).update(updates);
}
