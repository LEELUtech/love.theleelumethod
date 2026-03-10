import Stripe from "stripe";
import { addTagToMember, processCircleAccess } from "../../lib/circle";
import { getOffering, getUserData } from "../helpers/circle";
import { sendWelcomeMessage } from "../helpers/circle/sendGreetMessage";

export async function handleProtocolEssentials(pi: Stripe.PaymentIntent): Promise<void> {
  const { email, name, productType } = getUserData(pi);

  const data = await getOffering(productType);

  const { memberId } = await processCircleAccess({ email, name, courseId: "457048" });

  if (data?.tag) await addTagToMember(email, data.tag);

  if (memberId) {
    await sendWelcomeMessage(memberId, name, productType);
  }
}
