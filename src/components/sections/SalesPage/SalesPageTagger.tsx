"use client";
import { useEffect } from "react";
import { getEmailFromLS } from "@/lib/tracking/localEmail";
import { updateCampaignTags } from "@/lib/campaigns";

type Props = {
  product?: string;
  scoringEvent?: "sales_page_visited" | "pricing_page_visited";
  campaignTag?: string;
};

export default function SalesPageTagger({
  product,
  scoringEvent = "sales_page_visited",
  campaignTag = "sp_view",
}: Props) {
  useEffect(() => {
    const email = getEmailFromLS();
    if (!email) return;

    Promise.allSettled([
      updateCampaignTags(email, { add: [campaignTag] }),
      fetch("/api/score-crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, event: scoringEvent }),
      }),
    ]);
  }, [product, scoringEvent, campaignTag]);

  return null;
}
