// functions/src/webhooks/stripeCircleWebhook.ts
import { onRequest } from "firebase-functions/v2/https";
import Stripe from "stripe";
import { defineSecret } from "firebase-functions/params";

import { configs } from "../configs/env";

import { createOrUpdateContact, createDeal, updateContactFunnelStepByEmail } from "../lib/zoho-crm";

import {
  cleanStr,
  normalizeHost,
  splitName,
  getProductName,
  validatePaymentIntent,
  acquirePaymentLease,
  upsertPaymentBaseFromIntent,
  markFunnelStepAdvanceOnly,
  updateDeliveryStatusAdvanceOnly,
  updateZohoContactId,
  updateZohoDealId,
  getPaymentRecord,
  updateProcessingStatus,
  getStripeClient,
  processPayment,
  ProductType,
  errToMessage,
} from "../utils/stripeCircleWebhook.helpers";

// Secrets must be attached to this function (Firebase v2)
const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_DEAL_LAYOUT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_DEAL_LAYOUT_ID_LILYCHYSTOFAT");

function safeId(id: string) {
  return id.length > 10 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;
}

const HANDLED_EVENT_TYPES = [
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
] as const;

type HandledEventType = (typeof HANDLED_EVENT_TYPES)[number];

function isHandledEventType(v: unknown): v is HandledEventType {
  return typeof v === "string" && (HANDLED_EVENT_TYPES as readonly string[]).includes(v);
}

type StripeRawBodyRequest = {
  rawBody?: Buffer;
};

