import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";
import { randomUUID } from "crypto";

const stripe = getStripe();

const ALLOWED_PRODUCT_TYPES = new Set([
  "compatibility_report",
  "guided_breakthrough",
  "protocol_essentials",
  "vip_immersion",
]);

type Body = {
  productType: string;

  site?: string;
  pagePath?: string;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

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

function getIncomingSite(req: Request): string {
  const raw =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    process.env.DOMAIN_URL ||
    "unknown";

  return normalizeSite(raw) || "unknown";
}

function toMetadataRecord(obj: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      const s = v.trim();
      if (s) out[k] = s;
    }
  }
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    const productType = clean(body.productType);
    if (!productType) {
      return NextResponse.json({ error: "Missing required field: productType" }, { status: 400 });
    }
    if (!ALLOWED_PRODUCT_TYPES.has(productType)) {
      return NextResponse.json({ error: "Unknown productType" }, { status: 400 });
    }

    const ref = doc(collection(db, "offerings"), productType);
    const snap = await getDoc(ref);
    if (!snap.exists()) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const product = snap.data() as { price?: number; currency?: string; space_id?: string };

    const amount = typeof product.price === "number" ? product.price : 0;
    const currency = (product.currency ?? "USD").toLowerCase();

    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid product price" }, { status: 500 });
    }

    const site = normalizeSite(body.site) || getIncomingSite(req);
    const pagePath = clean(body.pagePath);

    const utmSource = clean(body.utmSource);
    const utmMedium = clean(body.utmMedium);
    const utmCampaign = clean(body.utmCampaign);
    const utmContent = clean(body.utmContent);
    const utmTerm = clean(body.utmTerm);

    const intentToken = randomUUID();

    const metadata: Stripe.MetadataParam = toMetadataRecord({
      schema: "payments_v1",
      product_type: productType,
      site,
      ...(pagePath ? { page_path: pagePath } : {}),

      ...(utmSource ? { utm_source: utmSource } : {}),
      ...(utmMedium ? { utm_medium: utmMedium } : {}),
      ...(utmCampaign ? { utm_campaign: utmCampaign } : {}),
      ...(utmContent ? { utm_content: utmContent } : {}),
      ...(utmTerm ? { utm_term: utmTerm } : {}),

      created_at: new Date().toISOString(),
      intent_token: intentToken,

      ...(product.space_id ? { space_id: String(product.space_id) } : {}),
    });

    const intent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        payment_method_types: ["card"],
        metadata,
      },
      {
        idempotencyKey: intentToken,
      },
    );

    if (!intent.client_secret) {
      return NextResponse.json({ error: "Stripe did not return client_secret" }, { status: 500 });
    }

    // Firestore: checkout_viewed
    try {
      await setDoc(
        doc(collection(db, "payments"), intent.id),
        {
          stripe_payment_intent_id: intent.id,
          stripe_event_id: null,

          email: null,
          product_type: productType,

          amount,
          currency: intent.currency ?? currency,
          status: intent.status,

          customer_id: intent.customer ? String(intent.customer) : null,

          site,
          page_path: pagePath ?? null,
          checkout_variant: null,

          utm_source: utmSource ?? null,
          utm_medium: utmMedium ?? null,
          utm_campaign: utmCampaign ?? null,
          utm_content: utmContent ?? null,
          utm_term: utmTerm ?? null,

          metadata: metadata as Record<string, string>,

          processing_status: "processing",
          funnel_step: "checkout_viewed",

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

          intent_token: intentToken,
        },
        { merge: true },
      );
    } catch (e) {
      console.error("⚠️ Failed to write checkout_viewed to Firestore", { intentId: intent.id, e });
    }

    return NextResponse.json({
      clientSecret: intent.client_secret,
      intentId: intent.id,
      intentToken,
      site,
      pagePath: pagePath ?? null,
    });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
