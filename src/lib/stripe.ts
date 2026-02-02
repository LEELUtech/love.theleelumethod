import Stripe from "stripe";

let stripeClient: Stripe | null = null;

// Returns singleton Stripe client instance
export function getStripe(): Stripe {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  stripeClient = new Stripe(secretKey, {
    apiVersion: "2025-04-30.basil",
  });

  return stripeClient;
}
