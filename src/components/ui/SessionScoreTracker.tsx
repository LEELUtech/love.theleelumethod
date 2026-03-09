"use client";

import { useEffect, useRef } from "react";

const MIN_SESSION_SEC = 120; // 2 minutes

function getEmail(): string | null {
  try {
    const v = localStorage.getItem("ff_email");
    return v && v.trim() ? v.trim().toLowerCase() : null;
  } catch {
    return null;
  }
}

export default function SessionScoreTracker() {
  const startRef = useRef<number>(0);
  const firedRef = useRef<boolean>(false);

  useEffect(() => {
    startRef.current = Date.now();
    firedRef.current = false;

    function tryScore() {
      if (firedRef.current) return;
      const elapsed = (Date.now() - startRef.current) / 1000;
      if (elapsed < MIN_SESSION_SEC) return;

      const email = getEmail();
      if (!email) return;

      firedRef.current = true;
      fetch("/api/score-crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ email, event: "session_completed" }),
      }).catch(() => {});
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") tryScore();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", tryScore);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", tryScore);
    };
  }, []);

  return null;
}
