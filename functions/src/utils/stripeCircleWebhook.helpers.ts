// functions/src/utils/stripeCircleWebhook.helpers.ts
import Stripe from "stripe";
import { db } from "../configs/firebase";
import { configs } from "../configs/env";
import { handleCompatibilityReport } from "./compatibility-report/compatibility-report";

import { handleCircleProduct } from "./helpers/circle/handleCircleProduct";

export type ProductType =
  | "compatibility_report"
  | "protocol_essentials"
  | "guided_breakthrough"
  | "vip_immersion";

export type ProcessingStatus = "processing" | "completed" | "failed";
export type DeliveryStatus = "not_started" | "delivered" | "failed";

export type FunnelStep =
  | "unknown"
  | "checkout_viewed"
  | "lead_captured"
  | "checkout_started"
  | "paid"
  | "delivered"
  | "delivery_failed"
  | "failed"
  | "canceled"
  | "abandoned";

export interface PaymentRecord {
  stripe_payment_intent_id: string;
  stripe_event_id?: string | null;

  email?: string | null;
  product_type?: ProductType | null;

  amount: number | null; // cents
  currency: string | null;
  status: string | null;

  customer_id?: string | null;

  site?: string | null;
  page_path?: string | null;
  checkout_variant?: string | null;

  // keep for now (stored in Firestore; CRM does NOT store UTM anymore)
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

  created_at: FirebaseFirestore.Timestamp | FirebaseFirestore.FieldValue | Date;
  processed_at: FirebaseFirestore.Timestamp | FirebaseFirestore.FieldValue | Date;
  updated_at?: FirebaseFirestore.Timestamp | FirebaseFirestore.FieldValue | Date;

  error?: string | null;

  [key: string]: unknown;
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

// --------------------
// tiny helpers
// --------------------
export function cleanStr(v: unknown): string | undefined {
  const s = String(v ?? "").trim();
  return s ? s : undefined;
}

export function normalizeHost(raw?: string): string | undefined {
  const s = (raw || "").trim();
  if (!s) return undefined;

  try {
    if (s.startsWith("http://") || s.startsWith("https://")) {
      const host = new URL(s).host.toLowerCase();
      return host.split(":")[0];
    }
  } catch {
    // ignore
  }

  const host = s.replace(/\/+$/, "").toLowerCase();
  return host.split(":")[0];
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

export function errToMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

// --------------------
// validation
// --------------------
export function validatePaymentIntent(pi: Stripe.PaymentIntent): {
  isValid: boolean;
  email: string;
  productType: ProductType | "";
  errors: string[];
} {
  const errors: string[] = [];

  const productType = (pi.metadata?.product_type || "") as ProductType | "";
  const emailRaw = pi.metadata?.email || pi.receipt_email || "";
  const email = String(emailRaw || "")
    .trim()
    .toLowerCase();

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

export async function processPayment(pi: Stripe.PaymentIntent): Promise<void> {
  const productType = pi.metadata?.product_type as ProductType;

  console.log(`Processing payment for product type: ${pi}`);

  switch (productType) {
    case "compatibility_report":
      handleCompatibilityReport(pi);
      break;
    case "protocol_essentials":
    case "guided_breakthrough":
    case "vip_immersion":
      handleCircleProduct(pi);
      break;

    default:
      throw new Error(`Unsupported product type: ${productType}`);
  }
}

// --------------------
// funnel / delivery advance-only
// --------------------
const FUNNEL_RANK: Record<FunnelStep, number> = {
  unknown: 0,
  checkout_viewed: 10,
  lead_captured: 20,
  abandoned: 25,
  checkout_started: 30,
  paid: 40,
  delivered: 50,
  delivery_failed: 55,
  failed: 60,
  canceled: 60,
};

function shouldAdvanceFunnel(current?: string | null, next?: FunnelStep) {
  const c = FUNNEL_RANK[(current || "unknown") as FunnelStep] ?? 0;
  const n = FUNNEL_RANK[(next || "unknown") as FunnelStep] ?? 0;
  return n >= c;
}

const DELIVERY_RANK: Record<DeliveryStatus, number> = {
  not_started: 0,
  failed: 1,
  delivered: 2,
};

function shouldAdvanceDelivery(current?: DeliveryStatus | null, next?: DeliveryStatus) {
  const c = DELIVERY_RANK[(current || "not_started") as DeliveryStatus] ?? 0;
  const n = DELIVERY_RANK[(next || "not_started") as DeliveryStatus] ?? 0;
  return n >= c;
}

function nowPlusMs(ms: number): Date {
  return new Date(Date.now() + ms);
}

function toDateMaybe(v: unknown): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;

  if (typeof v === "object" && v !== null && "toDate" in v) {
    const maybe = v as { toDate?: () => Date };
    if (typeof maybe.toDate === "function") return maybe.toDate();
  }

  const d = new Date(v as never);
  return isNaN(d.getTime()) ? null : d;
}

// --------------------
// Firestore helpers
// --------------------
export async function upsertPaymentBaseFromIntent(
  pi: Stripe.PaymentIntent,
  eventId?: string | null,
): Promise<void> {
  const metadata = (pi.metadata || {}) as Record<string, string>;

  const site = normalizeHost(cleanStr(metadata.site)) || "unknown";
  const email = String(metadata.email || pi.receipt_email || "")
    .trim()
    .toLowerCase();

  const ref = db.collection("payments").doc(pi.id);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const exists = snap.exists;

    tx.set(
      ref,
      {
        stripe_payment_intent_id: pi.id,
        stripe_event_id: eventId ?? null,

        email: email || null,
        product_type: (cleanStr(metadata.product_type) as ProductType) || null,

        amount: typeof pi.amount === "number" ? pi.amount : null,
        currency: pi.currency ?? null,
        status: (pi.status as string) ?? null,

        customer_id: pi.customer ? String(pi.customer) : null,

        site,
        page_path: cleanStr(metadata.page_path) ?? null,
        checkout_variant: cleanStr(metadata.checkout_variant) ?? null,

        // Keep UTM in Firestore for now (CRM is clean)
        utm_first_source: cleanStr(metadata.utm_first_source) ?? null,
        utm_first_medium: cleanStr(metadata.utm_first_medium) ?? null,
        utm_first_campaign: cleanStr(metadata.utm_first_campaign) ?? null,
        utm_first_content: cleanStr(metadata.utm_first_content) ?? null,
        utm_first_term: cleanStr(metadata.utm_first_term) ?? null,

        utm_last_source:
          cleanStr(metadata.utm_last_source) ?? cleanStr(metadata.utm_source) ?? null,
        utm_last_medium:
          cleanStr(metadata.utm_last_medium) ?? cleanStr(metadata.utm_medium) ?? null,
        utm_last_campaign:
          cleanStr(metadata.utm_last_campaign) ?? cleanStr(metadata.utm_campaign) ?? null,
        utm_last_content:
          cleanStr(metadata.utm_last_content) ?? cleanStr(metadata.utm_content) ?? null,
        utm_last_term: cleanStr(metadata.utm_last_term) ?? cleanStr(metadata.utm_term) ?? null,

        metadata,

        processed_at: new Date(),
        updated_at: new Date(),
        ...(exists ? {} : { created_at: new Date() }),
      },
      { merge: true },
    );
  });
}

