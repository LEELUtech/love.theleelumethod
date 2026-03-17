import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { upsertContactAndUpdateTags } from "../lib/zoho-campaigns";
import {
  markWebinarRegistered,
  markWebinarAttendedLive,
  markWebinarAttendedReplay,
} from "../lib/zoho-scoring";
import { db } from "../configs/firebase";

const WEBINAR_DISCOUNT_HOURS = 48;

const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT");
const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT");
const ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT");

const WB_REGISTERED_TIME_FIELD = "wb_registered_at";

type EwebinarAction =
  | "Registered"
  | "Joined"
  | "Left"
  | "WatchedWebinar"
  | "WatchedReplay"
  | "MissedWebinar"
  | "Unsubscribed"
  | "Converted"
  | "WebinarFinished"
  | "WebinarStarted"
  | "WebinarRestarted";

type EwebinarState = "Registered" | "NotJoined" | "Joined" | "Missed" | "Watched";

type EwebinarPayload = {
  id?: string;
  attendeeId?: string;
  email?: string;
  action?: string;
  state?: string;
  sessionType?: "Scheduled" | "Replay" | "JustInTime" | "OnDemand";
  registeredTime?: string;
  sessionTime?: string;
  updatedTime?: string;
  joinedTime?: string;
  leftTime?: string;
  leftAtSecs?: number;
  totalWatchedPercent?: number | string;
  watchedReplayPercent?: number | string;
  firstName?: string;
  lastName?: string;
  joinLink?: string;
  replayLink?: string;
  tags?: unknown[];
  [k: string]: unknown;
};

function normEmail(v?: unknown): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim().toLowerCase();
  return s ? s : null;
}

function normAction(v?: unknown): EwebinarAction | null {
  if (!v) return null;
  const s = String(v).trim();
  const allowed: EwebinarAction[] = [
    "Registered", "Joined", "Left", "WatchedWebinar", "WatchedReplay",
    "MissedWebinar", "Unsubscribed", "Converted", "WebinarFinished",
    "WebinarStarted", "WebinarRestarted",
  ];
  return (allowed as string[]).includes(s) ? (s as EwebinarAction) : null;
}

function normState(v?: unknown): EwebinarState | null {
  if (!v) return null;
  const s = String(v).trim();
  const allowed: EwebinarState[] = ["Registered", "NotJoined", "Joined", "Missed", "Watched"];
  return (allowed as string[]).includes(s) ? (s as EwebinarState) : null;
}

