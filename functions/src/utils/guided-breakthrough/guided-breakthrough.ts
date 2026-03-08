import Stripe from "stripe";
import {
  addCMToSpace,
  addMemberToSpace,
  addTagToMember,
  createSpace,
  processCircleAccess,
} from "../../lib/circle";
import { db } from "../../configs/firebase";
import { ProductType } from "../stripeCircleWebhook.helpers";

export async function handleGuidedBreakthrough(pi: Stripe.PaymentIntent): Promise<void> {
  const email = pi.metadata?.email || pi.receipt_email || "";
  const name = pi.metadata?.name || email.split("@")[0];
  const productType = pi.metadata?.product_type as ProductType;

  const doc = await db.collection("offerings").doc(productType).get();

  const data = doc?.data();

  if (data?.space_id) {
    await processCircleAccess(email, name, data.space_id);
  }

  if (data?.tag) {
    await addTagToMember(email, data.tag);
  }

  const chat_id = await createSpace(name, "chat", "1010467");

  if (chat_id) {
    await addMemberToSpace(email, chat_id);

    await addCMToSpace(chat_id);
  }
}
