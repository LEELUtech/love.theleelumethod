import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// ----------------------------------------------------
// Types
// ----------------------------------------------------

type Primitive = string | number | boolean | null | undefined;

export type SalesIQMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface SalesIQRequestArgs<TData extends Record<string, unknown> | undefined> {
  method: SalesIQMethod;
  path: string;
  params?: Record<string, Primitive>;
  data?: TData;
  requestId?: string;
}

interface ZohoOAuthResponse {
  access_token?: string;
  expires_in?: number;
}

// ----------------------------------------------------
// helpers
// ----------------------------------------------------

function env(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

function safePreview(obj: unknown, max = 1600): string {
  try {
    const s = JSON.stringify(obj);
    return s.length > max ? `${s.slice(0, max)}…(truncated)` : s;
  } catch {
    return String(obj);
  }
}

function errToMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const status = e.response?.status;
    const data = e.response?.data;
    if (status) {
      return `HTTP ${status}: ${safePreview(data)}`;
    }
    return e.message;
  }

  if (e instanceof Error) return e.message;

  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

function isZohoInvalidToken(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false;

  const status = err.response?.status;
  const data = err.response?.data as Record<string, unknown> | undefined;

  const code =
    typeof data?.code === "string"
      ? data.code
      : typeof data?.error === "string"
      ? data.error
      : typeof data?.errorCode === "string"
      ? data.errorCode
      : undefined;

  return status === 401 || code === "INVALID_TOKEN" || code === "AUTHENTICATION_FAILURE";
}

// ----------------------------------------------------
// OAuth cache
// ----------------------------------------------------

let cachedToken: string | null = null;
let cachedTokenExp = 0;

function clearTokenCache(): void {
  cachedToken = null;
  cachedTokenExp = 0;
}

// ----------------------------------------------------
// OAuth refresh
// ----------------------------------------------------

async function refreshSalesIQAccessToken(): Promise<string> {
  const accountsDomain = env("ZOHO_ACCOUNTS_DOMAIN_LILYCHYSTOFAT");
  const clientId = env("ZOHO_CLIENT_ID_LILYCHYSTOFAT");
  const clientSecret = env("ZOHO_CLIENT_SECRET_LILYCHYSTOFAT");
  const refreshToken = env("ZOHO_REFRESH_TOKEN_SALESIQ_LILYCHYSTOFAT");

  const url = `https://${accountsDomain}/oauth/v2/token`;

  const res: AxiosResponse<ZohoOAuthResponse> = await axios.post(
    url,
    null,
    {
      params: {
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
      },
      timeout: 15000,
      validateStatus: () => true,
    },
  );

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Zoho token refresh failed: ${safePreview(res.data, 2000)}`);
  }

  const accessToken = res.data.access_token;
  const expiresIn = Number(res.data.expires_in ?? 0);

  if (!accessToken || !expiresIn) {
    throw new Error(`Zoho token refresh invalid response: ${safePreview(res.data, 2000)}`);
  }

  cachedToken = accessToken;
  cachedTokenExp = Date.now() + expiresIn * 1000 - 60_000;

  return accessToken;
}

async function getSalesIQAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedTokenExp) {
    return cachedToken;
  }
  return refreshSalesIQAccessToken();
}

// ----------------------------------------------------
// Main Request Helper
// ----------------------------------------------------

export async function salesIQRequest<
  TResponse = unknown,
  TData extends Record<string, unknown> | undefined = undefined
>(
  args: SalesIQRequestArgs<TData>,
): Promise<TResponse> {
  const apiDomain = env("ZOHO_SALESIQ_API_DOMAIN");
  const url = `https://${apiDomain}${args.path}`;

  const doRequest = async (token: string): Promise<TResponse> => {
    const config: AxiosRequestConfig = {
      method: args.method,
      url,
      params: args.params,
      data: args.data,
      timeout: 20000,
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
      },
      validateStatus: () => true,
    };

    const res: AxiosResponse<TResponse> = await axios.request<TResponse>(config);

    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }

    throw new Error(`SalesIQ HTTP ${res.status}: ${safePreview(res.data, 2000)}`);
  };

  try {
    const token = await getSalesIQAccessToken();
    return await doRequest(token);
  } catch (e) {
    if (!isZohoInvalidToken(e)) {
      throw new Error(`[salesIQRequest] ${args.requestId ?? ""} ${errToMessage(e)}`);
    }

    // retry once
    clearTokenCache();

    const token2 = await refreshSalesIQAccessToken();

    try {
      return await doRequest(token2);
    } catch (e2) {
      throw new Error(
        `[salesIQRequest retry failed] ${args.requestId ?? ""} ${errToMessage(e2)}`
      );
    }
  }
}
