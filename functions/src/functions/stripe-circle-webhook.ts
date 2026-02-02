import { onRequest } from "firebase-functions/v2/https";
import Stripe from "stripe";
import { db } from "../configs/firebase";
import { configs } from "../configs/env";
import { handleCompatibilityReport } from "../utils/compatibility-report/compatibility-report";
// import { handleProtocolEssentials } from "../utils/protocol-essentials/protocol-essentials";
// import { handleGuidedBreakthrough } from "../utils/guided-breakthrough/guided-breakthrough";
// import { handleVipImmersion } from "../utils/vip-immersion/vip-immersion";

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

// Initialize Stripe client
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

// Route payment to correct handler based on product type
async function processPayment(pi: Stripe.PaymentIntent): Promise<void> {
  const productType = pi.metadata?.product_type as ProductType;

  switch (productType) {
  case "compatibility_report":
    await handleCompatibilityReport(pi);
    break;

  case "protocol_essentials":
    // await handleProtocolEssentials(pi);
    console.log("Protocol Essentials handler is currently disabled.");
    break;

  case "guided_breakthrough":
    // await handleGuidedBreakthrough(pi);
    console.log("Guided Breakthrough handler is currently disabled.");
    break;

  case "vip_immersion":
    // await handleVipImmersion(pi);
    console.log("VIP Immersion handler is currently disabled.");
    break;

  default:
    throw new Error(`Unsupported product type: ${productType}`);
  }
}

// Check if payment has all required metadata
function validatePaymentIntent(pi: Stripe.PaymentIntent): {
  isValid: boolean;
  email: string;
  productType: string;
  errors: string[];
} {
  const errors: string[] = [];
  const productType = pi.metadata?.product_type || "";
  const email = pi.metadata?.email || pi.receipt_email || "";

  if (!productType) {
    errors.push("Missing product_type in metadata");
  }

  if (!email) {
    errors.push("Missing email in metadata or receipt_email");
  }

  const validProductTypes: ProductType[] = [
    "compatibility_report",
    "protocol_essentials",
    "guided_breakthrough",
    "vip_immersion",
  ];

  if (productType && !validProductTypes.includes(productType as ProductType)) {
    errors.push(`Invalid product_type: ${productType}`);
  }

  return {
    isValid: errors.length === 0,
    email,
    productType,
    errors,
  };
}

// Atomically check and create payment record (idempotency with transaction)
async function createPaymentRecordIfNotExists(
  pi: Stripe.PaymentIntent,
  eventId: string,
): Promise<{ exists: boolean; record: PaymentRecord | null }> {
  const paymentRef = db.collection("payments").doc(pi.id);

  const email = pi.metadata?.email || pi.receipt_email || "";
  if (!email) {
    throw new Error("Email is required but missing in PaymentIntent");
  }

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

  try {
    const result = await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(paymentRef);

      if (doc.exists) {
        return { exists: true, record: null };
      }

      transaction.set(paymentRef, record);
      return { exists: false, record };
    });

    if (!result.exists) {
      console.log("✅ Payment record created:", pi.id);
    }

    return result;
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    throw error;
  }
}

// Update payment record status
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

  if (error) {
    updates.error = error;
  }

  await paymentRef.update(updates);
  console.log(`✅ Payment status updated to ${processingStatus}:`, paymentIntentId);
}

export const stripeCircleWebhook = onRequest(
  {
    cors: true,
    region: "us-central1",
  },
  async (req, res) => {
    console.log("🎯 Stripe Webhook received", {
      method: req.method,
      hasBody: !!req.rawBody,
    });

    // Only accept POST requests
    if (req.method !== "POST") {
      console.warn("❌ Invalid method:", req.method);
      res.status(405).send("Method Not Allowed");
      return;
    }

    // Verify webhook signature
    const sig = req.headers["stripe-signature"];
    const rawBody = req.rawBody;

    if (!rawBody || !sig || !configs.stripeCircleWebhookSecret) {
      console.error("❌ Missing webhook data:", {
        hasRawBody: !!rawBody,
        hasSignature: !!sig,
        hasSecret: !!configs.stripeCircleWebhookSecret,
      });
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
      console.log("✅ Webhook signature verified:", event.id, event.type);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      res.status(400).send("Webhook signature verification failed");
      return;
    }

    // Only handle payment_intent.succeeded events
    if (event.type !== "payment_intent.succeeded") {
      console.log("ℹ️ Event type ignored:", event.type);
      res.status(200).send("Event type not handled");
      return;
    }

    const pi = event.data.object as Stripe.PaymentIntent;

    console.log(
      "📦 FULL PAYMENT DATA:",
      JSON.stringify(
        {
          id: pi.id,
          amount: pi.amount,
          amount_received: pi.amount_received,
          currency: pi.currency,
          status: pi.status,
          created: pi.created,
          metadata: pi.metadata,
          receipt_email: pi.receipt_email,
          customer: pi.customer,
          description: pi.description,
          payment_method: pi.payment_method,
          shipping: pi.shipping,
          billing_details: pi.latest_charge ? "see charges" : null,
        },
        null,
        2,
      ),
    );

    // Check payment status
    if (pi.status !== "succeeded") {
      console.warn("⚠️ Payment not succeeded:", {
        id: pi.id,
        status: pi.status,
      });
      res.status(200).send("Payment not succeeded");
      return;
    }

    // Validate required metadata first
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

    // Atomically create payment record (idempotency check + save in one transaction)
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
      console.log("✓ Payment already processed:", pi.id);
      res.status(200).send("Already processed");
      return;
    }

    // Log payment details (only in development)
    const amountMajor = typeof pi.amount === "number" ? (pi.amount / 100).toFixed(2) : "0.00";

    console.log("💰 Payment succeeded", {
      payment_intent_id: pi.id,
      email:  validation.email,
      product_type: validation.productType,
      amount: `${amountMajor} ${(pi.currency ?? "").toUpperCase()}`,
      created: typeof pi.created === "number" ? new Date(pi.created * 1000).toISOString() : null,
    });

    // Process payment (record already saved with status="processing")
    try {
      await processPayment(pi);
      await updatePaymentStatus(pi.id, "completed");

      console.log("✅ Payment processed successfully:", pi.id);
      res.status(200).send("Success");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);

      // Update status to failed
      await updatePaymentStatus(pi.id, "failed", errorMsg);

      console.error("❌ Payment processing failed:", {
        payment_intent_id: pi.id,
        error: errorMsg,
        stack: error instanceof Error ? error.stack : undefined,
      });

      res.status(500).send("Payment processing failed");
    }
  },
);
