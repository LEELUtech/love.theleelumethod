import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/params";
import { db } from "../configs/firebase";
import { deactivateCircleMember } from "../lib/circle";
import { getStripeClient } from "../utils/stripeCircleWebhook.helpers";

const CIRCLE_API_KEY = defineSecret("CIRCLE_API_KEY");
const STRIPE_SECRET_KEY_LILYCHYSTOFAT = defineSecret("STRIPE_SECRET_KEY_LILYCHYSTOFAT");

const MAX_ATTEMPTS = 2;

export const processInstallments = onSchedule(
  {
    schedule: "0 9 * * *", // every day at 9:00 AM
    timeZone: "America/New_York",
    region: "us-central1",
    secrets: [CIRCLE_API_KEY, STRIPE_SECRET_KEY_LILYCHYSTOFAT],
  },
  async () => {
    const stripe = getStripeClient();
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const snapshot = await db
      .collection("installment_plans")
      .where("status", "==", "pending")
      .where("due_date", "<=", today.toISOString())
      .get();

    if (snapshot.empty) {
      console.log("processInstallments: no plans due today");
      return;
    }

    console.log(`processInstallments: processing ${snapshot.size} plans`);

    for (const doc of snapshot.docs) {
      const plan = doc.data();
      const { email, stripe_customer_id, amount, attempt_count, product_type, payment_method_id } = plan;

      console.log("processInstallments: processing plan", {
        id: doc.id,
        email,
        attempt_count,
        amount,
      });

      try {
        const pi = await stripe.paymentIntents.create(
          {
            amount,
            currency: "usd",
            customer: stripe_customer_id,
            ...(payment_method_id ? { payment_method: payment_method_id } : {}),
            payment_method_types: ["card"],
            confirm: true,
            off_session: true,
            metadata: {
              installment: "2",
              product_type: product_type ?? "",
              source: "installment_cron",
              email: email ?? "",
            },
          },
          { idempotencyKey: `installment_${doc.id}_${attempt_count ?? 0}` },
        );

        if (pi.status === "succeeded") {
          console.log("processInstallments: payment succeeded", { id: doc.id, email });
          await doc.ref.delete();
        } else {
          throw new Error(`PaymentIntent status: ${pi.status}`);
        }
      } catch (err) {
        const newAttemptCount = (attempt_count ?? 0) + 1;
        console.error("processInstallments: payment failed", {
          id: doc.id,
          email,
          attempt_count: newAttemptCount,
          error: err instanceof Error ? err.message : String(err),
        });

        if (newAttemptCount >= MAX_ATTEMPTS) {
          try {
            console.log("processInstallments: deactivating Circle member", { email });
            await deactivateCircleMember(email);
          } catch (circleErr) {
            console.error("processInstallments: failed to deactivate Circle member", {
              id: doc.id,
              error: circleErr instanceof Error ? circleErr.message : String(circleErr),
            });
          }
          try {
            await doc.ref.update({ status: "overdue", attempt_count: newAttemptCount });
          } catch (updateErr) {
            console.error("processInstallments: failed to update plan doc to overdue", {
              id: doc.id,
              error: updateErr instanceof Error ? updateErr.message : String(updateErr),
            });
          }
        } else {
          try {
            await doc.ref.update({ attempt_count: newAttemptCount });
          } catch (updateErr) {
            console.error("processInstallments: failed to update attempt_count", {
              id: doc.id,
              error: updateErr instanceof Error ? updateErr.message : String(updateErr),
            });
          }
        }
      }
    }
  },
);
