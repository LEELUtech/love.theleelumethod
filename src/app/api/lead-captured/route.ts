// app/api/lead-captured/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { upsertContactLeadCaptured } from "@/lib/zoho-functions";
import { emitFunnelEvent } from "@/lib/emitFunnelEvent";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  query,
  where,
  limit,
  getDocs,
  getDoc,
  runTransaction,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

const stripe = getStripe();

type Body = {
  email: string;
  paymentIntentId?: string;
  intentToken?: string;

  site?: string;
  pagePath?: string;

  // FIRST-touch UTM (fallback only)
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  // optional: if you already capture these on frontend
  checkoutVariant?: string;
  sessionId?: string;

  // optional: allow explicit lead source from frontend (if you have it)
  leadSource?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v?: string | null): string | undefined {
  const s = (v ?? "").trim();
  return s ? s : undefined;
}

function normalizeSite(raw?: string | null): string | undefined {
  const s = (raw || "").trim();
  if (!s) return undefined;

  try {
    if (s.startsWith("http://") || s.startsWith("https://")) {
      return new URL(s).host.split(":")[0].toLowerCase();
    }
  } catch {
    // ignore
  }

  return s.split(":")[0].toLowerCase();
}

function getIncomingSite(req: Request, bodySite?: string): string {
  const raw =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    bodySite ||
    process.env.DOMAIN_URL ||
    "unknown";
  return normalizeSite(raw) || "unknown";
}

function buildLandingPage(site: string, pagePath?: string) {
  const pp = clean(pagePath);
  if (!pp) return null;
  return `https://${site}${pp.startsWith("/") ? "" : "/"}${pp}`;
}

function nonEmptyString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s : null;
}

function numOrNull(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function stripeMetaStr(pi: Stripe.PaymentIntent, key: string): string | null {
  return nonEmptyString((pi.metadata as Record<string, string> | undefined)?.[key]);
}

async function findPaymentDocIdByIntentToken(token: string) {
  const q = query(
    collection(db, "payments"),
    where("metadata.intent_token", "==", token),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].id;
}

// ✅ ranks to prevent rollback
const STEP_RANK: Record<string, number> = {
  checkout_viewed: 10,
  lead_captured: 20,
  checkout_started: 30,
  paid: 40,
  delivered: 50,
  delivery_failed: 55,
  payment_failed: 60,
  canceled: 60,
};

function rankOf(step: unknown): number {
  if (typeof step !== "string") return 0;
  return STEP_RANK[step] ?? 0;
}

type PaymentDoc = {
  funnel_step: string | null;

  email: string | null;
  site: string | null;
  page_path: string | null;
  checkout_variant: string | null;
  product_type: string | null;

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
};

function asPaymentDoc(data?: DocumentData): PaymentDoc {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    funnel_step: nonEmptyString(d.funnel_step),

    email: nonEmptyString(d.email),
    site: nonEmptyString(d.site),
    page_path: nonEmptyString(d.page_path),
    checkout_variant: nonEmptyString(d.checkout_variant),
    product_type: nonEmptyString(d.product_type),

    amount: numOrNull(d.amount),
    currency: nonEmptyString(d.currency),
    stripe_status: nonEmptyString(d.stripe_status),
    stripe_customer_id: nonEmptyString(d.stripe_customer_id),

    utm_first_source: nonEmptyString(d.utm_first_source),
    utm_first_medium: nonEmptyString(d.utm_first_medium),
    utm_first_campaign: nonEmptyString(d.utm_first_campaign),
    utm_first_content: nonEmptyString(d.utm_first_content),
    utm_first_term: nonEmptyString(d.utm_first_term),

    utm_last_source: nonEmptyString(d.utm_last_source),
    utm_last_medium: nonEmptyString(d.utm_last_medium),
    utm_last_campaign: nonEmptyString(d.utm_last_campaign),
    utm_last_content: nonEmptyString(d.utm_last_content),
    utm_last_term: nonEmptyString(d.utm_last_term),
  };
}

