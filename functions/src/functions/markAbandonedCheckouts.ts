// functions/src/scheduler/markAbandonedCheckouts.ts
import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";

import { db } from "../configs/firebase";
import { updateContactFunnelStepByEmail } from "../lib/zoho-crm";

// attach secrets to scheduler too (v2!)
const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");

// ---- config ----
const ABANDONED_TIMEOUT_MIN = 10;
const SCAN_LIMIT = 500;

// Firestore steps
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
  const s = String(v ?? "").trim().toLowerCase();
  return s || "";
}

export const markAbandonedCheckouts = onSchedule(
  {
    region: "us-central1",
    schedule: "0 */5 * * *",
    timeZone: "UTC",
    secrets: [
      ZOHO_CLIENT_ID_LILYCHYSTOFAT,
      ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_LILYCHYSTOFAT,
      ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
      ZOHO_API_DOMAIN_LILYCHYSTOFAT,
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

        const stripeStatus = String(data.status ?? "");
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
        processed_at: isTimestamp(c.data?.processed_at)
          ? (c.data.processed_at as admin.firestore.Timestamp).toDate().toISOString()
          : null,
      })),
    });

    const now = admin.firestore.FieldValue.serverTimestamp();
    const updated: Array<{ id: string; email: string }> = [];

    for (const c of candidates) {
      try {
        const result = await db.runTransaction(async (tx) => {
          const fresh = await tx.get(c.ref);
          if (!fresh.exists) return { updated: false as const, email: "" };

          const d = fresh.data() as Record<string, unknown>;

          const processingStatus = (d.processing_status ?? null) as ProcessingStatus | null;
          if (processingStatus !== "processing") return { updated: false as const, email: "" };

          const step = normalizeStep(d.funnel_step);

          if (!shouldAdvance(step, "abandoned")) {
            return { updated: false as const, email: "" };
          }

          if (step !== "checkout_viewed" && step !== "lead_captured") {
            return { updated: false as const, email: "" };
          }

          const pa = d.processed_at;
          if (!isTimestamp(pa)) return { updated: false as const, email: "" };
          if (pa.toMillis() >= cutoffMs) return { updated: false as const, email: "" };

          const stripeStatus = String(d.status ?? "");
          if (stripeStatus === "succeeded") return { updated: false as const, email: "" };

          tx.update(c.ref, {
            funnel_step: "abandoned",
            abandoned_at: now,
            processed_at: now,
            abandoned_reason: `timeout_${ABANDONED_TIMEOUT_MIN}m`,
          });

          const meta = (d.metadata ?? null) as Record<string, unknown> | null;
          const email = safeLowerEmail(d.email || meta?.email);
          return { updated: true as const, email };
        });

        if (result.updated) updated.push({ id: c.id, email: result.email });
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

    // Zoho update (best-effort)
    const results = await Promise.allSettled(
      updated.map(async (p) => {
        if (!p.email) return;
        await updateContactFunnelStepByEmail({
          email: p.email,
          funnelStep: "abandoned",
          checkoutStatus: "Abandoned Checkout",
        });
      }),
    );

    const failed = results
      .map((r, i) => ({ r, i }))
      .filter((x) => x.r.status === "rejected")
      .slice(0, 5)
      .map(({ r, i }) => {
        const reason = (r as PromiseRejectedResult).reason as unknown;
        const resp = (reason as { response?: { status?: unknown; data?: unknown } })?.response;
        const status = resp?.status;
        const data = resp?.data;
        const message =
          reason instanceof Error ? reason.message : typeof reason === "string" ? reason : String(reason);

        return {
          payment_intent_id: updated[i]?.id,
          email: updated[i]?.email,
          status,
          data,
          message,
        };
      });

    if (failed.length) {
      logger.warn("Zoho abandoned update failures (sample)", { failed });
    }

    logger.info("markAbandonedCheckouts finished", {
      updatedCount: updated.length,
      zohoFailedSampleCount: failed.length,
      ms: Date.now() - startedAt,
    });
  },
);
