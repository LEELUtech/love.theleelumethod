// functions/src/functions/calendly-webhook.ts
import * as crypto from "crypto";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

import { configs } from "../configs/env";
import { upsertContactAndUpdateTags } from "../lib/zoho-campaigns";
import type { SessionPackageTier } from "../lib/zoho-sessions";

const CALENDLY_WEBHOOK_SIGNING_KEY = defineSecret("CALENDLY_WEBHOOK_SIGNING_KEY");
const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");

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

/**
 * Detect package tier from Calendly event name.
 * Returns null if event should be ignored (e.g. returning client sessions).
 *
 * Event types in Calendly:
 *   "9-SESSION PACKAGE with Lily Chystofat"      → nine_session
 *   "3-SESSION PACKAGE with Lily Chystofat"      → three_session
 *   "SINGLE SESSION with Lily Chystofat"         → single
 *   "30-Minute Guidance Session (...)"           → null (skip, no purchase tag)
 */
function detectPackageTier(eventName?: string): SessionPackageTier | null {
  const name = (eventName || "").toLowerCase();

  if (name.includes("9-session package")) return "nine_session";
  if (name.includes("3-session package")) return "three_session";
  if (name.includes("single session")) return "single";

  // Unknown / returning-client / free events — skip tagging
  return null;
}

/**
 * Campaigns tag delta for a confirmed session booking.
 *
 * Tags used in email automation (mirror the spreadsheet conditions):
 *   session_purchased   — any package booked
 *   sess_single         — single session
 *   sess_3pack          — 3-session package
 *   sess_9pack          — 9-session package
 *   no_session_purchase — removed when a session is purchased
 */
function purchasedTagDelta(tier: SessionPackageTier): { add: string[]; remove: string[] } {
  const tierTag: Record<SessionPackageTier, string> = {
    single: "sess_single",
    three_session: "sess_3pack",
    nine_session: "sess_9pack",
  };

  const otherTierTags = Object.values(tierTag).filter((t) => t !== tierTag[tier]);

  return {
    add: ["session_purchased", tierTag[tier]],
    remove: ["no_session_purchase", ...otherTierTags],
  };
}

function canceledTagDelta(): { add: string[]; remove: string[] } {
  return {
    add: ["no_session_purchase"],
    remove: ["session_purchased", "sess_single", "sess_3pack", "sess_9pack"],
  };
}

/**
 * Verify Calendly webhook signature.
 *
 * Header:  Calendly-Webhook-Signature
 * Format:  t=<unix_timestamp_seconds>,v1=<base64_hmac_sha256>
 * Signed:  "${timestamp}.${rawBody}"
 *
 * Docs: https://developer.calendly.com/api-docs/d7755e2f9e5fe-replay-protection
 *
 * Returns true when:
 *  - No signing key is configured (skip verification in dev/test)
 *  - Signature matches AND timestamp is within 5 minutes
 */
function verifySignature(rawBody: Buffer, header: string | undefined, signingKey: string): boolean {
  if (!signingKey) return true; // not configured → skip (dev/test mode)
  if (!header) return false;

  // Parse "t=<ts>,v1=<sig>"
  let timestamp = "";
  let sig = "";
  for (const part of header.split(",")) {
    const [k, v] = part.split("=", 2);
    if (k === "t") timestamp = v ?? "";
    if (k === "v1") sig = v ?? "";
  }
  if (!timestamp || !sig) return false;

  // Replay protection: reject if older than 5 minutes
  const tsMs = Number(timestamp) * 1000;
  if (Math.abs(Date.now() - tsMs) > 5 * 60 * 1000) return false;

  const signedPayload = `${timestamp}.${rawBody.toString("utf8")}`;
  const expected = crypto
    .createHmac("sha256", signingKey)
    .update(signedPayload)
    .digest("hex");

  // hex strings — use Buffer for timing-safe comparison
  const sigBuf = Buffer.from(sig, "hex");
  const expBuf = Buffer.from(expected, "hex");
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

// ─── Cloud Function ───────────────────────────────────────────────────────────

export const calendlyWebhook = onRequest(
  {
    region: "us-central1",
    secrets: [
      CALENDLY_WEBHOOK_SIGNING_KEY,
      ZOHO_CLIENT_ID_LILYCHYSTOFAT,
      ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT,
      ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT,
      ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
    ],
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      // ── Signature verification ──────────────────────────────────────────────
      const rawBody: Buffer = (req as any).rawBody ?? Buffer.from(JSON.stringify(req.body));
      const sigHeader = req.headers["calendly-webhook-signature"] as string | undefined;
      const signingKey = configs.calendlyWebhookSigningKey;

      if (!verifySignature(rawBody, sigHeader, signingKey)) {
        console.error("calendlyWebhook: signature verification failed", { sigHeader });
        res.status(401).send("Invalid signature");
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

      res.json({ ok: true, event: eventType, email, tier, add, remove });
    } catch (err: any) {
      console.error("calendlyWebhook error:", err);
      res.status(500).json({ ok: false, error: err?.message || "server_error" });
    }
  },
);
