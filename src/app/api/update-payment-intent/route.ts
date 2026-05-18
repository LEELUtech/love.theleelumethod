// app/api/update-intent/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { upsertContactCheckoutStarted } from '@/lib/zoho-functions';
import { emitFunnelEvent } from '@/lib/emitFunnelEvent';
import { db } from '@/lib/firebase';
import { doc, runTransaction, serverTimestamp, getDoc, collection, query, where, getDocs, type DocumentData } from 'firebase/firestore';
import type Stripe from 'stripe';

const stripe = getStripe();

const PRODUCT_NAMES: Record<string, string> = {
  compatibility_report: 'Compatibility Report',
  protocol_essentials: 'Protocol Essentials',
  guided_breakthrough: 'Guided Breakthrough',
  vip_immersion: 'VIP Immersion',
};

type Body = {
  intentId: string;
  intentToken: string;
  productType: string;

  email: string;

  firstName?: string;
  lastName?: string;
  phone?: string;

  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  // LAST-touch UTM
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  birthDate1?: string;
  birthDate2?: string;

  site?: string;
  pagePath?: string;
  checkoutVariant?: string;

  // optional analytics context
  sessionId?: string;
  deviceType?: string;
  browser?: string;

  leadSource?: string;

  salesiqVisitorId?: string;
  installment?: string;
  webinarDiscount?: boolean;
  promoCode?: string;
};

function clean(v?: string | null): string | undefined {
  const s = (v ?? '').trim();
  return s ? s : undefined;
}

async function findInstallmentPlan(
  email: string,
  productType: string
): Promise<{ amount: number; status: string } | null> {
  const snap = await getDocs(
    query(collection(db, 'installment_plans'), where('email', '==', email))
  );
  const plan = snap.docs.find(d => {
    const data = d.data();
    return (data.status === 'overdue' || data.status === 'pending') && data.product_type === productType;
  });
  if (!plan) return null;
  const data = plan.data();
  const amount = data.amount;
  return typeof amount === 'number' && amount > 0 ? { amount, status: data.status } : null;
}

function nonEmptyString(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return s ? s : null;
}

function numOrNull(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}


function buildLandingPage(site: string, pagePath?: string) {
  const pp = clean(pagePath);
  if (!pp) return null;
  return `https://${site}${pp.startsWith('/') ? '' : '/'}${pp}`;
}

function stripeMetaStr(pi: Stripe.PaymentIntent, key: string): string | null {
  const m = (pi.metadata ?? {}) as Record<string, string>;
  return nonEmptyString(m[key]);
}

function setMetaIfPresent(meta: Stripe.MetadataParam, key: string, v?: string) {
  const s = clean(v);
  if (s) meta[key] = s;
}

// stable event id (server-side dedup)
function stableCheckoutStartedEventId(paymentIntentId: string) {
  return `${paymentIntentId}:checkout_started`;
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

  lead_source?: string | null;
  salesiq_visitor_id?: string | null;
  session_id?: string | null;
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

    lead_source: nonEmptyString(d.lead_source),
    salesiq_visitor_id: nonEmptyString(d.salesiq_visitor_id),
    session_id: nonEmptyString(d.session_id),
  };
}

