import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { upsertContactAndUpdateTags } from "../lib/zoho-campaigns";
import { incrementDiagnosticSessions } from "../lib/zoho-sessions";

const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT");
const ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT");
const ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT");

export const completeDiagnosticSession = onRequest(
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
    ],
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const { email } = (req.body ?? {}) as { email?: unknown };
    if (!email || typeof email !== "string") {
      res.status(400).json({ ok: false, error: "missing email" });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log("completeDiagnosticSession: processing", { email: normalizedEmail });

    try {
      // Increment first so the CRM value is up-to-date before the workflow condition checks it
      let newCount = 0;
      try {
        newCount = await incrementDiagnosticSessions(normalizedEmail);
      } catch (e) {
        console.error("completeDiagnosticSession: increment failed (non-critical)", { email: normalizedEmail, error: e });
      }

      // Add tag + sync updated count to Campaigns contact field
      await upsertContactAndUpdateTags(
        normalizedEmail,
        { add: ["diagnostic_session_completed"], remove: [] },
        newCount > 0 ? { Diagnostic_Sessions_Completed: String(newCount) } : undefined,
      );

      console.log("completeDiagnosticSession: done", { email: normalizedEmail, newCount });
      res.json({ ok: true, email: normalizedEmail, count: newCount });
    } catch (err: unknown) {
      console.error("completeDiagnosticSession error:", err);
      res.status(500).json({ ok: false, error: err instanceof Error ? err.message : "server_error" });
    }
  },
);