function toNum(v: unknown): number | null {
  if (v === undefined || v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function hasTag(body: EwebinarPayload, tag: string): boolean {
  const tags = Array.isArray(body.tags) ? body.tags : [];
  const t = tag.toLowerCase();
  return tags.some((x) => String(x).trim().toLowerCase() === t);
}

function getDedupeKey(body: EwebinarPayload, email: string, action: string): string {
  const id = body.id || body.attendeeId;
  if (id) return `${action}:${String(id)}`;
  const ts = body.registeredTime || body.sessionTime || body.updatedTime || Date.now();
  return `${action}:${email}:${ts}`;
}

function buildCampaignFields(body: EwebinarPayload): Record<string, string> {
  const fields: Record<string, string> = {};
  if (body.firstName) fields["First Name"] = String(body.firstName).trim();
  if (body.lastName) fields["Last Name"] = String(body.lastName).trim();
  if (body.joinLink) fields.wb_join_link = String(body.joinLink).trim();
  if (body.replayLink) fields.wb_replay_link = String(body.replayLink).trim();
  if (body.registeredTime) fields[WB_REGISTERED_TIME_FIELD] = String(body.registeredTime).trim();
  return fields;
}

function mapTagDelta(body: EwebinarPayload, action: EwebinarAction): { add: string[]; remove: string[] } {
  const state = normState(body.state);

  switch (action) {
  case "Registered":
    return {
      add: ["wb_reg", "wb_welcome"],
      remove: [],
    };

  case "MissedWebinar":
    return {
      add: ["wb_noshow"],
      remove: ["wb_live", "wb_replay", "wb_partial"],
    };

  case "WatchedWebinar":
    return {
      add: ["wb_live"],
      remove: ["wb_replay", "wb_partial", "wb_noshow"],
    };

  case "WatchedReplay":
    return {
      add: ["wb_replay"],
      remove: ["wb_live", "wb_partial", "wb_noshow"],
    };

  case "WebinarFinished": {
    const isReplay = body.sessionType === "Replay";
    const totalPct = toNum(body.totalWatchedPercent);
    const replayPct = toNum(body.watchedReplayPercent);
    const pct = isReplay ? (replayPct ?? totalPct) : totalPct;
    const isMissed = state === "Missed" || hasTag(body, "missed");

    if (isMissed) {
      return { add: ["wb_noshow"], remove: ["wb_live", "wb_replay", "wb_partial"] };
    }

    if (pct !== null && pct > 0 && pct < 80) {
      return { add: ["wb_partial"], remove: ["wb_live", "wb_replay", "wb_noshow"] };
    }

    if (pct !== null && pct >= 80) {
      return isReplay
        ? { add: ["wb_replay"], remove: ["wb_noshow"] }
        : { add: ["wb_live"], remove: ["wb_noshow"] };
    }

    return { add: [], remove: [] };
  }

  case "Joined":
  case "Left":
  case "Converted":
  case "Unsubscribed":
  case "WebinarStarted":
  case "WebinarRestarted":
  default:
    return { add: [], remove: [] };
  }
}

export const ewebinarWebhook = onRequest(
  {
    region: "us-central1",
    secrets: [
      ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT,
      ZOHO_CLIENT_ID_LILYCHYSTOFAT,
      ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
      ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT,
      ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
      ZOHO_API_DOMAIN_LILYCHYSTOFAT,
      ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT,
      ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT,
    ],
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const body = (req.body || {}) as EwebinarPayload;

      console.log("ewebinarWebhook RAW PAYLOAD", JSON.stringify(body));

      const email = normEmail(body.email);
      const action = normAction(body.action);

      if (!email || !action) {
        res.status(400).json({ ok: false, error: "missing email or valid action", email, action: body.action });
        return;
      }

      const { add, remove } = mapTagDelta(body, action);
      const fields = buildCampaignFields(body);

      if (!add.length && !remove.length) {
        if (Object.keys(fields).length) {
          await upsertContactAndUpdateTags(email, { add: [], remove: [] }, fields);
        }
        res.json({
          ok: true, ignored: true, email, action, state: body.state,
          sessionType: body.sessionType, totalWatchedPercent: body.totalWatchedPercent,
          watchedReplayPercent: body.watchedReplayPercent, tags: body.tags,
          fields_written: Object.keys(fields),
        });
        return;
      }

      const eventKey = getDedupeKey(body, email, action);

      await upsertContactAndUpdateTags(email, { add, remove }, Object.keys(fields).length ? fields : undefined);

      try {
        if (action === "Registered") {
          await markWebinarRegistered(email, {
            firstName: body.firstName ? String(body.firstName).trim() : undefined,
            lastName: body.lastName ? String(body.lastName).trim() : undefined,
          });
        } else if (action === "WebinarFinished") {
          const isReplay = body.sessionType === "Replay";
          const totalPct = toNum(body.totalWatchedPercent);
          const replayPct = toNum(body.watchedReplayPercent);
          const pct = isReplay ? (replayPct ?? totalPct) : totalPct;

          if (pct !== null && pct >= 80) {
            const expiresAt = new Date(Date.now() + WEBINAR_DISCOUNT_HOURS * 60 * 60 * 1000);
            const docId = email.replace(/[^a-z0-9]/g, "_");
            await db.collection("webinar_discounts").doc(docId).set({ email, expires_at: expiresAt });
            console.log("ewebinarWebhook: webinar discount set", { email, expiresAt });

            if (isReplay) {
              await markWebinarAttendedReplay(email);
            } else {
              await markWebinarAttendedLive(email);
            }
          }
        }
      } catch (scoringErr: unknown) {
        console.error("ewebinarWebhook: CRM scoring failed (non-critical)", {
          action, email, error: scoringErr instanceof Error ? scoringErr.message : String(scoringErr),
        });
      }

      res.json({
        ok: true, email, action, add, remove, eventKey, state: body.state,
        sessionType: body.sessionType, totalWatchedPercent: body.totalWatchedPercent,
        watchedReplayPercent: body.watchedReplayPercent, fields_written: Object.keys(fields),
      });
    } catch (err: unknown) {
      console.error("ewebinarWebhook error:", err);
      res.status(500).json({ ok: false, error: err instanceof Error ? err.message : "server_error" });
    }
  },
);
