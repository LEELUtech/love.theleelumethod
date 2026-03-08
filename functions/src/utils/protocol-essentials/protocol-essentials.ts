import Stripe from "stripe";
import { addCMToSpace, addMemberToSpace, addTagToMember, createSpace } from "../../lib/circle";
import { ProductType } from "../stripeCircleWebhook.helpers";
import { db } from "../../configs/firebase";

export async function handleProtocolEssentials(pi: Stripe.PaymentIntent): Promise<void> {
  const email = pi.metadata?.email || pi.receipt_email || "";
  const name = pi.metadata?.name || email.split("@")[0];
  const productType = pi.metadata?.product_type as ProductType;

  const chat_id = await createSpace(name + email, "chat", "1010467");

  const doc = await db.collection("offerings").doc(productType).get();

  const data = doc?.data();

  if (data?.tag) {
    await addTagToMember(email, data.tag);
  }

  if (chat_id) {
    await addMemberToSpace(email, chat_id);

    await addCMToSpace(chat_id);
  }
}
