// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";
import { randomUUID } from "crypto";

const stripe = getStripe();

const SITE = process.env.DOMAIN_URL || "unknown";

const ALLOWED_PRODUCT_TYPES = new Set([
  "compatibility_report",
  "guided_breakthrough",
  "protocol_essentials",
  "vip_immersion",
]);

type Body = {
  productType: string;
};

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
      name?: string;
      description?: string;
    };

    const amount = typeof product.price === "number" ? product.price : 0;
    const currency = (product.currency ?? "USD").toLowerCase();

    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid product price" }, { status: 500 });
    }

    const intentToken = randomUUID();

    const metadata: Stripe.MetadataParam = {
      product_type: productType,
      site: SITE,
      created_at: new Date().toISOString(),
      intent_token: intentToken, // ✅ token
    };

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
    });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
