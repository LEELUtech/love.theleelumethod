"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/tracking/clientTracker";
import { PAGE_LABELS } from "@/utils/pageLabels";

declare global {
  interface Window {
    $zoho?: { salesiq?: { visitor?: { info?: (fields: Record<string, string>) => void } } };
    ZohoSalesIQ?: { visitor?: { info?: (fields: Record<string, string>) => void } };
  }
}

function salesiqTrackPage(pathname: string) {
  try {
    const siq = window.$zoho?.salesiq || window.ZohoSalesIQ;
    if (!siq?.visitor?.info) return;
    siq.visitor.info({
      Current_Page: PAGE_LABELS[pathname] ?? pathname,
      Page_Path: pathname,
    });
  } catch {
    // best-effort
  }
}

export default function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = useMemo(() => searchParams?.toString() ?? "", [searchParams]);

  useEffect(() => {
    trackPageView().catch(() => null);
    salesiqTrackPage(pathname ?? "/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  return null;
}
