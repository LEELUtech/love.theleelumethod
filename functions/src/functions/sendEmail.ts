import { onCall } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { upsertContactAndUpdateTags } from "../lib/zoho-campaigns";
import { markLeadMagnetDownloaded } from "../lib/zoho-scoring";

// Campaigns secrets
const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT");
const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");
// CRM secrets (for scoring)
const ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");

const LM_DL_TRIGGER = "lm_dl_trigger";
export const sendEmail = onCall({
  cors: true,
  secrets: [
    ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT,
    ZOHO_CLIENT_ID_LILYCHYSTOFAT,
    ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
    ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT,
    ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT,
    ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
    ZOHO_API_DOMAIN_LILYCHYSTOFAT,
  ],
}, async (req) => {
  const { firstName, email } = req.data || {};

  if (!firstName || !email) {
    throw new Error("Missing required fields: firstName, email");
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const normalizedFirstName = String(firstName).trim();


  await upsertContactAndUpdateTags(
    normalizedEmail,
    { add: ["lm_dl", LM_DL_TRIGGER] },
    { firstName: normalizedFirstName }
  );

  // CRM scoring: mark lead magnet downloaded (best-effort)
  try {
    await markLeadMagnetDownloaded(normalizedEmail);
  } catch (e: any) {
    console.error("markLeadMagnetDownloaded failed (non-critical)", { email: normalizedEmail, error: e?.message });
  }

  console.log("sendEmail: lm_dl_trigger added", { email: normalizedEmail });
  return { success: true };
});