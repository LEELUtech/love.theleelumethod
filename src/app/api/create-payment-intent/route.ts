// app/api/create-payment-intent/route.ts
// create-intent (checkout_viewed) — advance-only Firestore write + analytics event (dedup-safe)

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, runTransaction, serverTimestamp, type DocumentData } from 'firebase/firestore';
import { getStripe } from '@/lib/stripe';
import type Stripe from 'stripe';
import { randomUUID } from 'crypto';
import { emitFunnelEvent } from '@/lib/emitFunnelEvent';

const stripe = getStripe();

const ALLOWED_PRODUCT_TYPES = new Set([
  'compatibility_report',
  'guided_breakthrough',
  'protocol_essentials',
  'protocol_essentials_webinar',
  'vip_immersion',
]);

type Body = {
  productType: string;
  pagePath?: string;

  // FIRST-touch UTM (from client)
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  // optional (if you decide to send later)
  sessionId?: string;
  salesiqVisitorId?: string;
};

function clean(v?: string | null): string | undefined {
  const s = (v ?? '').trim();
  return s ? s : undefined;
}


function buildLandingPage(site: string, pagePath?: string) {
  const pp = clean(pagePath);
  if (!pp) return null;
  return `https://${site}${pp.startsWith('/') ? '' : '/'}${pp}`;
}

function toMetadataRecord(obj: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      const s = v.trim();
      if (s) out[k] = s;
    }
  }
  return out;
}

function nonEmptyString(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return s ? s : null;
}

function numOrNull(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

type PaymentDoc = {
  funnel_step: string | null;

  stripe_payment_intent_id: string | null;
  intent_token: string | null;

  email: string | null;
  product_type: string | null;

  amount: number | null;
  currency: string | null;

  stripe_status: string | null;
  stripe_customer_id: string | null;

  site: string | null;
  page_path: string | null;
  checkout_variant: string | null;

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

  session_id: string | null;
  salesiq_visitor_id: string | null;

  delivery_status: string | null;
  delivery_error: string | null;

  processing_status: string | null;
};

function asPaymentDoc(data?: DocumentData): PaymentDoc {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    funnel_step: nonEmptyString(d.funnel_step),

    stripe_payment_intent_id: nonEmptyString(d.stripe_payment_intent_id),
    intent_token: nonEmptyString(d.intent_token),

    email: nonEmptyString(d.email),
    product_type: nonEmptyString(d.product_type),

    amount: numOrNull(d.amount),
    currency: nonEmptyString(d.currency),

    stripe_status: nonEmptyString(d.stripe_status),
    stripe_customer_id: nonEmptyString(d.stripe_customer_id),

    site: nonEmptyString(d.site),
    page_path: nonEmptyString(d.page_path),
    checkout_variant: nonEmptyString(d.checkout_variant),

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

    session_id: nonEmptyString(d.session_id),
    salesiq_visitor_id: nonEmptyString(d.salesiq_visitor_id),

    delivery_status: nonEmptyString(d.delivery_status),
    delivery_error: nonEmptyString(d.delivery_error),

    processing_status: nonEmptyString(d.processing_status),
  };
}

// ranks to prevent rollback
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
  if (typeof step !== 'string') return 0;
  return STEP_RANK[step] ?? 0;
}