export async function getPaymentRecord(paymentIntentId: string): Promise<PaymentRecord | null> {
  const snap = await db.collection("payments").doc(paymentIntentId).get();
  return snap.exists ? (snap.data() as PaymentRecord) : null;
}

export async function markFunnelStepAdvanceOnly(
  paymentIntentId: string,
  step: FunnelStep,
): Promise<void> {
  const ref = db.collection("payments").doc(paymentIntentId);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists
      ? ((snap.data() as PaymentRecord)?.funnel_step as string | null)
      : null;

    if (!snap.exists) {
      tx.set(
        ref,
        {
          stripe_payment_intent_id: paymentIntentId,
          funnel_step: step,
          processed_at: new Date(),
          updated_at: new Date(),
          created_at: new Date(),
        },
        { merge: true },
      );
      return;
    }

    if (!shouldAdvanceFunnel(current, step)) {
      tx.update(ref, { processed_at: new Date(), updated_at: new Date() });
      return;
    }

    tx.update(ref, { funnel_step: step, processed_at: new Date(), updated_at: new Date() });
  });
}

export async function updateDeliveryStatusAdvanceOnly(
  paymentIntentId: string,
  status: "delivered" | "failed",
  error?: string,
): Promise<void> {
  const ref = db.collection("payments").doc(paymentIntentId);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists
      ? (((snap.data() as PaymentRecord)?.delivery_status as DeliveryStatus | null) ?? null)
      : null;

    const next = status as DeliveryStatus;

    if (!snap.exists) {
      tx.set(
        ref,
        {
          stripe_payment_intent_id: paymentIntentId,
          delivery_status: next,
          delivery_error: error || null,
          processed_at: new Date(),
          updated_at: new Date(),
          created_at: new Date(),
        },
        { merge: true },
      );
      return;
    }

    if (!shouldAdvanceDelivery(current, next)) {
      if (error) {
        tx.update(ref, { delivery_error: error, processed_at: new Date(), updated_at: new Date() });
      } else {
        tx.update(ref, { processed_at: new Date(), updated_at: new Date() });
      }
      return;
    }

    tx.update(ref, {
      delivery_status: next,
      delivery_error: error || null,
      processed_at: new Date(),
      updated_at: new Date(),
    });
  });
}

export async function updateZohoContactId(
  paymentIntentId: string,
  contactId: string,
): Promise<void> {
  await db.collection("payments").doc(paymentIntentId).set(
    {
      zoho_contact_id: contactId,
      zoho_synced_at: new Date(),
      processed_at: new Date(),
      updated_at: new Date(),
    },
    { merge: true },
  );
}

export async function updateZohoDealId(paymentIntentId: string, dealId: string): Promise<void> {
  await db.collection("payments").doc(paymentIntentId).set(
    {
      zoho_deal_id: dealId,
      zoho_synced_at: new Date(),
      processed_at: new Date(),
      updated_at: new Date(),
    },
    { merge: true },
  );
}

