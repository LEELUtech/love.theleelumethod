// functions/src/webhooks/stripeCircleWebhook.ts
import { onRequest } from "firebase-functions/v2/https";
import Stripe from "stripe";
import { db } from "../configs/firebase";
import { configs } from "../configs/env";
import { handleCompatibilityReport } from "../utils/compatibility-report/compatibility-report";

let stripe: Stripe | null = null;

const getStripeClient = () => {
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

type PIProcessedDoc = {
  stripe_payment_intent_id: string;
  stripe_event_id: string;
  email: string;
  product_type: string;
  amount: number | null;
  currency: string | null;
  status: string;
  created_at: FirebaseFirestore.Timestamp | Date;
  processed_at: FirebaseFirestore.Timestamp | Date;
};

export const stripeCircleWebhook = onRequest(
  {
    cors: true,
    region: "us-central1",
  },
  async (req, res) => {
    console.log("🎯 Stripe Webhook - Request received!", { method: req.method });

    // Stripe sends POST
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const sig = req.headers["stripe-signature"];
    const rawBody = req.rawBody;

    if (!rawBody || !sig || !configs.stripeCircleWebhookSecret) {
      console.error("❌ Missing required webhook data:", {
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

    if (event.type !== "payment_intent.succeeded") {
      console.log("ℹ️ Event ignored:", event.type);
      res.status(200).send("Event ignored");
      return;
    }

    const pi = event.data.object as Stripe.PaymentIntent;

    // Only accept succeeded (safety)
    if (pi.status !== "succeeded") {
      console.log("⚠️ PaymentIntent not succeeded:", { id: pi.id, status: pi.status });
      res.status(200).send("PI not succeeded");
      return;
    }

    console.log("💰 Payment amount:", {
      amount_cents: pi.amount,
      amount_normalized: pi.amount / 100,
      currency: pi.currency,
    });

    // Pull all routing data from metadata
    const productType = pi.metadata?.product_type || "";
    const email = pi.metadata?.email || pi.receipt_email || "";

    if (!productType || !email) {
      console.error("❌ Missing metadata on PaymentIntent:", {
        id: pi.id,
        productType,
        email,
        metadata: pi.metadata,
      });
      res.status(400).send("Missing required metadata");
      return;
    }

    // ✅ Idempotency: use payment_intent.id as document id
    const paymentRef = db.collection("payments").doc(pi.id);
    const paymentDoc = await paymentRef.get();

    if (paymentDoc.exists) {
      console.log("✓ Already processed:", pi.id);
      res.status(200).send("Already processed");
      return;
    }

    console.log("💳 Processing succeeded PI:", {
      payment_intent_id: pi.id,
      email,
      productType,
      amount: pi.amount,
      currency: pi.currency,
    });

    try {
      // Route to handler
      switch (productType) {
        case "compatibility_report": {
          await handleCompatibilityReport(pi);
          break;
        }

        // case "protocol_essentials":
        // case "guided_breakthrough":
        // case "vip_immersion":
        default: {
          console.log("ℹ️ No handler for product_type:", productType);
          break;
        }
      }

      // Save record (idempotent)
      const doc: PIProcessedDoc = {
        stripe_payment_intent_id: pi.id,
        stripe_event_id: event.id,
        email,
        product_type: productType,
        amount: typeof pi.amount === "number" ? pi.amount : null,
        currency: pi.currency ?? null,
        status: pi.status,
        created_at: new Date(),
        processed_at: new Date(),
      };

      await paymentRef.set(doc);

      console.log("✅ Payment recorded:", pi.id);
      res.status(200).send("Success");
    } catch (error) {
      console.error("❌ Processing failed:", error);

      res.status(500).send("Failed to process payment");
    }
  },
);
