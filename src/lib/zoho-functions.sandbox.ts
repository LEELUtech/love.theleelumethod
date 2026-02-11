// src/lib/zoho-functions.sandbox.ts
import { zohoRequest } from "@/lib/zoho-client.sandbox";

const ZOHO_CONTACT_LAYOUT_ID = process.env.ZOHO_CONTACT_LAYOUT_ID_SANDBOX;

type UTM = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

export type UpsertResult = { contactId: string; isNew: boolean };

function cleanStr(v?: string | null) {
  const s = (v ?? "").trim();
  return s ? s : undefined;
}

function toZohoDateTime(d: Date = new Date()): string {
  return d.toISOString().replace(/\.\d{3}Z$/, "Z").replace(/Z$/, "+00:00");
}

type FunnelStep =
  | "checkout_viewed"
  | "lead_captured"
  | "abandoned"
  | "checkout_started"
  | "paid"
  | "delivered"
  | "failed"
  | "canceled";

const FUNNEL_RANK: Record<FunnelStep, number> = {
  checkout_viewed: 10,
  lead_captured: 20,
  abandoned: 25,
  checkout_started: 30,
  paid: 40,
  delivered: 50,
  failed: 60,
  canceled: 60,
};

function normalizeStep(v: any): FunnelStep | undefined {
  const s = String(v ?? "").trim();
  if (!s) return undefined;
  if (s in FUNNEL_RANK) return s as FunnelStep;
  return undefined;
}

function attachLayoutIfPresent(obj: Record<string, any>, layoutId?: string) {
  const id = cleanStr(layoutId);
  if (!id) return;
  obj.Layout = { id };
}

function shouldAdvanceFunnel(existingStep: any, nextStep: FunnelStep) {
  const ex = normalizeStep(existingStep);
  if (!ex) return true;
  return FUNNEL_RANK[nextStep] >= FUNNEL_RANK[ex];
}

function guessLeadSource(utmSource?: string) {
  const s = (utmSource || "").toLowerCase();
  if (s.includes("instagram")) return "Instagram";
  if (s.includes("tiktok")) return "TikTok";
  if (s.includes("facebook")) return "Facebook";
  if (s.includes("youtube")) return "YouTube";
  if (s.includes("google")) return "Google";
  return undefined;
}

function setIfEmpty(obj: Record<string, any>, key: string, current: any, next?: any) {
  const val = typeof next === "string" ? cleanStr(next) : next;
  if (val === undefined || val === null) return;
  if (!current) obj[key] = val;
}

function isPlaceholderName(v: any) {
  const s = String(v ?? "").trim().toLowerCase();
  return !s || s === "unknown" || s === "lead" || s === "customer";
}

function setIfEmptyOrPlaceholder(obj: Record<string, any>, key: string, current: any, next?: any) {
  const val = typeof next === "string" ? cleanStr(next) : next;
  if (val === undefined || val === null) return;
  if (!current || isPlaceholderName(current)) obj[key] = val;
}

// ------------------------
// ✅ “best-value” setters (Zoho) to avoid degrading data
// ------------------------
function norm(v: any) {
  return String(v ?? "").trim();
}

function digitsCount(v: any) {
  const s = norm(v);
  const m = s.match(/\d/g);
  return m ? m.length : 0;
}

function lineCount(s: string) {
  return s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean).length;
}

function setIfBetterText(obj: Record<string, any>, key: string, current: any, next?: any) {
  const val = typeof next === "string" ? cleanStr(next) : next;
  if (val === undefined || val === null) return;

  const cur = norm(current);
  const nxt = norm(val);

  if (!nxt) return;

  if (!cur) {
    obj[key] = nxt;
    return;
  }

  // only if new is not shorter
  if (nxt.length >= cur.length) obj[key] = nxt;
}

function setIfBetterPhone(obj: Record<string, any>, key: string, current: any, next?: any) {
  const val = typeof next === "string" ? cleanStr(next) : next;
  if (val === undefined || val === null) return;

  const cur = norm(current);
  const nxt = norm(val);
  if (!nxt) return;

  if (!cur) {
    obj[key] = nxt;
    return;
  }

  const curDigits = digitsCount(cur);
  const nxtDigits = digitsCount(nxt);

  if (nxtDigits < curDigits) return;

  if (nxtDigits > curDigits || nxt.length >= cur.length) obj[key] = nxt;
}

/**
 * Mailing_Street non-degrading:
 * - если в CRM 2 строки, а новое 1 строка -> НЕ перетирать
 * - иначе обновлять только если новое “не хуже”
 */
