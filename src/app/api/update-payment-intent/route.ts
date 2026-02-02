// app/api/update-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

const stripe = getStripe();
const SITE = process.env.DOMAIN_URL || "unknown";

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
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    const intentId = body.intentId?.trim();
    const intentToken = body.intentToken?.trim();
    const productType = body.productType?.trim();
    const email = body.email?.trim();

    if (!intentId) return NextResponse.json({ error: "Missing intentId" }, { status: 400 });
    if (!intentToken) return NextResponse.json({ error: "Missing intentToken" }, { status: 400 });
    if (!productType) return NextResponse.json({ error: "Missing productType" }, { status: 400 });
    
    if (!email || email === "") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // ✅ 1) Retrieve PI and verify token
    const pi = await stripe.paymentIntents.retrieve(intentId);

    const storedToken = (pi.metadata?.intent_token ?? "").toString();
    if (!storedToken || storedToken !== intentToken) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const storedSite = (pi.metadata?.site ?? "").toString();
    if (storedSite && storedSite !== SITE) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ 2) productType mismatch protection
    const existingType = (pi.metadata?.product_type ?? "").toString();
    if (existingType && existingType !== productType) {
      return NextResponse.json(
        { error: `productType mismatch (expected ${existingType}, got ${productType})` },
        { status: 400 },
      );
    }

    console.log("📥 Original PaymentIntent metadata:", pi.metadata);

    // ✅ 3) Merge metadata
    const metadata: Record<string, string> = {
      product_type: existingType || productType,
      email,
      site: storedSite || SITE,
      updated_at: new Date().toISOString(),
    };

    // Preserve space_id from create
    if (pi.metadata?.space_id) {
      metadata.space_id = pi.metadata.space_id.toString();
    }
    // Preserve other original metadata fields
    if (pi.metadata?.created_at) {
      metadata.created_at = pi.metadata.created_at.toString();
    }
    if (pi.metadata?.intent_token) {
      metadata.intent_token = pi.metadata.intent_token.toString();
    }

    // Build full name from first + last for Circle
    const firstName = body.firstName?.trim() || "";
    const lastName = body.lastName?.trim() || "";
    if (firstName || lastName) {
      metadata.name = `${firstName} ${lastName}`.trim();
    }

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
          { error: "Missing birth dates for compatibility report" },
          { status: 400 },
        );
      }
      metadata.birth_date_1 = bd1;
      metadata.birth_date_2 = bd2;
    }

    console.log("📤 Updating PaymentIntent with metadata:", metadata);

    const updatedIntent = await stripe.paymentIntents.update(intentId, {
      receipt_email: email,
      metadata,
    });

    return NextResponse.json({
      ok: true,
      intentId: updatedIntent.id,
      metadata: updatedIntent.metadata,
    });
  } catch (err: unknown) {
    console.error("Error updating payment intent:", err);

    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: err.message || "Stripe error" }, { status: 400 });
    }

    if (err instanceof Error) {
      return NextResponse.json(
        { error: "Failed to update payment intent", details: err.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: "Failed to update payment intent" }, { status: 500 });
  }
}
