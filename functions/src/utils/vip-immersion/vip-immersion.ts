import Stripe from "stripe";
import { processCircleAccess } from "../../lib/circle";

export async function handleVipImmersion(pi: Stripe.PaymentIntent): Promise<void> {
  const email = pi.metadata?.email || pi.receipt_email || "";
  const name = pi.metadata?.name || email.split("@")[0];
  const spaceId = pi.metadata?.space_id;

  console.log("[VIP Immersion] Processing payment", {
    email,
    name,
    space_id: spaceId,
    payment_intent_id: pi.id,
  });

  if (!spaceId) {
    throw new Error("Missing space_id in metadata");
  }

  // Find or create Circle member and grant space access
  const result = await processCircleAccess(email, name, spaceId);

  console.log("[VIP Immersion] Access granted", {
    email,
    member_id: result.memberId,
    is_new_member: result.isNewMember,
  });
}