export const stripeCircleWebhook = onRequest(
  {
    cors: true,
    region: "us-central1",
    secrets: [
      ZOHO_CLIENT_ID_LILYCHYSTOFAT,
      ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_LILYCHYSTOFAT,
      ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
      ZOHO_API_DOMAIN_LILYCHYSTOFAT,
      ZOHO_DEAL_LAYOUT_ID_LILYCHYSTOFAT,
    ],
  },
  async (req, res) => {
    const startedAt = Date.now();
    const leaseId = `wh_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    try {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const sig = req.headers["stripe-signature"];
      const rawBody = (req as unknown as StripeRawBodyRequest).rawBody;

      if (!rawBody || !sig || !configs.stripeCircleWebhookSecret) {
        res.status(400).send("Missing required webhook data");
        return;
      }

      // Deal layoutId from Firebase Secret (passed to createDeal)
      const dealLayoutId = cleanStr(ZOHO_DEAL_LAYOUT_ID_LILYCHYSTOFAT.value());

      const stripe = getStripeClient();

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          sig as string,
          configs.stripeCircleWebhookSecret,
        );
      } catch (e) {
        console.error("Stripe signature verification failed", errToMessage(e));
        res.status(400).send("Webhook signature verification failed");
        return;
      }

      if (!isHandledEventType(event.type)) {
        res.status(200).send("Event type not handled");
        return;
      }

      const piFromEvent = event.data.object as Stripe.PaymentIntent;

      // Always re-fetch PI from Stripe (fresh status + metadata)
      const pi = await stripe.paymentIntents.retrieve(piFromEvent.id);

      const metadata = (pi.metadata || {}) as Record<string, string>;

      const utmLastSource = cleanStr(metadata.utm_last_source) || cleanStr(metadata.utm_source);
      const utmLastMedium = cleanStr(metadata.utm_last_medium) || cleanStr(metadata.utm_medium);
      const utmLastCampaign =
        cleanStr(metadata.utm_last_campaign) || cleanStr(metadata.utm_campaign);
      const utmLastContent = cleanStr(metadata.utm_last_content) || cleanStr(metadata.utm_content);
      const utmLastTerm = cleanStr(metadata.utm_last_term) || cleanStr(metadata.utm_term);

      const lastPagePath = cleanStr(metadata.page_path);

      const site = normalizeHost(cleanStr(metadata.site)) || "unknown";
      const customerId = pi.customer ? String(pi.customer) : undefined;

      const emailMaybe = (cleanStr(metadata.email) || cleanStr(pi.receipt_email) || "")
        .trim()
        .toLowerCase();

      // ---------------------------------------------------
      // FAILED / CANCELED
      // ---------------------------------------------------
      if (
        event.type === "payment_intent.payment_failed" ||
        event.type === "payment_intent.canceled"
      ) {
        const isCanceled = event.type === "payment_intent.canceled";
        const msg = isCanceled
          ? "Payment canceled"
          : pi.last_payment_error?.message || "Payment failed";

        console.log("Payment failed/canceled", {
          payment_intent_id: pi.id,
          event: safeId(event.id),
          type: event.type,
          stripe_status: pi.status,
          email: emailMaybe || undefined,
          reason: msg,
        });

        // 0) Upsert Firestore base doc (best-effort)
        try {
          await upsertPaymentBaseFromIntent(pi, event.id);
        } catch (e) {
          console.error("Upsert payment base failed (failed/canceled)", {
            payment_intent_id: pi.id,
            error: errToMessage(e),
          });
        }

        // 1) Firestore status updates (advance-only funnel + delivery)
        try {
          await markFunnelStepAdvanceOnly(pi.id, isCanceled ? "canceled" : "failed");
          await updateProcessingStatus(pi.id, "failed", msg);
        } catch (e) {
          console.error("Firestore update failed for failed/canceled", {
            payment_intent_id: pi.id,
            error: errToMessage(e),
          });
        }

        // 2) Zoho best-effort
        try {
          const email = cleanStr(metadata.email) || cleanStr(pi.receipt_email);
          const productType = cleanStr(metadata.product_type);

          if (email && productType) {
            const { firstName, lastName } = splitName(metadata.name);

            const c = await createOrUpdateContact({
              email: email.toLowerCase(),
              firstName,
              lastName,
              phone: cleanStr(metadata.phone),

              productType,
              amount: typeof pi.amount === "number" ? pi.amount : 0,
              currency: pi.currency || "usd",
              site,

              stripePaymentIntentId: pi.id,
              stripeCustomerId: customerId,

              utmSource: utmLastSource,
              utmMedium: utmLastMedium,
              utmCampaign: utmLastCampaign,
              utmContent: utmLastContent,
              utmTerm: utmLastTerm,

              pagePath: lastPagePath,
            });

            try {
              await updateZohoContactId(pi.id, c.contactId);
            } catch {
              // ignore
            }

            await updateContactFunnelStepByEmail({
              email: email.toLowerCase(),
              funnelStep: isCanceled ? "canceled" : "failed",
              lastError: msg,
            });
          }
        } catch (e) {
          console.error("Zoho sync failed for failed/canceled (non-critical)", {
            payment_intent_id: pi.id,
            error: errToMessage(e),
          });
        }

        res.status(200).send("Accepted");
        return;
      }

      // ---------------------------------------------------
      // SUCCEEDED
      // ---------------------------------------------------
      if (pi.status !== "succeeded") {
        res.status(200).send("Payment not succeeded");
        return;
      }

      const validation = validatePaymentIntent(pi);
      if (!validation.isValid) {
        console.error("Invalid PaymentIntent (no retry)", {
          id: pi.id,
          errors: validation.errors,
          metadata: pi.metadata,
          receipt_email: pi.receipt_email,
        });
        res.status(200).send(`Invalid payment data: ${validation.errors.join(", ")}`);
        return;
      }

      // Always upsert base doc early
      try {
        await upsertPaymentBaseFromIntent(pi, event.id);
      } catch (e) {
        console.error("Upsert payment base failed (succeeded)", {
          payment_intent_id: pi.id,
          error: errToMessage(e),
        });
      }

      // Idempotency / concurrency (lease)
      const lease = await acquirePaymentLease(pi, event.id, leaseId);
      if (lease.state === "already_completed") {
        console.log("Already completed", { pi: pi.id, event: safeId(event.id) });
        res.status(200).send("Already processed");
        return;
      }
      if (lease.state === "locked_by_other") {
        console.log("Locked by other", { pi: pi.id, event: safeId(event.id) });
        res.status(200).send("In progress");
        return;
      }

      console.log("Payment succeeded", {
        payment_intent_id: pi.id,
        email: validation.email,
        product_type: validation.productType,
        amount: `${(pi.amount / 100).toFixed(2)} ${(pi.currency ?? "").toUpperCase()}`,
        site,
        leaseId,
      });

      // Firestore: paid (advance-only)
      await markFunnelStepAdvanceOnly(pi.id, "paid");

      // Zoho contact (even if delivery fails)
      let contactId: string | undefined;
      try {
        const { firstName, lastName } = splitName(metadata.name);

        const c = await createOrUpdateContact({
          email: validation.email,
          firstName,
          lastName,
          phone: cleanStr(metadata.phone),

          productType: String(validation.productType),
          amount: typeof pi.amount === "number" ? pi.amount : 0,
          currency: pi.currency || "usd",
          site,

          stripePaymentIntentId: pi.id,
          stripeCustomerId: customerId,

          utmSource: utmLastSource,
          utmMedium: utmLastMedium,
          utmCampaign: utmLastCampaign,
          utmContent: utmLastContent,
          utmTerm: utmLastTerm,

          pagePath: lastPagePath,
        });

        contactId = c.contactId;
        await updateZohoContactId(pi.id, contactId);

        await updateContactFunnelStepByEmail({
          email: validation.email,
          funnelStep: "paid",
        });

        console.log("Zoho contact synced", { payment_intent_id: pi.id, contactId });
      } catch (e) {
        console.error("Zoho contact sync failed", {
          payment_intent_id: pi.id,
          error: errToMessage(e),
        });
      }

      // Delivery (Circle etc.)
      try {
        await processPayment(pi);

        await updateDeliveryStatusAdvanceOnly(pi.id, "delivered");
        await markFunnelStepAdvanceOnly(pi.id, "delivered");

        await updateContactFunnelStepByEmail({
          email: validation.email,
          funnelStep: "delivered",
        });
      } catch (e) {
        const msg = errToMessage(e);

        console.error("Delivery failed", { payment_intent_id: pi.id, error: msg });

        await updateDeliveryStatusAdvanceOnly(pi.id, "failed", msg);
        await markFunnelStepAdvanceOnly(pi.id, "delivery_failed");
        await updateProcessingStatus(pi.id, "failed", msg);

        try {
          await updateContactFunnelStepByEmail({
            email: validation.email,
            funnelStep: "delivery_failed",
            lastError: msg,
          });
        } catch (e2) {
          console.error("Zoho funnel update failed (delivery_failed)", {
            payment_intent_id: pi.id,
            error: errToMessage(e2),
          });
        }

        res.status(200).send("Accepted (delivery failed)");
        return;
      }

      // Deal only after delivery success
      try {
        const existing = await getPaymentRecord(pi.id);

        if (existing?.zoho_deal_id) {
          console.log("Deal already exists", {
            payment_intent_id: pi.id,
            zoho_deal_id: existing.zoho_deal_id,
          });
        } else {
          if (!contactId && existing?.zoho_contact_id) contactId = existing.zoho_contact_id;

          if (!contactId) {
            console.warn("No Zoho contactId, skipping deal creation", { payment_intent_id: pi.id });
          } else {
            const productName = getProductName(validation.productType as ProductType);
            const dealName = `${productName} - ${validation.email}`;

            const dealId = await createDeal({
              contactId,
              dealName,
              amount: typeof pi.amount === "number" ? pi.amount : 0,
              currency: pi.currency || "usd",
              productType: String(validation.productType),
              paymentIntentId: pi.id,
              site,
              customerId,

              utmSource: utmLastSource,
              utmMedium: utmLastMedium,
              utmCampaign: utmLastCampaign,
              utmContent: utmLastContent,
              utmTerm: utmLastTerm,

              pagePath: lastPagePath,

              checkoutVariant: cleanStr(metadata.checkout_variant),

              layoutId: dealLayoutId,
            });

            if (dealId) {
              await updateZohoDealId(pi.id, dealId);
              console.log("Zoho deal created", { payment_intent_id: pi.id, dealId });
            } else {
              console.warn("Zoho deal create returned null", { payment_intent_id: pi.id });
            }
          }
        }
      } catch (e) {
        console.error("Zoho deal create failed", {
          payment_intent_id: pi.id,
          error: errToMessage(e),
        });
      }

      await updateProcessingStatus(pi.id, "completed");

      console.log("Webhook finished", { payment_intent_id: pi.id, ms: Date.now() - startedAt });
      res.status(200).send("Success");
    } catch (e) {
      console.error("Webhook fatal error", errToMessage(e));
      res.status(200).send("Accepted");
    }
  },
);
