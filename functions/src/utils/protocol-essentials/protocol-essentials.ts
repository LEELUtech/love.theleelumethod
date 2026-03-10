import Stripe from "stripe";
import { addTagToMember, processCircleAccess } from "../../lib/circle";
import { getOffering, getUserData } from "../helpers/circle";
import { CIRCLE_COURSE_ID } from "../../static/circle";

export async function handleProtocolEssentials(pi: Stripe.PaymentIntent): Promise<void> {
  const { email, name, productType } = getUserData(pi);

  const data = await getOffering(productType);

  await processCircleAccess({ email, name, courseId: CIRCLE_COURSE_ID });

  if (data?.tag) await addTagToMember(email, data.tag);
}
