"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { startEngagementTracking } from "@/lib/tracking/engagementTracker";

export default function EngagementTracker() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const stop = startEngagementTracking({
      debug: false,
      scrollThresholds: [25, 50, 75, 90],
      timeThresholdsSec: [10, 30, 60, 120],
    });

    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search?.toString()]);

  return null;
}
