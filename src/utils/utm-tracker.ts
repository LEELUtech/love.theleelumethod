export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

const FIRST_KEY = "utm_first";
const LAST_KEY = "utm_last";

function readUTMFromUrl(): UTMParams | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);

  const utm: UTMParams = {};
  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  const content = params.get("utm_content");
  const term = params.get("utm_term");

  if (source) utm.utm_source = source;
  if (medium) utm.utm_medium = medium;
  if (campaign) utm.utm_campaign = campaign;
  if (content) utm.utm_content = content;
  if (term) utm.utm_term = term;

  return Object.keys(utm).length ? utm : null;
}

/**
 * Capture UTM:
 * - first-touch: store once
 * - last-touch: always overwrite when UTM exists in URL
 */
export function captureUTM(): { first?: UTMParams; last?: UTMParams } {
  const utm = readUTMFromUrl();
  if (!utm) return {};

  // last-touch always updated
  localStorage.setItem(LAST_KEY, JSON.stringify(utm));

  // first-touch only if missing
  const existingFirst = localStorage.getItem(FIRST_KEY);
  if (!existingFirst) {
    localStorage.setItem(FIRST_KEY, JSON.stringify(utm));
  }

  return {
    first: existingFirst ? undefined : utm,
    last: utm,
  };
}

export function getStoredFirstUTM(): UTMParams | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(FIRST_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UTMParams;
  } catch {
    return null;
  }
}

export function getStoredLastUTM(): UTMParams | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(LAST_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UTMParams;
  } catch {
    return null;
  }
}

/** Clear both */
export function clearStoredUTM(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(FIRST_KEY);
  localStorage.removeItem(LAST_KEY);
}
