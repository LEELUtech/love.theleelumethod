import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const configs = {
  email: process.env.SENDING_EMAIL || process.env.EMAIL,
  password: process.env.SENDING_PASSWORD || process.env.PASSWORD,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  stripeCircleWebhookSecret: process.env.STRIPE_CIRCLE_WEBHOOK_SECRET || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY_TEST,
  stripeSecretKeyTest: process.env.STRIPE_SECRET_KEY_TEST,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || process.env.DOMAIN_URL || "http://localhost:3000",
  test: process.env.TEST,
  // Circle API configuration
  circleApiKey: process.env.CIRCLE_API_KEY || "",
  circleCommunityId: process.env.CIRCLE_COMMUNITY_ID || "",
  circleCommunityUrl: process.env.CIRCLE_COMMUNITY_URL || "",

  // ====== ZOHO (SANDBOX) ======
  zohoClientId: process.env.ZOHO_CLIENT_ID_SANDBOX || "",
  zohoClientSecret: process.env.ZOHO_CLIENT_SECRET_SANDBOX || "",
  zohoRefreshToken: process.env.ZOHO_REFRESH_TOKEN_SANDBOX || "",

  zohoAccountsDomain: process.env.ZOHO_ACCOUNTS_DOMAIN_SANDBOX || "accounts.zoho.com",

  zohoApiDomain: process.env.ZOHO_API_DOMAIN_SANDBOX || "sandbox.zohoapis.com",

  ZOHO_DEAL_LAYOUT_ID_SANDBOX: process.env.ZOHO_DEAL_LAYOUT_ID_SANDBOX || "6635378000008438675",
};
