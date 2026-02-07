import { onRequest } from "firebase-functions/v2/https";
import Stripe from "stripe";
import { db } from "../configs/firebase";
import { configs } from "../configs/env";
import { handleCompatibilityReport } from "../utils/compatibility-report/compatibility-report";
import { handleProtocolEssentials } from "../utils/protocol-essentials/protocol-essentials";
import { createOrUpdateContact, createDeal } from "../lib/zoho-crm"; // ✅ включаем

type ProductType =
  | "compatibility_report"
  | "protocol_essentials"
  | "guided_breakthrough"
  | "vip_immersion";

interface PaymentRecord {
  stripe_payment_intent_id: string;
  stripe_event_id: string;
  email: string;
  product_type: ProductType;
  amount: number | null;
  currency: string | null;
  status: string;
  processing_status: "processing" | "completed" | "failed";
  metadata: Record<string, string>;
  created_at: FirebaseFirestore.Timestamp | Date;
  processed_at: FirebaseFirestore.Timestamp | Date;
  error?: string;
}

let stripe: Stripe | null = null;

const getStripeClient = (): Stripe => {
  if (!stripe) {
    if (!configs.stripeSecretKeyTest) {
      throw new Error("Stripe secret key (test) is not configured");
    }
    stripe = new Stripe(configs.stripeSecretKeyTest, {
      apiVersion: "2025-04-30.basil",
    });
  }
  return stripe;
};

async function processPayment(pi: Stripe.PaymentIntent): Promise<void> {
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

function validatePaymentIntent(pi: Stripe.PaymentIntent): {
  isValid: boolean;
  email: string;
  productType: string;
  errors: string[];
} {
  const errors: string[] = [];
  const productType = pi.metadata?.product_type || "";
  const email = pi.metadata?.email || pi.receipt_email || "";

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

async function createPaymentRecordIfNotExists(
  pi: Stripe.PaymentIntent,
  eventId: string,
): Promise<{ exists: boolean; record: PaymentRecord | null }> {
  const paymentRef = db.collection("payments").doc(pi.id);

  const email = pi.metadata?.email || pi.receipt_email || "";
  if (!email) throw new Error("Email is required but missing in PaymentIntent");

  const record: PaymentRecord = {
    stripe_payment_intent_id: pi.id,
    stripe_event_id: eventId,
    email,
    product_type: pi.metadata?.product_type as ProductType,
    amount: typeof pi.amount === "number" ? pi.amount : null,
    currency: pi.currency ?? null,
    status: pi.status,
    processing_status: "processing",
    metadata: pi.metadata || {},
    created_at: new Date(),
    processed_at: new Date(),
  };

  const result = await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(paymentRef);
    if (doc.exists) return { exists: true, record: null };
    transaction.set(paymentRef, record);
    return { exists: false, record };
  });

  if (!result.exists) console.log("✅ Payment record created:", pi.id);
  return result;
}

async function updatePaymentStatus(
  paymentIntentId: string,
  processingStatus: "completed" | "failed",
  error?: string,
): Promise<void> {
  const paymentRef = db.collection("payments").doc(paymentIntentId);

  const updates: Partial<PaymentRecord> = {
    processing_status: processingStatus,
    processed_at: new Date(),
  };
  if (error) updates.error = error;

  await paymentRef.update(updates);
  console.log(`✅ Payment status updated to ${processingStatus}:`, paymentIntentId);
}

function getProductName(productType: ProductType): string {
  const names: Record<ProductType, string> = {
    compatibility_report: "Compatibility Report",
    protocol_essentials: "Protocol Essentials",
    guided_breakthrough: "Guided Breakthrough",
    vip_immersion: "VIP Immersion",
  };
  return names[productType] || productType;
}

function splitName(full?: string) {
  const s = (full || "").trim();
  if (!s) return { firstName: undefined, lastName: undefined };
  const parts = s.split(/\s+/);
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ") || undefined,
  };
}