function setIfBetterMailingStreet(obj: Record<string, any>, key: string, current: any, nextStreet?: string) {
  const nxt = cleanStr(nextStreet);
  if (!nxt) return;

  const cur = norm(current);
  if (!cur) {
    obj[key] = nxt;
    return;
  }

  const curLines = lineCount(cur);
  const nxtLines = lineCount(nxt);

  if (curLines >= 2 && nxtLines < curLines) return;

  if (nxtLines > curLines || nxt.length >= cur.length) {
    obj[key] = nxt;
  }
}

function appendDescription(existingDesc: string | undefined, line: string) {
  const l = cleanStr(line);
  if (!l) return undefined;

  const base = cleanStr(existingDesc) || "";
  const next = base ? `${base}\n${l}` : l;

  const LIMIT = 3000;
  if (next.length <= LIMIT) return next;
  return next.slice(next.length - LIMIT);
}

async function findContactByEmail(email: string): Promise<any | null> {
  const criteria = encodeURIComponent(`(Email:equals:${email})`);
  const url = `https://${process.env.ZOHO_API_DOMAIN_SANDBOX}/crm/v2/Contacts/search?criteria=${criteria}`;

  try {
    const search = await zohoRequest({ method: "GET", url });
    return search?.data?.[0] ?? null;
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 204 || status === 404) return null;
    throw e;
  }
}

function buildCheckoutStartedLine(input: {
  productType: string;
  checkoutVariant?: string;
  pagePath?: string;
  site?: string;
  stripePaymentIntentId?: string;
}) {
  const parts = [
    "Checkout started",
    `product=${input.productType}`,
    input.checkoutVariant ? `variant=${input.checkoutVariant}` : null,
    input.pagePath ? `page=${input.pagePath}` : null,
    input.site ? `site=${input.site}` : null,
    input.stripePaymentIntentId ? `pi=${input.stripePaymentIntentId}` : null,
  ].filter(Boolean);

  return parts.join(" | ");
}

function buildCheckoutStartedDedupeKey(input: {
  productType: string;
  checkoutVariant?: string;
  pagePath?: string;
}) {
  const parts = [
    "Checkout started",
    `product=${input.productType}`,
    input.checkoutVariant ? `variant=${input.checkoutVariant}` : null,
    input.pagePath ? `page=${input.pagePath}` : null,
  ].filter(Boolean);

  return parts.join(" | ");
}

/**
 * ✅ ЭТАП 1 — Lead Captured (onBlur)
 */
export async function upsertContactLeadCaptured(
  input: { email: string; site?: string; pagePath?: string } & UTM,
): Promise<UpsertResult> {
  const email = cleanStr(input.email)?.toLowerCase();
  if (!email) throw new Error("Email is required");

  const existing = await findContactByEmail(email);
  const leadSource = guessLeadSource(input.utmSource);
  const nowDT = toZohoDateTime(new Date());

  if (existing?.id) {
    const updateData: Record<string, any> = { id: existing.id };

    setIfEmpty(updateData, "First_UTM_Source", existing.First_UTM_Source, input.utmSource);
    setIfEmpty(updateData, "First_UTM_Medium", existing.First_UTM_Medium, input.utmMedium);
    setIfEmpty(updateData, "First_UTM_Campaign", existing.First_UTM_Campaign, input.utmCampaign);
    setIfEmpty(updateData, "First_UTM_Content", existing.First_UTM_Content, input.utmContent);
    setIfEmpty(updateData, "First_UTM_Term", existing.First_UTM_Term, input.utmTerm);
    setIfEmpty(updateData, "First_Landing_Page", existing.First_Landing_Page, input.pagePath);

    setIfEmpty(updateData, "Site", existing.Site, input.site);
    setIfEmpty(updateData, "Lead_Source", existing.Lead_Source, leadSource);

    if (shouldAdvanceFunnel(existing.Funnel_Step, "lead_captured")) {
      updateData.Funnel_Step = "lead_captured";
      updateData.Funnel_Updated_At = nowDT;
    }

    if (Object.keys(updateData).length === 1) {
      return { contactId: existing.id, isNew: false };
    }

    const url = `https://${process.env.ZOHO_API_DOMAIN_SANDBOX}/crm/v2/Contacts`;
    await zohoRequest({ method: "PUT", url, data: { data: [updateData] } });

    return { contactId: existing.id, isNew: false };
  }

  const createData: Record<string, any> = {
    Email: email,
    First_Name: "Unknown",
    Last_Name: "Lead",
    Funnel_Step: "lead_captured",
    Funnel_Updated_At: nowDT,
  };

  attachLayoutIfPresent(createData, ZOHO_CONTACT_LAYOUT_ID);


  if (leadSource) createData.Lead_Source = leadSource;

  if (cleanStr(input.utmSource)) createData.First_UTM_Source = input.utmSource!.trim();
  if (cleanStr(input.utmMedium)) createData.First_UTM_Medium = input.utmMedium!.trim();
  if (cleanStr(input.utmCampaign)) createData.First_UTM_Campaign = input.utmCampaign!.trim();
  if (cleanStr(input.utmContent)) createData.First_UTM_Content = input.utmContent!.trim();
  if (cleanStr(input.utmTerm)) createData.First_UTM_Term = input.utmTerm!.trim();

  if (cleanStr(input.pagePath)) createData.First_Landing_Page = input.pagePath!.trim();
  if (cleanStr(input.site)) createData.Site = input.site!.trim();

  const url = `https://${process.env.ZOHO_API_DOMAIN_SANDBOX}/crm/v2/Contacts`;
  const created = await zohoRequest({ method: "POST", url, data: { data: [createData] } });

  const newId = created?.data?.[0]?.details?.id;
  if (!newId) throw new Error(`Zoho create failed: missing id (check Zoho response)`);

  return { contactId: newId, isNew: true };
}

