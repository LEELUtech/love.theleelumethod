import { useCallback } from "react";
import { getProgramVideoUrl, sendPersonalizedEmail } from "@/lib/firebaseFunctions";

export function useFreeReport() {
  const handleFreeReport = useCallback(async ({ dateOfBirth, email }: { dateOfBirth: Date | null; email: string }) => {
    const videoUrl = await getProgramVideoUrl(dateOfBirth);
    const webinarUrl = "https://leelutech.ewebinar.com/webinar/decoded-love-22610";
    await sendPersonalizedEmail({
      to: email,
      videoUrl,
      webinarUrl,
    });
  }, []);

  return { handleFreeReport };
}