export const stripeCircleWebhook = onRequest(
  { cors: true, region: "us-central1" },
  async (req, res) => {
    console.log("🎯 Stripe Webhook received", {
      method: req.method,
      hasBody: !!req.rawBody,
    });

    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const sig = req.headers["stripe-signature"];
    const rawBody = req.rawBody;

    if (!rawBody || !sig || !configs.stripeCircleWebhookSecret) {
      res.status(400).send("Missing required webhook data");
      return;
    }

    let event: Stripe.Event;
    try {
      event = getStripeClient().webhooks.constructEvent(
        rawBody,
        sig as string,
        configs.stripeCircleWebhookSecret as string,
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      res.status(400).send("Webhook signature verification failed");
      return;
    }

    if (event.type !== "payment_intent.succeeded") {
      res.status(200).send("Event type not handled");
      return;
    }

    const piFromEvent = event.data.object as Stripe.PaymentIntent;

    if (piFromEvent.status !== "succeeded") {
      res.status(200).send("Payment not succeeded");
      return;
    }

    // ✅ ВАЖНО: всегда берём свежий PI, чтобы подтянуть UTM/email/name/phone из update-payment-intent
    const pi = await getStripeClient().paymentIntents.retrieve(piFromEvent.id);

    const validation = validatePaymentIntent(pi);
    if (!validation.isValid) {
      console.error("❌ Invalid PaymentIntent:", {
        id: pi.id,
        errors: validation.errors,
        metadata: pi.metadata,
      });
      res.status(400).send(`Invalid payment data: ${validation.errors.join(", ")}`);
      return;
    }

    let recordResult;
    try {
      recordResult = await createPaymentRecordIfNotExists(pi, event.id);
    } catch (error) {
      console.error("❌ Failed to create payment record:", {
        payment_intent_id: pi.id,
        error: error instanceof Error ? error.message : String(error),
      });
      res.status(500).send("Failed to create payment record");
      return;
    }

    if (recordResult.exists) {
      res.status(200).send("Already processed");
      return;
    }

    const amountMajor =
      typeof pi.amount === "number" ? (pi.amount / 100).toFixed(2) : "0.00";

    console.log("💰 Payment succeeded", {
      payment_intent_id: pi.id,
      email: validation.email,
      product_type: validation.productType,
      amount: `${amountMajor} ${(pi.currency ?? "").toUpperCase()}`,
    });

    try {
      // ✅ 1) Zoho sync (не валит webhook)
      try {
        const metadata = pi.metadata || {};
        const site = (metadata.site || "").toString(); // у тебя уже нормализован в Next
        const customerId = pi.customer ? String(pi.customer) : undefined;

        const { firstName, lastName } = splitName(metadata.name);

        const productName = getProductName(validation.productType as ProductType);

        const { contactId } = await createOrUpdateContact({
          email: validation.email,
          firstName,
          lastName,
          phone: metadata.phone,
          productType: validation.productType,
          amount: typeof pi.amount === "number" ? pi.amount : 0,
          currency: pi.currency || "usd",
          site,
          stripePaymentIntentId: pi.id,
          stripeCustomerId: customerId,
          utmSource: metadata.utm_source,
          utmMedium: metadata.utm_medium,
          utmCampaign: metadata.utm_campaign,
          utmContent: metadata.utm_content,
          utmTerm: metadata.utm_term,
          pagePath: metadata.page_path,
        });

        const dealName = `${productName} - ${validation.email}`;
        await createDeal({
          contactId,
          dealName,
          amount: typeof pi.amount === "number" ? pi.amount : 0,
          currency: pi.currency || "usd",
          productType: validation.productType,
          paymentIntentId: pi.id,
          site,
          customerId,
          utmSource: metadata.utm_source,
          utmMedium: metadata.utm_medium,
          utmCampaign: metadata.utm_campaign,
          utmContent: metadata.utm_content,
          utmTerm: metadata.utm_term,
          checkoutVariant: metadata.checkout_variant,
          pagePath: metadata.page_path,
        });

        console.log("✅ Zoho CRM synced (Contact + Deal)");
      } catch (zohoError) {
        console.error("⚠️ Zoho CRM sync failed (non-critical):", zohoError);
      }

      // ✅ 2) Your business handlers
      await processPayment(pi);

      await updatePaymentStatus(pi.id, "completed");
      res.status(200).send("Success");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      await updatePaymentStatus(pi.id, "failed", errorMsg);
      console.error("❌ Payment processing failed:", {
        payment_intent_id: pi.id,
        error: errorMsg,
      });
      res.status(500).send("Payment processing failed");
    }
  },
);
