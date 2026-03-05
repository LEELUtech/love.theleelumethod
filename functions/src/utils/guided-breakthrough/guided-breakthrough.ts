import Stripe from "stripe";
import { processCircleAccess } from "../../lib/circle";

export async function handleGuidedBreakthrough(pi: Stripe.PaymentIntent): Promise<void> {
  const email = pi.metadata?.email || pi.receipt_email || "";
  const name = pi.metadata?.name || email.split("@")[0];
  const spaceId = pi.metadata?.space_id;

  console.log("[Guided Breakthrough] Processing payment", {
    email,
    name,
    space_id: spaceId,
    payment_intent_id: pi.id,
  });

  if (!spaceId) {
    throw new Error("Missing space_id in metadata");
  }

  console.log(spaceId);

  // Find or create Circle member and grant space access
  const result = await processCircleAccess(email, name, spaceId);

  console.log("[Guided Breakthrough] Access granted", {
    email,
    member_id: result.memberId,
    is_new_member: result.isNewMember,
  });
}
