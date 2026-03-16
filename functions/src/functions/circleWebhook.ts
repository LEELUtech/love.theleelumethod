import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { upsertContactAndUpdateTags } from "../lib/zoho-campaigns";
import { updateLastModuleSubmission } from "../lib/zoho-circle";

const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT");
const ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT");
const ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT");

type CircleEvent = "module_submission" | "module_3_completed" | "module_6_completed" | "course_completed";

const TAG_MAP: Partial<Record<CircleEvent, string[]>> = {
  module_3_completed: ["module_3_completed"],
  module_6_completed: ["module_6_completed"],
  course_completed: ["course_completed"],
};

export const circleWebhook = onRequest(
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

    const body = (req.body ?? {}) as { event?: unknown; email?: unknown };
    const event = typeof body.event === "string" ? (body.event as CircleEvent) : null;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;

    if (!email) {
      res.status(400).json({ ok: false, error: "missing email" });
      return;
    }

    if (!event) {
      res.status(400).json({ ok: false, error: "missing event" });
      return;
    }

    console.log("circleWebhook: processing", { event, email });

    try {
      const addTags = TAG_MAP[event] ?? [];

      await Promise.allSettled([
        upsertContactAndUpdateTags(email, { add: addTags, remove: ["course_inactive"] }),
        updateLastModuleSubmission(email),
      ]);

      console.log("circleWebhook: done", { event, email, addTags });
      res.json({ ok: true, event, email, addTags });
    } catch (err: unknown) {
      console.error("circleWebhook error:", err);
      res.status(500).json({ ok: false, error: err instanceof Error ? err.message : "server_error" });
    }
  },
);