// advance-only ranks
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
  const requestId = `ui_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const body = (await req.json()) as Body;

    const intentId = clean(body.intentId);
    const token = clean(body.intentToken);
    const email = clean(body.email)?.toLowerCase();
    const productTypeIn = clean(body.productType);

    if (!intentId || !token || !email || !productTypeIn) {
      return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
    }

    const siteFromReq = process.env.ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT || "unknown";
    const pagePathIn = clean(body.pagePath);
    const checkoutVariantIn = clean(body.checkoutVariant);
    const salesiqVisitorIdIn = clean(body.salesiqVisitorId);
    const sessionIdIn = clean(body.sessionId);

    // 1) Load PI and verify intent_token
    const pi = await stripe.paymentIntents.retrieve(intentId);
    if ((pi.metadata?.intent_token || '') !== token) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    // 2) Ensure Stripe customer exists
    let customerId = pi.customer ? String(pi.customer) : null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name: [clean(body.firstName), clean(body.lastName)].filter(Boolean).join(' ') || undefined,
        phone: clean(body.phone),
        address: {
          line1: clean(body.address1),
          line2: clean(body.address2),
          city: clean(body.city),
          state: clean(body.state),
          postal_code: clean(body.postalCode),
          country: clean(body.country),
        },
      });
      customerId = customer.id;
    }

    // 3) Update metadata (strings only)
    const existingMeta = (pi.metadata ?? {}) as Stripe.MetadataParam;
    const nextMeta: Stripe.MetadataParam = {
      ...existingMeta,
      email,
      site: siteFromReq,
      product_type: productTypeIn,
      intent_token: token, // keep
    };

    if (pagePathIn) nextMeta.page_path = pagePathIn;
    if (checkoutVariantIn) nextMeta.checkout_variant = checkoutVariantIn;

    if (salesiqVisitorIdIn) nextMeta.salesiq_visitor_id = salesiqVisitorIdIn;
    if (sessionIdIn) nextMeta.session_id = sessionIdIn;

    // compatibility_report birth dates
    if (productTypeIn === 'compatibility_report') {
      const b1 = clean(body.birthDate1);
      const b2 = clean(body.birthDate2);
      if (b1) nextMeta.birth_date_1 = b1;
      if (b2) nextMeta.birth_date_2 = b2;
    }

    // LAST-touch
    setMetaIfPresent(nextMeta, 'utm_last_source', body.utmSource);
    setMetaIfPresent(nextMeta, 'utm_last_medium', body.utmMedium);
    setMetaIfPresent(nextMeta, 'utm_last_campaign', body.utmCampaign);
    setMetaIfPresent(nextMeta, 'utm_last_content', body.utmContent);
    setMetaIfPresent(nextMeta, 'utm_last_term', body.utmTerm);

    // lead_source (optional from FE)
    setMetaIfPresent(nextMeta, 'lead_source', body.leadSource);

    // Installment amount (existing plan takes priority over toggle)
    const installmentIn = clean(body.installment);
    const webinarDiscountIn = !!body.webinarDiscount;
    const promoCodeIn = clean(body.promoCode)?.toUpperCase();
    let installmentAmount: number | undefined;
    let setupFutureUsage: 'off_session' | undefined;

    let existingPlan: { amount: number; status: string } | null = null;
    try {
      existingPlan = await findInstallmentPlan(email, productTypeIn);
    } catch (e) {
      console.error('Installment plan check failed (non-critical)', { e });
    }

    if (existingPlan !== null) {
      // Existing installment plan takes highest priority
      installmentAmount = existingPlan.amount;
      nextMeta.source = existingPlan.status === 'overdue' ? 'installment_retry' : 'installment_early';
      nextMeta.installment = '2';
    } else {
      // Resolve base amount: promo > webinar discount > full price
      let baseAmount = pi.amount;

      if (promoCodeIn && productTypeIn === 'protocol_essentials') {
        try {
          const promoSnap = await getDoc(doc(db, 'promo_links', promoCodeIn));
          if (promoSnap.exists()) {
            const promoData = promoSnap.data() as {
              enabled?: boolean;
              expires_at?: { toDate?: () => Date } | string;
              discount_price?: number;
            };
            const enabled = !!promoData.enabled;
            let expiresAt: Date | null = null;
            if (promoData.expires_at) {
              if (typeof (promoData.expires_at as { toDate?: () => Date }).toDate === 'function') {
                expiresAt = (promoData.expires_at as { toDate: () => Date }).toDate();
              } else if (typeof promoData.expires_at === 'string') {
                expiresAt = new Date(promoData.expires_at);
              }
            }
            const notExpired = expiresAt !== null && expiresAt > new Date();
            if (
              enabled &&
              notExpired &&
              typeof promoData.discount_price === 'number' &&
              promoData.discount_price > 0
            ) {
              baseAmount = promoData.discount_price;
              nextMeta.promo_code = promoCodeIn;
            }
          }
        } catch (e) {
          console.error('Failed to fetch promo code (non-critical)', { e });
        }
      } else if (webinarDiscountIn) {
        try {
          const offeringSnap = await getDoc(doc(collection(db, 'offerings'), productTypeIn));
          if (offeringSnap.exists()) {
            const offeringData = offeringSnap.data() as { discount_price?: number };
            if (typeof offeringData.discount_price === 'number' && offeringData.discount_price > 0) {
              baseAmount = offeringData.discount_price;
              nextMeta.webinar_discount = '1';
            }
          }
        } catch (e) {
          console.error('Failed to fetch discount price (non-critical)', { e });
        }
      }

      if (installmentIn === '1') {
        nextMeta.installment = '1';
        if (pi.metadata?.installment !== '1') {
          installmentAmount = Math.ceil(baseAmount / 2);
          nextMeta.original_amount = String(baseAmount);
          setupFutureUsage = 'off_session';
        }
      } else if (pi.metadata?.installment === '1' && pi.metadata?.original_amount) {
        const orig = parseInt(pi.metadata.original_amount, 10);
        if (Number.isFinite(orig) && orig > 0) installmentAmount = orig;
        nextMeta.installment = '';
      } else if (baseAmount !== pi.amount) {
        installmentAmount = baseAmount;
      }
    }

    const piUpdated = await stripe.paymentIntents.update(intentId, {
      receipt_email: email,
      customer: customerId ?? undefined,
      metadata: nextMeta,
      ...(installmentAmount !== undefined ? { amount: installmentAmount } : {}),
      ...(setupFutureUsage ? { setup_future_usage: setupFutureUsage } : {}),
    });

    // Snapshot for analytics / firestore
    const piAmount = typeof piUpdated.amount === 'number' ? piUpdated.amount : null;
    const piCurrency = piUpdated.currency ?? null;
    const piStatus = (piUpdated.status as string) ?? null;
    const piCustomer = piUpdated.customer ? String(piUpdated.customer) : null;

    const piSite = stripeMetaStr(piUpdated, 'site');
    const piPagePath = stripeMetaStr(piUpdated, 'page_path');
    const piCheckoutVariant = stripeMetaStr(piUpdated, 'checkout_variant');
    const piProductType = stripeMetaStr(piUpdated, 'product_type');

    const piUtmFirstSource = stripeMetaStr(piUpdated, 'utm_first_source');
    const piUtmFirstMedium = stripeMetaStr(piUpdated, 'utm_first_medium');
    const piUtmFirstCampaign = stripeMetaStr(piUpdated, 'utm_first_campaign');
    const piUtmFirstContent = stripeMetaStr(piUpdated, 'utm_first_content');
    const piUtmFirstTerm = stripeMetaStr(piUpdated, 'utm_first_term');

    const piUtmLastSource = stripeMetaStr(piUpdated, 'utm_last_source');
    const piUtmLastMedium = stripeMetaStr(piUpdated, 'utm_last_medium');
    const piUtmLastCampaign = stripeMetaStr(piUpdated, 'utm_last_campaign');
    const piUtmLastContent = stripeMetaStr(piUpdated, 'utm_last_content');
    const piUtmLastTerm = stripeMetaStr(piUpdated, 'utm_last_term');

    const piLeadSource = stripeMetaStr(piUpdated, 'lead_source');
    const piSalesIqVisitorId = stripeMetaStr(piUpdated, 'salesiq_visitor_id');
    const piSessionId = stripeMetaStr(piUpdated, 'session_id');

    const leadSource = clean(body.leadSource) || piLeadSource || piUtmFirstSource || piUtmLastSource || null;

    // 4) Firestore advance-only write
    const ref = doc(db, 'payments', intentId);

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      const cur = asPaymentDoc(snap.exists() ? snap.data() : undefined);

      const curRank = rankOf(cur.funnel_step);
      const nextRank = rankOf('checkout_started');

      const patch: Record<string, unknown> = {
        updated_at: serverTimestamp(),
        email: cur.email ?? email,
        site: cur.site ?? siteFromReq,
      };

      if (!cur.page_path) patch.page_path = pagePathIn ?? piPagePath ?? null;
      if (!cur.checkout_variant) patch.checkout_variant = checkoutVariantIn ?? piCheckoutVariant ?? null;
      if (!cur.product_type) patch.product_type = productTypeIn ?? piProductType ?? null;

      if (cur.amount === null) patch.amount = piAmount ?? null;
      if (!cur.currency) patch.currency = piCurrency ?? null;
      if (!cur.stripe_status) patch.stripe_status = piStatus ?? null;
      if (!cur.stripe_customer_id) patch.stripe_customer_id = piCustomer ?? null;

      // last-touch update (only if present)
      if (piUtmLastSource) patch.utm_last_source = piUtmLastSource;
      if (piUtmLastMedium) patch.utm_last_medium = piUtmLastMedium;
      if (piUtmLastCampaign) patch.utm_last_campaign = piUtmLastCampaign;
      if (piUtmLastContent) patch.utm_last_content = piUtmLastContent;
      if (piUtmLastTerm) patch.utm_last_term = piUtmLastTerm;

      if (!cur.lead_source && leadSource) patch.lead_source = leadSource;

      if (!cur.salesiq_visitor_id && (piSalesIqVisitorId || salesiqVisitorIdIn)) {
        patch.salesiq_visitor_id = piSalesIqVisitorId ?? salesiqVisitorIdIn ?? null;
      }

      if (!cur.session_id && (piSessionId || sessionIdIn)) {
        patch.session_id = piSessionId ?? sessionIdIn ?? null;
      }

      if (nextRank > curRank) patch.funnel_step = 'checkout_started';

      tx.set(ref, patch, { merge: true });
    });

    const afterSnap = await getDoc(ref);
    const final = asPaymentDoc(afterSnap.exists() ? afterSnap.data() : undefined);

		// 5) Zoho snapshot (non-critical)
		try {
			await upsertContactCheckoutStarted({
				email,
				firstName: body.firstName,
				lastName: body.lastName,
				phone: body.phone,
				address1: body.address1,
				address2: body.address2,
				city: body.city,
				state: body.state,
				postalCode: body.postalCode,
				country: body.country,
				productType: productTypeIn,
				site: siteFromReq,
				stripePaymentIntentId: intentId,
				birthDate1: clean(body.birthDate1),
				birthDate2: clean(body.birthDate2),
			});
		} catch (e) {
			console.error("Zoho checkout_started failed (non-critical)", {
				requestId,
				e,
			});
		}

    // 6) Analytics event (best-effort) — stable event_id (dedup)
    try {
      const docSite = final.site ?? piSite ?? siteFromReq;
      const docPagePath = final.page_path ?? piPagePath ?? pagePathIn ?? null;

      await emitFunnelEvent({
        event_id: stableCheckoutStartedEventId(intentId),
        event_time: new Date().toISOString(),
        funnel_step: 'checkout_started',
        source: 'api:update-intent',

        payment_intent_id: intentId,
        intent_token: token,
        email,

        site: docSite,
        landing_page: buildLandingPage(docSite, docPagePath ?? undefined),
        page_path: docPagePath,
        checkout_variant: final.checkout_variant ?? checkoutVariantIn ?? piCheckoutVariant ?? null,

        product_type: final.product_type ?? productTypeIn ?? piProductType ?? null,
        product_name: PRODUCT_NAMES[productTypeIn] ?? productTypeIn ?? null,
        amount: piAmount ?? final.amount ?? null,
        currency: final.currency ?? piCurrency ?? null,

        webinar_discount: webinarDiscountIn && nextMeta.webinar_discount === '1' ? true : null,
        installment: installmentIn === '1' ? true : null,

        stripe_status: piStatus,
        stripe_customer_id: piCustomer,

        lead_source: final.lead_source ?? leadSource,

        utm_first_source: final.utm_first_source ?? piUtmFirstSource ?? null,
        utm_first_medium: final.utm_first_medium ?? piUtmFirstMedium ?? null,
        utm_first_campaign: final.utm_first_campaign ?? piUtmFirstCampaign ?? null,
        utm_first_content: final.utm_first_content ?? piUtmFirstContent ?? null,
        utm_first_term: final.utm_first_term ?? piUtmFirstTerm ?? null,

        utm_last_source: final.utm_last_source ?? piUtmLastSource ?? clean(body.utmSource) ?? null,
        utm_last_medium: final.utm_last_medium ?? piUtmLastMedium ?? clean(body.utmMedium) ?? null,
        utm_last_campaign: final.utm_last_campaign ?? piUtmLastCampaign ?? clean(body.utmCampaign) ?? null,
        utm_last_content: final.utm_last_content ?? piUtmLastContent ?? clean(body.utmContent) ?? null,
        utm_last_term: final.utm_last_term ?? piUtmLastTerm ?? clean(body.utmTerm) ?? null,

        session_id: final.session_id ?? piSessionId ?? sessionIdIn ?? null,
        device_type: clean(body.deviceType) ?? null,
        browser: clean(body.browser) ?? null,
        country: clean(body.country) ?? null,

        salesiq_visitor_id: final.salesiq_visitor_id ?? piSalesIqVisitorId ?? salesiqVisitorIdIn ?? null,
      });
    } catch (e) {
      console.error('emitFunnelEvent checkout_started failed (non-critical)', {
        requestId,
        e,
      });
    }

    return NextResponse.json({ ok: true, customerId: piCustomer });
  } catch (err) {
    console.error('update intent fatal', { err });
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