export async function POST(req: NextRequest) {
  const requestId = `cpi_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const body = (await req.json()) as Body;

    const productType = clean(body.productType);
    if (!productType) {
      return NextResponse.json({ error: 'Missing required field: productType' }, { status: 400 });
    }
    if (!ALLOWED_PRODUCT_TYPES.has(productType)) {
      return NextResponse.json({ error: 'Unknown productType' }, { status: 400 });
    }

    // Load offering
    const offeringRef = doc(collection(db, 'offerings'), productType);
    const offeringSnap = await getDoc(offeringRef);
    if (!offeringSnap.exists()) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const offering = offeringSnap.data() as {
      price?: number; // cents
      currency?: string;
      space_id?: string;
      name?: string;
    };

    const amount = typeof offering.price === 'number' ? offering.price : 0;
    const currency = (offering.currency ?? 'USD').toLowerCase();
    const productName = offering.name ? String(offering.name) : null;

    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid product price' }, { status: 500 });
    }

    const site = process.env.ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT || "unknown";
    const pagePath = clean(body.pagePath);
    const landingPage = buildLandingPage(site, pagePath);

    const utmFirstSource = clean(body.utmSource);
    const utmFirstMedium = clean(body.utmMedium);
    const utmFirstCampaign = clean(body.utmCampaign);
    const utmFirstContent = clean(body.utmContent);
    const utmFirstTerm = clean(body.utmTerm);
    const sessionId = clean(body.sessionId);
    const salesiqVisitorId = clean(body.salesiqVisitorId);

    const intentToken = randomUUID();

    const metadata: Stripe.MetadataParam = toMetadataRecord({
      schema: 'payments_v1',
      product_type: productType,
      site,
      ...(pagePath ? { page_path: pagePath } : {}),

      ...(utmFirstSource ? { utm_first_source: utmFirstSource } : {}),
      ...(utmFirstMedium ? { utm_first_medium: utmFirstMedium } : {}),
      ...(utmFirstCampaign ? { utm_first_campaign: utmFirstCampaign } : {}),
      ...(utmFirstContent ? { utm_first_content: utmFirstContent } : {}),
      ...(utmFirstTerm ? { utm_first_term: utmFirstTerm } : {}),

      ...(sessionId ? { session_id: sessionId } : {}),
      ...(salesiqVisitorId ? { salesiq_visitor_id: salesiqVisitorId } : {}),

      intent_token: intentToken,
      ...(offering.space_id ? { space_id: String(offering.space_id) } : {}),
    });

    // Stripe create PI (idempotent per intentToken)
    const intent = await stripe.paymentIntents.create(
      {
        amount,
        currency,

        //FOR APPLE PAY

        // automatic_payment_methods: {
        //   enabled: true,
        // },

        payment_method_types: ['card'],
        metadata,
      },
      { idempotencyKey: intentToken },
    );

    if (!intent.client_secret) {
      return NextResponse.json({ error: 'Stripe did not return client_secret' }, { status: 500 });
    }

    // Firestore: advance-only write
    const payRef = doc(collection(db, 'payments'), intent.id);

    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(payRef);
        const cur = asPaymentDoc(snap.exists() ? snap.data() : undefined);

        const curRank = rankOf(cur.funnel_step);
        const nextRank = rankOf('checkout_viewed');

        const patch: Record<string, unknown> = {
          stripe_payment_intent_id: intent.id,
          intent_token: intentToken,

          // do NOT force email here
          product_type: cur.product_type ?? productType,

          // stripe snapshot
          amount: cur.amount ?? amount,
          currency: cur.currency ?? intent.currency ?? currency,
          stripe_status: cur.stripe_status ?? (intent.status as string),
          stripe_customer_id: cur.stripe_customer_id ?? (intent.customer ? String(intent.customer) : null),

          // context (do not overwrite existing dims)
          site: cur.site ?? site,
          page_path: cur.page_path ?? pagePath ?? null,
          checkout_variant: cur.checkout_variant ?? null,

          // FIRST-touch (never overwrite)
          utm_first_source: cur.utm_first_source ?? utmFirstSource ?? null,
          utm_first_medium: cur.utm_first_medium ?? utmFirstMedium ?? null,
          utm_first_campaign: cur.utm_first_campaign ?? utmFirstCampaign ?? null,
          utm_first_content: cur.utm_first_content ?? utmFirstContent ?? null,
          utm_first_term: cur.utm_first_term ?? utmFirstTerm ?? null,

          // last-touch untouched here
          utm_last_source: cur.utm_last_source ?? null,
          utm_last_medium: cur.utm_last_medium ?? null,
          utm_last_campaign: cur.utm_last_campaign ?? null,
          utm_last_content: cur.utm_last_content ?? null,
          utm_last_term: cur.utm_last_term ?? null,

          session_id: cur.session_id ?? sessionId ?? null,
          salesiq_visitor_id: cur.salesiq_visitor_id ?? salesiqVisitorId ?? null,

          delivery_status: cur.delivery_status ?? 'not_started',
          delivery_error: cur.delivery_error ?? null,

          // ✅ unified status
          processing_status: cur.processing_status ?? 'created',

          // timestamps
          updated_at: serverTimestamp(),
          ...(snap.exists() ? {} : { created_at: serverTimestamp() }),

          // store metadata as plain object
          metadata: metadata as Record<string, string>,
          error: null,
        };

        // funnel_step advance-only
        if (nextRank > curRank) patch.funnel_step = 'checkout_viewed';

        tx.set(payRef, patch, { merge: true });
      });
    } catch (e) {
      console.error('Failed to write checkout_viewed to Firestore (non-critical)', {
        requestId,
        intentId: intent.id,
        e,
      });
    }

    // Analytics event (best-effort) — ✅ dedup by deterministic event_id
    try {
      await emitFunnelEvent({
        event_id: `${intent.id}:checkout_viewed`,
        event_time: new Date().toISOString(),
        source: 'api:create-payment-intent',

        event_name: 'checkout_viewed',
        funnel_step: 'checkout_viewed',

        payment_intent_id: intent.id,
        intent_token: intentToken,
        email: null,

        site,
        landing_page: landingPage,
        page_path: pagePath ?? null,
        checkout_variant: null,

        product_type: productType,
        product_name: productName,
        amount,
        currency: intent.currency ?? currency,

        stripe_status: intent.status as string,
        stripe_customer_id: intent.customer ? String(intent.customer) : null,

        utm_first_source: utmFirstSource ?? null,
        utm_first_medium: utmFirstMedium ?? null,
        utm_first_campaign: utmFirstCampaign ?? null,
        utm_first_content: utmFirstContent ?? null,
        utm_first_term: utmFirstTerm ?? null,

        utm_last_source: null,
        utm_last_medium: null,
        utm_last_campaign: null,
        utm_last_content: null,
        utm_last_term: null,

        session_id: sessionId ?? null,
        salesiq_visitor_id: salesiqVisitorId ?? null,

        processing_status: 'created',
        delivery_status: 'not_started',
      });
    } catch (e) {
      console.error('emitFunnelEvent(checkout_viewed) failed (non-critical)', {
        requestId,
        intentId: intent.id,
        e,
      });
    }

    return NextResponse.json({
      clientSecret: intent.client_secret,
      intentId: intent.id,
      intentToken,
      site,
      pagePath: pagePath ?? null,
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
