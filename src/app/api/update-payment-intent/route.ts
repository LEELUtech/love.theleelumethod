// app/api/update-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";
import { upsertContactCheckoutStartedSandbox } from "@/lib/zoho-functions.sandbox";

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

function normalizeSite(raw?: string | null): string {
  const s = (raw || "").trim();
  if (!s) return "unknown";
  try {
    if (s.startsWith("http://") || s.startsWith("https://")) {
      return new URL(s).host.toLowerCase();
    }
  } catch {}
  return s.replace(/\/+$/, "").toLowerCase();
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

export async function POST(req: NextRequest) {
  const requestId = `upi_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const body = (await req.json()) as Body;

    const incomingSite = getIncomingSite(req);

    const intentId = body.intentId?.trim();
    const intentToken = body.intentToken?.trim();
    const productType = body.productType?.trim();
    const email = body.email?.trim();

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

    const pi = await stripe.paymentIntents.retrieve(intentId);

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

    // ✅ нормализуем storedSite чтобы пережить старые intents где было "http://..."
    const storedSiteRaw = (pi.metadata?.site ?? "").toString();
    const storedSite = normalizeSite(storedSiteRaw);

    if (storedSite && storedSite !== "unknown" && incomingSite !== "unknown" && storedSite !== incomingSite) {
      console.warn("⛔ Forbidden: site mismatch", {
        requestId,
        intentId,
        storedSiteRaw,
        storedSite,
        incomingSite,
      });
      return NextResponse.json({ error: "Forbidden", requestId }, { status: 403 });
    }

    const existingType = (pi.metadata?.product_type ?? "").toString();
    if (existingType && existingType !== productType) {
      return NextResponse.json(
        { error: `productType mismatch (expected ${existingType}, got ${productType})`, requestId },
        { status: 400 },
      );
    }

    const metadata: Record<string, string> = {
      product_type: existingType || productType,
      email,
      site: storedSite !== "unknown" ? storedSite : incomingSite, // ✅
      updated_at: new Date().toISOString(),
    };

    if (pi.metadata?.space_id) metadata.space_id = pi.metadata.space_id.toString();
    if (pi.metadata?.created_at) metadata.created_at = pi.metadata.created_at.toString();
    if (pi.metadata?.intent_token) metadata.intent_token = pi.metadata.intent_token.toString();

    const firstName = body.firstName?.trim() || "";
    const lastName = body.lastName?.trim() || "";
    if (firstName || lastName) metadata.name = `${firstName} ${lastName}`.trim();

    if (body.phone?.trim()) metadata.phone = body.phone.trim();

    if (body.address1?.trim()) metadata.address_line1 = body.address1.trim();
    if (body.address2?.trim()) metadata.address_line2 = body.address2.trim();
    if (body.city?.trim()) metadata.city = body.city.trim();
    if (body.state?.trim()) metadata.state = body.state.trim();
    if (body.postalCode?.trim()) metadata.postal_code = body.postalCode.trim();
    if (body.country?.trim()) metadata.country = body.country.trim().toUpperCase();

    if (productType === "compatibility_report") {
      const bd1 = body.birthDate1?.trim();
      const bd2 = body.birthDate2?.trim();
      if (!bd1 || !bd2) {
        return NextResponse.json(
          { error: "Missing birth dates for compatibility report", requestId },
          { status: 400 },
        );
      }
      metadata.birth_date_1 = bd1;
      metadata.birth_date_2 = bd2;
    }

    if (body.utmSource?.trim()) metadata.utm_source = body.utmSource.trim();
    if (body.utmMedium?.trim()) metadata.utm_medium = body.utmMedium.trim();
    if (body.utmCampaign?.trim()) metadata.utm_campaign = body.utmCampaign.trim();
    if (body.utmContent?.trim()) metadata.utm_content = body.utmContent.trim();
    if (body.utmTerm?.trim()) metadata.utm_term = body.utmTerm.trim();

    if (body.checkoutVariant?.trim()) metadata.checkout_variant = body.checkoutVariant.trim();
    if (body.pagePath?.trim()) metadata.page_path = body.pagePath.trim();

    const updatedIntent = await stripe.paymentIntents.update(intentId, {
      receipt_email: email,
      metadata,
    });

    // Zoho upsert (не ломаем чекаут если Zoho упал)
    let zoho: { contactId: string; isNew: boolean } | null = null;
    try {
      zoho = await upsertContactCheckoutStartedSandbox({
        email,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,

        productType: existingType || productType,
        checkoutVariant: body.checkoutVariant,
        pagePath: body.pagePath,
        site: metadata.site,

        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
        utmContent: body.utmContent,
        utmTerm: body.utmTerm,

        stripePaymentIntentId: updatedIntent.id,
      });
    } catch (e: any) {
      console.error("⚠️ Zoho upsert failed", { requestId, ...errToLogObject(e) });
    }

    return NextResponse.json({
      ok: true,
      requestId,
      intentId: updatedIntent.id,
      site: metadata.site,
      metadata: updatedIntent.metadata,
      zoho,
    });
  } catch (err: unknown) {
    console.error("❌ Error updating payment intent:", { requestId, err });

    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: err.message || "Stripe error", requestId }, { status: 400 });
    }

    if (err instanceof Error) {
      return NextResponse.json(
        { error: "Failed to update payment intent", details: err.message, requestId },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: "Failed to update payment intent", requestId }, { status: 500 });
  }
}
