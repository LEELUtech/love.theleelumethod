import "server-only";
import axios from "axios";
import { zohoRequest } from "@/lib/zoho-client";

const API_DOMAIN = process.env.ZOHO_API_DOMAIN_LILYCHYSTOFAT || "www.zohoapis.com";
const MAX_COUNT = 10;

async function findContact(email: string): Promise<{ id: string; fields: Record<string, any> } | null> {
  const criteria = encodeURIComponent(`(Email:equals:${email})`);
  const url = `https://${API_DOMAIN}/crm/v2/Contacts/search?criteria=${criteria}`;

  console.log("[zoho-crm-scoring] findContact", { email });

  try {
    const data = await zohoRequest<any>({ method: "GET", url });
    const record = data?.data?.[0];
    if (!record?.id) {
      console.log("[zoho-crm-scoring] findContact not found", { email });
      return null;
    }
    console.log("[zoho-crm-scoring] findContact found", { email, id: record.id });
    return { id: record.id, fields: record };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      console.warn("[zoho-crm-scoring] findContact HTTP error", { email, status, data: err.response?.data });
      if (status === 204 || status === 404) return null;
    }
    console.error("[zoho-crm-scoring] findContact unexpected error", err);
    return null;
  }
}

async function patchContact(id: string, fields: Record<string, unknown>, label: string): Promise<void> {
  const payload = { data: [{ id, ...fields }] };
  console.log(`[score-crm] PATCH [${label}] →`, JSON.stringify(fields));
  const res = await zohoRequest<any>({
    method: "PUT",
    url: `https://${API_DOMAIN}/crm/v2/Contacts`,
    data: payload,
  });
  const status = res?.data?.[0]?.status ?? res?.data?.[0]?.code ?? "?";
  console.log(`[score-crm] PATCH [${label}] ← status=${status}`, JSON.stringify(res?.data?.[0]));
}

async function incrementCounter(email: string, field: string): Promise<void> {
  console.log(`[score-crm] incrementCounter START field=${field} email=${email}`);

  const contact = await findContact(email);
  if (!contact) {
    console.warn(`[score-crm] contact NOT FOUND — skip field=${field} email=${email}`);
    return;
  }

  const current = Number(contact.fields[field] ?? 0);

  if (current >= MAX_COUNT) {
    console.log(`[score-crm] incrementCounter SKIP field=${field} already at max (${current})`);
    return;
  }

  const next = current + 1;
  console.log(`[score-crm] contact id=${contact.id} field=${field} current=${current} → next=${next}`);
  await patchContact(contact.id, { [field]: next }, `${field}=${next}`);
  console.log(`[score-crm] incrementCounter DONE field=${field} email=${email} new_value=${next}`);
}

export async function markSalesPageVisited(email: string): Promise<void> {
  await incrementCounter(email, "Sales_Page_Visit_Count");
}

export async function markPricingPageVisited(email: string): Promise<void> {
  await incrementCounter(email, "Pricing_Page_Visit_Count");
}

export async function markSessionCompleted(email: string): Promise<void> {
  await incrementCounter(email, "Site_Session_Count");
}
