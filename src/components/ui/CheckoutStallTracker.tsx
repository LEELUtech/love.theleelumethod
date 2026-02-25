"use client";

import { useEffect } from "react";
import { startCheckoutStallTracker } from "@/lib/tracking/checkoutStallTracker";

export default function CheckoutStallTracker() {
  useEffect(() => {
    const stop = startCheckoutStallTracker({ stallAfterSec: 180, debug: false });
    return () => stop();
  }, []);

  return null;
}
