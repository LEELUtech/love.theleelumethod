"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/tracking/clientTracker";

export default function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = useMemo(() => searchParams?.toString() ?? "", [searchParams]);

  useEffect(() => {
    trackPageView().catch(() => null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  return null;
}
