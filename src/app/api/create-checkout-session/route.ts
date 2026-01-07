
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  const { 
    email, 
    name,
    firstName,
    lastName,
    phone,
    productId = "course_decodedlove",
    circleSpaceId,
    circleCourseId,
    zohoContactId,
    addPaidReport = false,
    amount = 9700, // Default $97.00 in cents
    productName = "Decoded Love Course"
  } = await req.json();
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

  try {
    // Build line items
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: productName,
            description: "Access to Decoded Love Course with lifetime updates",
          },
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: email ?? "",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      // Critical: metadata for webhook processing
      metadata: {
        product_id: productId,
        circle_space_id: circleSpaceId || process.env.CIRCLE_DEFAULT_SPACE_ID || "",
        circle_course_id: circleCourseId || "",
        zoho_contact_id: zohoContactId || "",
        source: "website",
        customer_name: name || `${firstName} ${lastName}`,
        customer_first_name: firstName || "",
        customer_last_name: lastName || "",
        customer_phone: phone || "",
        add_paid_report: addPaidReport.toString(),
      },
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancel`,
    });
    return NextResponse.json({ sessionId: session.id, sessionUrl: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Something went wrong" },
      { status: 500 },
    );
  }
}
