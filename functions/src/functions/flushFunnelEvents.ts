import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";

import { db } from "../configs/firebase";
import { appendRowToZohoAnalytics, errToMessage, FunnelEventRow } from "../lib/emitFunnelEvent";

const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_API_DOMAIN = defineSecret("ZOHO_ANALYTICS_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_ORG_ID = defineSecret("ZOHO_ANALYTICS_ORG_ID_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_WORKSPACE_ID = defineSecret("ZOHO_ANALYTICS_WORKSPACE_ID_LILYCHYSTOFAT");
const ZOHO_ANALYTICS_VIEW_ID = defineSecret("ZOHO_ANALYTICS_VIEW_ID_LILYCHYSTOFAT");

const MAX_ATTEMPTS = 5;
const BATCH_SIZE = 50;

export const flushFunnelEvents = onSchedule(
  {
    region: "us-central1",
    schedule: "* * * * *", // every minute
    timeZone: "UTC",
    secrets: [
      ZOHO_CLIENT_ID_LILYCHYSTOFAT,
      ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
      ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_ANALYTICS_LILYCHYSTOFAT,
      ZOHO_ANALYTICS_API_DOMAIN,
      ZOHO_ANALYTICS_ORG_ID,
      ZOHO_ANALYTICS_WORKSPACE_ID,
      ZOHO_ANALYTICS_VIEW_ID,
    ],
  },
  async () => {
    const snapshot = await db
      .collection("funnel_events_queue")
      .where("_sent", "==", false)
      .limit(BATCH_SIZE)
      .get();

    if (snapshot.empty) {
      logger.info("flushFunnelEvents: nothing to flush");
      return;
    }

    logger.info("flushFunnelEvents: flushing", { count: snapshot.size });

    for (const doc of snapshot.docs) {
      const data = doc.data();

      if ((data._attempts || 0) >= MAX_ATTEMPTS) {
        logger.warn("flushFunnelEvents: max attempts reached, skipping", {
          docId: doc.id,
          event_id: data.event_id,
          attempts: data._attempts,
        });
        continue;
      }

      // Strip internal queue fields before sending to Zoho
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _queued_at, _sent, _attempts, _last_error, _sent_at, ...row } = data;

      try {
        await appendRowToZohoAnalytics(row as FunnelEventRow, doc.id);
        await doc.ref.update({ _sent: true, _sent_at: new Date().toISOString() });
        logger.info("flushFunnelEvents: sent", { docId: doc.id, event_id: row.event_id });
      } catch (e) {
        const error = errToMessage(e);
        await doc.ref.update({
          _attempts: (data._attempts || 0) + 1,
          _last_error: error,
        });
        logger.warn("flushFunnelEvents: send failed", {
          docId: doc.id,
          event_id: row.event_id,
          error,
        });
      }
    }
  },
);
