/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/update-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { upsertContactCheckoutStarted } from "@/lib/zoho-functions.sandbox";

const stripe = getStripe();

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

  birthDate1?: string;
  birthDate2?: string;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  checkoutVariant?: string;
  pagePath?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v?: string | null) {
  const s = (v ?? "").trim();
  return s ? s : undefined;
}

/**
 * ✅ normalize host:
 * - supports "https://domain:port/path"
 * - strips port
 * - strips trailing slashes
 */
function normalizeSite(raw?: string | null): string {
  const s = (raw || "").trim();
  if (!s) return "unknown";

  try {
    if (s.startsWith("http://") || s.startsWith("https://")) {
      const host = new URL(s).host.toLowerCase();
      return host.split(":")[0];
    }
  } catch {}

  const host = s.replace(/\/+$/, "").toLowerCase();
  return host.split(":")[0];
}

function getIncomingSite(req: Request): string {
  const raw =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    process.env.DOMAIN_URL ||
    "unknown";

  return normalizeSite(raw);
}

function safeTokenPreview(token?: string | null) {
  const t = (token || "").toString();
  if (!t) return "";
  if (t.length <= 10) return "***";
  return `${t.slice(0, 6)}…${t.slice(-4)}`;
}

function errToLogObject(e: any) {
  const status = e?.response?.status;
  const data = e?.response?.data;
  const headers = e?.response?.headers;
  return {
    status,
    data,
    zohoRequestId: headers?.["x-request-id"] ?? headers?.["X-Request-Id"],
    url: e?.config?.url,
    method: e?.config?.method,
    message: e?.message,
  };
}

/** whitelist: чтобы в metadata не улетал мусор */
function buildMetadata(body: Body, pi: Stripe.PaymentIntent, siteFinal: string) {
  const metadata: Record<string, string> = {
    product_type: (pi.metadata?.product_type?.toString() || body.productType).trim(),
    email: body.email.trim().toLowerCase(),
    site: siteFinal,
    updated_at: new Date().toISOString(),
  };

  // preserve immutable from create-intent
  if (pi.metadata?.space_id) metadata.space_id = pi.metadata.space_id.toString();
  if (pi.metadata?.created_at) metadata.created_at = pi.metadata.created_at.toString();
  if (pi.metadata?.intent_token) metadata.intent_token = pi.metadata.intent_token.toString();

  const firstName = clean(body.firstName);
  const lastName = clean(body.lastName);
  const fullName = clean([firstName, lastName].filter(Boolean).join(" "));
  if (fullName) metadata.name = fullName;

  const phone = clean(body.phone);
  if (phone) metadata.phone = phone;

  const address1 = clean(body.address1);
  const address2 = clean(body.address2);
  const city = clean(body.city);
  const state = clean(body.state);
  const postalCode = clean(body.postalCode);
  const country = clean(body.country)?.toUpperCase();

  if (address1) metadata.address_line1 = address1;
  if (address2) metadata.address_line2 = address2;
  if (city) metadata.city = city;
  if (state) metadata.state = state;
  if (postalCode) metadata.postal_code = postalCode;
  if (country) metadata.country = country;

  // compatibility_report special fields
  if (metadata.product_type === "compatibility_report") {
    const bd1 = clean(body.birthDate1);
    const bd2 = clean(body.birthDate2);
    if (!bd1 || !bd2) {
      throw new Error("Missing birth dates for compatibility report");
    }
    metadata.birth_date_1 = bd1;
    metadata.birth_date_2 = bd2;
  }

  // UTM / context
  const utmSource = clean(body.utmSource);
  const utmMedium = clean(body.utmMedium);
  const utmCampaign = clean(body.utmCampaign);
  const utmContent = clean(body.utmContent);
  const utmTerm = clean(body.utmTerm);

  if (utmSource) metadata.utm_source = utmSource;
  if (utmMedium) metadata.utm_medium = utmMedium;
  if (utmCampaign) metadata.utm_campaign = utmCampaign;
  if (utmContent) metadata.utm_content = utmContent;
  if (utmTerm) metadata.utm_term = utmTerm;

  const checkoutVariant = clean(body.checkoutVariant);
  const pagePath = clean(body.pagePath);

  if (checkoutVariant) metadata.checkout_variant = checkoutVariant;
  if (pagePath) metadata.page_path = pagePath;

  return metadata;
}

