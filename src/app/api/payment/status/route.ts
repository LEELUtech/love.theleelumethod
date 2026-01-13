import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getStripe } from "@/lib/stripe";

const stripe = getStripe();

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  try {
    // Verify payment status directly with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentStatus = session.payment_status;

    // Fetch our internal payment record for Circle state
    const paymentDoc = await getDoc(doc(db, "payments", sessionId));
    const paymentData = paymentDoc.exists() ? paymentDoc.data() : null;

    const circleAccessGranted = Boolean(paymentData?.circle_access_granted);
    const circleMemberId = paymentData?.circle_member_id || "";
    const email = paymentData?.email || session.customer_email || session.customer_details?.email || "";
    const productId = paymentData?.product_id || session.metadata?.product_id || "";

    // Build course URL from community URL (not using slug-based helper)
    const communityUrl = process.env.NEXT_PUBLIC_CIRCLE_COMMUNITY_URL || "";
    const courseUrl = communityUrl || "https://app.circle.so";

    const responseData = {
      payment_status: paymentStatus,
      circle_access_granted: circleAccessGranted,
      circle_member_id: circleMemberId,
      email,
      product_id: productId,
      course_url: courseUrl,
    };

    console.log("[Payment Status]", responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json({ error: "Failed to fetch payment status" }, { status: 500 });
  }
}
