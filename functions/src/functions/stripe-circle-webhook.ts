// functions/src/webhooks/stripeCircleWebhook.ts
import { onRequest } from "firebase-functions/v2/https";
import Stripe from "stripe";
import { defineSecret } from "firebase-functions/params";

import { configs } from "../configs/env";

import { createOrUpdateContact, createDeal, updateContactFunnelStepByEmail } from "../lib/zoho-crm";
import { emitFunnelEvent } from "../lib/emitFunnelEvent";

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
  type PaymentRecord,
} from "../utils/stripeCircleWebhook.helpers";
import { applyPurchaseCampaignTags } from "../lib/zoho-campaigns-purchase";
import { markCompatibilityCodePurchased } from "../lib/zoho-scoring";

// Secrets must be attached to this function (Firebase v2)
const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");
// const ZOHO_DEAL_LAYOUT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_DEAL_LAYOUT_ID_LILYCHYSTOFAT");
const ZOHO_DEAL_LAYOUT_ID_LILYCHYSTOFAT = "6782764000008928434";
const ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT = defineSecret(
  "ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT",
);

// Zoho Analytics secrets
const ZOHO_ANALYTICS_API_DOMAIN = defineSecret("ZOHO_ANALYTICS_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_ORG_ID = defineSecret("ZOHO_ANALYTICS_ORG_ID_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_WORKSPACE_ID = defineSecret("ZOHO_ANALYTICS_WORKSPACE_ID_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_VIEW_ID = defineSecret("ZOHO_ANALYTICS_VIEW_ID_LILYCHYSTOFAT");

function safeId(id: string) {
  return id.length > 10 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;
}

function buildLandingPage(site: string, pagePath?: string | null) {
  const pp = (pagePath || "").trim();
  if (!pp) return null;
  return `https://${site}${pp.startsWith("/") ? "" : "/"}${pp}`;
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

type StripeRawBodyRequest = { rawBody?: Buffer };

function isoFromStripeEvent(event: Stripe.Event): string {
  const createdSec =
    typeof event.created === "number" ? event.created : Math.floor(Date.now() / 1000);
  return new Date(createdSec * 1000).toISOString();
}

function makeAnalyticsEventId(piId: string, step: string, stripeEventId: string) {
  // ✅ unique per step, stable per webhook event
  return `${piId}:${step}:${stripeEventId}`;
}

export const stripeCircleWebhook = onRequest(
  {
    cors: true,
    region: "us-central1",
    secrets: [
      ZOHO_CLIENT_ID_LILYCHYSTOFAT,
      ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT,
      ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
      ZOHO_API_DOMAIN_LILYCHYSTOFAT,
      // ZOHO_DEAL_LAYOUT_ID_LILYCHYSTOFAT,
      ZOHO_ANALYTICS_API_DOMAIN,
      ZOHO_ANALYTICS_ORG_ID,
      ZOHO_ANALYTICS_WORKSPACE_ID,
      ZOHO_ANALYTICS_VIEW_ID,
      ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT,
      ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT,
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

      const intentToken = cleanStr(metadata.intent_token) ?? null;

      const site = normalizeHost(cleanStr(metadata.site)) || "unknown";
      const pagePath = cleanStr(metadata.page_path) ?? null;
      const checkoutVariant = cleanStr(metadata.checkout_variant) ?? null;
      const sessionId = cleanStr(metadata.session_id) ?? null;
      const salesiqVisitorId = cleanStr(metadata.salesiq_visitor_id) ?? null;

      const productTypeFromMeta = cleanStr(metadata.product_type) ?? null;
      const customerId = pi.customer ? String(pi.customer) : null;

      const emailMaybe = (cleanStr(metadata.email) || cleanStr(pi.receipt_email) || "")
        .trim()
        .toLowerCase();

      const piAmount = typeof pi.amount === "number" ? pi.amount : null;
      const piCurrency = pi.currency ?? null;
      const piStatus = (pi.status as string) ?? null;

      const utmFirstSource = cleanStr(metadata.utm_first_source) ?? null;
      const utmFirstMedium = cleanStr(metadata.utm_first_medium) ?? null;
      const utmFirstCampaign = cleanStr(metadata.utm_first_campaign) ?? null;
      const utmFirstContent = cleanStr(metadata.utm_first_content) ?? null;
      const utmFirstTerm = cleanStr(metadata.utm_first_term) ?? null;

      const utmLastSource =
        cleanStr(metadata.utm_last_source) || cleanStr(metadata.utm_source) || null;
      const utmLastMedium =
        cleanStr(metadata.utm_last_medium) || cleanStr(metadata.utm_medium) || null;
      const utmLastCampaign =
        cleanStr(metadata.utm_last_campaign) || cleanStr(metadata.utm_campaign) || null;
      const utmLastContent =
        cleanStr(metadata.utm_last_content) || cleanStr(metadata.utm_content) || null;
      const utmLastTerm = cleanStr(metadata.utm_last_term) || cleanStr(metadata.utm_term) || null;

      const leadSource = cleanStr(metadata.lead_source) || utmFirstSource || null;

      // ---------------------------------------------------
      // helper: unified Analytics emit
      // ---------------------------------------------------
      const emit = async (args: {
        funnel_step:
          | "payment_failed"
          | "paid"
          | "delivered"
          | "delivery_failed"
          | "deal_created"
          | "canceled";
        email: string | null;
        product_type: string | null;

        product_name?: string | null;
        processing_status?: string | null;

        stripe_error_code?: string | null;
        stripe_error_message?: string | null;

        delivery_status?: "delivered" | "failed" | null;
        delivery_error?: string | null;

        abandon_reason?: string | null;

        zoho_contact_id?: string | null;
        zoho_deal_id?: string | null;

        // if you want a custom timestamp
        event_time_override?: string;
      }) => {
        const existing: PaymentRecord | null = await getPaymentRecord(pi.id);

        const processingFromDb =
          existing && typeof existing.processing_status === "string"
            ? existing.processing_status
            : null;

        await emitFunnelEvent({
          event_id: makeAnalyticsEventId(pi.id, args.funnel_step, event.id),
          event_time: args.event_time_override ?? isoFromStripeEvent(event),
          source: "stripe:webhook",
          funnel_step: args.funnel_step,

          payment_intent_id: pi.id,
          intent_token: intentToken,
          email: args.email,

          zoho_contact_id: args.zoho_contact_id ?? existing?.zoho_contact_id ?? null,
          zoho_deal_id: args.zoho_deal_id ?? existing?.zoho_deal_id ?? null,

          processing_status: args.processing_status ?? processingFromDb,
          product_name: args.product_name ?? null,

          site,
          landing_page: buildLandingPage(site, pagePath),
          page_path: pagePath,
          checkout_variant: checkoutVariant,

          product_type: args.product_type,
          amount: piAmount,
          currency: piCurrency,

          stripe_status: piStatus,
          stripe_error_code: args.stripe_error_code ?? null,
          stripe_error_message: args.stripe_error_message ?? null,
          stripe_customer_id: customerId,

          delivery_status: args.delivery_status ?? null,
          delivery_error: args.delivery_error ?? null,
          abandon_reason: args.abandon_reason ?? null,

          lead_source: leadSource,
          session_id: sessionId,
          salesiq_visitor_id: salesiqVisitorId,

          utm_first_source: utmFirstSource,
          utm_first_medium: utmFirstMedium,
          utm_first_campaign: utmFirstCampaign,
          utm_first_content: utmFirstContent,
          utm_first_term: utmFirstTerm,

          utm_last_source: utmLastSource,
          utm_last_medium: utmLastMedium,
          utm_last_campaign: utmLastCampaign,
          utm_last_content: utmLastContent,
          utm_last_term: utmLastTerm,
        });
      };

      // ---------------------------------------------------
      // CANCELED
      // ---------------------------------------------------
      if (event.type === "payment_intent.canceled") {
        const msg = "Payment canceled";

        console.log("Payment canceled", {
          payment_intent_id: pi.id,
          event: safeId(event.id),
          type: event.type,
          stripe_status: pi.status,
          email: emailMaybe || undefined,
        });

        try {
          await upsertPaymentBaseFromIntent(pi, event.id);
        } catch (e) {
          console.error("Upsert payment base failed (canceled)", {
            payment_intent_id: pi.id,
            error: errToMessage(e),
          });
        }

        try {
          await markFunnelStepAdvanceOnly(pi.id, "canceled");
          await updateProcessingStatus(pi.id, "failed", msg);
        } catch (e) {
          console.error("Firestore update failed for canceled", {
            payment_intent_id: pi.id,
            error: errToMessage(e),
          });
        }

        try {
          await emit({
            funnel_step: "canceled",
            email: emailMaybe || null,
            product_type: productTypeFromMeta,
            product_name: productTypeFromMeta
              ? getProductName(productTypeFromMeta as ProductType)
              : null,
            processing_status: "failed",
            stripe_error_code: null,
            stripe_error_message: msg,
            delivery_status: null,
            delivery_error: null,
            abandon_reason: "canceled",
          });
        } catch (e) {
          console.error("emitFunnelEvent canceled failed (non-critical)", {
            payment_intent_id: pi.id,
            error: errToMessage(e),
          });
        }

        res.status(200).send("Accepted");
        return;
      }

      // ---------------------------------------------------
      // FAILED
      // ---------------------------------------------------
      if (event.type === "payment_intent.payment_failed") {
        const msg = "Payment failed";

        console.log("Payment failed", {
          payment_intent_id: pi.id,
          event: safeId(event.id),
          type: event.type,
          stripe_status: pi.status,
          email: emailMaybe || undefined,
          reason: msg,
        });

        try {
          await upsertPaymentBaseFromIntent(pi, event.id);
        } catch (e) {
          console.error("Upsert payment base failed (failed)", {
            payment_intent_id: pi.id,
            error: errToMessage(e),
          });
        }

        try {
          await markFunnelStepAdvanceOnly(pi.id, "failed");
          await updateProcessingStatus(pi.id, "failed", msg);
        } catch (e) {
          console.error("Firestore update failed for failed", {
            payment_intent_id: pi.id,
            error: errToMessage(e),
          });
        }

        try {
          await emit({
            funnel_step: "payment_failed",
            email: emailMaybe || null,
            product_type: productTypeFromMeta,
            product_name: productTypeFromMeta
              ? getProductName(productTypeFromMeta as ProductType)
              : null,
            processing_status: "failed",
            stripe_error_code: pi.last_payment_error?.code ?? null,
            stripe_error_message: msg,
            delivery_status: null,
            delivery_error: null,
            abandon_reason: null,
          });
        } catch (e) {
          console.error("emitFunnelEvent payment_failed failed (non-critical)", {
            payment_intent_id: pi.id,
            error: errToMessage(e),
          });
        }

        // Zoho best-effort (NO UTM)
        try {
          const email = cleanStr(metadata.email) || cleanStr(pi.receipt_email);
          const pt = cleanStr(metadata.product_type);

          if (email && pt) {
            const { firstName, lastName } = splitName(metadata.name);

            const c = await createOrUpdateContact({
              email: email.toLowerCase(),
              firstName,
              lastName,
              phone: cleanStr(metadata.phone),

              productType: pt,
              amount: typeof pi.amount === "number" ? pi.amount : 0,
              currency: pi.currency || "usd",
              site,

              stripePaymentIntentId: pi.id,
              stripeCustomerId: customerId ?? undefined,
              leadSource: leadSource ?? undefined,
            });

            try {
              await updateZohoContactId(pi.id, c.contactId);
            } catch {
              // ignore
            }

            await updateContactFunnelStepByEmail({
              email: email.toLowerCase(),
              funnelStep: "failed",
              lastError: msg,
              checkoutStatus: "Payment Failed",
            });
          }
        } catch (e) {
          console.error("Zoho sync failed for payment_failed (non-critical)", {
            payment_intent_id: pi.id,
            error: errToMessage(e),
          });
        }

        res.status(200).send("Accepted");
        return;
      }

      // ---------------------------------------------------
      // SUCCEEDED gate
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

      const normalizedProductType =
        productTypeFromMeta || (validation.productType ? String(validation.productType) : null);

      const productNameHuman = validation.productType
        ? getProductName(validation.productType as ProductType)
        : productTypeFromMeta
          ? getProductName(productTypeFromMeta as ProductType)
          : null;

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

      try {
        await updateProcessingStatus(pi.id, "processing");
      } catch {
        // ignore
      }

      // Analytics: paid
      try {
        await emit({
          funnel_step: "paid",
          email: validation.email || null,
          product_type: normalizedProductType,
          product_name: productNameHuman,
          processing_status: "processing",
          delivery_status: null,
          delivery_error: null,
          abandon_reason: null,
          // для paid логично оставить event.created (Stripe)
          event_time_override: isoFromStripeEvent(event),
        });
      } catch (e) {
        console.error("emitFunnelEvent paid failed (non-critical)", {
          payment_intent_id: pi.id,
          error: errToMessage(e),
        });
      }

      // Zoho contact
      let contactId: string | undefined;
      try {
        const { firstName, lastName } = splitName(metadata.name);

        console.log("Creating NEW Zoho contact", {
          email: validation.email,
          productType: String(validation.productType),
        });

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
          stripeCustomerId: customerId ?? undefined,
          leadSource: leadSource ?? undefined,
        });

        contactId = c.contactId;
        await updateZohoContactId(pi.id, contactId);

        await updateContactFunnelStepByEmail({
          email: validation.email,
          funnelStep: "paid",
          checkoutStatus: "Paid",
        });

        console.log("Zoho contact synced", { payment_intent_id: pi.id, contactId, c: c });
      } catch (e) {
        console.error("Zoho contact sync failed", {
          payment_intent_id: pi.id,
          error: errToMessage(e),
        });
      }

      // Campaigns tags: applied right after paid (guaranteed, independent of delivery)
      console.log("applyPurchaseCampaignTags: env check", {
        refreshToken: process.env.ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT ? process.env.ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT.slice(0, 6) + "…" : "EMPTY",
        listkey: process.env.ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT ? process.env.ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT.slice(0, 6) + "…" : "EMPTY",
      });
      try {
        await applyPurchaseCampaignTags(pi);
      } catch (e) {
        console.error("applyPurchaseCampaignTags failed (non-critical)", {
          payment_intent_id: pi.id,
          error: errToMessage(e),
        });
      }

      // CRM scoring: mark compatibility_report purchase (best-effort)
      if (normalizedProductType === "compatibility_report" && validation.email) {
        try {
          await markCompatibilityCodePurchased(validation.email);
        } catch (e) {
          console.error("markCompatibilityCodePurchased failed (non-critical)", {
            payment_intent_id: pi.id,
            error: errToMessage(e),
          });
        }
      }

      // Delivery
      try {
        await processPayment(pi);

        await updateDeliveryStatusAdvanceOnly(pi.id, "delivered");
        await markFunnelStepAdvanceOnly(pi.id, "delivered");

        await updateContactFunnelStepByEmail({
          email: validation.email,
          funnelStep: "delivered",
          checkoutStatus: "Delivered",
        });

        // Analytics: delivered
        try {
          await emit({
            funnel_step: "delivered",
            email: validation.email || null,
            product_type: normalizedProductType,
            product_name: productNameHuman,
            processing_status: "completed",
            delivery_status: "delivered",
            delivery_error: null,
            abandon_reason: null,
            zoho_contact_id: contactId ?? null,
            event_time_override: new Date().toISOString(),
          });
        } catch (e) {
          console.error("emitFunnelEvent delivered failed (non-critical)", {
            payment_intent_id: pi.id,
            error: errToMessage(e),
          });
        }
      } catch (e) {
        const msg = errToMessage(e);

        console.error("Delivery failed", { payment_intent_id: pi.id, error: msg });

        await updateDeliveryStatusAdvanceOnly(pi.id, "failed", msg);
        await markFunnelStepAdvanceOnly(pi.id, "delivery_failed");
        await updateProcessingStatus(pi.id, "failed", msg);

        try {
          await emit({
            funnel_step: "delivery_failed",
            email: validation.email || null,
            product_type: normalizedProductType,
            product_name: productNameHuman,
            processing_status: "failed",
            delivery_status: "failed",
            delivery_error: msg ?? null,
            abandon_reason: null,
            zoho_contact_id: contactId ?? null,
            event_time_override: new Date().toISOString(),
          });
        } catch (e2) {
          console.error("emitFunnelEvent delivery_failed failed (non-critical)", {
            payment_intent_id: pi.id,
            error: errToMessage(e2),
          });
        }

        try {
          await updateContactFunnelStepByEmail({
            email: validation.email,
            funnelStep: "delivery_failed",
            lastError: msg,
            checkoutStatus: "Delivery Failed",
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
          if (!contactId && existing?.zoho_contact_id)
            contactId = existing.zoho_contact_id ?? undefined;

          if (!contactId) {
            console.warn("No Zoho contactId, skipping deal creation", { payment_intent_id: pi.id });
          } else {
            //FIX!!!!
            // const dealLayoutId = cleanStr(ZOHO_DEAL_LAYOUT_ID_LILYCHYSTOFAT.value());

            const dealLayoutId = cleanStr(ZOHO_DEAL_LAYOUT_ID_LILYCHYSTOFAT);
            const dealName = `${productNameHuman ?? "Purchase"} - ${validation.email}`;

            const dealId = await createDeal({
              contactId,
              dealName,
              amount: typeof pi.amount === "number" ? pi.amount : 0,
              currency: pi.currency || "usd",
              productType: String(validation.productType),
              paymentIntentId: pi.id,
              site,
              customerId: customerId ?? undefined,
              checkoutVariant: cleanStr(metadata.checkout_variant),
              layoutId: dealLayoutId,
              leadSource: leadSource ?? undefined,
            });

            if (dealId) {
              await updateZohoDealId(pi.id, dealId);
              console.log("Zoho deal created", { payment_intent_id: pi.id, dealId });

              try {
                await emit({
                  funnel_step: "deal_created",
                  email: validation.email || null,
                  product_type: normalizedProductType,
                  product_name: productNameHuman,
                  processing_status: "completed",
                  delivery_status: "delivered",
                  delivery_error: null,
                  zoho_contact_id: contactId ?? null,
                  zoho_deal_id: dealId,
                  event_time_override: new Date().toISOString(),
                });
              } catch (e2) {
                console.error("emitFunnelEvent deal_created failed (non-critical)", {
                  payment_intent_id: pi.id,
                  error: errToMessage(e2),
                });
              }
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

      console.log("Webhook finished", {
        payment_intent_id: pi.id,
        event: safeId(event.id),
        ms: Date.now() - startedAt,
        pagePath,
      });

      res.status(200).send("Success");
    } catch (e) {
      console.error("Webhook fatal error", errToMessage(e));
      res.status(200).send("Accepted");
    }
  },
);
