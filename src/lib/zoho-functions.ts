// src/server/zoho/zoho-functions.ts
import "server-only";
import { zohoRequest } from "@/lib/zoho-client";
import { getCohortData } from "@/lib/cohort";

const ZOHO_API_DOMAIN = process.env.ZOHO_API_DOMAIN_LILYCHYSTOFAT;
const ZOHO_CONTACT_LAYOUT_ID = process.env.ZOHO_CONTACT_LAYOUT_ID_LILYCHYSTOFAT;

export type UpsertResult = { contactId: string; isNew: boolean };

function env(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

function cleanStr(v?: string | null) {
  const s = String(v ?? "").trim();
  return s ? s : undefined;
}

function toZohoDateTime(d: Date = new Date()): string {
  return d.toISOString().replace(/\.\d{3}Z$/, "+00:00");
}

// -------------------------
// Funnel (advance-only)
// -------------------------
export type FunnelStep = "checkout_viewed" | "lead_captured" | "checkout_started" | "paid" | "delivered" | "failed" | "canceled";

const FUNNEL_RANK: Record<FunnelStep, number> = {
  checkout_viewed: 10,
  lead_captured: 20,
  checkout_started: 30,
  paid: 40,
  delivered: 50,
  failed: 60,
  canceled: 60,
};

function normalizeStep(v: unknown): FunnelStep | undefined {
  const s = String(v ?? "").trim();
  if (!s) return undefined;
  return (s in FUNNEL_RANK ? (s as FunnelStep) : undefined);
}

function shouldAdvance(existing: unknown, next: FunnelStep) {
  const ex = normalizeStep(existing);
  if (!ex) return true;
  return FUNNEL_RANK[next] >= FUNNEL_RANK[ex];
}

function checkoutStatusFor(step: FunnelStep) {
  if (step === "checkout_started") return "Checkout Started";
  if (step === "lead_captured") return "Lead Captured";
  if (step === "paid") return "Paid";
  if (step === "delivered") return "Delivered";
  if (step === "failed") return "Payment Failed";
  if (step === "canceled") return "Canceled";
  return undefined;
}

// -------------------------
// Helpers (non-degrading)
// -------------------------

// Converts MM/DD/YYYY → YYYY-MM-DD (Zoho CRM date format)
function toZohoCrmDate(v?: string): string | undefined {
  if (!v) return undefined;
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return undefined;
  return `${m[3]}-${m[1]}-${m[2]}`;
}

function digitsCount(v: unknown) {
  const s = String(v ?? "");
  const m = s.match(/\d/g);
  return m ? m.length : 0;
}

function isPlaceholderName(v: unknown) {
  const s = String(v ?? "").trim().toLowerCase();
  return !s || s === "." || s === "unknown" || s === "lead" || s === "customer";
}

function setIfEmpty(obj: Record<string, unknown>, key: string, current: unknown, next?: unknown) {
  const val = typeof next === "string" ? cleanStr(next) : next;
  if (val === undefined || val === null) return;
  if (!current) obj[key] = val;
}

function setIfEmptyOrPlaceholder(
  obj: Record<string, unknown>,
  key: string,
  current: unknown,
  next?: unknown,
) {
  const val = typeof next === "string" ? cleanStr(next) : next;
  if (val === undefined || val === null) return;
  if (!current || isPlaceholderName(current)) obj[key] = val;
}

function setIfBetterPhone(obj: Record<string, unknown>, key: string, current: unknown, next?: string) {
  const nxt = cleanStr(next);
  if (!nxt) return;

  const cur = String(current ?? "").trim();
  if (!cur) {
    obj[key] = nxt;
    return;
  }

  const curDigits = digitsCount(cur);
  const nxtDigits = digitsCount(nxt);

  if (nxtDigits < curDigits) return;
  if (nxtDigits > curDigits || nxt.length >= cur.length) obj[key] = nxt;
}

function buildMailingStreet(address1?: string, address2?: string) {
  const a1 = cleanStr(address1);
  const a2 = cleanStr(address2);
  if (!a1 && !a2) return undefined;
  return [a1, a2].filter(Boolean).join("\n");
}

function attachLayoutIfPresent(obj: Record<string, unknown>, layoutId?: string) {
  const id = cleanStr(layoutId);
  if (!id) return;
  obj.Layout = { id };
}

// -------------------------
// Zoho search
// -------------------------
type ZohoRow = Record<string, unknown> & { id?: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getErrorStatus(e: unknown): number | undefined {
  if (!isRecord(e)) return undefined;
  const resp = e["response"];
  if (!isRecord(resp)) return undefined;
  const status = resp["status"];
  return typeof status === "number" ? status : undefined;
}

async function findContactByEmail(email: string): Promise<ZohoRow | null> {
  const apiDomain = ZOHO_API_DOMAIN || env("ZOHO_API_DOMAIN_LILYCHYSTOFAT");

  const criteria = encodeURIComponent(`(Email:equals:${email})`);
  const url = `https://${apiDomain}/crm/v2/Contacts/search?criteria=${criteria}`;

  try {
    const search = await zohoRequest<{ data?: ZohoRow[] }>({ method: "GET", url });
    return search?.data?.[0] ?? null;
  } catch (e: unknown) {
    const status = getErrorStatus(e);
    if (status === 204 || status === 404) return null;
    throw e;
  }
}

// -------------------------
// ONE simple upsert for Next.js (lead/checkout_started)
// -------------------------
export async function upsertZohoContactFunnel(input: {
  email: string;
  step: "lead_captured" | "checkout_started";

  site?: string;
  stripePaymentIntentId?: string;

  // optional profile (only for checkout_started usually)
  firstName?: string;
  lastName?: string;
  phone?: string;

  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  birthDate1?: string; // MM/DD/YYYY — saved to Date_of_Birth
  birthDate2?: string; // MM/DD/YYYY — saved to Partner_Date_of_Birth
}): Promise<UpsertResult> {
  const apiDomain = ZOHO_API_DOMAIN || env("ZOHO_API_DOMAIN_LILYCHYSTOFAT");

  const email = cleanStr(input.email)?.toLowerCase();
  if (!email) throw new Error("Email is required");

  const existing = await findContactByEmail(email);
  const nowDT = toZohoDateTime(new Date());
  const cohort = await getCohortData();

  const street = buildMailingStreet(input.address1, input.address2);

  const baseUrl = `https://${apiDomain}/crm/v2/Contacts`;

  if (existing?.id) {
    const patch: Record<string, unknown> = { id: existing.id };

    // non-degrading profile
    setIfEmptyOrPlaceholder(patch, "First_Name", existing["First_Name"], input.firstName);
    setIfEmptyOrPlaceholder(patch, "Last_Name", existing["Last_Name"], input.lastName);
    setIfBetterPhone(patch, "Phone", existing["Phone"], input.phone);

    // address: only set if empty
    setIfEmpty(patch, "Mailing_Street", existing["Mailing_Street"], street);
    setIfEmpty(patch, "Mailing_City", existing["Mailing_City"], input.city);
    setIfEmpty(patch, "Mailing_State", existing["Mailing_State"], input.state);
    setIfEmpty(patch, "Mailing_Zip", existing["Mailing_Zip"], input.postalCode);
    setIfEmpty(patch, "Mailing_Country", existing["Mailing_Country"], input.country);

    // snapshot fields
    setIfEmpty(patch, "Site", existing["Site"], input.site);
    setIfEmpty(patch, "Date_of_Birth", existing["Date_of_Birth"], toZohoCrmDate(input.birthDate1));
    setIfEmpty(patch, "Partner_Date_of_Birth", existing["Partner_Date_of_Birth"], toZohoCrmDate(input.birthDate2));

    // cohort: fill if empty (bulk sync handles mass updates)
    setIfEmpty(patch, "Cohort_Start_Date", existing["Cohort_Start_Date"], cohort.date);
    setIfEmpty(patch, "Cohort_Start_Date_Name", existing["Cohort_Start_Date_Name"], cohort.label);

    if (cleanStr(input.stripePaymentIntentId)) {
      patch.Stripe_Payment_Intent_ID = input.stripePaymentIntentId!.trim();
    }

    // funnel (advance-only)
    if (shouldAdvance(existing["Funnel_Step"], input.step)) {
      patch.Funnel_Step = input.step;
      patch.Funnel_Updated_At = nowDT;

      const st = checkoutStatusFor(input.step);
      if (st) patch.Checkout_Status = st;
    }

    if (Object.keys(patch).length === 1) {
      return { contactId: existing.id, isNew: false };
    }

    await zohoRequest({ method: "PUT", url: baseUrl, data: { data: [patch] } });
    return { contactId: existing.id, isNew: false };
  }

  // CREATE
  const createData: Record<string, unknown> = {
    Email: email,
    First_Name: cleanStr(input.firstName) || "",
    Last_Name: cleanStr(input.lastName) || ".",

    Funnel_Step: input.step,
    Funnel_Updated_At: nowDT,
  };

  const st = checkoutStatusFor(input.step);
  if (st) createData.Checkout_Status = st;

  const dob = toZohoCrmDate(input.birthDate1);
  if (dob) createData.Date_of_Birth = dob;

  const dob2 = toZohoCrmDate(input.birthDate2);
  if (dob2) createData.Partner_Date_of_Birth = dob2;

  if (cohort.date) createData.Cohort_Start_Date = cohort.date;
  if (cohort.label) createData.Cohort_Start_Date_Name = cohort.label;

  attachLayoutIfPresent(createData, ZOHO_CONTACT_LAYOUT_ID);

  if (cleanStr(input.phone)) createData.Phone = input.phone!.trim();

  if (street) createData.Mailing_Street = street;
  if (cleanStr(input.city)) createData.Mailing_City = input.city!.trim();
  if (cleanStr(input.state)) createData.Mailing_State = input.state!.trim();
  if (cleanStr(input.postalCode)) createData.Mailing_Zip = input.postalCode!.trim();
  if (cleanStr(input.country)) createData.Mailing_Country = input.country!.trim();

  if (cleanStr(input.site)) createData.Site = input.site!.trim();
  if (cleanStr(input.stripePaymentIntentId)) {
    createData.Stripe_Payment_Intent_ID = input.stripePaymentIntentId!.trim();
  }

  console.log("[zoho-functions] CRM create payload:", JSON.stringify({ data: [createData] }, null, 2));
  const created = await zohoRequest<{ data?: Array<{ details?: { id?: string } }> }>({
    method: "POST",
    url: baseUrl,
    data: { data: [createData] },
  });

  const newId = created?.data?.[0]?.details?.id;
  console.log("[zoho-functions] CRM create response:", JSON.stringify(created, null, 2));
  if (!newId) throw new Error("Zoho create failed: missing id");

  return { contactId: newId, isNew: true };
}

// -------------------------
// Backwards-compatible wrappers
// -------------------------
export async function upsertContactLeadCaptured(input: { email: string; site?: string, firstName?: string; lastName?: string }) {
  const res = await upsertZohoContactFunnel({
    email: input.email,
    step: "lead_captured",
    site: input.site,
    firstName: input.firstName,
    lastName: input.lastName,
  });
  return res;
}

export async function upsertContactCheckoutStarted(input: {
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
  site?: string;

  stripePaymentIntentId?: string;
  birthDate1?: string;
  birthDate2?: string;
}) {
  return upsertZohoContactFunnel({
    email: input.email,
    step: "checkout_started",
    site: input.site,
    stripePaymentIntentId: input.stripePaymentIntentId,

    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,

    address1: input.address1,
    address2: input.address2,
    city: input.city,
    state: input.state,
    postalCode: input.postalCode,
    country: input.country,

    birthDate1: input.birthDate1,
    birthDate2: input.birthDate2,
  });
}
