// src/lib/tracking/clientTracker.ts
"use client";

import { api } from "@/lib/api";

type UTM = {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
};

const LS_SESSION = "ff_session_id";
const LS_UTM_FIRST = "ff_utm_first";
const LS_UTM_LAST = "ff_utm_last";
const LS_LANDING = "ff_landing_page";

function nowIso(): string {
  return new Date().toISOString();
}

function randomId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function clean(v: string | null): string | null {
  const s = (v ?? "").trim();
  return s ? s : null;
}

function getUTMFromUrl(url: URL): UTM {
  return {
    utm_source: clean(url.searchParams.get("utm_source")),
    utm_medium: clean(url.searchParams.get("utm_medium")),
    utm_campaign: clean(url.searchParams.get("utm_campaign")),
    utm_content: clean(url.searchParams.get("utm_content")),
    utm_term: clean(url.searchParams.get("utm_term")),
  };
}

function loadJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(LS_SESSION);
    if (existing && existing.trim()) return existing.trim();

    const sid = randomId("sid");
    localStorage.setItem(LS_SESSION, sid);
    return sid;
  } catch {
    return randomId("sid");
  }
}

export function upsertUtmAndLanding(currentPath: string): {
  landing_page: string | null;
  utm_first: UTM;
  utm_last: UTM;
} {
  const url = new URL(currentPath, window.location.origin);

  let landing = clean(loadJson<string>(LS_LANDING) ?? null);
  if (!landing) {
    landing = `${url.origin}${url.pathname}${url.search}`;
    saveJson(LS_LANDING, landing);
  }

  const utmFromUrl = getUTMFromUrl(url);

  const first = loadJson<UTM>(LS_UTM_FIRST) ?? {};
  const hasAnyUtm =
    !!utmFromUrl.utm_source ||
    !!utmFromUrl.utm_medium ||
    !!utmFromUrl.utm_campaign ||
    !!utmFromUrl.utm_content ||
    !!utmFromUrl.utm_term;

  if (hasAnyUtm) {
    // first-touch: only fill missing
    const nextFirst: UTM = {
      utm_source: first.utm_source ?? utmFromUrl.utm_source ?? null,
      utm_medium: first.utm_medium ?? utmFromUrl.utm_medium ?? null,
      utm_campaign: first.utm_campaign ?? utmFromUrl.utm_campaign ?? null,
      utm_content: first.utm_content ?? utmFromUrl.utm_content ?? null,
      utm_term: first.utm_term ?? utmFromUrl.utm_term ?? null,
    };

    saveJson(LS_UTM_FIRST, nextFirst);
    // last-touch: overwrite when utm exists in url
    saveJson(LS_UTM_LAST, utmFromUrl);
  }

  const utm_first = loadJson<UTM>(LS_UTM_FIRST) ?? {};
  const utm_last = loadJson<UTM>(LS_UTM_LAST) ?? {};

  return { landing_page: landing, utm_first, utm_last };
}

function getScrollDepthPct(): number {
  const doc = document.documentElement;
  const body = document.body;

  const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
  const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
  const clientHeight = doc.clientHeight || window.innerHeight;

  const maxScroll = Math.max(scrollHeight - clientHeight, 1);
  const pct = Math.round((scrollTop / maxScroll) * 100);
  return Math.min(100, Math.max(0, pct));
}

function getSiteHost(): string {
  return window.location.host.toLowerCase().split(":")[0] || "unknown";
}

type EventName = "page_view" | "page_engaged";
type FunnelStep = "engagement";

type CommonContext = {
  session_id: string;
  site: string;
  landing_page: string | null;
  page_path: string;

  utm_first_source: string | null;
  utm_first_medium: string | null;
  utm_first_campaign: string | null;
  utm_first_content: string | null;
  utm_first_term: string | null;

  utm_last_source: string | null;
  utm_last_medium: string | null;
  utm_last_campaign: string | null;
  utm_last_content: string | null;
  utm_last_term: string | null;

  chat_opened: null;

  email: null;
  intent_token: null;
  payment_intent_id: null;
};

type PageEventPayload = CommonContext & {
  event_id: string;
  event_time: string;
  source: "web:client";
  event_name: EventName;
  funnel_step: FunnelStep;
  scroll_depth: number | null;
  time_on_page_sec: number | null;
};

let detachPrevListeners: (() => void) | null = null;

let lastPageViewKey: string | null = null;
let lastPageViewTs = 0;

export async function trackPageView(): Promise<void> {
  const currentKey = `${window.location.pathname}?${window.location.search}`;
  const now = Date.now();
  if (lastPageViewKey === currentKey && now - lastPageViewTs < 800) return;
  lastPageViewKey = currentKey;
  lastPageViewTs = now;

  if (detachPrevListeners) {
    detachPrevListeners();
    detachPrevListeners = null;
  }

  const session_id = getOrCreateSessionId();
  const site = getSiteHost();
  const page_path = window.location.pathname;

  const { landing_page, utm_first, utm_last } = upsertUtmAndLanding(
    `${window.location.pathname}${window.location.search}`,
  );

  const startedAt = Date.now();

  const ctx: CommonContext = {
    session_id,
    site,
    landing_page,
    page_path,

    utm_first_source: utm_first.utm_source ?? null,
    utm_first_medium: utm_first.utm_medium ?? null,
    utm_first_campaign: utm_first.utm_campaign ?? null,
    utm_first_content: utm_first.utm_content ?? null,
    utm_first_term: utm_first.utm_term ?? null,

    utm_last_source: utm_last.utm_source ?? null,
    utm_last_medium: utm_last.utm_medium ?? null,
    utm_last_campaign: utm_last.utm_campaign ?? null,
    utm_last_content: utm_last.utm_content ?? null,
    utm_last_term: utm_last.utm_term ?? null,

    chat_opened: null,

    email: null,
    intent_token: null,
    payment_intent_id: null,
  };

  let engagedSent = false;

  const emitEngagedOnce = () => {
    if (engagedSent) return;
    engagedSent = true;

    const timeOnPageSec = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
    const scrollDepth = getScrollDepthPct();

    const payload: PageEventPayload = {
      ...ctx,
      event_id: `${session_id}:${Date.now()}:page_engaged`,
      event_time: nowIso(),
      source: "web:client",
      event_name: "page_engaged",
      funnel_step: "engagement",
      scroll_depth: scrollDepth,
      time_on_page_sec: timeOnPageSec,
    };

    try {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/event-log", blob);
    } catch {
      // ignore
    }
  };

  const onBeforeUnload = () => emitEngagedOnce();
  const onPageHide = () => emitEngagedOnce();
  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") emitEngagedOnce();
  };

  window.addEventListener("beforeunload", onBeforeUnload);
  window.addEventListener("pagehide", onPageHide);
  document.addEventListener("visibilitychange", onVisibilityChange);

  detachPrevListeners = () => {
    window.removeEventListener("beforeunload", onBeforeUnload);
    window.removeEventListener("pagehide", onPageHide);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };

  // page_view
  const pageViewPayload: PageEventPayload = {
    ...ctx,
    event_id: `${session_id}:${Date.now()}:page_view`,
    event_time: nowIso(),
    source: "web:client",
    event_name: "page_view",
    funnel_step: "engagement",
    scroll_depth: 0,
    time_on_page_sec: 0,
  };

  await api.post("/api/event-log", pageViewPayload).catch(() => null);
}
