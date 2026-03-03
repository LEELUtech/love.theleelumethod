
import { getValidSandboxAccessToken } from "@/lib/zoho-token-manager";
import axios, { AxiosRequestConfig } from "axios";

export async function zohoRequest<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  console.log("[zoho-client] zohoRequest start", { method: config.method, url: config.url });

  let token: string;
  try {
    token = await getValidSandboxAccessToken();
    console.log("[zoho-client] got access token", { tokenPrefix: token.slice(0, 8) + "..." });
  } catch (e) {
    console.error("[zoho-client] failed to get access token", e);
    throw e;
  }

  try {
    const res = await axios.request<T>({
      timeout: 20_000,
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });

    console.log("[zoho-client] response", { status: res.status, url: config.url, data: res.data });
    return res.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      console.error("[zoho-client] axios error", {
        url: config.url,
        status: e.response?.status,
        data: e.response?.data,
        message: e.message,
      });
    } else {
      console.error("[zoho-client] unknown error", e);
    }
    throw e;
  }
}
