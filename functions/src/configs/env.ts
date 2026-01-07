import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const configs = {
  email: process.env.SENDING_EMAIL || process.env.EMAIL,
  password: process.env.SENDING_PASSWORD || process.env.PASSWORD,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || process.env.DOMAIN_URL || "http://localhost:3000",
  test: process.env.TEST,
  // Circle API configuration
  circleApiKey: process.env.CIRCLE_API_KEY || "",
  circleCommunityId: process.env.CIRCLE_COMMUNITY_ID || "",
  circleCommunityUrl: process.env.CIRCLE_COMMUNITY_URL || "",
};