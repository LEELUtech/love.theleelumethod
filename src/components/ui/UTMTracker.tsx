"use client";

import { useEffect } from "react";
import { captureUTM } from "@/utils/utm-tracker";

/**
 * Client component that captures UTM parameters on mount
 * Can be used in server layout without making entire app client-side
 */
export default function UTMTracker() {
  useEffect(() => {
    // Capture UTM params from URL on first page load
    const utm = captureUTM();
    
  }, []);

  return null; 
}
