import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";

import { db } from "../configs/firebase";
import { updateContactFunnelStepByEmail } from "../lib/zoho-crm";
import { emitFunnelEvent } from "../lib/emitFunnelEvent";
import { upsertContactAndAddTags } from "../lib/zoho-campaigns";

const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_API_DOMAIN = defineSecret("ZOHO_ANALYTICS_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_ORG_ID = defineSecret("ZOHO_ANALYTICS_ORG_ID_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_WORKSPACE_ID = defineSecret("ZOHO_ANALYTICS_WORKSPACE_ID_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_VIEW_ID = defineSecret("ZOHO_ANALYTICS_VIEW_ID_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");

const ABANDONED_TIMEOUT_MIN = 5;
const SCAN_LIMIT = 500;
const ABANDONED_CAMPAIGNS_TAG = "ca_sp";

type FunnelStep =
  | "unknown" | "checkout_viewed" | "lead_captured" | "abandoned"
  | "checkout_started" | "paid" | "delivered" | "delivery_failed"
  | "failed" | "canceled";

const FUNNEL_RANK: Record<FunnelStep, number> = {
  unknown: 0, checkout_viewed: 10, lead_captured: 20, abandoned: 25,
  checkout_started: 30, paid: 40, delivered: 50, delivery_failed: 55,
  failed: 60, canceled: 60,
};

function normalizeStep(v: unknown): FunnelStep {
  const s = String(v ?? "").trim();
  return (s in FUNNEL_RANK ? s : "unknown") as FunnelStep;
}

function shouldAdvance(current: unknown, next: FunnelStep) {
  return (FUNNEL_RANK[normalizeStep(current)] ?? 0) <= (FUNNEL_RANK[next] ?? 0);
}

function minutes(n: number) { return n * 60 * 1000; }

function isTimestamp(v: unknown): v is admin.firestore.Timestamp {
  return !!v && typeof (v as { toMillis?: unknown }).toMillis === "function";
}

function safeLowerEmail(v: unknown) {
  return String(v ?? "").trim().toLowerCase();
}

function normalizeHost(raw?: string | null) {
  const s = String(raw ?? "").trim().toLowerCase();
  if (!s) return "unknown";
  try {
    if (s.startsWith("http://") || s.startsWith("https://")) return new URL(s).host.split(":")[0];
  } catch { /* ignore */ }
  return s.split(":")[0];
}

function buildLandingPage(site: string, pagePath?: string | null) {
  const pp = String(pagePath ?? "").trim();
  if (!pp) return null;
  return `https://${site}${pp.startsWith("/") ? "" : "/"}${pp}`;
}

function isAbandonableStatus(processingStatus: string | null): boolean {
  return processingStatus === "processing" || processingStatus === "created" || processingStatus === null;
}

export const markAbandonedCheckouts = onSchedule(
  {
    region: "us-central1",
    schedule: "*/5 * * * *",
    timeZone: "UTC",
    secrets: [
      ZOHO_CLIENT_ID_LILYCHYSTOFAT, ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT, ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
      ZOHO_API_DOMAIN_LILYCHYSTOFAT, ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT,
      ZOHO_ANALYTICS_API_DOMAIN, ZOHO_ANALYTICS_ORG_ID,
      ZOHO_ANALYTICS_WORKSPACE_ID, ZOHO_ANALYTICS_VIEW_ID,
      ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT, ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT,
    ],
  },
  async () => {
    const startedAt = Date.now();
    const cutoffMs = Date.now() - minutes(ABANDONED_TIMEOUT_MIN);
    const cutoffTs = admin.firestore.Timestamp.fromMillis(cutoffMs);

    logger.info("markAbandonedCheckouts: scan start", {
      timeoutMin: ABANDONED_TIMEOUT_MIN,
      cutoffISO: new Date(cutoffMs).toISOString(),
      scanLimit: SCAN_LIMIT,
    });

    let snap: admin.firestore.QuerySnapshot;
    try {
      snap = await db.collection("payments")
        .where("funnel_step", "in", ["checkout_viewed", "lead_captured"])
        .where("created_at", "<", cutoffTs)
        .limit(SCAN_LIMIT)
        .get();
      logger.info("markAbandonedCheckouts: query done", { totalDocs: snap.size });
    } catch (e: unknown) {
      logger.error("markAbandonedCheckouts: query failed", { error: e instanceof Error ? e.message : String(e) });
      return;
    }

    if (snap.empty) {
      logger.info("markAbandonedCheckouts: nothing to do (empty snap)", { ms: Date.now() - startedAt });
      return;
    }

    const candidates = snap.docs
      .map((d) => ({ id: d.id, ref: d.ref, data: d.data() as Record<string, unknown> }))
      .filter(({ id, data }) => {
        const processingStatus = (data.processing_status ?? null) as string | null;
        if (!isAbandonableStatus(processingStatus)) {
          logger.debug("markAbandonedCheckouts: skip - bad processing_status", { id, processingStatus });
          return false;
        }

        const step = normalizeStep(data.funnel_step);
        if (step !== "checkout_viewed" && step !== "lead_captured") {
          logger.debug("markAbandonedCheckouts: skip - bad funnel_step", { id, step });
          return false;
        }

        const pa = data.created_at ?? data.updated_at;
        if (!isTimestamp(pa)) {
          logger.debug("markAbandonedCheckouts: skip - no timestamp", { id });
          return false;
        }
        if (pa.toMillis() >= cutoffMs) {
          logger.debug("markAbandonedCheckouts: skip - too fresh", { id, createdAt: pa.toDate().toISOString() });
          return false;
        }

        const stripeStatus = String((data.stripe_status ?? data.status ?? "") as any).toLowerCase();
        if (stripeStatus === "succeeded") {
          logger.debug("markAbandonedCheckouts: skip - already succeeded", { id });
          return false;
        }

        if (data.abandoned_at) {
          logger.debug("markAbandonedCheckouts: skip - already abandoned", { id });
          return false;
        }

        return true;
      });

    logger.info("markAbandonedCheckouts: candidates after filter", {
      total: snap.size,
      candidates: candidates.length,
    });

    if (!candidates.length) {
      logger.info("markAbandonedCheckouts: nothing to do after filter", { ms: Date.now() - startedAt });
      return;
    }

    const now = admin.firestore.FieldValue.serverTimestamp();

    type UpdatedPayload = {
      id: string; ref: admin.firestore.DocumentReference; email: string;
      site: string; page_path: string | null; checkout_variant: string | null;
      product_type: string | null; product_name: string | null;
      amount: number | null; currency: string | null;
      stripe_status: string | null; stripe_customer_id: string | null;
      utm_first_source: string | null; utm_first_medium: string | null;
      utm_first_campaign: string | null; utm_first_content: string | null;
      utm_first_term: string | null; utm_last_source: string | null;
      utm_last_medium: string | null; utm_last_campaign: string | null;
      utm_last_content: string | null; utm_last_term: string | null;
      lead_source: string | null;
    };

    const updated: UpdatedPayload[] = [];

    for (const c of candidates) {
      logger.info("markAbandonedCheckouts: processing candidate", { id: c.id });
      try {
        const result = await db.runTransaction(async (tx) => {
          const fresh = await tx.get(c.ref);
          if (!fresh.exists) {
            logger.warn("markAbandonedCheckouts: doc not found in tx", { id: c.id });
            return { updated: false as const };
          }

          const d = fresh.data() as Record<string, unknown>;

          const processingStatus = (d.processing_status ?? null) as string | null;
          if (!isAbandonableStatus(processingStatus)) {
            logger.warn("markAbandonedCheckouts: tx skip - bad processing_status", { id: c.id, processingStatus });
            return { updated: false as const };
          }

          const step = normalizeStep(d.funnel_step);
          if (!shouldAdvance(step, "abandoned")) {
            logger.warn("markAbandonedCheckouts: tx skip - shouldAdvance false", { id: c.id, step });
            return { updated: false as const };
          }
          if (step !== "checkout_viewed" && step !== "lead_captured") {
            logger.warn("markAbandonedCheckouts: tx skip - bad step", { id: c.id, step });
            return { updated: false as const };
          }

          const pa = d.created_at ?? d.updated_at;
          if (!isTimestamp(pa)) {
            logger.warn("markAbandonedCheckouts: tx skip - no timestamp", { id: c.id });
            return { updated: false as const };
          }
          if (pa.toMillis() >= cutoffMs) {
            logger.warn("markAbandonedCheckouts: tx skip - too fresh", { id: c.id });
            return { updated: false as const };
          }

          const stripeStatus = String((d.stripe_status ?? d.status ?? "") as any).toLowerCase();
          if (stripeStatus === "succeeded") {
            logger.warn("markAbandonedCheckouts: tx skip - succeeded", { id: c.id });
            return { updated: false as const };
          }

          const alreadyTagged = !!d.campaigns_abandoned_tagged_at;
          const pending = !!d.campaigns_abandoned_tag_pending;

          logger.info("markAbandonedCheckouts: tx updating to abandoned", {
            id: c.id,
            alreadyTagged,
            pending,
            step,
          });

          tx.update(c.ref, {
            funnel_step: "abandoned",
            abandoned_at: now,
            abandoned_reason: `timeout_${ABANDONED_TIMEOUT_MIN}m`,
            ...(alreadyTagged || pending ? {} : {
              campaigns_abandoned_tag_pending: true,
              campaigns_abandoned_tag: ABANDONED_CAMPAIGNS_TAG,
            }),
          });

          const meta = (d.metadata ?? null) as Record<string, unknown> | null;
          const str = (v: unknown) => String(v ?? "").trim() || null;

          return {
            updated: true as const,
            payload: {
              id: c.id, ref: c.ref,
              email: safeLowerEmail(d.email || meta?.email),
              site: normalizeHost((d.site ?? meta?.site) as any),
              page_path: str(d.page_path ?? meta?.page_path),
              checkout_variant: str(d.checkout_variant ?? meta?.checkout_variant),
              product_type: str(d.product_type ?? meta?.product_type),
              product_name: str(d.product_name),
              amount: typeof d.amount === "number" ? d.amount : null,
              currency: str(d.currency),
              stripe_status: str(d.stripe_status ?? d.status),
              stripe_customer_id: str(d.stripe_customer_id ?? d.customer_id),
              utm_first_source: str(d.utm_first_source ?? meta?.utm_first_source),
              utm_first_medium: str(d.utm_first_medium ?? meta?.utm_first_medium),
              utm_first_campaign: str(d.utm_first_campaign ?? meta?.utm_first_campaign),
              utm_first_content: str(d.utm_first_content ?? meta?.utm_first_content),
              utm_first_term: str(d.utm_first_term ?? meta?.utm_first_term),
              utm_last_source: str(d.utm_last_source ?? meta?.utm_last_source),
              utm_last_medium: str(d.utm_last_medium ?? meta?.utm_last_medium),
              utm_last_campaign: str(d.utm_last_campaign ?? meta?.utm_last_campaign),
              utm_last_content: str(d.utm_last_content ?? meta?.utm_last_content),
              utm_last_term: str(d.utm_last_term ?? meta?.utm_last_term),
              lead_source: str(d.lead_source ?? meta?.lead_source),
            },
          };
        });

        if ((result as any).updated) {
          const p = (result as any).payload;
          if (p?.email) {
            logger.info("markAbandonedCheckouts: tx success", { id: c.id, email: p.email });
            updated.push(p);
          } else {
            logger.warn("markAbandonedCheckouts: tx success but no email", { id: c.id });
          }
        }
      } catch (e: unknown) {
        logger.warn("markAbandonedCheckouts: transaction failed", {
          id: c.id,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    if (!updated.length) {
      logger.info("markAbandonedCheckouts: nothing updated after transactions", { ms: Date.now() - startedAt });
      return;
    }

    logger.info("markAbandonedCheckouts: starting post-processing", { updatedCount: updated.length });

    const campaignsResults = await Promise.allSettled(
      updated.map(async (p) => {
        if (!p.email) return;
        logger.info("markAbandonedCheckouts: setting campaigns tag", { id: p.id, email: p.email, tag: ABANDONED_CAMPAIGNS_TAG });
        try {
          await upsertContactAndAddTags(p.email, [ABANDONED_CAMPAIGNS_TAG]);
          logger.info("markAbandonedCheckouts: campaigns tag set OK", { id: p.id, email: p.email });
        } catch (e) {
          logger.error("markAbandonedCheckouts: campaigns tag FAILED", {
            id: p.id,
            email: p.email,
            error: e instanceof Error ? e.message : String(e),
          });
          throw e;
        }
        await p.ref.set({
          campaigns_abandoned_tag_pending: false,
          campaigns_abandoned_tagged_at: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }),
    );

    const zohoResults = await Promise.allSettled(
      updated.map(async (p) => {
        if (!p.email) return;
        logger.info("markAbandonedCheckouts: updating CRM", { id: p.id, email: p.email });
        try {
          await updateContactFunnelStepByEmail({
            email: p.email,
            funnelStep: "abandoned",
            checkoutStatus: "Abandoned Checkout",
            abandonedAt: new Date(),
          });
          logger.info("markAbandonedCheckouts: CRM update OK", { id: p.id, email: p.email });
        } catch (e) {
          logger.error("markAbandonedCheckouts: CRM update FAILED", {
            id: p.id,
            email: p.email,
            error: e instanceof Error ? e.message : String(e),
          });
          throw e;
        }
      }),
    );

    const analyticsResults = await Promise.allSettled(
      updated.map(async (p) => {
        logger.info("markAbandonedCheckouts: emitting analytics", { id: p.id, email: p.email });
        try {
          await emitFunnelEvent({
            event_id: `abandon:${p.id}:timeout_${ABANDONED_TIMEOUT_MIN}m`,
            event_time: new Date().toISOString(),
            source: "cron:markAbandonedCheckouts",
            funnel_step: "abandoned",
            payment_intent_id: p.id,
            intent_token: null,
            email: p.email || null,
            site: p.site,
            landing_page: buildLandingPage(p.site, p.page_path),
            page_path: p.page_path,
            checkout_variant: p.checkout_variant,
            product_type: p.product_type,
            product_name: p.product_name,
            amount: p.amount,
            currency: p.currency,
            stripe_status: p.stripe_status,
            stripe_customer_id: p.stripe_customer_id,
            delivery_status: null,
            delivery_error: null,
            lead_source: p.lead_source,
            utm_first_source: p.utm_first_source,
            utm_first_medium: p.utm_first_medium,
            utm_first_campaign: p.utm_first_campaign,
            utm_first_content: p.utm_first_content,
            utm_first_term: p.utm_first_term,
            utm_last_source: p.utm_last_source,
            utm_last_medium: p.utm_last_medium,
            utm_last_campaign: p.utm_last_campaign,
            utm_last_content: p.utm_last_content,
            utm_last_term: p.utm_last_term,
          });
          logger.info("markAbandonedCheckouts: analytics emit OK", { id: p.id });
        } catch (e) {
          logger.error("markAbandonedCheckouts: analytics emit FAILED", {
            id: p.id,
            error: e instanceof Error ? e.message : String(e),
          });
          throw e;
        }
      }),
    );

    const countFailed = (results: PromiseSettledResult<unknown>[]) =>
      results.filter((r) => r.status === "rejected").length;

    logger.info("markAbandonedCheckouts finished", {
      updatedCount: updated.length,
      campaignsFailed: countFailed(campaignsResults),
      zohoFailed: countFailed(zohoResults),
      analyticsFailed: countFailed(analyticsResults),
      ms: Date.now() - startedAt,
    });
  },
);