"use client";

import { useEffect } from "react";
import { captureUTM } from "@/utils/utm-tracker";

export default function UTMTracker() {
  useEffect(() => {
    const utm = captureUTM();
    
  }, []);

  return null; 
}
