import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import { getAllCircleCourseMembersForCourse, getAllCommunityMembers } from "../lib/circle";
import { updateCircleCourseProgress } from "../lib/zoho-circle";

const ZOHO_CLIENT_ID_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
const ZOHO_CLIENT_SECRET_LILYCHYSTOFAT = defineSecret("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
const ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT = defineSecret("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT");
const ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
const ZOHO_API_DOMAIN_LILYCHYSTOFAT = defineSecret("ZOHO_API_DOMAIN_LILYCHYSTOFAT");
const CIRCLE_API_KEY = defineSecret("CIRCLE_API_KEY");

// Circle space IDs (stable production IDs, verified via Postman)
const MODULE_1_ID = 2520173;
const MODULE_3_ID = 2524933;
const MODULE_6_ID = 2524937;
const MODULE_12_ID = 2524945;

const INACTIVE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const syncCircleCourseProgress = onSchedule(
  {
    region: "us-central1",
    schedule: "0 8 * * *",
    timeZone: "UTC",
    timeoutSeconds: 300,
    secrets: [
      ZOHO_CLIENT_ID_LILYCHYSTOFAT,
      ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
      ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT,
      ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
      ZOHO_API_DOMAIN_LILYCHYSTOFAT,
      CIRCLE_API_KEY,
    ],
  },
  async () => {
    logger.info("syncCircleCourseProgress: start");

    // Step 1: Fetch enrolled members for each module + all community members in parallel
    const [module1Members, module3Members, module6Members, finalModuleMembers, communityMembers] =
      await Promise.all([
        getAllCircleCourseMembersForCourse(MODULE_1_ID),
        getAllCircleCourseMembersForCourse(MODULE_3_ID),
        getAllCircleCourseMembersForCourse(MODULE_6_ID),
        getAllCircleCourseMembersForCourse(MODULE_12_ID),
        getAllCommunityMembers(),
      ]);

    // Step 3: Build enrollment sets (community_member_id)
    // Enrolled in a module = completed the prerequisite modules (sequentially locked)
    const module3EnrolledIds = new Set(module3Members.map((m) => m.community_member_id));
    const module6EnrolledIds = new Set(module6Members.map((m) => m.community_member_id));
    const courseEnrolledIds = new Set(finalModuleMembers.map((m) => m.community_member_id));

    // Step 4: Build last_seen_at map from community members
    const lastSeenMap = new Map<number, Date | null>();
    for (const cm of communityMembers) {
      lastSeenMap.set(cm.id, cm.last_seen_at ? new Date(cm.last_seen_at) : null);
    }

    // Step 5: Build per-email map from module-1 participants (all course enrollees)
    const memberMap = new Map<string, { communityMemberId: number; lastSeenAt: Date | null }>();
    for (const m of module1Members) {
      const email = m.community_member?.email?.trim().toLowerCase();
      if (!email) continue;
      memberMap.set(email, {
        communityMemberId: m.community_member_id,
        lastSeenAt: lastSeenMap.get(m.community_member_id) ?? null,
      });
    }

    logger.info("syncCircleCourseProgress: participants found", { total: memberMap.size });

    // Step 6: Update Zoho CRM for each participant
    const inactiveCutoff = new Date(Date.now() - INACTIVE_THRESHOLD_MS);
    let succeeded = 0;
    let failed = 0;

    for (const [email, { communityMemberId, lastSeenAt }] of memberMap) {
      const isInactive = !lastSeenAt || lastSeenAt < inactiveCutoff;

      try {
        await updateCircleCourseProgress(email, {
          circle_status: isInactive ? "inactive" : "active",
          last_module_submission: lastSeenAt ? lastSeenAt.toISOString().slice(0, 10) : undefined,
          module_3_completed: module3EnrolledIds.has(communityMemberId),
          module_6_completed: module6EnrolledIds.has(communityMemberId),
          course_completed: courseEnrolledIds.has(communityMemberId),
        });
        succeeded++;
      } catch (err) {
        logger.error("syncCircleCourseProgress: Zoho update failed", {
          email,
          error: String(err),
        });
        failed++;
      }

      await sleep(300); // rate limit between Zoho calls
    }

    logger.info("syncCircleCourseProgress: done", {
      total: memberMap.size,
      succeeded,
      failed,
    });
  },
);
