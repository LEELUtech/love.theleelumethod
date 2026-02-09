/**
 * UTM Tracking Utility
 * Captures and stores UTM parameters for Zoho CRM attribution
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export function captureUTM(): UTMParams | null {
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

  if (Object.keys(utm).length === 0) return null;

  // ✅ first-touch: не перетираем существующее
  const existing = window.localStorage.getItem("utm_params");
  if (!existing) {
    window.localStorage.setItem("utm_params", JSON.stringify(utm));
  }

  return utm;
}

export function getStoredUTM(): UTMParams | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem("utm_params");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UTMParams;
  } catch {
    return null;
  }
}

/**
 * Clear stored UTM params from sessionStorage
 */
export function clearStoredUTM(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("utm_params");
}