function makeEventId(paymentIntentId: string, step: string) {
  return `${paymentIntentId}:${step}:${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function POST(req: NextRequest) {
  const requestId = `lc_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const body = (await req.json()) as Body;

    const email = clean(body.email)?.toLowerCase();
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const siteFromReq = getIncomingSite(req, body.site);
    const pagePathIn = clean(body.pagePath);

    let paymentIntentId = clean(body.paymentIntentId);
    const intentToken = clean(body.intentToken);

    // If no intent id, try find by intent_token in Firestore
    if (!paymentIntentId && intentToken) {
      paymentIntentId = (await findPaymentDocIdByIntentToken(intentToken)) ?? undefined;
    }

    // Zoho snapshot (non-critical)
    try {
      await upsertContactLeadCaptured({ email, site: siteFromReq });
    } catch (e) {
      console.error("Zoho lead_captured failed (non-critical)", { requestId, e });
    }

    // If still no PI — we can’t tie to payment record yet
    if (!paymentIntentId) {
      return NextResponse.json({ ok: true, deferred: true });
    }

    // Security: require intent token
    if (!intentToken) return NextResponse.json({ ok: true, ignored: true });

    // Stripe verify PI belongs to that intentToken
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if ((pi.metadata?.intent_token || "") !== intentToken) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    // Stripe snapshot
    const piAmount = typeof pi.amount === "number" ? pi.amount : null;
    const piCurrency = pi.currency ?? null;
    const piStatus = (pi.status as string) ?? null;
    const piCustomer = pi.customer ? String(pi.customer) : null;

    const piProductType = stripeMetaStr(pi, "product_type");
    const piSite = stripeMetaStr(pi, "site");
    const piPagePath = stripeMetaStr(pi, "page_path");
    const piCheckoutVariant = stripeMetaStr(pi, "checkout_variant");

    const piUtmFirstSource = stripeMetaStr(pi, "utm_first_source");
    const piUtmFirstMedium = stripeMetaStr(pi, "utm_first_medium");
    const piUtmFirstCampaign = stripeMetaStr(pi, "utm_first_campaign");
    const piUtmFirstContent = stripeMetaStr(pi, "utm_first_content");
    const piUtmFirstTerm = stripeMetaStr(pi, "utm_first_term");

    const piLeadSource = stripeMetaStr(pi, "lead_source"); // ✅ important

    // incoming fallbacks
    const utmFirstSourceIn = clean(body.utmSource);
    const utmFirstMediumIn = clean(body.utmMedium);
    const utmFirstCampaignIn = clean(body.utmCampaign);
    const utmFirstContentIn = clean(body.utmContent);
    const utmFirstTermIn = clean(body.utmTerm);

    const checkoutVariantIn = clean(body.checkoutVariant);
    const leadSourceIn = clean(body.leadSource);

    const leadSource =
      leadSourceIn ||
      piLeadSource ||
      piUtmFirstSource ||
      utmFirstSourceIn ||
      null;

    // Firestore: advance-only
    const ref = doc(db, "payments", paymentIntentId);

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      const cur = asPaymentDoc(snap.exists() ? snap.data() : undefined);

      const curRank = rankOf(cur.funnel_step);
      const nextRank = rankOf("lead_captured");

      const patch: Record<string, unknown> = {
        updated_at: serverTimestamp(),
        processed_at: serverTimestamp(),

        // do not overwrite if already set
        email: cur.email ?? email,
        site: cur.site ?? siteFromReq,
      };

      if (!cur.page_path) patch.page_path = pagePathIn ?? piPagePath ?? null;

      // checkout_variant: allow fallback from body -> stripe -> null
      if (!cur.checkout_variant) {
        patch.checkout_variant = checkoutVariantIn ?? piCheckoutVariant ?? null;
      }

      if (!cur.product_type) patch.product_type = piProductType ?? null;

      // first-touch never overwrite: prefer cur -> stripe -> incoming
      if (!cur.utm_first_source) patch.utm_first_source = piUtmFirstSource ?? utmFirstSourceIn ?? null;
      if (!cur.utm_first_medium) patch.utm_first_medium = piUtmFirstMedium ?? utmFirstMediumIn ?? null;
      if (!cur.utm_first_campaign) patch.utm_first_campaign = piUtmFirstCampaign ?? utmFirstCampaignIn ?? null;
      if (!cur.utm_first_content) patch.utm_first_content = piUtmFirstContent ?? utmFirstContentIn ?? null;
      if (!cur.utm_first_term) patch.utm_first_term = piUtmFirstTerm ?? utmFirstTermIn ?? null;

      // stripe snapshot if missing
      if (cur.amount === null) patch.amount = piAmount ?? null;
      if (!cur.currency) patch.currency = piCurrency ?? null;
      if (!cur.stripe_status) patch.stripe_status = piStatus ?? null;
      if (!cur.stripe_customer_id) patch.stripe_customer_id = piCustomer ?? null;

      // OPTIONAL: store lead_source in payments doc for later CRM use
      if (!(snap.data())?.lead_source && leadSource) patch.lead_source = leadSource;

      // advance-only
      if (nextRank > curRank) patch.funnel_step = "lead_captured";

      tx.set(ref, patch, { merge: true });
    });

    const afterSnap = await getDoc(ref);
    const final = asPaymentDoc(afterSnap.exists() ? afterSnap.data() : undefined);

    const docSite = final.site ?? piSite ?? siteFromReq;
    const docPagePath = final.page_path ?? piPagePath ?? pagePathIn ?? null;

    // Analytics (best-effort)
    try {
      await emitFunnelEvent({
        // ✅ UNIQUE EVENT ID so Analytics APPENDS instead of updating
        event_id: makeEventId(paymentIntentId, "lead_captured"),
        event_time: new Date().toISOString(),
        source: "api:lead-captured",
        funnel_step: "lead_captured",

        payment_intent_id: paymentIntentId,
        intent_token: intentToken,
        email,

        site: docSite,
        landing_page: buildLandingPage(docSite, docPagePath ?? undefined),
        page_path: docPagePath,
        checkout_variant: final.checkout_variant ?? checkoutVariantIn ?? piCheckoutVariant ?? null,

        product_type: final.product_type ?? piProductType ?? null,
        amount: final.amount ?? piAmount ?? null,
        currency: final.currency ?? piCurrency ?? null,

        stripe_status: piStatus,
        stripe_customer_id: piCustomer,

        lead_source: leadSource,

        utm_first_source: final.utm_first_source ?? piUtmFirstSource ?? utmFirstSourceIn ?? null,
        utm_first_medium: final.utm_first_medium ?? piUtmFirstMedium ?? utmFirstMediumIn ?? null,
        utm_first_campaign: final.utm_first_campaign ?? piUtmFirstCampaign ?? utmFirstCampaignIn ?? null,
        utm_first_content: final.utm_first_content ?? piUtmFirstContent ?? utmFirstContentIn ?? null,
        utm_first_term: final.utm_first_term ?? piUtmFirstTerm ?? utmFirstTermIn ?? null,

        session_id: clean(body.sessionId) ?? null,
      });
    } catch (e) {
      console.error("emitFunnelEvent lead_captured failed (non-critical)", {
        requestId,
        paymentIntentId,
        e,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("lead-captured fatal", err);
    return NextResponse.json({ ok: false });
  }
}
