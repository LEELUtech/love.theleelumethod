import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import { upsertContactAndUpdateTags } from "../lib/zoho-campaigns";
import { findInactiveCourseContacts } from "../lib/zoho-circle";

const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT");
const ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT");
const ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT");

const INACTIVE_DAYS = 7;

export const markInactiveCourseUsers = onSchedule(
  {
    region: "us-central1",
    schedule: "0 8 * * *",
    timeZone: "UTC",
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
  async () => {
    const cutoffDate = new Date(Date.now() - INACTIVE_DAYS * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    logger.info("markInactiveCourseUsers: start", { cutoffDate, inactiveDays: INACTIVE_DAYS });

    let contacts: string[];
    try {
      contacts = await findInactiveCourseContacts(cutoffDate);
    } catch (err: unknown) {
      logger.error("markInactiveCourseUsers: findInactiveCourseContacts failed", {
        error: err instanceof Error ? err.message : String(err),
      });
      return;
    }

    if (!contacts.length) {
      logger.info("markInactiveCourseUsers: no inactive contacts found");
      return;
    }

    logger.info("markInactiveCourseUsers: found inactive contacts", { count: contacts.length });

    const results = await Promise.allSettled(
      contacts.map((email) =>
        upsertContactAndUpdateTags(email, { add: ["course_inactive"], remove: [] }),
      ),
    );

    const failed = results.filter((r) => r.status === "rejected").length;

    logger.info("markInactiveCourseUsers: done", {
      total: contacts.length,
      failed,
      succeeded: contacts.length - failed,
    });
  },
);
