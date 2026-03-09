"use client";
import { useEffect } from "react";
import { getEmailFromLS } from "@/lib/tracking/localEmail";
import { updateCampaignTags } from "@/lib/campaigns";

const typeToProfileTag: Record<string, string> = {
  brokenHeartStorm: "q_pf_over",
  lonelyHopeLoop: "q_pf_drift",
  silentBreakupRelationship: "q_pf_karmic",
  endlessWaitingRoom: "q_pf_proj",
};

const ALL_PROFILE_TAGS = Object.values(typeToProfileTag);
const Q_EMAIL3_TRIGGER = "q_email3_trigger";

export default function QuizResultTagger({ type }: { type: string }) {
  useEffect(() => {
    const profileTag = typeToProfileTag[type];
    if (!profileTag) return;

    const email = getEmailFromLS();
    if (!email) return;

    const otherProfileTags = ALL_PROFILE_TAGS.filter((t) => t !== profileTag);

    (async () => {
      // create/update contact and add tags (default behavior)
      await updateCampaignTags(email, {
        remove: otherProfileTags,
        add: ["q_done", profileTag, Q_EMAIL3_TRIGGER],
      });
    })();
  }, [type]);

  return null;
}