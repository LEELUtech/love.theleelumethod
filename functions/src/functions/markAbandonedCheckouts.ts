import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";

import { db } from "../configs/firebase";
import { updateContactFunnelStepByEmail } from "../lib/zoho-crm";

// ✅ attach secrets to scheduler too (v2!)
const ZOHO_CLIENT_ID_SANDBOX = defineSecret("ZOHO_CLIENT_ID_SANDBOX");
const ZOHO_CLIENT_SECRET_SANDBOX = defineSecret("ZOHO_CLIENT_SECRET_SANDBOX");
const ZOHO_REFRESH_TOKEN_SANDBOX = defineSecret("ZOHO_REFRESH_TOKEN_SANDBOX");
const ZOHO_ACCOUNTS_DOMAIN_SANDBOX = defineSecret("ZOHO_ACCOUNTS_DOMAIN_SANDBOX");
const ZOHO_API_DOMAIN_SANDBOX = defineSecret("ZOHO_API_DOMAIN_SANDBOX");

// ---- config ----
const ABANDONED_TIMEOUT_MIN = 10;
const SCAN_LIMIT = 500;

// Мы маркируем abandoned только на ранних шагах
type AbandonableStep = "checkout_viewed" | "lead_captured";
type ProcessingStatus = "processing" | "completed" | "failed";

function minutes(n: number) {
  return n * 60 * 1000;
}

function isTimestamp(v: any): v is admin.firestore.Timestamp {
  return v && typeof v.toMillis === "function";
}

function safeLowerEmail(v: any) {
  const s = String(v ?? "").trim().toLowerCase();
  return s || "";
}

export const markAbandonedCheckouts = onSchedule(
  {
    region: "us-central1",
    schedule: "every 5 minutes",
    timeZone: "UTC",
    secrets: [
      ZOHO_CLIENT_ID_SANDBOX,
      ZOHO_CLIENT_SECRET_SANDBOX,
      ZOHO_REFRESH_TOKEN_SANDBOX,
      ZOHO_ACCOUNTS_DOMAIN_SANDBOX,
      ZOHO_API_DOMAIN_SANDBOX,
    ],
  },
  async () => {
    const startedAt = Date.now();

    const cutoffMs = Date.now() - minutes(ABANDONED_TIMEOUT_MIN);
    const cutoffTs = admin.firestore.Timestamp.fromMillis(cutoffMs);

    logger.info("markAbandonedCheckouts: scan start", {
      timeoutMin: ABANDONED_TIMEOUT_MIN,
      cutoffISO: new Date(cutoffMs).toISOString(),
    });

    let snap: admin.firestore.QuerySnapshot;
    try {
      // base query only by processed_at to avoid composite index
      snap = await db
        .collection("payments")
        .where("processed_at", "<", cutoffTs)
        .limit(SCAN_LIMIT)
        .get();
    } catch (e: any) {
      logger.error("markAbandonedCheckouts base query failed", { error: e?.message || String(e) });
      return;
    }

    if (snap.empty) {
      logger.info("markAbandonedCheckouts: nothing to do", { ms: Date.now() - startedAt });
      return;
    }

    const abandonableSteps: AbandonableStep[] = ["checkout_viewed", "lead_captured"];

    // Сначала кандидаты (дешёвый фильтр), потом транзакции (точная проверка)
    const candidates = snap.docs
      .map((d) => ({ id: d.id, ref: d.ref, data: d.data() as any }))
      .filter(({ data }) => {
        const processingStatus = (data.processing_status ?? null) as ProcessingStatus | null;
        if (processingStatus !== "processing") return false;

        const step = (data.funnel_step ?? null) as string | null;
        if (!step || !abandonableSteps.includes(step as AbandonableStep)) return false;

        const pa = data.processed_at;
        if (!isTimestamp(pa)) return false;
        if (pa.toMillis() >= cutoffMs) return false;

        return true;
      });

    if (!candidates.length) {
      logger.info("markAbandonedCheckouts: nothing to do after filter", { ms: Date.now() - startedAt });
      return;
    }

    logger.info("markAbandonedCheckouts: candidates found", {
      count: candidates.length,
      sample: candidates.slice(0, 3).map((c) => ({
        id: c.id,
        step: c.data?.funnel_step,
        status: c.data?.processing_status,
        processed_at: isTimestamp(c.data?.processed_at) ? c.data.processed_at.toDate().toISOString() : null,
      })),
    });

    const now = admin.firestore.FieldValue.serverTimestamp();

    // Обновляем только если ДО СИХ ПОР документ подходит (transaction prevents race)
    const updated: Array<{ id: string; email: string }> = [];

    for (const c of candidates) {
      try {
        const result = await db.runTransaction(async (tx) => {
          const fresh = await tx.get(c.ref);
          if (!fresh.exists) return { updated: false as const, email: "" };

          const d = fresh.data() as any;

          const processingStatus = (d.processing_status ?? null) as ProcessingStatus | null;
          if (processingStatus !== "processing") return { updated: false as const, email: "" };

          const step = String(d.funnel_step ?? "");
          if (!abandonableSteps.includes(step as AbandonableStep)) return { updated: false as const, email: "" };

          // если уже ушли дальше — не трогаем
          // (если ты добавишь rank-логику, можно сделать ещё жёстче)
          if (step === "checkout_started" || step === "paid" || step === "delivered" || step === "failed" || step === "canceled" || step === "abandoned") {
            return { updated: false as const, email: "" };
          }

          const pa = d.processed_at;
          if (!isTimestamp(pa)) return { updated: false as const, email: "" };
          if (pa.toMillis() >= cutoffMs) return { updated: false as const, email: "" };

          // дополнительная защита: если Stripe status уже succeeded — не ставим abandoned
          const stripeStatus = String(d.status ?? "");
          if (stripeStatus === "succeeded") return { updated: false as const, email: "" };

          tx.update(c.ref, {
            funnel_step: "abandoned",
            abandoned_at: now,
            processed_at: now,
            // можно хранить причину (удобно для дебага)
            abandoned_reason: `timeout_${ABANDONED_TIMEOUT_MIN}m`,
          });

          const email = safeLowerEmail(d.email || d?.metadata?.email);
          return { updated: true as const, email };
        });

        if (result.updated) {
          updated.push({ id: c.id, email: result.email });
        }
      } catch (e: any) {
        logger.warn("markAbandonedCheckouts: transaction failed", {
          payment_intent_id: c.id,
          error: e?.message || String(e),
        });
      }
    }

    if (!updated.length) {
      logger.info("markAbandonedCheckouts: nothing updated (races filtered)", {
        ms: Date.now() - startedAt,
      });
      return;
    }

    // Zoho update (best-effort) — только для реально обновлённых
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
        const reason: any = (r as PromiseRejectedResult).reason;
        return {
          payment_intent_id: updated[i]?.id,
          email: updated[i]?.email,
          status: reason?.response?.status,
          data: reason?.response?.data,
          message: reason?.message || String(reason),
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
