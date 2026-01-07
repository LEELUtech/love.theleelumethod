import { onRequest } from "firebase-functions/v2/https";
import { db } from "../configs/firebase";
import { configs } from "../configs/env";
import Stripe from "stripe";
import { processCircleAccess } from "../lib/circle";

let stripe: Stripe | null = null;
const getStripeClient = () => {
  if (!stripe) {
    stripe = new Stripe(configs.stripeSecretKey || "", {
      apiVersion: "2025-04-30.basil",
    });
  }
  return stripe;
};

export const stripeCircleWebhook = onRequest({
  cors: true,
  region: "us-central1",
}, async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  const rawBody = req.rawBody;

  console.log("🎯 Received Stripe-Circle webhook");
  console.log("Signature:", sig);

  try {
    if (!rawBody || !sig || !configs.stripeWebhookSecret) {
      console.error("Missing required webhook data:", {
        hasRawBody: !!req.rawBody,
        hasSignature: !!sig,
        hasSecret: !!configs.stripeWebhookSecret
      });
      res.status(400).send("Missing required webhook data");
      return;
    }

    event = getStripeClient().webhooks.constructEvent(
      rawBody, 
      sig!, 
      configs.stripeWebhookSecret!
    );
    console.log("✅ Webhook signature verified:", event.id);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

  // Handle checkout.session.completed for Circle
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Idempotency check - prevent duplicate processing
    const paymentDoc = await db.collection("payments").doc(session.id).get();
    if (paymentDoc.exists) {
      console.log("✓ Event already processed:", session.id);
      res.status(200).send("Already processed");
      return;
    }

    // Extract data from session
    const email = session.customer_email || session.customer_details?.email;
    const name = session.metadata?.customer_name || 
                 session.customer_details?.name || 
                 "Customer";
    
    const productId = session.metadata?.product_id;
    const circleSpaceId = session.metadata?.circle_space_id;
    const circleCourseId = session.metadata?.circle_course_id;
    const zohoContactId = session.metadata?.zoho_contact_id;

    console.log("📧 Processing payment for:", { email, name, productId, circleSpaceId });

    if (!email) {
      console.error("❌ No email found in session");
      res.status(400).send("Missing email");
      return;
    }

    // Check payment status
    if (session.payment_status !== "paid") {
      console.log("⚠️ Payment not completed:", session.payment_status);
      res.status(200).send("Payment not completed");
      return;
    }

    try {
      let circleMemberId = "";
      let circleAccessGranted = false;

      // Process Circle access if space_id is provided
      if (circleSpaceId) {
        try {
          const result = await processCircleAccess(email, name, circleSpaceId);
          circleMemberId = result.memberId;
          circleAccessGranted = true;
          console.log(`✅ Circle access granted: ${circleMemberId}`);
        } catch (circleError) {
          console.error("❌ Circle processing failed:", circleError);
          // Continue - we still save the payment record
          circleAccessGranted = false;
        }
      }

      // Save payment record to Firestore
      await db.collection("payments").doc(session.id).set({
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        email,
        name,
        product_id: productId || "",
        circle_space_id: circleSpaceId || "",
        circle_course_id: circleCourseId || "",
        circle_member_id: circleMemberId,
        circle_access_granted: circleAccessGranted,
        zoho_contact_id: zohoContactId || "",
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        created_at: new Date(),
        processed_at: new Date(),
      });

      console.log("✅ Payment record saved:", session.id);

      // Optional: Update Zoho CRM
      if (email) {
        try {
          console.log("📝 Updating Zoho CRM...");
          
          // Prepare Zoho data
          const zohoData = {
            Email: email,
            First_Name: name.split(" ")[0] || name,
            Last_Name: name.split(" ").slice(1).join(" ") || "",
            Phone: session.customer_details?.phone || "",
            Product_Purchased: productId || "course_decodedlove",
            Stripe_Session_ID: session.id,
            Stripe_Payment_Intent_ID: session.payment_intent as string || "",
            Purchase_Amount: session.amount_total ? session.amount_total / 100 : 0,
            Currency: session.currency?.toUpperCase() || "USD",
            Circle_Member_ID: circleMemberId || "",
            Circle_Access_Granted: circleAccessGranted,
            Purchase_Date: new Date().toISOString(),
          };

          // Save to Firestore for Zoho sync (or call Zoho API directly)
          await db.collection("zoho_sync_queue").add({
            type: "contact_update",
            data: zohoData,
            session_id: session.id,
            created_at: new Date(),
            processed: false,
          });

          console.log("✅ Zoho sync queued");
        } catch (zohoError) {
          console.error("❌ Zoho sync failed (non-critical):", zohoError);
          // Continue - Zoho is not critical for payment flow
        }
      }

      res.status(200).send("Success");
    } catch (error) {
      console.error("❌ Processing failed:", error);
      res.status(500).send("Failed to process payment");
    }
  } else {
    console.log("ℹ️ Event type not handled:", event.type);
    res.status(200).send("Event ignored");
  }
});
