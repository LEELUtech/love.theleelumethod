"use client";
import { useEffect } from "react";
import { getEmailFromLS } from "@/lib/tracking/localEmail";
import { updateCampaignTags } from "@/lib/campaigns";

export default function SalesPageTagger({ product }: { product?: string }) {
  useEffect(() => {
    const email = getEmailFromLS();
    if (!email) return;

    (async () => {

      await updateCampaignTags(email, { add: ["sp_view"] });
 
    })();
  }, [product]);

  return null;
}
