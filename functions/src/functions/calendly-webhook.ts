import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { CloudTasksClient } from "@google-cloud/tasks";
import { db } from "../configs/firebase";

import { upsertContactAndUpdateTags } from "../lib/zoho-campaigns";
import { markSessionPurchased, markSessionCanceled, markTrustTempleBooked, type SessionPackageTier } from "../lib/zoho-sessions";

const GCP_PROJECT = "leelu-tech";
const GCP_LOCATION = "us-central1";
const TASK_QUEUE = "trust-temple-complete";
const DIAG_TASK_QUEUE = "diagnostic-session-complete";
const TRUST_TEMPLE_DURATION_MIN = 20;
const DIAG_SESSION_DURATION_MIN = 60;

const tasksClient = new CloudTasksClient();

async function scheduleCompleteTask(email: string, startTimeISO: string): Promise<void> {
  const startMs = new Date(startTimeISO).getTime();
  const scheduleMs = startMs + TRUST_TEMPLE_DURATION_MIN * 60 * 1000;
  const scheduleSeconds = Math.floor(scheduleMs / 1000);

  const functionUrl = `https://${GCP_LOCATION}-${GCP_PROJECT}.cloudfunctions.net/completeTrustTemple`;
  const parent = tasksClient.queuePath(GCP_PROJECT, GCP_LOCATION, TASK_QUEUE);

  const [task] = await tasksClient.createTask({
    parent,
    task: {
      scheduleTime: { seconds: scheduleSeconds },
      httpRequest: {
        httpMethod: "POST" as const,
        url: functionUrl,
        headers: { "Content-Type": "application/json" },
        body: Buffer.from(JSON.stringify({ email })).toString("base64"),
      },
    },
  });

  const taskName = task.name ?? "";
  await db.collection("trust_temple_tasks").doc(email.replace(/[^a-z0-9]/g, "_")).set({
    email,
    taskName,
    scheduledAt: new Date(),
    startTime: startTimeISO,
  });

  console.log("calendlyWebhook: trust temple task scheduled", { email, taskName, scheduleAt: new Date(scheduleMs).toISOString() });
}

async function scheduleDiagnosticTask(email: string, startTimeISO: string): Promise<void> {
  const startMs = new Date(startTimeISO).getTime();
  const scheduleMs = startMs + DIAG_SESSION_DURATION_MIN * 60 * 1000;
  const scheduleSeconds = Math.floor(scheduleMs / 1000);

  const functionUrl = `https://${GCP_LOCATION}-${GCP_PROJECT}.cloudfunctions.net/completeDiagnosticSession`;
  const parent = tasksClient.queuePath(GCP_PROJECT, GCP_LOCATION, DIAG_TASK_QUEUE);

  const [task] = await tasksClient.createTask({
    parent,
    task: {
      scheduleTime: { seconds: scheduleSeconds },
      httpRequest: {
        httpMethod: "POST" as const,
        url: functionUrl,
        headers: { "Content-Type": "application/json" },
        body: Buffer.from(JSON.stringify({ email })).toString("base64"),
      },
    },
  });

  const taskName = task.name ?? "";
  await db.collection("diagnostic_session_tasks").doc(email.replace(/[^a-z0-9]/g, "_")).set({
    email,
    taskName,
    scheduledAt: new Date(),
    startTime: startTimeISO,
  });

  console.log("calendlyWebhook: diagnostic task scheduled", { email, taskName, scheduleAt: new Date(scheduleMs).toISOString() });
}

async function cancelDiagnosticTask(email: string): Promise<void> {
  const docId = email.replace(/[^a-z0-9]/g, "_");
  const doc = await db.collection("diagnostic_session_tasks").doc(docId).get();
  if (!doc.exists) {
    console.log("calendlyWebhook: no diagnostic task found to cancel", { email });
    return;
  }

  const { taskName } = doc.data() as { taskName: string };
  try {
    await tasksClient.deleteTask({ name: taskName });
    console.log("calendlyWebhook: diagnostic task deleted", { email, taskName });
  } catch (e: unknown) {
    console.warn("calendlyWebhook: deleteDiagnosticTask failed (may already be done)", { email, taskName, error: e instanceof Error ? e.message : String(e) });
  }

  await db.collection("diagnostic_session_tasks").doc(docId).delete();
}

async function cancelCompleteTask(email: string): Promise<void> {
  const docId = email.replace(/[^a-z0-9]/g, "_");
  const doc = await db.collection("trust_temple_tasks").doc(docId).get();
  if (!doc.exists) {
    console.log("calendlyWebhook: no trust temple task found to cancel", { email });
    return;
  }

  const { taskName } = doc.data() as { taskName: string };
  try {
    await tasksClient.deleteTask({ name: taskName });
    console.log("calendlyWebhook: trust temple task deleted", { email, taskName });
  } catch (e: unknown) {
    console.warn("calendlyWebhook: deleteTask failed (may already be done)", { email, taskName, error: e instanceof Error ? e.message : String(e) });
  }

  await db.collection("trust_temple_tasks").doc(docId).delete();
}

const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT");
const ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT");
const ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT");

type CalendlyEventKind = SessionPackageTier | "trust_temple";

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
  [k: string]: unknown;
};

