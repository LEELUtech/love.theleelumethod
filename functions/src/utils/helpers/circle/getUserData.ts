import Stripe from "stripe";
import { ProductType } from "../../stripeCircleWebhook.helpers";

export const getUserData = (pi: Stripe.PaymentIntent) => {
  const email = pi.metadata?.email || pi.receipt_email || "";
  const name = pi.metadata?.name || email.split("@")[0];
  const productType = pi.metadata?.product_type as ProductType;

  return { email, name, productType };
};
