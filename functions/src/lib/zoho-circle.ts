import axios from "axios";
import { configs } from "../configs/env";

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
    throw new Error(`[zoho-circle] token refresh failed: ${JSON.stringify(res.data)}`);
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
    const res = await axios.get<{ data?: Array<{ id?: string }> }>(url, {
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
  await axios.put(
    `https://${configs.zohoApiCRMDomain}/crm/v2/Contacts`,
    { data: [{ id, ...fields }] },
    {
      timeout: 15000,
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
}

export async function updateLastModuleSubmission(email: string): Promise<void> {
  const id = await findContactId(email);
  if (!id) {
    console.warn("[zoho-circle] contact not found for updateLastModuleSubmission", { email });
    return;
  }
  await patchContact(id, { Last_Module_Submission: new Date().toISOString().slice(0, 10) });
  console.log("[zoho-circle] last module submission updated", { email });
}

export async function updateCircleCourseProgress(
  email: string,
  fields: {
    circle_status?: "active" | "inactive";
    last_module_submission?: string;
    module_3_completed?: boolean;
    module_6_completed?: boolean;
    course_completed?: boolean;
  },
): Promise<void> {
  const id = await findContactId(email);
  if (!id) {
    console.warn("[zoho-circle] contact not found for updateCircleCourseProgress", { email });
    return;
  }
  const patch: Record<string, unknown> = {};
  if (fields.circle_status !== undefined) patch.Circle_Status = fields.circle_status;
  if (fields.last_module_submission !== undefined) patch.Last_Module_Submission = fields.last_module_submission;
  if (fields.module_3_completed !== undefined) patch.Module_3_Completed = fields.module_3_completed;
  if (fields.module_6_completed !== undefined) patch.Module_6_Completed = fields.module_6_completed;
  if (fields.course_completed !== undefined) patch.Course_Completed = fields.course_completed;
  if (Object.keys(patch).length === 0) return;
  await patchContact(id, patch);
  console.log("[zoho-circle] course progress updated", { email, ...fields });
}

const COURSE_PRODUCTS = ["protocol_essentials", "guided_breakthrough", "vip_immersion"];

export async function findInactiveCourseContacts(cutoffDate: string): Promise<string[]> {
  const token = await getToken();
  const criteria = encodeURIComponent(`(Last_Module_Submission:less_than:${cutoffDate})`);
  const url = `https://${configs.zohoApiCRMDomain}/crm/v2/Contacts/search?criteria=${criteria}&fields=Email,Purchased_Products&per_page=200`;

  try {
    const res = await axios.get<{ data?: Array<{ Email?: string; Purchased_Products?: string[] }> }>(url, {
      timeout: 15000,
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    });
    return (res.data?.data ?? [])
      .filter((c) => {
        const products = c.Purchased_Products ?? [];
        return products.some((p) => COURSE_PRODUCTS.includes(p));
      })
      .map((c) => c.Email?.trim().toLowerCase() ?? "")
      .filter(Boolean);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 204 || status === 404) return [];
    }
    throw err;
  }
}
