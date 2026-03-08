import Stripe from "stripe";
import { addTagToMember, processCircleAccess } from "../../lib/circle";
import { createChatAndAddMembers, getOffering, getUserData } from "../helpers/circle";

export async function handleVipImmersion(pi: Stripe.PaymentIntent): Promise<void> {
  const { email, name, productType } = getUserData(pi);

  const data = await getOffering(productType);

  if (data?.space_id) await processCircleAccess(email, name, data.space_id);

  if (data?.tag) await addTagToMember(email, data.tag);

  await createChatAndAddMembers(name, email);
}
