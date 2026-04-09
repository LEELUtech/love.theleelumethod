import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { db } from "../configs/firebase";
import { upsertContactAndUpdateTags } from "../lib/zoho-campaigns";
import { incrementDiagnosticSessions } from "../lib/zoho-sessions";
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

    const { email } = (req.body ?? {}) as { email?: unknown };
    if (!email || typeof email !== "string") {
      res.status(400).json({ ok: false, error: "missing email" });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log("completeDiagnosticSession: processing", { email: normalizedEmail });

    try {
      // Read kind from Firestore task doc
      const taskDoc = await db.collection("diagnostic_session_tasks")
        .doc(normalizedEmail.replace(/[^a-z0-9]/g, "_")).get();
      const rawKind = taskDoc.exists ? (taskDoc.data() as { kind?: string }).kind ?? null : null;

      // Map raw Calendly kind → product_type values used in funnel events
      const productTypeMap: Record<string, string> = {
        single: "session_single",
        three_session: "session_3pack",
        nine_session: "session_9pack",
      };
      const productType = rawKind ? (productTypeMap[rawKind] ?? rawKind) : null;

      let newCount = 0;
      try {
        newCount = await incrementDiagnosticSessions(normalizedEmail);
      } catch (e) {
        console.error("completeDiagnosticSession: increment failed (non-critical)", { email: normalizedEmail, error: e });
      }

      await upsertContactAndUpdateTags(
        normalizedEmail,
        { add: ["diagnostic_session_completed"], remove: [] },
        newCount > 0 ? { Diagnostic_Sessions_Completed: String(newCount) } : undefined,
      );

      emitFunnelEvent({
        event_id: `session_completed_${normalizedEmail.replace(/[^a-z0-9]/g, "_")}_${Date.now()}`,
        source: "calendly:task",
        funnel_step: "delivered",
        event_name: "session_completed",
        email: normalizedEmail,
        product_type: productType,
        site: "love.theleelumethod.com",
      }).catch((e) => console.error("completeDiagnosticSession: emitFunnelEvent failed", e));

      console.log("completeDiagnosticSession: done", { email: normalizedEmail, newCount });
      res.json({ ok: true, email: normalizedEmail, count: newCount });
    } catch (err: unknown) {
      console.error("completeDiagnosticSession error:", err);
      res.status(500).json({ ok: false, error: err instanceof Error ? err.message : "server_error" });
    }
  },
);
