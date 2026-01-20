import { onRequest } from "firebase-functions/v2/https";
import { db } from "../configs/firebase";
import { configs } from "../configs/env";
import Stripe from "stripe";
import { handleCompatibilityReport } from "../utils/compatibility-report/compatibility-report"

let stripe: Stripe | null = null;
const getStripeClient = () => {
  if (!stripe) {
    if (!configs.stripeSecretKeyTest) {
      throw new Error("Stripe secret key (test) is not configured");
    }
    stripe = new Stripe(configs.stripeSecretKeyTest, {
      apiVersion: "2025-04-30.basil",
    });
  }
  return stripe;
};

// // Handler for Circle Access (existing packages)
// async function handleCircleAccess(session: Stripe.Checkout.Session) {
//   const email = session.customer_email || session.customer_details?.email;
//   const name = session.metadata?.customer_name || session.customer_details?.name || "Customer";
//   const circleSpaceId = session.metadata?.circle_space_id || "";
//   const circleCourseId = session.metadata?.circle_course_id || "";

//   if (!email) {
//     throw new Error("Missing email for Circle access");
//   }

//   console.log("🎯 Processing Circle access for:", email);

//   let circleMemberId: string | number = "";
//   let circleAccessGranted = false;

//   const circleTarget = circleSpaceId || circleCourseId;
//   if (circleTarget) {
//     try {
//       const result = await processCircleAccess(email, name, circleSpaceId, circleCourseId);
//       circleMemberId = result.memberId.toString();
//       circleAccessGranted = true;
//       console.log(`✅ Circle access granted: ${circleMemberId}`);
//     } catch (circleError: unknown) {
//       console.error("❌ Circle processing failed:", circleError);
//       circleAccessGranted = false;

//       if (circleError instanceof Error) {
//         console.error("Circle error details:", circleError.message);
//       }
//     }
//   }

//   return {
//     circle_member_id: circleMemberId,
//     circle_access_granted: circleAccessGranted,
//     circle_space_id: circleSpaceId,
//     circle_course_id: circleCourseId,
//   };
// }

export const stripeCircleWebhook = onRequest(
  {
    cors: true,
    region: "us-central1",
  },
  async (req, res) => {
    console.log("🎯 Stripe Circle Webhook - Request received!");
    console.log("Method:", req.method);

    const sig = req.headers["stripe-signature"];
    const rawBody = req.rawBody;
    let event: Stripe.Event;

    try {
      if (!rawBody || !sig || !configs.stripeCircleWebhookSecret) {
        console.error("Missing required webhook data:", {
          hasRawBody: !!req.rawBody,
          hasSignature: !!sig,
          hasSecret: !!configs.stripeCircleWebhookSecret,
        });
        res.status(400).send("Missing required webhook data");
        return;
      }

      event = getStripeClient().webhooks.constructEvent(
        rawBody,
        sig as string,
        configs.stripeCircleWebhookSecret as string,
      );
      console.log("✅ Webhook signature verified:", event.id);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      res.status(400).send(`Webhook Error: ${err}`);
      return;
    }

    if (event.type !== "checkout.session.completed") {
      console.log("ℹ️ Event type not handled:", event.type);
      res.status(200).send("Event ignored");
      return;
    }

    console.log("ℹ️ Event type received:", event.type);

    // Handle checkout.session.completed

    const session = event.data.object as Stripe.Checkout.Session;

    // Idempotency check - prevent duplicate processing
    const paymentDoc = await db.collection("payments").doc(session.id).get();
    if (paymentDoc.exists) {
      console.log("✓ Event already processed:", session.id);
      res.status(200).send("Already processed");
      return;
    }

    // Extract common data from session
    const email = session.customer_email || session.customer_details?.email;
    const name = session.metadata?.customer_name || session.customer_details?.name || "Customer";
    const productType = session.metadata?.product_type || "circle_access"; 

    console.log("📧 Processing payment:", { email, name, productType });

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
      // let processingResult: Record<string, any> = {};

      // Route to appropriate handler based on product_type
      switch (productType) {
      case "compatibility_report":
        // processingResult = await handleCompatibilityReport(session);
        await handleCompatibilityReport(session);
        break;

      // case "protocol_essentials":
      // case "guided_breakthrough":
      // case "vip_immersion":
      default:
        break;
      }

      // Save payment record to Firestore (idempotent with session.id)
      // await db
      //   .collection("payments")
      //   .doc(session.id)
      //   .set({
      //     stripe_session_id: session.id,
      //     stripe_payment_intent_id: session.payment_intent,
      //     email,
      //     name,
      //     product_type: productType,
      //     payment_status: session.payment_status,
      //     amount_total: session.amount_total,
      //     currency: session.currency,
      //     created_at: new Date(),
      //     processed_at: new Date(),
      //     ...processingResult,
      //   });

      // console.log("✅ Payment record saved:", session.id);
      res.status(200).send("Success");
    } catch (error) {
      console.error("❌ Processing failed:", error);
      res.status(500).send("Failed to process payment");
    }
  },
);
