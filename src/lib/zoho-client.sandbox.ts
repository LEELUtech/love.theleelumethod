/* eslint-disable @typescript-eslint/no-explicit-any */
import { getValidSandboxAccessToken } from "@/lib/zoho-token-manager.sandbox";
import axios, { AxiosRequestConfig } from "axios";

export async function zohoRequest<T = any>(config: AxiosRequestConfig): Promise<T> {
  const token = await getValidSandboxAccessToken();

  const res = await axios.request<T>({
    timeout: 20_000,
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  });

  return res.data; // ✅ ВАЖНО: только data
}
