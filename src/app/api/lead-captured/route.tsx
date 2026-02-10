/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { upsertContactLeadCaptured } from "@/lib/zoho-functions.sandbox";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  limit,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStripe } from "@/lib/stripe";

type Body = {
  email: string;
  paymentIntentId?: string;
  intentToken?: string;

  pagePath?: string;
  site?: string;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

const stripe = getStripe();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v?: string | null) {
  const s = (v ?? "").trim();
  return s ? s : undefined;
}

function normalizeSite(raw?: string | null): string | undefined {
  const s = (raw || "").trim();
  if (!s) return undefined;
  try {
    if (s.startsWith("http://") || s.startsWith("https://")) {
      const host = new URL(s).host.toLowerCase();
      return host.split(":")[0];
    }
  } catch {}
  const host = s.replace(/\/+$/, "").toLowerCase();
  return host.split(":")[0];
}

function getIncomingSite(req: Request): string | undefined {
  const raw = req.headers.get("x-forwarded-host") || req.headers.get("host");
  return normalizeSite(raw);
}

async function findPaymentDocIdByIntentToken(intentToken: string): Promise<string | null> {
  const q = query(
    collection(db, "payments"),
    where("metadata.intent_token", "==", intentToken),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].id;
}

function funnelRank(step?: string | null) {
  switch (step) {
    case "checkout_viewed":
      return 10;
    case "lead_captured":
      return 20;
    case "abandoned":
      return 25;
    case "checkout_started":
      return 30;
    case "paid":
      return 40;
    case "delivered":
      return 50;
    case "failed":
    case "canceled":
      return 60;
    default:
      return 0;
  }
}

// patch-only helper (no null overwrites)
function patchSet(target: Record<string, unknown>, key: string, value?: string) {
  if (value === undefined) return;
  target[key] = value;
}

export async function POST(req: NextRequest) {
  const requestId = `lc_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const body = (await req.json()) as Body;

    const email = clean(body.email)?.toLowerCase();
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ ok: false, ignored: true, requestId }, { status: 200 });
    }

    const site = normalizeSite(body.site) || getIncomingSite(req);
    const pagePath = clean(body.pagePath);

    const utmSource = clean(body.utmSource);
    const utmMedium = clean(body.utmMedium);
    const utmCampaign = clean(body.utmCampaign);
    const utmContent = clean(body.utmContent);
    const utmTerm = clean(body.utmTerm);

    // Resolve PI id: id first, else token -> doc id
    let paymentIntentId = clean(body.paymentIntentId);
    const intentToken = clean(body.intentToken);

    if (!paymentIntentId && intentToken) {
      paymentIntentId = (await findPaymentDocIdByIntentToken(intentToken)) ?? undefined;
    }

    // 🔒 Security: if PI id exists, token must exist and match Stripe metadata
    if (paymentIntentId) {
      if (!intentToken) {
        return NextResponse.json(
          { ok: true, ignored: true, reason: "missing_intentToken", requestId },
          { status: 200 },
        );
      }

      try {
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        const expected = (pi.metadata?.intent_token || "").trim();
        if (!expected || expected !== intentToken) {
          return NextResponse.json(
            { ok: true, ignored: true, reason: "token_mismatch", requestId },
            { status: 200 },
          );
        }
      } catch (e) {
        console.error("⚠️ Stripe retrieve failed (token check)", { requestId, paymentIntentId, e });
        return NextResponse.json(
          { ok: true, ignored: true, reason: "stripe_unavailable", requestId },
          { status: 200 },
        );
      }
    }

    // 1) Zoho (non-critical)
    try {
      await upsertContactLeadCaptured({
        email,
        site,
        pagePath,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
      });
    } catch (e) {
      console.error("⚠️ Zoho lead-captured failed (non-critical)", { requestId, e });
    }

    // 2) Firestore (non-critical) - patch-only + advance-only
    try {
      if (paymentIntentId) {
        const paymentRef = doc(collection(db, "payments"), paymentIntentId);
        const snap = await getDoc(paymentRef);

        if (!snap.exists()) {
          await setDoc(
            paymentRef,
            {
              stripe_payment_intent_id: paymentIntentId,
              stripe_event_id: null,

              email,
              product_type: null,

              amount: null,
              currency: null,
              status: null,

              customer_id: null,

              site: site ?? null,
              page_path: pagePath ?? null,
              checkout_variant: null,

              utm_source: utmSource ?? null,
              utm_medium: utmMedium ?? null,
              utm_campaign: utmCampaign ?? null,
              utm_content: utmContent ?? null,
              utm_term: utmTerm ?? null,

              metadata: {
                ...(intentToken ? { intent_token: intentToken } : {}),
              },

              processing_status: "processing",
              funnel_step: "lead_captured",

              delivery_status: "not_started",
              delivery_error: null,

              zoho_contact_id: null,
              zoho_deal_id: null,
              zoho_synced_at: null,

              locked_by: null,
              lock_expires_at: null,

              attempts: 0,
              created_at: serverTimestamp(),
              processed_at: serverTimestamp(),
              error: null,

              intent_token: intentToken ?? null,
            },
            { merge: true },
          );
        } else {
          const prev = snap.data() as any;
          const prevStep = (prev?.funnel_step ?? null) as string | null;

          const nextStep =
            funnelRank(prevStep) >= funnelRank("checkout_started") ? prevStep : "lead_captured";

          const patch: Record<string, unknown> = {
            email,
            funnel_step: nextStep,
            processed_at: serverTimestamp(),
          };

          if (site) patchSet(patch, "site", site);
          if (pagePath) patchSet(patch, "page_path", pagePath);
          if (utmSource) patchSet(patch, "utm_source", utmSource);
          if (utmMedium) patchSet(patch, "utm_medium", utmMedium);
          if (utmCampaign) patchSet(patch, "utm_campaign", utmCampaign);
          if (utmContent) patchSet(patch, "utm_content", utmContent);
          if (utmTerm) patchSet(patch, "utm_term", utmTerm);

          await setDoc(paymentRef, patch, { merge: true });
        }
      }
    } catch (e) {
      console.error("⚠️ Firestore lead-captured update failed (non-critical)", { requestId, e });
    }

    // 3) Stripe metadata update (non-critical) - MERGE (do not lose intent_token)
    try {
      if (paymentIntentId) {
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        const existing = pi.metadata ?? {};

        const md: Record<string, string> = {
          ...existing,
          intent_token: existing.intent_token || intentToken || "",
          email,
          ...(site ? { site } : {}),
          ...(pagePath ? { page_path: pagePath } : {}),
          ...(utmSource ? { utm_source: utmSource } : {}),
          ...(utmMedium ? { utm_medium: utmMedium } : {}),
          ...(utmCampaign ? { utm_campaign: utmCampaign } : {}),
          ...(utmContent ? { utm_content: utmContent } : {}),
          ...(utmTerm ? { utm_term: utmTerm } : {}),
          updated_at: new Date().toISOString(),
        };

        if (!md.intent_token) delete md.intent_token;

        await stripe.paymentIntents.update(paymentIntentId, { metadata: md });
      }
    } catch (e) {
      console.error("⚠️ Stripe metadata update failed (non-critical)", { requestId, e });
    }

    return NextResponse.json({ ok: true, requestId }, { status: 200 });
  } catch (err: unknown) {
    console.error("❌ lead-captured fatal:", { requestId, err });
    return NextResponse.json({ ok: false, requestId }, { status: 200 });
  }
}
