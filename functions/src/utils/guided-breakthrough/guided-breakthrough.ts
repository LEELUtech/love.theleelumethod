import Stripe from "stripe";
import { addTagToMember, processCircleAccess } from "../../lib/circle";
import { createChatAndAddMembers, getOffering, getUserData } from "../helpers/circle";

export async function handleGuidedBreakthrough(pi: Stripe.PaymentIntent): Promise<void> {
  const { email, name, productType } = getUserData(pi);

  const data = await getOffering(productType);

  await processCircleAccess({ email, name, courseId: "457048" });

  if (data?.tag) await addTagToMember(email, data.tag);

  await createChatAndAddMembers(name, email);
}
