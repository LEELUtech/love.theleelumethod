"use client";

import { useEffect, useState } from "react";

// Hook for detecting device type and viewport dimensions
export default function useMediaQuery() {
  const [device, setDevice] = useState<
    "mobile" | "tablet" | "mdTablet" | "desktop" | null
  >(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      if (window.matchMedia("(max-width: 640px)").matches) {
        setDevice("mobile");
      } else if (
        window.matchMedia("(min-width: 641px) and (max-width: 767px)").matches
      ) {
        setDevice("tablet");
      } else if (
        window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches
      ) {
        setDevice("mdTablet");
      } else {
        setDevice("desktop");
      }
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    // Initial detection
    checkDevice();

    // Listen for viewport changes
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return {
    device,
    width: dimensions?.width,
    height: dimensions?.height,
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isMdTablet: device === "mdTablet",
    isDesktop: device === "desktop",
  };
}
