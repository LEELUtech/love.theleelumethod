import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const configs = {
  email: process.env.SENDING_EMAIL || process.env.EMAIL,
  password: process.env.SENDING_PASSWORD || process.env.PASSWORD,
  stripeCircleWebhookSecret: process.env.STRIPE_CIRCLE_WEBHOOK_SECRET || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY_TEST,
  stripeSecretKeyTest: process.env.STRIPE_SECRET_KEY_TEST,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || process.env.DOMAIN_URL || "http://localhost:3000",
  // Circle API configuration
  circleApiKey: process.env.CIRCLE_API_KEY || "",
  circleCommunityId: process.env.CIRCLE_COMMUNITY_ID || "",
  circleCommunityUrl: process.env.CIRCLE_COMMUNITY_URL || "",

  // ====== ZOHO ======
  zohoClientId: process.env.ZOHO_CLIENT_ID_LILYCHYSTOFAT || "",
  zohoClientSecret: process.env.ZOHO_CLIENT_SECRET_LILYCHYSTOFAT || "",
  zohoRefreshCRMToken: process.env.ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT || "",
  zohoRefreshAnalyticsToken: process.env.ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT || "",

  zohoAccountsDomain: process.env.ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT || "accounts.zoho.com",
  zohoApiCRMDomain: process.env.ZOHO_API_DOMAIN_LILYCHYSTOFAT || "www.zohoapis.com",
  zohoApiAnalyticsDomain: process.env.ZOHO_ANALYTICS_API_DOMAIN_LILYCHYSTOFAT || "www.zohoapis.com",
  zohoAnalyticsOrgId: process.env.ZOHO_ANALYTICS_ORG_ID_LILYCHYSTOFAT || "",
  zohoAnalyticsWorkspaceId: process.env.ZOHO_ANALYTICS_WORKSPACE_ID_LILYCHYSTOFAT || "",
  zohoAnalyticsViewId: process.env.ZOHO_ANALYTICS_VIEW_ID_LILYCHYSTOFAT || "",

  zohoDealLayoutId: process.env.ZOHO_DEAL_LAYOUT_ID_LILYCHYSTOFAT,

  zohoCampaignsListKey: process.env.ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT || "",
  zohoRefreshCampaignsToken: process.env.ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT || "",

  // ====== CALENDLY ======
  calendlyWebhookSigningKey: process.env.CALENDLY_WEBHOOK_SIGNING_KEY || "",

  sheetEmail: process.env.SHEET_EMAIL || "",
  sheetPrivateKey: process.env.SHEET_PRIVATE_KEY || "",
  sheetId: process.env.SHEET_ID || "",
  sheetName: process.env.SHEET_NAME || "",

  nodemailerUser: process.env.NODEMAILER_USER || "",
  nodemailerPass: process.env.NODEMAILER_PASS || "",
};
