// functions/src/ewebinarWebhook.ts
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { upsertContactAndUpdateTags } from "../lib/zoho-campaigns";

const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret(
  "ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT",
);
const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");

type EwebinarAction =
  | "Registered"
  | "Joined"
  | "Left"
  | "WatchedWebinar"
  | "WatchedReplay"
  | "MissedWebinar"
  | "Unsubscribed"
  | "Converted"
  | "WebinarFinished";

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
    "Registered",
    "Joined",
    "Left",
    "WatchedWebinar",
    "WatchedReplay",
    "MissedWebinar",
    "Unsubscribed",
    "Converted",
    "WebinarFinished",
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

/**
 * Main mapping:
 * - Registered -> wb_reg
 * - WebinarFinished:
 *    - state/tags/percent determine watched vs missed vs partial
 *    - sessionType determines live vs replay
 */
function mapTagDelta(
  body: EwebinarPayload,
  action: EwebinarAction,
): { add: string[]; remove: string[] } {
  const sessionType = body.sessionType; // "Replay" etc
  const state = normState(body.state);

  const isReplay = sessionType === "Replay";

  const totalPct = toNum(body.totalWatchedPercent);
  const replayPct = toNum(body.watchedReplayPercent);
  const pct = isReplay ? replayPct : totalPct;

  const watchedTag = hasTag(body, "watched");
  const missedTag = hasTag(body, "missed");

  switch (action) {
    case "Registered":
      return {
        add: ["wb_reg"],
        remove: ["wb_live", "wb_replay", "wb_partial", "wb_noshow", "nr_ready", "nr_drip"],
      };

    case "WebinarFinished": {
      // 1) явные state/tags
      const isMissed = state === "Missed" || missedTag;
      const isWatched = state === "Watched" || watchedTag;

      if (isMissed) {
        return {
          add: ["wb_noshow"],
          remove: ["wb_live", "wb_replay", "wb_partial", "nr_ready", "nr_drip"],
        };
      }

      // check percent BEFORE isWatched — eWebinar adds "watched" tag even for partial viewers
      if (pct !== null && pct < 50) {
        return {
          add: ["wb_partial"],
          remove: ["wb_live", "wb_replay", "wb_noshow", "nr_ready", "nr_drip"],
        };
      }

      if (isWatched || (pct !== null && pct >= 50)) {
        return isReplay
          ? {
              add: ["wb_replay", "nr_ready", "nr_drip"],
              remove: ["wb_live", "wb_partial", "wb_noshow"],
            }
          : {
              add: ["wb_live", "nr_ready", "nr_drip"],
              remove: ["wb_replay", "wb_partial", "wb_noshow"],
            };
      }

      return { add: [], remove: [] };
    }

    case "WatchedWebinar":
      return {
        add: ["wb_live", "nr_ready", "nr_drip"],
        remove: ["wb_replay", "wb_partial", "wb_noshow"],
      };

    case "WatchedReplay":
      return {
        add: ["wb_replay", "nr_ready", "nr_drip"],
        remove: ["wb_live", "wb_partial", "wb_noshow"],
      };

    case "MissedWebinar":
      return {
        add: ["wb_noshow"],
        remove: ["wb_live", "wb_replay", "wb_partial", "nr_ready", "nr_drip"],
      };

    case "Left":
    case "Joined":
    case "Converted":
    case "Unsubscribed":
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

      if (!add.length && !remove.length) {
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
        });
        return;
      }

      const eventKey = getDedupeKey(body, email, action);

      await upsertContactAndUpdateTags(email, { add, remove });

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
      });
    } catch (err: unknown) {
      console.error("ewebinarWebhook error:", err);
      res.status(500).json({ ok: false, error: (err as Error)?.message || "server_error" });
    }
  },
);
