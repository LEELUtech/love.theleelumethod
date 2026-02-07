/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/zoho-functions.sandbox.ts
import { zohoSandboxRequest } from "@/lib/zoho-client.sandbox";

type CheckoutStartedInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;

  productType: string;      
  checkoutVariant?: string;   
  pagePath?: string;         
  site?: string;              

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  stripePaymentIntentId?: string;
};

function guessLeadSource(utmSource?: string) {
  const s = (utmSource || "").toLowerCase();
  if (s.includes("instagram")) return "Instagram";
  if (s.includes("tiktok")) return "TikTok";
  if (s.includes("facebook")) return "Facebook";
  if (s.includes("youtube")) return "YouTube";
  if (s.includes("google")) return "Google";
  return undefined;
}

export async function upsertContactCheckoutStartedSandbox(input: CheckoutStartedInput): Promise<{
  contactId: string;
  isNew: boolean;
}> {
  const email = input.email.trim();
  if (!email) throw new Error("Email is required");

  // 1) search by email
  let existing: any | null = null;
  try {
    const criteria = encodeURIComponent(`(Email:equals:${email})`);
    const url = `https://${process.env.ZOHO_API_DOMAIN_SANDBOX}/crm/v2/Contacts/search?criteria=${criteria}`;

    const search = await zohoSandboxRequest({ method: "GET", url });
    existing = search?.data?.[0] ?? null;
  } catch (e: any) {
    // Zoho often returns 204 for no content
    const status = e?.response?.status;
    if (status !== 204 && status !== 404) throw e;
  }

  const leadSource = guessLeadSource(input.utmSource);

  // helper: only set field if current empty
  const setIfEmpty = (obj: Record<string, any>, key: string, current: any, next?: any) => {
    if (next === undefined || next === null) return;
    const s = typeof next === "string" ? next.trim() : next;
    if (s === "" || s === undefined || s === null) return;
    if (!current) obj[key] = s;
  };

  // 2) update
  if (existing?.id) {
    const updateData: Record<string, any> = { id: existing.id };

    // fill basics only if empty in CRM
    setIfEmpty(updateData, "First_Name", existing.First_Name, input.firstName);
    setIfEmpty(updateData, "Last_Name", existing.Last_Name, input.lastName);
    setIfEmpty(updateData, "Phone", existing.Phone, input.phone);

    // first-touch attribution: only if empty
    setIfEmpty(updateData, "First_UTM_Source", existing.First_UTM_Source, input.utmSource);
    setIfEmpty(updateData, "First_UTM_Medium", existing.First_UTM_Medium, input.utmMedium);
    setIfEmpty(updateData, "First_UTM_Campaign", existing.First_UTM_Campaign, input.utmCampaign);
    setIfEmpty(updateData, "First_UTM_Content", existing.First_UTM_Content, input.utmContent);
    setIfEmpty(updateData, "First_UTM_Term", existing.First_UTM_Term, input.utmTerm);
    setIfEmpty(updateData, "First_Landing_Page", existing.First_Landing_Page, input.pagePath);

    // site fields: only if empty
    setIfEmpty(updateData, "Site", existing.Site, input.site);
    setIfEmpty(updateData, "Site_Source", existing.Site_Source, input.site);

    // Lead source: only if empty
    setIfEmpty(updateData, "Lead_Source", existing.Lead_Source, leadSource);

    // Keep latest PI id (можно обновлять всегда, это безопасно)
    if (input.stripePaymentIntentId?.trim()) {
      updateData.Stripe_Payment_Intent_ID = input.stripePaymentIntentId.trim();
    }

    // Context можно складывать в Description (не обязательно)
    // (это удобно, если пока нет отдельного поля "Checkout Started")
    const ctx = [
      `Checkout Started`,
      `productType=${input.productType}`,
      input.checkoutVariant ? `variant=${input.checkoutVariant}` : null,
      input.pagePath ? `page=${input.pagePath}` : null,
    ].filter(Boolean).join(" | ");

    // Не затирай Description если уже есть — просто допиши (очень аккуратно)
    if (!existing.Description) {
      updateData.Description = ctx;
    }

    const url = `https://${process.env.ZOHO_API_DOMAIN_SANDBOX}/crm/v2/Contacts`;
    await zohoSandboxRequest({
      method: "PUT",
      url,
      data: { data: [updateData] },
    });

    return { contactId: existing.id, isNew: false };
  }

  // 3) create new contact
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createData: Record<string, any> = {
    Email: email,
    First_Name: input.firstName?.trim() || "Unknown",
    Last_Name: input.lastName?.trim() || "Customer",
  };

  if (input.phone?.trim()) createData.Phone = input.phone.trim();
  if (leadSource) createData.Lead_Source = leadSource;

  // first-touch directly
  if (input.utmSource?.trim()) createData.First_UTM_Source = input.utmSource.trim();
  if (input.utmMedium?.trim()) createData.First_UTM_Medium = input.utmMedium.trim();
  if (input.utmCampaign?.trim()) createData.First_UTM_Campaign = input.utmCampaign.trim();
  if (input.utmContent?.trim()) createData.First_UTM_Content = input.utmContent.trim();
  if (input.utmTerm?.trim()) createData.First_UTM_Term = input.utmTerm.trim();
  if (input.pagePath?.trim()) createData.First_Landing_Page = input.pagePath.trim();

  if (input.site?.trim()) {
    createData.Site = input.site.trim();
    createData.Site_Source = input.site.trim();
  }

  if (input.stripePaymentIntentId?.trim()) {
    createData.Stripe_Payment_Intent_ID = input.stripePaymentIntentId.trim();
  }

  createData.Description = [
    `Checkout Started`,
    `productType=${input.productType}`,
    input.checkoutVariant ? `variant=${input.checkoutVariant}` : null,
    input.pagePath ? `page=${input.pagePath}` : null,
  ].filter(Boolean).join(" | ");

  const url = `https://${process.env.ZOHO_API_DOMAIN_SANDBOX}/crm/v2/Contacts`;
  const created = await zohoSandboxRequest({
    method: "POST",
    url,
    data: { data: [createData] },
  });

  const newId = created?.data?.[0]?.details?.id;
  if (!newId) {
    throw new Error(`Zoho create failed: ${JSON.stringify(created)}`);
  }

  return { contactId: newId, isNew: true };
}
