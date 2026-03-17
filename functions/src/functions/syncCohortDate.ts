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
    const cohortLabel = typeof newData.cohort_date_label === "string"
      ? newData.cohort_date_label.trim() || null
      : null;

    if (!cohortDate && !cohortLabel) {
      logger.warn("syncCohortDate: both cohort_date and cohort_date_label are empty");
      return;
    }

    const oldData = event.data?.before?.data();
    const oldDate = oldData ? parseCohortDate(oldData.cohort_date) : null;
    const oldLabel = oldData && typeof oldData.cohort_date_label === "string"
      ? oldData.cohort_date_label.trim() || null
      : null;

    if (cohortDate === oldDate && cohortLabel === oldLabel) {
      logger.info("syncCohortDate: fields unchanged, skipping", { cohortDate, cohortLabel });
      return;
    }

    logger.info("syncCohortDate: syncing to Zoho", { cohortDate, cohortLabel, oldDate, oldLabel });

    const crmFields: Record<string, string> = {};
    if (cohortDate) crmFields["Cohort_Start_Date"] = cohortDate;
    if (cohortLabel) crmFields["Cohort_Start_Date_Name"] = cohortLabel;

    const campaignsFields: Record<string, string> = {};
    if (cohortDate) campaignsFields["Cohort Start Date"] = cohortDate;
    if (cohortLabel) campaignsFields["Cohort Start Date Name"] = cohortLabel;

    const [crmResult, campaignsResult] = await Promise.allSettled([
      bulkUpdateCrmContactsBySite(COHORT_SITES, crmFields),
      bulkUpdateCampaignsContactField(campaignsFields),
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
