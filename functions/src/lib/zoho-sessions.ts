// lib/zoho-sessions.ts
// CRM helpers for 1:1 Diagnostic Session purchases (Calendly + Stripe)
import axios, { AxiosRequestConfig } from "axios";
import { configs } from "../configs/env";
import { ensureCRMContact } from "./zoho-crm";

export type SessionPackageTier = "single" | "three_session" | "nine_session";


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
    throw new Error(`[zoho-sessions] token refresh failed: ${JSON.stringify(res.data)}`);
  }

  _token = token;
  _tokenExp = Date.now() + expiresIn * 1000 - 60_000;
  return _token;
}


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


export async function markSessionPurchased(
  email: string,
  packageTier: SessionPackageTier,
  extraFields?: Record<string, unknown>,
  meta?: { firstName?: string; lastName?: string },
): Promise<void> {
  const id = await ensureCRMContact(email, meta);

  await patchContact(id, {
    Session_Purchased: true,
    Session_Tier_Purchased: packageTier,
    Last_Session_Booked_At: new Date().toISOString(),
    ...extraFields,
  });

  console.log("[zoho-sessions] session purchased set", { email, packageTier });
}

export async function markTrustTempleBooked(
  email: string,
  booked: boolean,
  meta?: { firstName?: string; lastName?: string },
): Promise<void> {
  const id = booked
    ? await ensureCRMContact(email, meta)
    : await findContactId(email);
  if (!id) {
    console.warn("[zoho-sessions] contact not found for trust temple cancel, skipping", { email });
    return;
  }

  await patchContact(id, { Trust_Temple_Booked: booked });
  console.log("[zoho-sessions] trust temple booked set", { email, booked });
}

export async function markTrustTempleCompleted(email: string): Promise<void> {
  const id = await findContactId(email);
  if (!id) {
    console.warn("[zoho-sessions] contact not found for trust temple completed, skipping", { email });
    return;
  }

  await patchContact(id, { Trust_Temple_Completed: true });
  console.log("[zoho-sessions] trust temple completed set", { email });
}

export async function incrementDiagnosticSessions(email: string): Promise<number> {
  const token = await getToken();
  const id = await findContactId(email);
  if (!id) {
    console.warn("[zoho-sessions] contact not found for incrementDiagnosticSessions, skipping", { email });
    return 0;
  }

  const res = await axios.get<{ data?: Array<{ Diagnostic_Sessions_Completed?: unknown }> }>(
    `https://${configs.zohoApiCRMDomain}/crm/v2/Contacts/${id}`,
    { timeout: 15000, headers: { Authorization: `Zoho-oauthtoken ${token}` } },
  );
  const current = Number(res.data?.data?.[0]?.Diagnostic_Sessions_Completed ?? 0);
  const next = current + 1;

  await patchContact(id, { Diagnostic_Sessions_Completed: next });
  console.log("[zoho-sessions] diagnostic sessions incremented", { email, from: current, to: next });
  return next;
}

export async function markSessionCanceled(email: string): Promise<void> {
  const id = await findContactId(email);
  if (!id) {
    console.warn("[zoho-sessions] contact not found for cancel, skipping", { email });
    return;
  }

  await patchContact(id, {
    Session_Purchased: false,
    Session_Tier_Purchased: "",
  });

  console.log("[zoho-sessions] session canceled", { email });
}
