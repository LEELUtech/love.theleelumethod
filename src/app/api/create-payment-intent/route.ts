// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
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

type Body = { productType: string };

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

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    const productType = (body.productType || "").trim();
    if (!productType) {
      return NextResponse.json({ error: "Missing required field: productType" }, { status: 400 });
    }
    if (!ALLOWED_PRODUCT_TYPES.has(productType)) {
      return NextResponse.json({ error: "Unknown productType" }, { status: 400 });
    }

    const ref = doc(collection(db, "offerings"), productType);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = snap.data() as {
      price?: number;
      currency?: string;
      space_id?: string;
    };

    const amount = typeof product.price === "number" ? product.price : 0;
    const currency = (product.currency ?? "USD").toLowerCase();
    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid product price" }, { status: 500 });
    }

    const SITE = getIncomingSite(req);
    const intentToken = randomUUID();

    const metadata: Stripe.MetadataParam = {
      product_type: productType,
      site: SITE, // ✅ всегда host, без протокола
      created_at: new Date().toISOString(),
      intent_token: intentToken,
    };

    if (product.space_id) metadata.space_id = product.space_id;

    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
      metadata,
    });

    if (!intent.client_secret) {
      return NextResponse.json({ error: "Stripe did not return client_secret" }, { status: 500 });
    }

    return NextResponse.json({
      clientSecret: intent.client_secret,
      intentId: intent.id,
      intentToken,
      site: SITE, // удобно дебажить
    });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