export async function updateProcessingStatus(
  paymentIntentId: string,
  processingStatus: ProcessingStatus,
  error?: string,
): Promise<void> {
  const updates: Partial<PaymentRecord> = {
    processing_status: processingStatus,
    processed_at: new Date(),
    updated_at: new Date(),
    locked_by: null,
    lock_expires_at: null,
  };
  if (error) updates.error = error;

  await db.collection("payments").doc(paymentIntentId).set(updates, { merge: true });
}

/**
 * Lease lock:
 * - prevents parallel webhook executions from creating multiple deals
 * - supports retries after lock expiry
 */
export async function acquirePaymentLease(
  pi: Stripe.PaymentIntent,
  eventId: string,
  leaseId: string,
  leaseMs = 2 * 60 * 1000,
): Promise<
  | { state: "already_completed"; record: PaymentRecord }
  | { state: "locked_by_other"; record: PaymentRecord }
  | { state: "acquired"; record: PaymentRecord }
> {
  const paymentRef = db.collection("payments").doc(pi.id);

  const email = String(pi.metadata?.email || pi.receipt_email || "")
    .trim()
    .toLowerCase();
  if (!email) throw new Error("Email is required but missing in PaymentIntent");

  const metadata = (pi.metadata || {}) as Record<string, string>;
  const site = normalizeHost(cleanStr(metadata.site)) || "unknown";

  const recordBase = {
    stripe_payment_intent_id: pi.id,
    stripe_event_id: eventId,

    email,
    product_type: (cleanStr(metadata.product_type) as ProductType) || null,

    amount: typeof pi.amount === "number" ? pi.amount : null,
    currency: pi.currency ?? null,
    status: (pi.status as string) ?? null,

    customer_id: pi.customer ? String(pi.customer) : null,

    site,
    page_path: cleanStr(metadata.page_path) ?? null,
    checkout_variant: cleanStr(metadata.checkout_variant) ?? null,

    // Keep UTM in Firestore for now (CRM is clean)
    utm_first_source: cleanStr(metadata.utm_first_source) ?? null,
    utm_first_medium: cleanStr(metadata.utm_first_medium) ?? null,
    utm_first_campaign: cleanStr(metadata.utm_first_campaign) ?? null,
    utm_first_content: cleanStr(metadata.utm_first_content) ?? null,
    utm_first_term: cleanStr(metadata.utm_first_term) ?? null,

    utm_last_source: cleanStr(metadata.utm_last_source) ?? cleanStr(metadata.utm_source) ?? null,
    utm_last_medium: cleanStr(metadata.utm_last_medium) ?? cleanStr(metadata.utm_medium) ?? null,
    utm_last_campaign:
      cleanStr(metadata.utm_last_campaign) ?? cleanStr(metadata.utm_campaign) ?? null,
    utm_last_content: cleanStr(metadata.utm_last_content) ?? cleanStr(metadata.utm_content) ?? null,
    utm_last_term: cleanStr(metadata.utm_last_term) ?? cleanStr(metadata.utm_term) ?? null,

    metadata,
    processed_at: new Date(),
    updated_at: new Date(),
  };

  const out = await db.runTransaction(async (tx) => {
    const snap = await tx.get(paymentRef);

    if (!snap.exists) {
      const fresh: PaymentRecord = {
        ...(recordBase as PaymentRecord),

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
        processed_at: new Date(),
        updated_at: new Date(),
        error: null,
      };

      tx.set(paymentRef, fresh);
      return { state: "acquired" as const, record: fresh };
    }

    const existing = snap.data() as PaymentRecord;

    if (existing.processing_status === "completed") {
      tx.update(paymentRef, {
        stripe_event_id: eventId,
        processed_at: new Date(),
        updated_at: new Date(),
      });
      return { state: "already_completed" as const, record: existing };
    }

    const lockExpires = toDateMaybe(existing.lock_expires_at);
    const lockActive =
      !!existing.locked_by &&
      !!lockExpires &&
      lockExpires.getTime() > Date.now() &&
      existing.locked_by !== leaseId;

    if (lockActive) {
      tx.update(paymentRef, {
        stripe_event_id: eventId,
        processed_at: new Date(),
        updated_at: new Date(),
      });
      return { state: "locked_by_other" as const, record: existing };
    }

    const nextFunnel = shouldAdvanceFunnel(existing.funnel_step ?? "unknown", "paid")
      ? "paid"
      : existing.funnel_step;

    tx.update(paymentRef, {
      ...(recordBase as Partial<PaymentRecord>),
      processing_status: "processing",
      funnel_step: nextFunnel,
      locked_by: leaseId,
      lock_expires_at: nowPlusMs(leaseMs),
      attempts: (existing.attempts || 0) + 1,
      error: null,
    });

    return {
      state: "acquired" as const,
      record: {
        ...existing,
        ...(recordBase as PaymentRecord),
        processing_status: "processing",
        funnel_step: nextFunnel as FunnelStep,
        locked_by: leaseId,
        lock_expires_at: nowPlusMs(leaseMs),
      } as PaymentRecord,
    };
  });

  return out;
}
