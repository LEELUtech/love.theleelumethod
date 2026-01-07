import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { getCircleCourseUrl } from "@/lib/circle-api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id parameter" },
        { status: 400 }
      );
    }

    // Fetch payment record from Firestore
    const paymentDoc = await db.collection("payments").doc(sessionId).get();

    if (!paymentDoc.exists) {
      // Payment record not found - might still be processing
      return NextResponse.json({
        payment_status: "processing",
        circle_access_granted: false,
        message: "Payment is being processed. Please wait a moment.",
      });
    }

    const paymentData = paymentDoc.data();

    if (!paymentData) {
      return NextResponse.json(
        { error: "Invalid payment data" },
        { status: 500 }
      );
    }

    // Get Circle course URL
    const courseUrl = paymentData.circle_space_id 
      ? getCircleCourseUrl(paymentData.circle_space_id)
      : process.env.NEXT_PUBLIC_CIRCLE_COMMUNITY_URL || "";

    return NextResponse.json({
      payment_status: paymentData.payment_status || "unknown",
      circle_access_granted: paymentData.circle_access_granted || false,
      circle_member_id: paymentData.circle_member_id || "",
      email: paymentData.email || "",
      product_id: paymentData.product_id || "",
      course_url: courseUrl,
      created_at: paymentData.created_at?.toDate?.()?.toISOString() || "",
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch payment status",
        payment_status: "error",
        circle_access_granted: false,
      },
      { status: 500 }
    );
  }
}