export async function POST(req: NextRequest) {
  const requestId = `upi_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const body = (await req.json()) as Body;

    const incomingSite = getIncomingSite(req);

    const intentId = clean(body.intentId);
    const intentToken = clean(body.intentToken);
    const productType = clean(body.productType);
    const email = clean(body.email)?.toLowerCase();

    console.log("➡️ update-payment-intent START", {
      requestId,
      incomingSite,
      intentId,
      productType,
      email,
      intentTokenPreview: safeTokenPreview(intentToken),
    });

    if (!intentId) return NextResponse.json({ error: "Missing intentId", requestId }, { status: 400 });
    if (!intentToken) return NextResponse.json({ error: "Missing intentToken", requestId }, { status: 400 });
    if (!productType) return NextResponse.json({ error: "Missing productType", requestId }, { status: 400 });

    if (!email) return NextResponse.json({ error: "Email is required", requestId }, { status: 400 });
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format", requestId }, { status: 400 });
    }

    // 1) retrieve PI
    const pi = await stripe.paymentIntents.retrieve(intentId);

    // ✅ early exits: don't try to mutate finalized intents
    if (pi.status === "canceled") {
      return NextResponse.json({ ok: true, requestId, canceled: true }, { status: 200 });
    }

    // 2) security: token match
    const storedToken = (pi.metadata?.intent_token ?? "").toString();
    if (!storedToken || storedToken !== intentToken) {
      console.warn("⛔ Forbidden: intent token mismatch", {
        requestId,
        intentId,
        storedTokenPreview: safeTokenPreview(storedToken),
        incomingTokenPreview: safeTokenPreview(intentToken),
      });
      return NextResponse.json({ error: "Forbidden", requestId }, { status: 403 });
    }

    // 3) security: site match
    const storedSiteRaw = (pi.metadata?.site ?? "").toString();
    const storedSite = normalizeSite(storedSiteRaw);

    if (
      storedSite &&
      storedSite !== "unknown" &&
      incomingSite !== "unknown" &&
      storedSite !== incomingSite
    ) {
      console.warn("⛔ Forbidden: site mismatch", {
        requestId,
        intentId,
        storedSiteRaw,
        storedSite,
        incomingSite,
      });
      return NextResponse.json({ error: "Forbidden", requestId }, { status: 403 });
    }

    // 4) productType guard
    const existingType = (pi.metadata?.product_type ?? "").toString();
    if (existingType && existingType !== productType) {
      return NextResponse.json(
        { error: `productType mismatch (expected ${existingType}, got ${productType})`, requestId },
        { status: 400 },
      );
    }

    const siteFinal = storedSite !== "unknown" ? storedSite : incomingSite;

    // ✅ If already succeeded: do NOT update intent (Stripe may reject),
    // but still do Zoho checkout-started best-effort for audit trail.
    if (pi.status === "succeeded") {
      let zoho: { contactId: string; isNew: boolean } | null = null;
      try {
        zoho = await upsertContactCheckoutStarted({
          email,
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,

          productType: existingType || productType,
          checkoutVariant: body.checkoutVariant,
          pagePath: body.pagePath,
          site: siteFinal,

          utmSource: body.utmSource,
          utmMedium: body.utmMedium,
          utmCampaign: body.utmCampaign,
          utmContent: body.utmContent,
          utmTerm: body.utmTerm,

          stripePaymentIntentId: pi.id,
        });
      } catch (e: any) {
        console.error("⚠️ Zoho checkout-started upsert failed (pi already succeeded)", {
          requestId,
          ...errToLogObject(e),
        });
      }

      return NextResponse.json(
        {
          ok: true,
          requestId,
          intentId: pi.id,
          site: siteFinal,
          alreadySucceeded: true,
          metadata: pi.metadata,
          zoho,
        },
        { status: 200 },
      );
    }

    // 5) build metadata
    let metadata: Record<string, string>;
    try {
      metadata = buildMetadata({ ...body, email, productType: existingType || productType }, pi, siteFinal);
    } catch (e: any) {
      return NextResponse.json({ error: e?.message || "Invalid payload", requestId }, { status: 400 });
    }

    // 6) update PI
    const updatedIntent = await stripe.paymentIntents.update(intentId, {
      receipt_email: email,
      metadata,
    });

    // 7) Zoho upsert (non-blocking)
    let zoho: { contactId: string; isNew: boolean } | null = null;
    try {
      zoho = await upsertContactCheckoutStarted({
        email,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,

        productType: existingType || productType,
        checkoutVariant: body.checkoutVariant,
        pagePath: body.pagePath,
        site: siteFinal,

        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
        utmContent: body.utmContent,
        utmTerm: body.utmTerm,

        stripePaymentIntentId: updatedIntent.id,
      });
    } catch (e: any) {
      console.error("⚠️ Zoho checkout-started upsert failed", { requestId, ...errToLogObject(e) });
    }

    return NextResponse.json({
      ok: true,
      requestId,
      intentId: updatedIntent.id,
      site: siteFinal,
      metadata: updatedIntent.metadata,
      zoho,
    });
  } catch (err: unknown) {
    console.error("❌ Error updating payment intent:", { requestId, err });

    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: err.message || "Stripe error", requestId }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to update payment intent", requestId }, { status: 500 });
  }
}
