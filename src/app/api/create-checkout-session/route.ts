import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

interface ProductItem {
  id: string;
  price: number;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  const { amount, email, productIdsWithPrices, userId, referralData } =
    await req.json();
  const productIds = productIdsWithPrices.map((item: ProductItem) => item.id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

  if (!amount || typeof amount !== "number") {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const originalTotal = productIdsWithPrices.reduce(
    (sum: number, product: ProductItem) => sum + product.price,
    0,
  );
  const discountedTotal = amount / 100;
  const hasDiscount = Math.abs(originalTotal - discountedTotal) > 0.01;

  try {
    let lineItems;

    if (hasDiscount) {
      const discountAmount = originalTotal - discountedTotal;
      lineItems = [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(discountedTotal * 100),
            product_data: {
              name: `Personalized Report (${Math.round(
                (discountAmount / originalTotal) * 100,
              )}% discount applied)`,
              description: `Products: ${productIds
                .map((id: string) => id.toUpperCase())
                .join(", ")}`,
            },
          },
          quantity: 1,
        },
      ];
    } else {
      lineItems = productIdsWithPrices.map((product: ProductItem) => ({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: `Product ${product.id.toUpperCase()}`,
          },
        },
        quantity: 1,
      }));
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: email ?? "",
      success_url: `${baseUrl}${userId ? `/${userId}/thank` : "/thank"}`,
      cancel_url: `${baseUrl}${userId ? `/${userId}` : ""}`,
      metadata: {
        email,
        productIds: productIds.join(","),
        originalAmount: originalTotal.toString(),
        discountedAmount: discountedTotal.toString(),
        hasDiscount: hasDiscount.toString(),
        ...(referralData && {
          promoCode: referralData.promoCode,
          agentId: referralData.agentId,
          agentName: referralData.agentName,
          agentZohoId: referralData.agentZohoId,
        }),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
