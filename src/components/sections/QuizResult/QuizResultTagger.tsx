"use client";

import { useEffect } from "react";
import { addCampaignTags } from "@/lib/campaigns";
import { getEmailFromLS } from "@/lib/tracking/localEmail";

const typeToProfileTag: Record<string, string> = {
	brokenHeartStorm: "q_pf_over",
	lonelyHopeLoop: "q_pf_drift",
	silentBreakupRelationship: "q_pf_karmic",
	endlessWaitingRoom: "q_pf_proj",
};

export default function QuizResultTagger({ type }: { type: string }) {
	useEffect(() => {
		const profileTag = typeToProfileTag[type];
		if (!profileTag) return;

		const email = getEmailFromLS();
		if (!email) return;

		(async () => {
			await addCampaignTags(email, ["q_done", profileTag]);
		})();
	}, [type]);

	return null;
}
