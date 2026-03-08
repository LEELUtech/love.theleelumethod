import Stripe from "stripe";
import { addTagToMember } from "../../lib/circle";
import { createChatAndAddMembers, getOffering, getUserData } from "../helpers/circle";

export async function handleProtocolEssentials(pi: Stripe.PaymentIntent): Promise<void> {
  const { email, name, productType } = getUserData(pi);

  const data = await getOffering(productType);
  if (data?.tag) await addTagToMember(email, data.tag);

  await createChatAndAddMembers(name, email);
}