type CalendlyWebhookBody = {
  event?: string;
  payload?: CalendlyInvitee;
  created_at?: string;
};

function normEmail(v?: unknown): string | null {
  if (!v) return null;
  const s = String(v).trim().toLowerCase();
  return s || null;
}

function detectEventKind(eventName?: string): CalendlyEventKind | null {
  const name = (eventName || "").toLowerCase();

  if (name.includes("trust temple")) return "trust_temple";
  if (name.includes("9-session package")) return "nine_session";
  if (name.includes("3-session package")) return "three_session";
  if (name.includes("single session")) return "single";
  if (name.includes("test session")) return "single";

  return null;
}

function purchasedTagDelta(kind: CalendlyEventKind): { add: string[]; remove: string[] } {
  const tierTag: Record<SessionPackageTier, string> = {
    single: "sess_single",
    three_session: "sess_3pack",
    nine_session: "sess_9pack",
  };

  if (kind === "trust_temple") {
    return {
      add: ["trust_temple_session"],
      remove: Object.values(tierTag),
    };
  }

  const otherTierTags = Object.values(tierTag).filter((t) => t !== tierTag[kind]);

  return {
    add: ["session_purchased", tierTag[kind]],
    remove: otherTierTags,
  };
}

export const calendlyWebhook = onRequest(
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
    try {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const body = (req.body || {}) as CalendlyWebhookBody;

      console.log("calendlyWebhook RAW PAYLOAD", JSON.stringify(body));

      const eventType = body.event;
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

      const eventName = payload.scheduled_event?.name ?? "";
      const kind = detectEventKind(eventName);

      if (eventType === "invitee.canceled") {
        if (kind === "trust_temple") {
          try {
            await markTrustTempleBooked(email, false);
          } catch (e) {
            console.error("calendlyWebhook: markTrustTempleBooked(false) failed (non-critical)", { email, error: e });
          }
          try {
            await cancelCompleteTask(email);
          } catch (e) {
            console.error("calendlyWebhook: cancelCompleteTask failed (non-critical)", { email, error: e });
          }
        } else {
          try {
            await markSessionCanceled(email);
          } catch (e) {
            console.error("calendlyWebhook: markSessionCanceled failed (non-critical)", { email, error: e });
          }
          try {
            await cancelDiagnosticTask(email);
          } catch (e) {
            console.error("calendlyWebhook: cancelDiagnosticTask failed (non-critical)", { email, error: e });
          }
        }

        res.json({ ok: true, event: eventType, email });
        return;
      }

      const fullNameParts = payload.name ? String(payload.name).trim().split(/\s+/) : [];
      const derivedFirst = payload.first_name
        ? String(payload.first_name).trim()
        : fullNameParts.slice(0, -1).join(" ") || fullNameParts[0];
      const derivedLast = payload.last_name
        ? String(payload.last_name).trim()
        : fullNameParts.length > 1 ? fullNameParts[fullNameParts.length - 1] : undefined;

      const inviteeMeta = {
        firstName: derivedFirst || undefined,
        lastName: derivedLast || undefined,
      };

      if (!kind) {
        console.warn("calendlyWebhook: unrecognized event type, skipping tags", { email, eventName });
        res.json({ ok: true, ignored: true, reason: "unrecognized_event_type", email, eventName });
        return;
      }

      console.log("calendlyWebhook: booking confirmed", { email, eventName, kind });

      const { add, remove } = purchasedTagDelta(kind);

      const meta: Record<string, string> = {};
      if (derivedFirst) meta["First Name"] = derivedFirst;
      if (derivedLast) meta["Last Name"] = derivedLast;
      if (payload.scheduled_event?.start_time) {
        meta["session_start_time"] = String(payload.scheduled_event.start_time);
      }

      await upsertContactAndUpdateTags(email, { add, remove }, Object.keys(meta).length ? meta : undefined);

      if (kind === "trust_temple") {
        try {
          await markTrustTempleBooked(email, true, inviteeMeta);
        } catch (e) {
          console.error("calendlyWebhook: markTrustTempleBooked(true) failed (non-critical)", { email, error: e });
        }
        if (payload.scheduled_event?.start_time) {
          try {
            await scheduleCompleteTask(email, String(payload.scheduled_event.start_time));
          } catch (e) {
            console.error("calendlyWebhook: scheduleCompleteTask failed (non-critical)", { email, error: e });
          }
        }
      } else {
        try {
          await markSessionPurchased(email, kind, undefined, inviteeMeta);
        } catch (e) {
          console.error("calendlyWebhook: markSessionPurchased failed (non-critical)", { email, kind, error: e });
        }
        if (payload.scheduled_event?.start_time) {
          try {
            await scheduleDiagnosticTask(email, String(payload.scheduled_event.start_time));
          } catch (e) {
            console.error("calendlyWebhook: scheduleDiagnosticTask failed (non-critical)", { email, error: e });
          }
        }
      }

      res.json({ ok: true, event: eventType, email, kind, add, remove });
    } catch (err: unknown) {
      console.error("calendlyWebhook error:", err);
      res.status(500).json({ ok: false, error: err instanceof Error ? err.message : "server_error" });
    }
  },
);
