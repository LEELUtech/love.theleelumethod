import Stripe from "stripe";
import { addMemberToSpace, createSpace, processCircleAccess } from "../../lib/circle";
import { ProductType } from "../stripeCircleWebhook.helpers";
import { db } from "../../configs/firebase";

export async function handleProtocolEssentials(pi: Stripe.PaymentIntent): Promise<void> {
  const email = pi.metadata?.email || pi.receipt_email || "";
  const name = pi.metadata?.name || email.split("@")[0];
  const productType = pi.metadata?.product_type as ProductType;

  const doc = await db.collection("offerings").doc(productType).get();

  const data = doc?.data();

  console.log("Processing Protocol Essentials for:", { email, name, productType });

  console.log("Fetched offering data:", data);

  if (data?.space_id) {
    const result = await processCircleAccess(email, name, data.space_id);

    console.log(result);
  }

  const chat_id = await createSpace(name + email, "chat", "1010467");

  if (chat_id) {
    await addMemberToSpace(email, chat_id);
  }
}
