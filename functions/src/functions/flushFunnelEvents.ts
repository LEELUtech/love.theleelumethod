import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";

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

    // Separate docs into ready and maxed-out
    const ready: Array<{ doc: admin.firestore.QueryDocumentSnapshot; row: FunnelEventRow }> = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      if ((data._attempts || 0) >= MAX_ATTEMPTS) {
        logger.warn("flushFunnelEvents: max attempts reached, skipping", {
          docId: doc.id,
          event_id: data.event_id,
        });
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _queued_at, _sent, _attempts, _last_error, _sent_at, ...row } = data;
      ready.push({ doc, row: row as FunnelEventRow });
    }

    if (ready.length === 0) return;

    const requestId = `flush_${Date.now()}`;

    try {
      // Send all rows in one Zoho request
      await appendRowToZohoAnalytics(ready.map((r) => r.row), requestId);

      const sentAt = new Date().toISOString();
      await Promise.all(ready.map(({ doc }) => doc.ref.update({ _sent: true, _sent_at: sentAt })));

      logger.info("flushFunnelEvents: batch sent", { count: ready.length });
    } catch (e) {
      const error = errToMessage(e);
      logger.warn("flushFunnelEvents: batch failed", { count: ready.length, error });

      // Mark each doc as failed individually
      await Promise.all(
        ready.map(({ doc }) =>
          doc.ref.update({
            _attempts: (doc.data()._attempts || 0) + 1,
            _last_error: error,
          }),
        ),
      );
    }
  },
);
