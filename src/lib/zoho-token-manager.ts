import axios from "axios";

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;

function assertSandboxZohoEnv() {
  if (!process.env.ZOHO_CLIENT_ID_LILYCHYSTOFAT)
    throw new Error("ZOHO_CLIENT_ID_LILYCHYSTOFAT missing");

  if (!process.env.ZOHO_CLIENT_SECRET_LILYCHYSTOFAT)
    throw new Error("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT missing");

  if (!process.env.ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT)
    throw new Error("ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT missing");

  if (!process.env.ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT)
    throw new Error("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT missing");

  if (!process.env.ZOHO_API_DOMAIN_LILYCHYSTOFAT)
    throw new Error("ZOHO_API_DOMAIN_LILYCHYSTOFAT missing");
}

async function refreshSandboxAccessToken(): Promise<string> {
  console.log("[zoho-token] refreshSandboxAccessToken start");
  console.log("[zoho-token] env check", {
    hasClientId: !!process.env.ZOHO_CLIENT_ID_LILYCHYSTOFAT,
    hasClientSecret: !!process.env.ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
    hasRefreshToken: !!process.env.ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT,
    accountsDomain: process.env.ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT,
    apiDomain: process.env.ZOHO_API_DOMAIN_LILYCHYSTOFAT,
  });

  assertSandboxZohoEnv();

  const url = `https://${process.env.ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT}/oauth/v2/token`;
  console.log("[zoho-token] requesting token from", url);

  const res = await axios.post(url, null, {
    params: {
      refresh_token: process.env.ZOHO_REFRESH_TOKEN_CRM_LILYCHYSTOFAT,
      client_id: process.env.ZOHO_CLIENT_ID_LILYCHYSTOFAT,
      client_secret: process.env.ZOHO_CLIENT_SECRET_LILYCHYSTOFAT,
      grant_type: "refresh_token",
    },
    timeout: 15_000,
  });

  console.log("[zoho-token] token response", { status: res.status, data: res.data });

  const accessToken = res.data?.access_token as string | undefined;
  const expiresInSec = Number(res.data?.expires_in ?? 0);

  if (!accessToken || !expiresInSec) {
    throw new Error(
      `Failed to refresh Zoho access token: ${JSON.stringify(res.data)}`,
    );
  }

  // Refresh token early (60 seconds before expiry)
  cachedAccessToken = accessToken;
  cachedAccessTokenExpiresAt = Date.now() + expiresInSec * 1000 - 60_000;

  console.log("[zoho-token] token refreshed successfully, expires in", expiresInSec, "sec");
  return accessToken;
}

export async function getValidSandboxAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt) {
    return cachedAccessToken;
  }

  return refreshSandboxAccessToken();
}
