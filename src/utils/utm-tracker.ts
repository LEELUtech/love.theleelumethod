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

/**
 * Capture UTM params from URL on page load
 * Stores in sessionStorage for use during checkout
 * 
 * @returns UTMParams object if UTM params found, null otherwise
 */
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

  // Only store if at least one UTM param exists
  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem("utm_params", JSON.stringify(utm));
    return utm;
  }

  return null;
}

/**
 * Get stored UTM params from sessionStorage
 * 
 * @returns Stored UTM params or null if none found
 */
export function getStoredUTM(): UTMParams | null {
  if (typeof window === "undefined") return null;
  
  const stored = sessionStorage.getItem("utm_params");
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
