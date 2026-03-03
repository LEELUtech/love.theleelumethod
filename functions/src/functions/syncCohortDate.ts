import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";

import { bulkUpdateCrmContactsBySite } from "../lib/zoho-crm";
import { bulkUpdateCampaignsContactField } from "../lib/zoho-campaigns";

const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT");
const ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT = defineSecret("ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");

const COHORT_SITES = ["localhost", "leelu-v2.bndigital.dev"];
const CRM_COHORT_FIELD = "Cohort_Start_Date_Name";
const CAMPAIGNS_COHORT_FIELD = "Cohort Start Date Name";

function parseCohortDate(value: unknown): string | null {
  if (!value) return null;
  if (typeof (value as any)?.toDate === "function") {
    return (value as admin.firestore.Timestamp).toDate().toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toISOString().slice(0, 10);
  }
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

export const syncCohortDate = onDocumentWritten(
  {
    document: "config/cohort",
    database: "(default)",
    timeoutSeconds: 540,
    secrets: [
      ZOHO_CLIENT_ID_LILYCHYSTOFAT,
      ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT,
      ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
      ZOHO_API_DOMAIN_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT,
      ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT,
    ],
  },
  async (event) => {
    const newData = event.data?.after?.data();
    if (!newData) {
      logger.warn("syncCohortDate: document deleted, nothing to sync");
      return;
    }

    const cohortDate = parseCohortDate(newData.cohort_date);
    if (!cohortDate) {
      logger.warn("syncCohortDate: cohort_date is empty or missing");
      return;
    }

    // Skip if date didn't actually change
    const oldData = event.data?.before?.data();
    const oldDate = oldData ? parseCohortDate(oldData.cohort_date) : null;
    if (cohortDate === oldDate) {
      logger.info("syncCohortDate: cohort_date unchanged, skipping", { cohortDate });
      return;
    }

    logger.info("syncCohortDate: syncing cohort date to Zoho", { cohortDate, oldDate });

    const [crmResult, campaignsResult] = await Promise.allSettled([
      bulkUpdateCrmContactsBySite(COHORT_SITES, CRM_COHORT_FIELD, cohortDate),
      bulkUpdateCampaignsContactField(CAMPAIGNS_COHORT_FIELD, cohortDate),
    ]);

    if (crmResult.status === "fulfilled") {
      logger.info("syncCohortDate: CRM sync done", crmResult.value);
    } else {
      logger.error("syncCohortDate: CRM sync failed", {
        error: crmResult.reason instanceof Error ? crmResult.reason.message : String(crmResult.reason),
      });
    }

    if (campaignsResult.status === "fulfilled") {
      logger.info("syncCohortDate: Campaigns sync done", campaignsResult.value);
    } else {
      logger.error("syncCohortDate: Campaigns sync failed", {
        error: campaignsResult.reason instanceof Error ? campaignsResult.reason.message : String(campaignsResult.reason),
      });
    }
  },
);
