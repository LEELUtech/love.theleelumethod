// functions/src/ewebinarWebhook.ts
import { onRequest } from "firebase-functions/v2/https";
import { upsertContactAndAddTags } from "../lib/zoho-campaigns"

type EwebinarEventName =
  | "Registered"
  | "Joined"
  | "Left"
  | "WatchedWebinar"
  | "WatchedReplay"
  | "MissedWebinar"
  | "Unsubscribed"
  | "Converted"
  | "WebinarFinished"
  | "All";

type EwebinarPayload = {
  event?: EwebinarEventName;
  trigger?: EwebinarEventName;

  email?: string;
  registrant_email?: string;
  registrant?: { email?: string };

  [k: string]: any;
};

function getEmail(body: EwebinarPayload): string | null {
  const email =
    body.email ||
    body.registrant_email ||
    body.registrant?.email ||
    null;

  return email ? String(email).trim().toLowerCase() : null;
}

function getEventName(body: EwebinarPayload): EwebinarEventName | null {
  const ev = (body.event || body.trigger) as any;
  return ev ? (String(ev) as EwebinarEventName) : null;
}

/**
 * Маппинг eWebinar → твои TAG SHORTCODES
 *
 * Registered      -> wb_reg
 * WatchedWebinar  -> wb_live + nr_ready + nr_drip
 * WatchedReplay   -> wb_replay + nr_ready + nr_drip
 * MissedWebinar   -> wb_noshow
 * Left (<50%)     -> wb_partial
 * Converted       -> (если конверсия = покупка) p_done
 */
function mapTags(ev: EwebinarEventName): string[] {
  switch (ev) {
  case "Registered":
    return ["wb_reg"];

  case "WatchedWebinar":
    return ["wb_live", "nr_ready", "nr_drip"];

  case "WatchedReplay":
    return ["wb_replay", "nr_ready", "nr_drip"];

  case "MissedWebinar":
    return ["wb_noshow"];

  case "Left":
    return ["wb_partial"];

  case "Converted":
    return ["p_done"];

  default:
    return [];
  }
}

export const ewebinarWebhook = onRequest(
  {
    region: "europe-west1",
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const body = (req.body || {}) as EwebinarPayload;

      const email = getEmail(body);
      const ev = getEventName(body);

      if (!email || !ev) {
        res.status(400).json({ ok: false, error: "missing email or event", email, ev });
        return;
      }

      const tags = mapTags(ev);

      // если событие нам не нужно — просто 200 OK (eWebinar не будет ретраить)
      if (!tags.length) {
        res.json({ ok: true, ignored: true, email, event: ev });
        return;
      }

      // Вся магия токенов/refresh внутри upsertContactAndAddTags()
      await upsertContactAndAddTags(email, tags);

      res.json({ ok: true, email, event: ev, tags });
    } catch (err: any) {
      console.error("ewebinarWebhook error:", err);
      res.status(500).json({ ok: false, error: err?.message || "server_error" });
    }
  }
);
