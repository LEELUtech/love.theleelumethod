import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { upsertContactAndUpdateTags } from "../lib/zoho-campaigns";
import { markTrustTempleCompleted } from "../lib/zoho-sessions";
import { emitFunnelEvent } from "../lib/emitFunnelEvent";

const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT");
const ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT");
const ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_API_DOMAIN = defineSecret("ZOHO_ANALYTICS_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_ORG_ID = defineSecret("ZOHO_ANALYTICS_ORG_ID_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_WORKSPACE_ID = defineSecret("ZOHO_ANALYTICS_WORKSPACE_ID_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_VIEW_ID = defineSecret("ZOHO_ANALYTICS_VIEW_ID_LILYCHYSTOFAT");

export const completeTrustTemple = onRequest(
  {
    region: "us-central1",
    secrets: [
      ZOHO_CLIENT_ID_LILYCHYSTOFAT,
      ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT,
      ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT,
      ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
      ZOHO_API_DOMAIN_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT,
      ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT,
      ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT,
      ZOHO_ANALYTICS_API_DOMAIN,
      ZOHO_ANALYTICS_ORG_ID,
      ZOHO_ANALYTICS_WORKSPACE_ID,
      ZOHO_ANALYTICS_VIEW_ID,
    ],
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const { email } = req.body ?? {};
    if (!email || typeof email !== "string") {
      res.status(400).json({ ok: false, error: "missing email" });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log("completeTrustTemple: processing", { email: normalizedEmail });

    try {
      await upsertContactAndUpdateTags(normalizedEmail, {
        add: ["trust_temple_completed"],
        remove: [],
      });

      try {
        await markTrustTempleCompleted(normalizedEmail);
      } catch (e) {
        console.error("completeTrustTemple: markTrustTempleCompleted failed (non-critical)", { email: normalizedEmail, error: e });
      }

      emitFunnelEvent({
        event_id: `trust_temple_completed_${normalizedEmail.replace(/[^a-z0-9]/g, "_")}_${Date.now()}`,
        source: "calendly:task",
        funnel_step: "delivered",
        event_name: "session_completed",
        email: normalizedEmail,
        product_type: "trust_temple",
        site: "love.theleelumethod.com",
      }).catch((e) => console.error("completeTrustTemple: emitFunnelEvent failed", e));

      console.log("completeTrustTemple: done", { email: normalizedEmail });
      res.json({ ok: true, email: normalizedEmail });
    } catch (err: unknown) {
      console.error("completeTrustTemple error:", err);
      res.status(500).json({ ok: false, error: err instanceof Error ? err.message : "server_error" });
    }
  },
);
