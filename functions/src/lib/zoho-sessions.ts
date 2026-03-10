// lib/zoho-sessions.ts
// CRM helpers for 1:1 Diagnostic Session purchases (Calendly + Stripe)
import axios, { AxiosRequestConfig } from "axios";
import { configs } from "../configs/env";

export type SessionPackageTier = "single" | "three_session" | "nine_session";

// ─── OAuth (own cache, separate from zoho-crm.ts / zoho-scoring.ts) ──────────

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

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * Called when a Calendly booking is confirmed (payment successful).
 * Sets Session_Purchased = true, Package_Tier_Purchased, and optional extra fields
 * (e.g. Calendly_Event_UUID, Last_Session_Booked_At).
 */
export async function markSessionPurchased(
  email: string,
  packageTier: SessionPackageTier,
  extraFields?: Record<string, unknown>,
): Promise<void> {
  const id = await findContactId(email);
  if (!id) {
    console.warn("[zoho-sessions] contact not found, skipping", { email, packageTier });
    return;
  }

  await patchContact(id, {
    Session_Purchased: true,
    Session_Tier_Purchased: packageTier,
    Last_Session_Booked_At: new Date().toISOString(),
    ...extraFields,
  });

  console.log("[zoho-sessions] session purchased set", { email, packageTier });
}

/**
 * Called when a Trust Temple session is booked or canceled via Calendly.
 */
export async function markTrustTempleBooked(email: string, booked: boolean): Promise<void> {
  const id = await findContactId(email);
  if (!id) {
    console.warn("[zoho-sessions] contact not found for trust temple, skipping", { email });
    return;
  }

  await patchContact(id, { Trust_Temple_Booked: booked });
  console.log("[zoho-sessions] trust temple booked set", { email, booked });
}

/**
 * Called when a Calendly booking is canceled.
 * Clears Session_Purchased and Package_Tier_Purchased.
 */
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
