export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

const FIRST_KEY = "ff_utm_first";
const LAST_KEY = "ff_utm_last";
const LANDING_KEY = "ff_landing_page";

// legacy keys
const LEGACY_FIRST_KEY = "utm_first";
const LEGACY_LAST_KEY = "utm_last";

function clean(v: string | null | undefined): string | null {
  const s = (v ?? "").trim();
  return s ? s : null;
}

function readUTMFromUrl(): UTMParams | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);

  const utm: UTMParams = {};
  const source = clean(params.get("utm_source"));
  const medium = clean(params.get("utm_medium"));
  const campaign = clean(params.get("utm_campaign"));
  const content = clean(params.get("utm_content"));
  const term = clean(params.get("utm_term"));

  if (source) utm.utm_source = source;
  if (medium) utm.utm_medium = medium;
  if (campaign) utm.utm_campaign = campaign;
  if (content) utm.utm_content = content;
  if (term) utm.utm_term = term;

  return Object.keys(utm).length ? utm : null;
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function migrateLegacyUTMIfNeeded(): void {
  if (typeof window === "undefined") return;

  try {
    const hasNewFirst = !!localStorage.getItem(FIRST_KEY);
    const hasNewLast = !!localStorage.getItem(LAST_KEY);

    if (!hasNewFirst) {
      const legacyFirst = safeParse<UTMParams>(localStorage.getItem(LEGACY_FIRST_KEY));
      if (legacyFirst) localStorage.setItem(FIRST_KEY, JSON.stringify(legacyFirst));
    }

    if (!hasNewLast) {
      const legacyLast = safeParse<UTMParams>(localStorage.getItem(LEGACY_LAST_KEY));
      if (legacyLast) localStorage.setItem(LAST_KEY, JSON.stringify(legacyLast));
    }
  } catch {
    // ignore
  }
}

function ensureLandingStored(): void {
  if (typeof window === "undefined") return;

  try {
    const existing = localStorage.getItem(LANDING_KEY);
    if (existing && existing.trim()) return;

    const landing = `${window.location.origin}${window.location.pathname}${window.location.search}`;
    localStorage.setItem(LANDING_KEY, landing);
  } catch {
    // ignore
  }
}

export function captureUTM(): { first?: UTMParams; last?: UTMParams } {
  if (typeof window === "undefined") return {};

  migrateLegacyUTMIfNeeded();

  ensureLandingStored();

  const utm = readUTMFromUrl();
  if (!utm) return {};

  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(utm));

    const existingFirst = localStorage.getItem(FIRST_KEY);
    if (!existingFirst) {
      localStorage.setItem(FIRST_KEY, JSON.stringify(utm));
      return { first: utm, last: utm };
    }

    return { last: utm };
  } catch {
    return {};
  }
}

export function getStoredFirstUTM(): UTMParams | null {
  if (typeof window === "undefined") return null;
  migrateLegacyUTMIfNeeded();
  return safeParse<UTMParams>(localStorage.getItem(FIRST_KEY));
}

export function getStoredLastUTM(): UTMParams | null {
  if (typeof window === "undefined") return null;
  migrateLegacyUTMIfNeeded();
  return safeParse<UTMParams>(localStorage.getItem(LAST_KEY));
}

export function getStoredLandingPage(): string | null {
  if (typeof window === "undefined") return null;
  ensureLandingStored();
  const v = localStorage.getItem(LANDING_KEY);
  return clean(v);
}

export function clearStoredUTM(opts?: { clearLegacy?: boolean }): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(FIRST_KEY);
    localStorage.removeItem(LAST_KEY);
    localStorage.removeItem(LANDING_KEY);

    if (opts?.clearLegacy) {
      localStorage.removeItem(LEGACY_FIRST_KEY);
      localStorage.removeItem(LEGACY_LAST_KEY);
    }
  } catch {
    // ignore
  }
}
