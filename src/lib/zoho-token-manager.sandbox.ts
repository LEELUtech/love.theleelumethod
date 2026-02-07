import axios from "axios";

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;

function assertSandboxZohoEnv() {
  if (!process.env.ZOHO_CLIENT_ID_SANDBOX)
    throw new Error("ZOHO_CLIENT_ID_SANDBOX missing");

  if (!process.env.ZOHO_CLIENT_SECRET_SANDBOX)
    throw new Error("ZOHO_CLIENT_SECRET_SANDBOX missing");

  if (!process.env.ZOHO_REFRESH_TOKEN_SANDBOX)
    throw new Error("ZOHO_REFRESH_TOKEN_SANDBOX missing");

  if (!process.env.ZOHO_ACCOUNTS_DOMAIN_SANDBOX)
    throw new Error("ZOHO_ACCOUNTS_DOMAIN_SANDBOX missing");

  if (!process.env.ZOHO_API_DOMAIN_SANDBOX)
    throw new Error("ZOHO_API_DOMAIN_SANDBOX missing");

  // 🔒 hard safety: sandbox only
  if (process.env.ZOHO_API_DOMAIN_SANDBOX !== "sandbox.zohoapis.com") {
    throw new Error(
      `Zoho API domain must be sandbox. Got: ${process.env.ZOHO_API_DOMAIN_SANDBOX}`,
    );
  }
}

async function refreshSandboxAccessToken(): Promise<string> {
  assertSandboxZohoEnv();

  const url = `https://${process.env.ZOHO_ACCOUNTS_DOMAIN_SANDBOX}/oauth/v2/token`;

  const res = await axios.post(url, null, {
    params: {
      refresh_token: process.env.ZOHO_REFRESH_TOKEN_SANDBOX,
      client_id: process.env.ZOHO_CLIENT_ID_SANDBOX,
      client_secret: process.env.ZOHO_CLIENT_SECRET_SANDBOX,
      grant_type: "refresh_token",
    },
    timeout: 15_000,
  });

  const accessToken = res.data?.access_token as string | undefined;
  const expiresInSec = Number(res.data?.expires_in ?? 0);

  if (!accessToken || !expiresInSec) {
    throw new Error(
      `Failed to refresh Zoho access token: ${JSON.stringify(res.data)}`,
    );
  }

  // обновляем токен заранее (на 60 сек раньше)
  cachedAccessToken = accessToken;
  cachedAccessTokenExpiresAt = Date.now() + expiresInSec * 1000 - 60_000;

  return accessToken;
}

export async function getValidSandboxAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt) {
    return cachedAccessToken;
  }

  return refreshSandboxAccessToken();
}
