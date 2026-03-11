import axios, { AxiosRequestConfig } from "axios";
import { configs } from "../configs/env";
import { ensureCRMContact } from "./zoho-crm";

// ─── Scoring field API names ──────────────────────────────────────────────────

const SCORING_FIELDS = {
  Lead_Magnet_Downloaded: "Lead_Magnet_Downloaded",
  Quiz_Completed: "Quiz_Completed",
  Compatibility_Code_Purchased: "Compatibility_Code_Purchased",
  Webinar_Registered: "Webinar_Registered",
  Webinar_Attended_Live: "Webinar_Attended_Live",
  Webinar_Attended_Replay: "Webinar_Attended_Replay",
} as const;

// ─── OAuth (separate cache from zoho-crm.ts) ─────────────────────────────────

let _token: string | null = null;
let _tokenExp = 0;

async function getToken(): Promise<string> {
  if (_token && Date.now() < _tokenExp) return _token;

  const url = `https://${configs.zohoAccountsDomain}/oauth/v2/token`;
  const res = await axios.post(url, null, {
    params: {
      refresh_token: configs.zohoRefreshCRMToken,
      client_id: configs.zohoClientId,
      client_secret: configs.zohoClientSecret,
      grant_type: "refresh_token",
    },
    timeout: 15000,
  });

  const token = res.data?.access_token as string | undefined;
  const expiresIn = Number(res.data?.expires_in ?? 0);
  if (!token || !expiresIn) {
    throw new Error(`[zoho-scoring] token refresh failed: ${JSON.stringify(res.data)}`);
  }

  _token = token;
  _tokenExp = Date.now() + expiresIn * 1000 - 60_000;
  return _token;
}

// ─── Low-level helpers ────────────────────────────────────────────────────────

async function findContactId(email: string): Promise<string | null> {
  const token = await getToken();
  const criteria = encodeURIComponent(`(Email:equals:${email})`);
  const url = `https://${configs.zohoApiCRMDomain}/crm/v2/Contacts/search?criteria=${criteria}`;

  try {
    const res = await axios.get<any>(url, {
      timeout: 15000,
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    });
    return (res.data?.data?.[0]?.id as string | undefined) ?? null;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 204 || status === 404) return null;
    }
    throw err;
  }
}

async function patchContact(id: string, fields: Record<string, unknown>): Promise<void> {
  const token = await getToken();
  const config: AxiosRequestConfig = {
    method: "PUT",
    url: `https://${configs.zohoApiCRMDomain}/crm/v2/Contacts`,
    timeout: 15000,
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
    data: { data: [{ id, ...fields }] },
  };
  await axios.request(config);
}

// ─── Core: set one or more boolean fields to true ────────────────────────────

async function setFields(email: string, fields: Record<string, true>): Promise<void> {
  const id = await findContactId(email);
  if (!id) {
    console.warn("[zoho-scoring] contact not found, skipping", { email, fields: Object.keys(fields) });
    return;
  }
  await patchContact(id, fields);
  console.log("[zoho-scoring] fields set", { email, fields: Object.keys(fields) });
}

async function setFieldsOrCreate(
  email: string,
  fields: Record<string, true>,
  meta?: { firstName?: string; lastName?: string },
): Promise<void> {
  let id = await findContactId(email);
  if (!id) {
    id = await ensureCRMContact(email, meta);
  }
  await patchContact(id, fields);
  console.log("[zoho-scoring] fields set", { email, fields: Object.keys(fields) });
}

// ─── Public helpers ───────────────────────────────────────────────────────────

/** Call when user downloads the lead magnet. */
export async function markLeadMagnetDownloaded(email: string): Promise<void> {
  await setFields(email, { [SCORING_FIELDS.Lead_Magnet_Downloaded]: true });
}

/** Call when user completes the compatibility quiz. */
export async function markQuizCompleted(email: string): Promise<void> {
  await setFields(email, { [SCORING_FIELDS.Quiz_Completed]: true });
}

/** Call when user purchases the compatibility_report product. */
export async function markCompatibilityCodePurchased(email: string): Promise<void> {
  await setFields(email, { [SCORING_FIELDS.Compatibility_Code_Purchased]: true });
}

/** Call when user registers for a webinar. Creates CRM contact if it doesn't exist yet. */
export async function markWebinarRegistered(
  email: string,
  meta?: { firstName?: string; lastName?: string },
): Promise<void> {
  await setFieldsOrCreate(email, { [SCORING_FIELDS.Webinar_Registered]: true }, meta);
}

/** Call when user watched the live webinar (≥80%). */
export async function markWebinarAttendedLive(email: string): Promise<void> {
  await setFields(email, { [SCORING_FIELDS.Webinar_Attended_Live]: true });
}

/** Call when user watched the webinar replay (≥80%). */
export async function markWebinarAttendedReplay(email: string): Promise<void> {
  await setFields(email, { [SCORING_FIELDS.Webinar_Attended_Replay]: true });
}

/** Save compatibility state (Battle/Truce/Victory/Revolution/Absorption) to CRM contact. */
export async function setCompatState(email: string, state: string): Promise<void> {
  const id = await findContactId(email);
  if (!id) {
    console.warn("[zoho-scoring] contact not found for setCompatState", { email });
    return;
  }
  await patchContact(id, { Compat_State: state });
  console.log("[zoho-scoring] Compat_State set", { email, state });
}
