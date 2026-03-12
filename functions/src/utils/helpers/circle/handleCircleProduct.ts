import Stripe from "stripe";
import { getOffering, getUserData } from ".";
import { CIRCLE_COURSE_ID } from "../../../static/circle";
import { addTagToMember, processCircleAccess } from "../../../lib/circle";

export const handleCircleProduct = async (pi: Stripe.PaymentIntent) => {
  const { email, name, productType } = getUserData(pi);

  const data = await getOffering(productType);

  await processCircleAccess({
    email,
    name,
    courseId: CIRCLE_COURSE_ID,
    spaceId: data?.space_id,
  });

  if (data?.tag) await addTagToMember(email, data.tag);
};
