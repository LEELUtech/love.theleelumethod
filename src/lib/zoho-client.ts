
import { getValidSandboxAccessToken } from "@/lib/zoho-token-manager";
import axios, { AxiosRequestConfig } from "axios";

export async function zohoRequest<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  const token = await getValidSandboxAccessToken();

  const res = await axios.request<T>({
    timeout: 20_000,
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  });

  return res.data;
}
