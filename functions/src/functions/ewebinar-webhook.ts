// functions/src/ewebinarWebhook.ts
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { upsertContactAndUpdateTags } from "../lib/zoho-campaigns";
import {
  markWebinarRegistered,
  markWebinarAttendedLive,
  markWebinarAttendedReplay,
} from "../lib/zoho-scoring";

const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret(
  "ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT",
);
const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");


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

  tags?: any[];

  [k: string]: any;
};

function normEmail(v?: any): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim().toLowerCase();
  return s ? s : null;
}

function normAction(v?: any): EwebinarAction | null {
  if (!v) return null;
  const s = String(v).trim();

  const allowed: EwebinarAction[] = [
    "Registered",
    "Joined",
    "Left",
    "WatchedWebinar",
    "WatchedReplay",
    "MissedWebinar",
    "Unsubscribed",
    "Converted",
    "WebinarFinished",
    "WebinarStarted",
    "WebinarRestarted",
  ];

  return (allowed as string[]).includes(s) ? (s as EwebinarAction) : null;
}

function normState(v?: any): EwebinarState | null {
  if (!v) return null;
  const s = String(v).trim();
  const allowed: EwebinarState[] = ["Registered", "NotJoined", "Joined", "Missed", "Watched"];
  return (allowed as string[]).includes(s) ? (s as EwebinarState) : null;
}

function toNum(v: any): number | null {
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

function buildCampaignFields(body: EwebinarPayload): Record<string, any> {
  const fields: Record<string, any> = {};

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
      add: ["wb_reg"],
      // Keep your previous behavior: when someone registers again, reset watch-state tags
      remove: ["wb_live", "wb_replay", "wb_partial", "wb_noshow"],
    };

  case "MissedWebinar":
    return {
      add: ["wb_noshow"],
      remove: ["wb_live", "wb_replay", "wb_partial"],
    };

  case "WatchedWebinar":
    // If eWebinar ever fires this directly, we treat it as completed live watcher
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

    // For replay prefer watchedReplayPercent; fallback to totalWatchedPercent
    const pct = isReplay ? (replayPct ?? totalPct) : totalPct;

    const missedTag = hasTag(body, "missed");
    const isMissed = state === "Missed" || missedTag;

    if (isMissed) {
      return {
        add: ["wb_noshow"],
        remove: ["wb_live", "wb_replay", "wb_partial"],
      };
    }

    // Partial watch: > 0% and < 80%
    if (pct !== null && pct > 0 && pct < 80) {
      return {
        add: ["wb_partial"],
        remove: ["wb_live", "wb_replay", "wb_noshow"],
      };
    }

    // Completed: >= 80%
    if (pct !== null && pct >= 80) {
      return isReplay
        ? {
          add: ["wb_replay"],
          remove: ["wb_live", "wb_partial", "wb_noshow"],
        }
        : {
          add: ["wb_live"],
          remove: ["wb_replay", "wb_partial", "wb_noshow"],
        };
    }

    // pct === 0 or null: no action
    return { add: [], remove: [] };
  }

  // Not used for tagging in your funnel
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
        res.status(400).json({
          ok: false,
          error: "missing email or valid action",
          email,
          action: body.action,
        });
        return;
      }

      const { add, remove } = mapTagDelta(body, action);

      // Always build fields (safe), but only send them if non-empty
      const fields = buildCampaignFields(body);

      if (!add.length && !remove.length) {
        if (Object.keys(fields).length) {
          await upsertContactAndUpdateTags(email, { add: [], remove: [] }, fields);
        }

        res.json({
          ok: true,
          ignored: true,
          email,
          action,
          state: body.state,
          sessionType: body.sessionType,
          totalWatchedPercent: body.totalWatchedPercent,
          watchedReplayPercent: body.watchedReplayPercent,
          tags: body.tags,
          fields_written: Object.keys(fields),
        });
        return;
      }

      const eventKey = getDedupeKey(body, email, action);

      await upsertContactAndUpdateTags(
        email,
        { add, remove },
        Object.keys(fields).length ? fields : undefined,
      );

      // CRM scoring fields (best-effort, non-blocking)
      // In practice eWebinar only fires Registered and WebinarFinished.
      try {
        if (action === "Registered") {
          await markWebinarRegistered(email);
        } else if (action === "WebinarFinished") {
          const isReplay = body.sessionType === "Replay";
          const totalPct = toNum(body.totalWatchedPercent);
          const replayPct = toNum(body.watchedReplayPercent);
          const pct = isReplay ? (replayPct ?? totalPct) : totalPct;

          if (pct !== null && pct >= 80) {
            if (isReplay) {
              await markWebinarAttendedReplay(email);
            } else {
              await markWebinarAttendedLive(email);
            }
          }
        }
      } catch (scoringErr: any) {
        console.error("ewebinarWebhook: CRM scoring failed (non-critical)", {
          action,
          email,
          error: scoringErr?.message,
        });
      }

      res.json({
        ok: true,
        email,
        action,
        add,
        remove,
        eventKey,
        state: body.state,
        sessionType: body.sessionType,
        totalWatchedPercent: body.totalWatchedPercent,
        watchedReplayPercent: body.watchedReplayPercent,
        fields_written: Object.keys(fields),
      });
    } catch (err: any) {
      console.error("ewebinarWebhook error:", err);
      res.status(500).json({ ok: false, error: err?.message || "server_error" });
    }
  },
);