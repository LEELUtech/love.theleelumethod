// functions/src/functions/calendly-webhook.ts
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

import { upsertContactAndUpdateTags } from "../lib/zoho-campaigns";
import { markSessionPurchased, markSessionCanceled, type SessionPackageTier } from "../lib/zoho-sessions";

const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT");

// ─── Types ─────────────────────────────────────────────────────────────────────

type CalendlyInvitee = {
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  scheduled_event?: {
    uri?: string;
    name?: string;
    start_time?: string;
  };
  [k: string]: any;
};

type CalendlyWebhookBody = {
  event?: string;          // "invitee.created" | "invitee.canceled"
  payload?: CalendlyInvitee;
  created_at?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normEmail(v?: unknown): string | null {
  if (!v) return null;
  const s = String(v).trim().toLowerCase();
  return s || null;
}


function detectPackageTier(eventName?: string): SessionPackageTier | null {
  const name = (eventName || "").toLowerCase();

  if (name.includes("9-session package")) return "nine_session";
  if (name.includes("3-session package")) return "three_session";
  if (name.includes("single session")) return "single";
  if (name.includes("test session")) return "single"; // test event

  // Unknown / returning-client / free events — skip tagging
  return null;
}

function purchasedTagDelta(tier: SessionPackageTier): { add: string[]; remove: string[] } {
  const tierTag: Record<SessionPackageTier, string> = {
    single: "sess_single",
    three_session: "sess_3pack",
    nine_session: "sess_9pack",
  };

  const otherTierTags = Object.values(tierTag).filter((t) => t !== tierTag[tier]);

  return {
    add: ["session_purchased", tierTag[tier]],
    remove: otherTierTags,
  };
}

function canceledTagDelta(): { add: string[]; remove: string[] } {
  return {
    add: [],
    remove: ["session_purchased", "sess_single", "sess_3pack", "sess_9pack"],
  };
}


// ─── Cloud Function ───────────────────────────────────────────────────────────

export const calendlyWebhook = onRequest(
  {
    region: "us-central1",
    secrets: [
      // CALENDLY_WEBHOOK_SIGNING_KEY,
      ZOHO_CLIENT_ID_LILYCHYSTOFAT,
      ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT,
      ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT,
      ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
      ZOHO_API_DOMAIN_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT,
    ],
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const body = (req.body || {}) as CalendlyWebhookBody;

      console.log("calendlyWebhook RAW PAYLOAD", JSON.stringify(body));

      const eventType = body.event; // "invitee.created" | "invitee.canceled"
      const payload = body.payload ?? {};

      const email = normEmail(payload.email);
      if (!email) {
        res.status(400).json({ ok: false, error: "missing email" });
        return;
      }

      if (eventType !== "invitee.created" && eventType !== "invitee.canceled") {
        res.json({ ok: true, ignored: true, event: eventType });
        return;
      }

      // ── invitee.canceled ────────────────────────────────────────────────────
      if (eventType === "invitee.canceled") {
        const { add, remove } = canceledTagDelta();

        await upsertContactAndUpdateTags(email, { add, remove });

        try {
          await markSessionCanceled(email);
        } catch (e) {
          console.error("calendlyWebhook: markSessionCanceled failed (non-critical)", { email, error: e });
        }

        res.json({ ok: true, event: eventType, email, add, remove });
        return;
      }

      // ── invitee.created ─────────────────────────────────────────────────────
      const eventName = payload.scheduled_event?.name ?? "";
      const tier = detectPackageTier(eventName);

      console.log("calendlyWebhook: booking confirmed", {
        email,
        eventName,
        tier,
      });

      if (!tier) {
        console.warn("calendlyWebhook: unrecognized event type, skipping tags", { email, eventName });
        res.json({ ok: true, ignored: true, reason: "unrecognized_event_type", email, eventName });
        return;
      }

      const { add, remove } = purchasedTagDelta(tier);

      // Meta fields to write to Campaigns contact
      const meta: Record<string, string> = {};
      if (payload.first_name) meta["First Name"] = String(payload.first_name).trim();
      if (payload.last_name) meta["Last Name"] = String(payload.last_name).trim();
      if (payload.scheduled_event?.start_time) {
        meta["session_start_time"] = String(payload.scheduled_event.start_time);
      }

      await upsertContactAndUpdateTags(email, { add, remove }, Object.keys(meta).length ? meta : undefined);

      try {
        await markSessionPurchased(email, tier);
      } catch (e) {
        console.error("calendlyWebhook: markSessionPurchased failed (non-critical)", { email, tier, error: e });
      }

      res.json({ ok: true, event: eventType, email, tier, add, remove });
    } catch (err: any) {
      console.error("calendlyWebhook error:", err);
      res.status(500).json({ ok: false, error: err?.message || "server_error" });
    }
  },
);
