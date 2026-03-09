import Stripe from "stripe";
import { upsertContactAndUpdateTags } from "./zoho-campaigns";

const TAG_LOGIC: Record<string, { add: string[]; remove: string[] }> = {
  protocol_essentials: {
    add: ["p_done", "tier_low"],
    remove: ["tier_mid", "tier_high", "ca_sp"],
  },
  guided_breakthrough: {
    add: ["p_done", "tier_mid"],
    remove: ["tier_low", "tier_high", "ca_sp"],
  },
  vip_immersion: {
    add: ["p_done", "tier_high"],
    remove: ["tier_low", "tier_mid", "ca_sp"],
  },
};

export async function applyPurchaseCampaignTags(pi: Stripe.PaymentIntent) {
  const email = String(pi.metadata?.email || pi.receipt_email || "")
    .trim()
    .toLowerCase();
  if (!email) throw new Error("applyPurchaseCampaignTags: missing email");

  const productType = pi.metadata?.product_type;
  const tags = productType ? TAG_LOGIC[productType] : null;
  if (!tags) return;

  await upsertContactAndUpdateTags(email, tags);
}