/**
 * ✅ ЭТАП 2 — Checkout Started (Pay)
 * - НЕ деградирует адрес/телефон (best-value)
 * - funnel advance-only
 */
export async function upsertContactCheckoutStarted(
  input: {
    email: string;

    firstName?: string;
    lastName?: string;
    phone?: string;

    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;

    productType: string;
    checkoutVariant?: string;
    pagePath?: string;
    site?: string;

    stripePaymentIntentId?: string;
  } & UTM,
): Promise<UpsertResult> {
  const email = cleanStr(input.email)?.toLowerCase();
  if (!email) throw new Error("Email is required");

  const existing = await findContactByEmail(email);
  const leadSource = guessLeadSource(input.utmSource);
  const nowDT = toZohoDateTime(new Date());

  // normalize address -> Zoho Mailing_*
  const a1 = cleanStr(input.address1);
  const a2 = cleanStr(input.address2);
  const mailingStreet = cleanStr([a1, a2].filter(Boolean).join(" / "));
  const mailingCity = cleanStr(input.city);
  const mailingState = cleanStr(input.state);
  const mailingZip = cleanStr(input.postalCode);
  const mailingCountry = cleanStr(input.country);

  if (existing?.id) {
    const updateData: Record<string, any> = { id: existing.id };

    // name: fill if empty/placeholder (НЕ перетираем нормальные)
    setIfEmptyOrPlaceholder(updateData, "First_Name", existing.First_Name, input.firstName);
    setIfEmptyOrPlaceholder(updateData, "Last_Name", existing.Last_Name, input.lastName);

    // ✅ Phone: only if better (never degrade)
    setIfBetterPhone(updateData, "Phone", existing.Phone, input.phone);

    // ✅ Address: only if better (never degrade)
    setIfBetterMailingStreet(updateData, "Mailing_Street", existing.Mailing_Street, mailingStreet);
    setIfBetterText(updateData, "Mailing_City", existing.Mailing_City, mailingCity);
    setIfBetterText(updateData, "Mailing_State", existing.Mailing_State, mailingState);
    setIfBetterText(updateData, "Mailing_Zip", existing.Mailing_Zip, mailingZip);
    setIfBetterText(updateData, "Mailing_Country", existing.Mailing_Country, mailingCountry);

    // first-touch attribution: only if empty (как и было)
    setIfEmpty(updateData, "First_UTM_Source", existing.First_UTM_Source, input.utmSource);
    setIfEmpty(updateData, "First_UTM_Medium", existing.First_UTM_Medium, input.utmMedium);
    setIfEmpty(updateData, "First_UTM_Campaign", existing.First_UTM_Campaign, input.utmCampaign);
    setIfEmpty(updateData, "First_UTM_Content", existing.First_UTM_Content, input.utmContent);
    setIfEmpty(updateData, "First_UTM_Term", existing.First_UTM_Term, input.utmTerm);
    setIfEmpty(updateData, "First_Landing_Page", existing.First_Landing_Page, input.pagePath);

    // last-touch: тоже non-degrading (чтобы не затирать хорошее пустым/коротким)
    // setIfBetterText(updateData, "Last_UTM_Source", existing.Last_UTM_Source, input.utmSource);
    // setIfBetterText(updateData, "Last_UTM_Medium", existing.Last_UTM_Medium, input.utmMedium);
    // setIfBetterText(updateData, "Last_UTM_Campaign", existing.Last_UTM_Campaign, input.utmCampaign);
    // setIfBetterText(updateData, "Last_UTM_Content", existing.Last_UTM_Content, input.utmContent);
    // setIfBetterText(updateData, "Last_UTM_Term", existing.Last_UTM_Term, input.utmTerm);
    // setIfBetterText(updateData, "Last_Landing_Page", existing.Last_Landing_Page, input.pagePath);

    // Site + Lead Source: only if empty (как и было)
    setIfEmpty(updateData, "Site", existing.Site, input.site);
    setIfEmpty(updateData, "Lead_Source", existing.Lead_Source, leadSource);

    // always store latest PI (это ок, не "ухудшает")
    if (cleanStr(input.stripePaymentIntentId)) {
      updateData.Stripe_Payment_Intent_ID = input.stripePaymentIntentId!.trim();
    }

    // funnel advance only
    if (shouldAdvanceFunnel(existing.Funnel_Step, "checkout_started")) {
      updateData.Funnel_Step = "checkout_started";
      updateData.Funnel_Updated_At = nowDT;
      updateData.Checkout_Status = "Checkout Started";
    }

    // log step (append, no dupes)
    const eventLine = buildCheckoutStartedLine({
      productType: input.productType,
      checkoutVariant: input.checkoutVariant,
      pagePath: input.pagePath,
      site: input.site,
      stripePaymentIntentId: input.stripePaymentIntentId,
    });

    const dedupeKey = buildCheckoutStartedDedupeKey({
      productType: input.productType,
      checkoutVariant: input.checkoutVariant,
      pagePath: input.pagePath,
    });

    if (!existing.Description?.includes(dedupeKey)) {
      const nextDesc = appendDescription(existing.Description, eventLine);
      if (nextDesc && nextDesc !== existing.Description) updateData.Description = nextDesc;
    }

    if (Object.keys(updateData).length === 1) {
      return { contactId: existing.id, isNew: false };
    }

    const url = `https://${process.env.ZOHO_API_DOMAIN_SANDBOX}/crm/v2/Contacts`;
    await zohoRequest({ method: "PUT", url, data: { data: [updateData] } });

    return { contactId: existing.id, isNew: false };
  }

  // CREATE NEW (тут можно писать все поля — нечего "перетирать")
  const createData: Record<string, any> = {
    Email: email,
    First_Name: cleanStr(input.firstName) || "Unknown",
    Last_Name: cleanStr(input.lastName) || "Customer",
    Funnel_Step: "checkout_started",
    Funnel_Updated_At: nowDT,
    Checkout_Status: "Checkout Started",
  };

  attachLayoutIfPresent(createData, ZOHO_CONTACT_LAYOUT_ID);

  if (cleanStr(input.phone)) createData.Phone = input.phone!.trim();

  if (mailingStreet) createData.Mailing_Street = mailingStreet;
  if (mailingCity) createData.Mailing_City = mailingCity;
  if (mailingState) createData.Mailing_State = mailingState;
  if (mailingZip) createData.Mailing_Zip = mailingZip;
  if (mailingCountry) createData.Mailing_Country = mailingCountry;

  if (leadSource) createData.Lead_Source = leadSource;

  // first-touch
  if (cleanStr(input.utmSource)) createData.First_UTM_Source = input.utmSource!.trim();
  if (cleanStr(input.utmMedium)) createData.First_UTM_Medium = input.utmMedium!.trim();
  if (cleanStr(input.utmCampaign)) createData.First_UTM_Campaign = input.utmCampaign!.trim();
  if (cleanStr(input.utmContent)) createData.First_UTM_Content = input.utmContent!.trim();
  if (cleanStr(input.utmTerm)) createData.First_UTM_Term = input.utmTerm!.trim();

  if (cleanStr(input.pagePath)) createData.First_Landing_Page = input.pagePath!.trim();
  if (cleanStr(input.site)) createData.Site = input.site!.trim();

  // last-touch
  // if (cleanStr(input.utmSource)) createData.Last_UTM_Source = input.utmSource!.trim();
  // if (cleanStr(input.utmMedium)) createData.Last_UTM_Medium = input.utmMedium!.trim();
  // if (cleanStr(input.utmCampaign)) createData.Last_UTM_Campaign = input.utmCampaign!.trim();
  // if (cleanStr(input.utmContent)) createData.Last_UTM_Content = input.utmContent!.trim();
  // if (cleanStr(input.utmTerm)) createData.Last_UTM_Term = input.utmTerm!.trim();
  // if (cleanStr(input.pagePath)) createData.Last_Landing_Page = input.pagePath!.trim();

  if (cleanStr(input.stripePaymentIntentId)) {
    createData.Stripe_Payment_Intent_ID = input.stripePaymentIntentId!.trim();
  }

  const url = `https://${process.env.ZOHO_API_DOMAIN_SANDBOX}/crm/v2/Contacts`;
  const created = await zohoRequest({ method: "POST", url, data: { data: [createData] } });

  const newId = created?.data?.[0]?.details?.id;
  if (!newId) throw new Error(`Zoho create failed: missing id (check Zoho response)`);

  return { contactId: newId, isNew: true };
}
