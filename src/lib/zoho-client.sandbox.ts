import { getValidSandboxAccessToken } from "@/lib/zoho-token-manager.sandbox"
import axios from "axios";

export async function zohoSandboxRequest(config: any) {
  const token = await getValidSandboxAccessToken();

  return axios.request({
    timeout: 20_000,
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  });
}
