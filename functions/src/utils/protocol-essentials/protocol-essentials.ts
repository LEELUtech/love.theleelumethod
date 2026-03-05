import Stripe from "stripe";
import { addCMToSpace, addMemberToSpace, createSpace } from "../../lib/circle";

export async function handleProtocolEssentials(pi: Stripe.PaymentIntent): Promise<void> {
  const email = pi.metadata?.email || pi.receipt_email || "";
  const name = pi.metadata?.name || email.split("@")[0];

  const chat_id = await createSpace(name + email, "chat", "1010467");

  if (chat_id) {
    await addMemberToSpace(email, chat_id);

    await addCMToSpace(chat_id);
  }
}
