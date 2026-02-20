// functions/src/scheduler/markAbandonedCheckouts.ts
import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";

import { db } from "../configs/firebase";
import { updateContactFunnelStepByEmail } from "../lib/zoho-crm";
import { emitFunnelEvent } from "../lib/emitFunnelEvent";
// attach secrets to scheduler too (v2!)
const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");


const ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT = defineSecret(
  "ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT",
);
const ZOHO_ANALYTICS_API_DOMAIN = defineSecret("ZOHO_ANALYTICS_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_ORG_ID = defineSecret("ZOHO_ANALYTICS_ORG_ID_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_WORKSPACE_ID = defineSecret("ZOHO_ANALYTICS_WORKSPACE_ID_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_VIEW_ID = defineSecret("ZOHO_ANALYTICS_VIEW_ID_LILYCHYSTOFAT");

// ---- config ----
const ABANDONED_TIMEOUT_MIN = 10;
const SCAN_LIMIT = 500;

type FunnelStep =
  | "unknown"
  | "checkout_viewed"
  | "lead_captured"
  | "abandoned"
  | "checkout_started"
  | "paid"
  | "delivered"
  | "delivery_failed"
  | "failed"
  | "canceled";

type ProcessingStatus = "processing" | "completed" | "failed";

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

function normalizeStep(v: unknown): FunnelStep {
  const s = String(v ?? "").trim() as FunnelStep;
  return (s && s in FUNNEL_RANK ? s : "unknown") as FunnelStep;
}

function shouldAdvance(current: unknown, next: FunnelStep) {
  const c = FUNNEL_RANK[normalizeStep(current)] ?? 0;
  const n = FUNNEL_RANK[next] ?? 0;
  return n >= c;
}

function minutes(n: number) {
  return n * 60 * 1000;
}

function isTimestamp(v: unknown): v is admin.firestore.Timestamp {
  return !!v && typeof (v as { toMillis?: unknown }).toMillis === "function";
}

function safeLowerEmail(v: unknown) {
  const s = String(v ?? "")
    .trim()
    .toLowerCase();
  return s || "";
}

function normalizeHost(raw?: string | null) {
  const s = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!s) return "unknown";

  try {
    if (s.startsWith("http://") || s.startsWith("https://")) {
      return new URL(s).host.split(":")[0];
    }
  } catch {
    // ignore
  }
  return s.split(":")[0];
}

function buildLandingPage(site: string, pagePath?: string | null) {
  const pp = String(pagePath ?? "").trim();
  if (!pp) return null;
  return `https://${site}${pp.startsWith("/") ? "" : "/"}${pp}`;
}

function nowIso() {
  return new Date().toISOString();
}

export const markAbandonedCheckouts = onSchedule(
  {
    region: "us-central1",
    schedule: "*/5 * * * *",
    timeZone: "UTC",
    secrets: [
      ZOHO_CLIENT_ID_LILYCHYSTOFAT,
      ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_LILYCHYSTOFAT,
      ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
      ZOHO_API_DOMAIN_LILYCHYSTOFAT,

      // analytics
      ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT,
      ZOHO_ANALYTICS_API_DOMAIN,
      ZOHO_ANALYTICS_ORG_ID,
      ZOHO_ANALYTICS_WORKSPACE_ID,
      ZOHO_ANALYTICS_VIEW_ID,
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
      snap = await db
        .collection("payments")
        .where("processed_at", "<", cutoffTs)
        .limit(SCAN_LIMIT)
        .get();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      logger.error("markAbandonedCheckouts base query failed", { error: msg });
      return;
    }

    if (snap.empty) {
      logger.info("markAbandonedCheckouts: nothing to do", { ms: Date.now() - startedAt });
      return;
    }

    const candidates = snap.docs
      .map((d) => ({ id: d.id, ref: d.ref, data: d.data() as Record<string, unknown> }))
      .filter(({ data }) => {
        const processingStatus = (data.processing_status ?? null) as ProcessingStatus | null;
        if (processingStatus !== "processing") return false;

        const step = normalizeStep(data.funnel_step);
        if (step !== "checkout_viewed" && step !== "lead_captured") return false;

        const pa = data.processed_at;
        if (!isTimestamp(pa)) return false;
        if (pa.toMillis() >= cutoffMs) return false;

        const stripeStatus = String((data.stripe_status ?? data.status ?? "") as any).toLowerCase();
        if (stripeStatus === "succeeded") return false;

        return true;
      });

    if (!candidates.length) {
      logger.info("markAbandonedCheckouts: nothing to do after filter", {
        ms: Date.now() - startedAt,
      });
      return;
    }

    logger.info("markAbandonedCheckouts: candidates found", {
      count: candidates.length,
      sample: candidates.slice(0, 3).map((c) => ({
        id: c.id,
        step: c.data?.funnel_step,
        status: c.data?.processing_status,
      })),
    });

    const now = admin.firestore.FieldValue.serverTimestamp();

    const updated: Array<{
      id: string; // payment_intent_id
      email: string;
      site: string;
      page_path: string | null;
      checkout_variant: string | null;
      product_type: string | null;
      product_name: string | null;
      amount: number | null;
      currency: string | null;
      stripe_status: string | null;
      stripe_customer_id: string | null;

      utm_first_source: string | null;
      utm_first_medium: string | null;
      utm_first_campaign: string | null;
      utm_first_content: string | null;
      utm_first_term: string | null;

      utm_last_source: string | null;
      utm_last_medium: string | null;
      utm_last_campaign: string | null;
      utm_last_content: string | null;
      utm_last_term: string | null;

      lead_source: string | null;
    }> = [];

    for (const c of candidates) {
      try {
        const result = await db.runTransaction(async (tx) => {
          const fresh = await tx.get(c.ref);
          if (!fresh.exists) return { updated: false as const };

          const d = fresh.data() as Record<string, unknown>;

          const processingStatus = (d.processing_status ?? null) as ProcessingStatus | null;
          if (processingStatus !== "processing") return { updated: false as const };

          const step = normalizeStep(d.funnel_step);

          if (!shouldAdvance(step, "abandoned")) return { updated: false as const };

          if (step !== "checkout_viewed" && step !== "lead_captured")
            return { updated: false as const };

          const pa = d.processed_at;
          if (!isTimestamp(pa)) return { updated: false as const };
          if (pa.toMillis() >= cutoffMs) return { updated: false as const };

          const stripeStatus = String((d.stripe_status ?? d.status ?? "") as any).toLowerCase();
          if (stripeStatus === "succeeded") return { updated: false as const };

          tx.update(c.ref, {
            funnel_step: "abandoned",
            abandoned_at: now,
            processed_at: now,
            abandoned_reason: `timeout_${ABANDONED_TIMEOUT_MIN}m`,
          });

          const meta = (d.metadata ?? null) as Record<string, unknown> | null;

          const email = safeLowerEmail(d.email || meta?.email);
          const site = normalizeHost((d.site ?? meta?.site) as any);
          const page_path = (String(d.page_path ?? meta?.page_path ?? "").trim() || null) as
            | string
            | null;

          return {
            updated: true as const,
            payload: {
              id: c.id,
              email,
              site,
              page_path,
              checkout_variant: (String(
                d.checkout_variant ?? meta?.checkout_variant ?? "",
              ).trim() || null) as string | null,
              product_type: (String(d.product_type ?? meta?.product_type ?? "").trim() || null) as
                | string
                | null,
              product_name: (String(d.product_name ?? "").trim() || null) as string | null,
              amount: (typeof d.amount === "number" ? d.amount : null) as number | null,
              currency: (String(d.currency ?? "").trim() || null) as string | null,
              stripe_status: (String(d.stripe_status ?? d.status ?? "").trim() || null) as
                | string
                | null,
              stripe_customer_id: (String(d.stripe_customer_id ?? d.customer_id ?? "").trim() ||
                null) as string | null,

              utm_first_source: (String(
                d.utm_first_source ?? meta?.utm_first_source ?? "",
              ).trim() || null) as string | null,
              utm_first_medium: (String(
                d.utm_first_medium ?? meta?.utm_first_medium ?? "",
              ).trim() || null) as string | null,
              utm_first_campaign: (String(
                d.utm_first_campaign ?? meta?.utm_first_campaign ?? "",
              ).trim() || null) as string | null,
              utm_first_content: (String(
                d.utm_first_content ?? meta?.utm_first_content ?? "",
              ).trim() || null) as string | null,
              utm_first_term: (String(d.utm_first_term ?? meta?.utm_first_term ?? "").trim() ||
                null) as string | null,

              utm_last_source: (String(d.utm_last_source ?? meta?.utm_last_source ?? "").trim() ||
                null) as string | null,
              utm_last_medium: (String(d.utm_last_medium ?? meta?.utm_last_medium ?? "").trim() ||
                null) as string | null,
              utm_last_campaign: (String(
                d.utm_last_campaign ?? meta?.utm_last_campaign ?? "",
              ).trim() || null) as string | null,
              utm_last_content: (String(
                d.utm_last_content ?? meta?.utm_last_content ?? "",
              ).trim() || null) as string | null,
              utm_last_term: (String(d.utm_last_term ?? meta?.utm_last_term ?? "").trim() ||
                null) as string | null,

              lead_source: (String(d.lead_source ?? meta?.lead_source ?? "").trim() || null) as
                | string
                | null,
            },
          };
        });

        if ((result as any).updated) {
          updated.push((result as any).payload);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        logger.warn("markAbandonedCheckouts: transaction failed", {
          payment_intent_id: c.id,
          error: msg,
        });
      }
    }

    if (!updated.length) {
      logger.info("markAbandonedCheckouts: nothing updated (races filtered)", {
        ms: Date.now() - startedAt,
      });
      return;
    }

    // 1) Zoho CRM update (best-effort)
    const zohoResults = await Promise.allSettled(
      updated.map(async (p) => {
        if (!p.email) return;
        await updateContactFunnelStepByEmail({
          email: p.email,
          funnelStep: "abandoned",
          checkoutStatus: "Abandoned Checkout",
          abandonedAt: new Date(),
          abandonedReason: `timeout_${ABANDONED_TIMEOUT_MIN}m`,
        });
      }),
    );

    const zohoFailed = zohoResults
      .map((r, i) => ({ r, i }))
      .filter((x) => x.r.status === "rejected")
      .slice(0, 5)
      .map(({ r, i }) => {
        const reason = (r as PromiseRejectedResult).reason as any;
        return {
          payment_intent_id: updated[i]?.id,
          email: updated[i]?.email,
          message: reason instanceof Error ? reason.message : String(reason),
        };
      });

    if (zohoFailed.length) {
      logger.warn("Zoho abandoned update failures (sample)", { failed: zohoFailed });
    }

    // 2) Zoho Analytics event
    const analyticsResults = await Promise.allSettled(
      updated.map(async (p) => {
        const event_id = `abandon:${p.id}:timeout_${ABANDONED_TIMEOUT_MIN}m`;

        await emitFunnelEvent({
          event_id,
          event_time: nowIso(),
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

          abandon_reason: `timeout_${ABANDONED_TIMEOUT_MIN}m`,
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
      }),
    );

    const analyticsFailed = analyticsResults
      .map((r, i) => ({ r, i }))
      .filter((x) => x.r.status === "rejected")
      .slice(0, 5)
      .map(({ r, i }) => {
        const reason = (r as PromiseRejectedResult).reason as any;
        return {
          payment_intent_id: updated[i]?.id,
          email: updated[i]?.email,
          message: reason instanceof Error ? reason.message : String(reason),
        };
      });

    if (analyticsFailed.length) {
      logger.warn("Zoho Analytics abandoned emit failures (sample)", { failed: analyticsFailed });
    }

    logger.info("markAbandonedCheckouts finished", {
      updatedCount: updated.length,
      zohoFailedSampleCount: zohoFailed.length,
      analyticsFailedSampleCount: analyticsFailed.length,
      ms: Date.now() - startedAt,
    });
  },
);
