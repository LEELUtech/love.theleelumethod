import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { configs } from "../configs/env";

// -------------------------
// Zoho field API names (single source of truth)
// -------------------------
const CONTACT_FIELDS = {
  Email: "Email",
  First_Name: "First_Name",
  Last_Name: "Last_Name",
  Phone: "Phone",

  Site: "Site",
  Stripe_Customer_ID: "Stripe_Customer_ID",
  Stripe_Payment_Intent_ID: "Stripe_Payment_Intent_ID",

  First_Product_Purchased: "First_Product_Purchased",
  Last_Product_Purchased: "Last_Product_Purchased",
  Purchased_Products: "Purchased_Products_List",

  First_Purchase_Date: "First_Purchase_Date",
  Last_Purchase_Date: "Last_Purchase_Date",
  Last_Purchase_Amount: "Last_Purchase_Amount",
  Last_Purchase_Currency: "Last_Purchase_Currency",
  Lead_Source: "Lead_Source",

  Funnel_Step: "Funnel_Step",
  Funnel_Updated_At: "Funnel_Updated_At",
  Checkout_Status: "Checkout_Status",
  Last_Checkout_Error: "Last_Checkout_Error",

  Abandoned_Checkout_At: "Abandoned_Checkout_At", // DateTime
  Abandoned_Reason: "Abandoned_Reason", // Single line text / multi-line text
} as const;

const DEAL_FIELDS = {
  Deal_Name: "Deal_Name",
  Amount: "Amount",
  Stage: "Stage",
  Contact_Name: "Contact_Name",

  Product_Type: "Product_Type",
  Stripe_Payment_Intent_ID: "Stripe_Payment_Intent_ID",
  Purchase_Currency: "Purchase_Currency",

  Site: "Site",
  Stripe_Customer_ID: "Stripe_Customer_ID",
  Layout: "Layout",
  Closing_Date: "Closing_Date",

  Checkout_Variant: "Checkout_Variant",
  Lead_Source: "Lead_Source",

  Description: "Description",
} as const;

// -------------------------
// Product picklist guard (Zoho picklist values)
// -------------------------
const ZOHO_PRODUCT_VALUES = new Set([
  "compatibility_report",
  "protocol_essentials",
  "guided_breakthrough",
  "vip_immersion",
]);

// -------------------------
// small utils
// -------------------------
function cleanStr(v?: unknown): string | undefined {
  const s = String(v ?? "").trim();
  return s ? s : undefined;
}

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + "...";
}

function toZohoDateTime(d: Date = new Date()): string {
  // 2026-02-09T16:41:31.123Z -> 2026-02-09T16:41:31+00:00
  return d
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
    .replace(/Z$/, "+00:00");
}

function toZohoDateOnly(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v))
    return v
      .map(String)
      .map((x) => x.trim())
      .filter(Boolean);
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return [];
    return s
      .split(/[;,]/g)
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
}

function uniq(arr: string[]) {
  return [...new Set(arr.map((x) => x.trim()).filter(Boolean))];
}

function mergeMultiSelect(existing: unknown, add?: string): string[] | undefined {
  const v = cleanStr(add);
  if (!v) return undefined;
  const cur = uniq(asStringArray(existing));
  const next = uniq([...cur, v]);
  // if no change => undefined (so we don't send patch)
  if (cur.length === next.length && cur.every((x) => next.includes(x))) return undefined;
  return next;
}

function isPlaceholderName(v: unknown) {
  const s = String(v ?? "")
    .trim()
    .toLowerCase();
  return !s || s === "unknown" || s === "lead" || s === "customer";
}

function digitsCount(v: unknown) {
  const m = String(v ?? "").match(/\d/g);
  return m ? m.length : 0;
}

// only write if empty
function setIfEmpty(patch: Record<string, unknown>, key: string, current: unknown, next?: unknown) {
  const v = typeof next === "string" ? cleanStr(next) : next;
  if (v === undefined || v === null) return;
  if (!current) patch[key] = v;
}

// write if empty or placeholder
function setIfEmptyOrPlaceholder(
  patch: Record<string, unknown>,
  key: string,
  current: unknown,
  next?: unknown,
) {
  const v = typeof next === "string" ? cleanStr(next) : next;
  if (v === undefined || v === null) return;
  if (!current || isPlaceholderName(current)) patch[key] = v;
}

// phone: write only if "better" (more digits or longer)
function setIfBetterPhone(
  patch: Record<string, unknown>,
  key: string,
  current: unknown,
  next?: unknown,
) {
  const nxt = cleanStr(next);
  if (!nxt) return;

  const cur = cleanStr(current);
  if (!cur) {
    patch[key] = nxt;
    return;
  }

  const curDigits = digitsCount(cur);
  const nxtDigits = digitsCount(nxt);
  if (nxtDigits < curDigits) return;

  if (nxtDigits > curDigits || nxt.length >= cur.length) patch[key] = nxt;
}

function pickPurchasedProduct(productType: string, override?: string) {
  const o = cleanStr(override);
  if (o && ZOHO_PRODUCT_VALUES.has(o)) return o;

  const pt = cleanStr(productType);
  if (pt && ZOHO_PRODUCT_VALUES.has(pt)) return pt;

  return undefined; // don't write invalid picklist values
}

// -------------------------
// Funnel mapping (advance-only)
// -------------------------
export type ZohoFunnelStep =
  | "lead_captured"
  | "checkout_started"
  | "payment_failed"
  | "paid"
  | "delivered"
  | "abandoned"
  | "delivery_failed";

export type AppFunnelStep =
  | "checkout_viewed"
  | "lead_captured"
  | "checkout_started"
  | "paid"
  | "delivered"
  | "failed"
  | "canceled"
  | "abandoned"
  | "delivery_failed";

function toZohoFunnelStep(step: AppFunnelStep): ZohoFunnelStep {
  if (step === "failed" || step === "canceled") return "payment_failed";
  if (step === "delivery_failed") return "delivery_failed";
  if (step === "paid") return "paid";
  if (step === "delivered") return "delivered";
  if (step === "checkout_started") return "checkout_started";
  if (step === "abandoned") return "abandoned";
  // checkout_viewed / abandoned are not true CRM steps — keep as lead_captured
  return "lead_captured";
}

const ZOHO_FUNNEL_RANK: Record<ZohoFunnelStep, number> = {
  lead_captured: 20,
  checkout_started: 30,
  payment_failed: 35,
  paid: 40,
  delivered: 50,
  delivery_failed: 55,
  abandoned: 25,
};

function normalizeZohoStep(v: unknown): ZohoFunnelStep | undefined {
  const s = String(v ?? "").trim();
  if (!s) return undefined;
  if (s in ZOHO_FUNNEL_RANK) return s as ZohoFunnelStep;
  return undefined;
}

function shouldAdvanceZoho(existing: unknown, next: ZohoFunnelStep) {
  const ex = normalizeZohoStep(existing);
  if (!ex) return true;
  return ZOHO_FUNNEL_RANK[next] >= ZOHO_FUNNEL_RANK[ex];
}

function toZohoCheckoutStatus(step: ZohoFunnelStep, original?: AppFunnelStep) {
  // keep existing behavior
  if (original === "canceled") return "Payment Failed";

  if (step === "checkout_started") return "Checkout Started";
  if (step === "lead_captured") return "Lead Captured";
  if (step === "payment_failed") return "Payment Failed";
  if (step === "paid") return "Paid";
  if (step === "delivered") return "Delivered";
  if (step === "delivery_failed") return "Delivery Failed";
  return undefined;
}

// -------------------------
// OAuth token (refresh + cache)
// -------------------------
let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;

async function refreshZohoAccessToken(): Promise<string> {
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

  const accessToken = res.data?.access_token as string | undefined;
  const expiresInSec = Number(res.data?.expires_in ?? 0);

  if (!accessToken || !expiresInSec) {
    throw new Error(`Failed to refresh Zoho token. Response: ${JSON.stringify(res.data)}`);
  }

  cachedAccessToken = accessToken;
  cachedAccessTokenExpiresAt = Date.now() + expiresInSec * 1000 - 60_000; // 60s buffer
  return accessToken;
}

async function getValidAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt) return cachedAccessToken;
  return refreshZohoAccessToken();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function zohoRequest<T = unknown>(
  config: AxiosRequestConfig,
  attempt = 0,
  refreshed = false,
): Promise<T> {
  const token = await getValidAccessToken();

  const finalConfig: AxiosRequestConfig = {
    timeout: 20000,
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  };

  try {
    const res = await axios.request<T>(finalConfig);
    return res.data;
  } catch (err: unknown) {
    const e = err as AxiosError<Error>;
    const status = e.response?.status;

    const respData = e.response?.data as AxiosResponse["data"] | undefined;
    const zohoCode =
      respData?.code || (Array.isArray(respData?.data) ? respData?.data?.[0]?.code : undefined);

    const isAuthIssue =
      status === 401 || zohoCode === "INVALID_TOKEN" || zohoCode === "AUTHENTICATION_FAILURE";

    const isRetryable = status === 429 || (typeof status === "number" && status >= 500);

    console.error("ZOHO REQUEST FAILED", {
      method: finalConfig.method,
      url: finalConfig.url,
      status,
      zohoCode,
      response: e.response?.data,
      attempt,
    });

    if (isAuthIssue && !refreshed) {
      cachedAccessToken = null;
      cachedAccessTokenExpiresAt = 0;
      await refreshZohoAccessToken();
      return zohoRequest<T>(config, attempt, true);
    }

    if (isRetryable && attempt < 3) {
      await sleep(400 * Math.pow(2, attempt) + Math.floor(Math.random() * 150));
      return zohoRequest<T>(config, attempt + 1, refreshed);
    }

    throw err;
  }
}

// -------------------------
// search helpers
// -------------------------
async function findContactByEmail(email: string): Promise<Record<string, unknown> | null> {
  const criteria = encodeURIComponent(`(Email:equals:${email})`);
  const url = `https://${configs.zohoApiCRMDomain}/crm/v2/Contacts/search?criteria=${criteria}`;

  try {
    const data = await zohoRequest<{ data: Record<string, unknown>[] }>({ method: "GET", url });
    return data?.data?.[0] ?? null;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 204 || status === 404) return null;
    }
    throw err;
  }
}

async function findDealByPaymentIntentId(
  paymentIntentId: string,
): Promise<Record<string, unknown> | null> {
  const pi = cleanStr(paymentIntentId);
  if (!pi) return null;

  const criteria = encodeURIComponent(`(${DEAL_FIELDS.Stripe_Payment_Intent_ID}:equals:${pi})`);
  const url = `https://${configs.zohoApiCRMDomain}/crm/v2/Deals/search?criteria=${criteria}`;

  try {
    const data = await zohoRequest<{ data: Record<string, unknown>[] }>({ method: "GET", url });
    return data?.data?.[0] ?? null;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 204 || status === 404) return null;
    }
    throw err;
  }
}

// ======================================================
// CONTACT UPSERT (purchase snapshot)
// ======================================================
export async function createOrUpdateContact(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;

  productType: string;
  amount: number; // cents
  currency: string;
  site?: string;

  stripePaymentIntentId: string;
  stripeCustomerId?: string;
  leadSource?: string;

  productNameForZoho?: string;
}): Promise<{ contactId: string; isNew: boolean }> {
  const email = cleanStr(data.email)?.toLowerCase();
  if (!email) throw new Error("Email is required");

  const existing = await findContactByEmail(email);

  const nowDT = toZohoDateTime(new Date());
  const amountMajor =
    typeof data.amount === "number" ? Math.round((data.amount / 100) * 100) / 100 : 0;
  const currencyUpper = (data.currency || "usd").toUpperCase();

  const safeFirstName = cleanStr(data.firstName)
    ? truncate(cleanStr(data.firstName) as string, 80)
    : undefined;
  const safeLastName = cleanStr(data.lastName)
    ? truncate(cleanStr(data.lastName) as string, 80)
    : undefined;
  const safePhone = cleanStr(data.phone) ? truncate(cleanStr(data.phone) as string, 50) : undefined;

  const purchasedValue = pickPurchasedProduct(data.productType, data.productNameForZoho);

  console.log("HUGELOG", data);

  // ---------- UPDATE ----------
  if (existing?.id) {
    const patch: Record<string, unknown> = {
      id: existing.id,

      [CONTACT_FIELDS.Last_Product_Purchased]: cleanStr(data.productType),
      [CONTACT_FIELDS.Last_Purchase_Amount]: amountMajor,
      [CONTACT_FIELDS.Last_Purchase_Currency]: currencyUpper,
      [CONTACT_FIELDS.Last_Purchase_Date]: nowDT,
    };

    // keep first purchase fields if empty
    setIfEmpty(
      patch,
      CONTACT_FIELDS.First_Product_Purchased,
      existing[CONTACT_FIELDS.First_Product_Purchased],
      data.productType,
    );
    setIfEmpty(
      patch,
      CONTACT_FIELDS.First_Purchase_Date,
      existing[CONTACT_FIELDS.First_Purchase_Date],
      nowDT,
    );
    setIfEmpty(
      patch,
      CONTACT_FIELDS.Lead_Source,
      existing[CONTACT_FIELDS.Lead_Source],
      data.leadSource,
    );
    // name/phone non-degrading
    setIfEmptyOrPlaceholder(
      patch,
      CONTACT_FIELDS.First_Name,
      existing[CONTACT_FIELDS.First_Name],
      safeFirstName,
    );
    setIfEmptyOrPlaceholder(
      patch,
      CONTACT_FIELDS.Last_Name,
      existing[CONTACT_FIELDS.Last_Name],
      safeLastName,
    );
    setIfBetterPhone(patch, CONTACT_FIELDS.Phone, existing[CONTACT_FIELDS.Phone], safePhone);

    // safe identifiers: fill if empty
    setIfEmpty(patch, CONTACT_FIELDS.Site, existing[CONTACT_FIELDS.Site], cleanStr(data.site));
    setIfEmpty(
      patch,
      CONTACT_FIELDS.Stripe_Customer_ID,
      existing[CONTACT_FIELDS.Stripe_Customer_ID],
      cleanStr(data.stripeCustomerId),
    );

    // always update last PI (useful operationally)
    if (cleanStr(data.stripePaymentIntentId)) {
      patch[CONTACT_FIELDS.Stripe_Payment_Intent_ID] = cleanStr(data.stripePaymentIntentId);
    }

    // Purchased_Products: merge if valid
    if (purchasedValue) {
      const merged = mergeMultiSelect(existing[CONTACT_FIELDS.Purchased_Products], purchasedValue);
      if (merged) patch[CONTACT_FIELDS.Purchased_Products] = merged;
    }

    console.log("Updating existing Zoho contact", { email, id: existing.id, patch });

    const res = await zohoRequest({
      method: "PUT",
      url: `https://${configs.zohoApiCRMDomain}/crm/v2/Contacts`,
      data: { data: [patch] },
    });

    console.log("ZOHO RAW RESPONSE:");
    console.log(JSON.stringify(res, null, 2));

    return { contactId: existing.id as string, isNew: false };
  }

  // ---------- CREATE ----------
  const createData: Record<string, unknown> = {
    [CONTACT_FIELDS.Email]: email,
    [CONTACT_FIELDS.First_Name]: safeFirstName || "Unknown",
    [CONTACT_FIELDS.Last_Name]: safeLastName || "Customer",

    [CONTACT_FIELDS.First_Product_Purchased]: cleanStr(data.productType),
    [CONTACT_FIELDS.Last_Product_Purchased]: cleanStr(data.productType),

    [CONTACT_FIELDS.First_Purchase_Date]: nowDT,
    [CONTACT_FIELDS.Last_Purchase_Date]: nowDT,

    [CONTACT_FIELDS.Last_Purchase_Amount]: amountMajor,
    [CONTACT_FIELDS.Last_Purchase_Currency]: currencyUpper,
    [CONTACT_FIELDS.Lead_Source]: cleanStr(data.leadSource),

    [CONTACT_FIELDS.Stripe_Payment_Intent_ID]: cleanStr(data.stripePaymentIntentId),
  };

  if (safePhone) createData[CONTACT_FIELDS.Phone] = safePhone;
  if (cleanStr(data.site)) createData[CONTACT_FIELDS.Site] = cleanStr(data.site);
  if (cleanStr(data.stripeCustomerId))
    createData[CONTACT_FIELDS.Stripe_Customer_ID] = cleanStr(data.stripeCustomerId);
  if (purchasedValue) createData[CONTACT_FIELDS.Purchased_Products] = [purchasedValue];

  const createRes = await zohoRequest<any>({
    method: "POST",
    url: `https://${configs.zohoApiCRMDomain}/crm/v2/Contacts`,
    data: { data: [createData] },
  });

  const newId = createRes?.data?.[0]?.details?.id as string | undefined;
  if (!newId)
    throw new Error(`Failed to create Zoho contact. Response: ${JSON.stringify(createRes)}`);

  return { contactId: newId, isNew: true };
}

// ======================================================
// DEAL CREATE (purchase snapshot)
// ======================================================
export async function createDeal(data: {
  contactId: string;
  dealName: string;

  amount: number; // cents
  currency: string;

  productType: string;
  paymentIntentId: string;

  site?: string;
  customerId?: string;

  checkoutVariant?: string;

  layoutId?: string;
  leadSource?: string;
}): Promise<string | null> {
  const paymentIntentId = cleanStr(data.paymentIntentId);
  if (!paymentIntentId) throw new Error("paymentIntentId is required");

  const existing = await findDealByPaymentIntentId(paymentIntentId);
  if (existing?.id) return existing.id as string;

  const amountMajor =
    typeof data.amount === "number" ? Math.round((data.amount / 100) * 100) / 100 : 0;
  const currencyUpper = (data.currency || "usd").toUpperCase();

  const dealData: Record<string, unknown> = {
    [DEAL_FIELDS.Deal_Name]: truncate(
      cleanStr(data.dealName) || `Purchase - ${paymentIntentId}`,
      120,
    ),
    [DEAL_FIELDS.Amount]: amountMajor,
    [DEAL_FIELDS.Stage]: "Closed Won",
    [DEAL_FIELDS.Contact_Name]: { id: data.contactId },

    [DEAL_FIELDS.Product_Type]: cleanStr(data.productType),
    [DEAL_FIELDS.Stripe_Payment_Intent_ID]: paymentIntentId,
    [DEAL_FIELDS.Purchase_Currency]: currencyUpper,
    [DEAL_FIELDS.Lead_Source]: cleanStr(data.leadSource),

    [DEAL_FIELDS.Closing_Date]: toZohoDateOnly(new Date()),
    [DEAL_FIELDS.Description]: [
      `Product: ${cleanStr(data.productType) || "-"}`,
      `Payment Intent: ${paymentIntentId}`,
      cleanStr(data.site) ? `Website: ${cleanStr(data.site)}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  };

  const layoutId = cleanStr(data.layoutId);
  if (layoutId) dealData[DEAL_FIELDS.Layout] = { id: layoutId };

  if (cleanStr(data.site)) dealData[DEAL_FIELDS.Site] = cleanStr(data.site);
  if (cleanStr(data.customerId))
    dealData[DEAL_FIELDS.Stripe_Customer_ID] = cleanStr(data.customerId);
  if (cleanStr(data.checkoutVariant))
    dealData[DEAL_FIELDS.Checkout_Variant] = cleanStr(data.checkoutVariant);

  try {
    const createRes = await zohoRequest<any>({
      method: "POST",
      url: `https://${configs.zohoApiCRMDomain}/crm/v2/Deals`,
      data: { data: [dealData] },
    });

    const row = createRes?.data?.[0];
    if (!row) return null;
    if (row.status === "error") return null;

    return (row?.details?.id as string | undefined) ?? null;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Zoho create deal HTTP error", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      return null;
    }
    throw err;
  }
}

// ======================================================
// Funnel update by email (advance-only) + ✅ Abandoned markers
// ======================================================
export async function updateContactFunnelStepByEmail(params: {
  email: string;
  funnelStep: AppFunnelStep;
  checkoutStatus?: string;
  lastError?: string;

  // ✅ extra abandoned info (optional)
  abandonedAt?: Date;
  abandonedReason?: string;
}): Promise<{ contactId: string } | null> {
  const email = cleanStr(params.email)?.toLowerCase();
  if (!email) throw new Error("Email is required");

  const existing = await findContactByEmail(email);
  if (!existing?.id) return null;

  // We don't store "checkout_viewed" in CRM (Analytics only)
  if (params.funnelStep === "checkout_viewed") return { contactId: existing.id as string };

  const next = toZohoFunnelStep(params.funnelStep);
  const canAdvance = shouldAdvanceZoho(existing[CONTACT_FIELDS.Funnel_Step], next);

  const patch: Record<string, unknown> = { id: existing.id };

  const errMsg = cleanStr(params.lastError);
  if (errMsg) patch[CONTACT_FIELDS.Last_Checkout_Error] = truncate(errMsg, 240);

  const autoStatus = toZohoCheckoutStatus(next, params.funnelStep);
  const statusToWrite = cleanStr(params.checkoutStatus) || cleanStr(autoStatus);
  if (statusToWrite) patch[CONTACT_FIELDS.Checkout_Status] = truncate(statusToWrite, 60);

  // ✅ IMPORTANT:
  // Abandoned is not a "CRM funnel step" (we keep lead_captured there),
  // but we DO need a marketing marker for campaigns.
  if (params.funnelStep === "abandoned") {
    patch[CONTACT_FIELDS.Abandoned_Checkout_At] = toZohoDateTime(params.abandonedAt ?? new Date());

    const r = cleanStr(params.abandonedReason);
    if (r) patch[CONTACT_FIELDS.Abandoned_Reason] = truncate(r, 120);

    // If caller didn't pass status, ensure meaningful status for segmenting
    if (!statusToWrite) patch[CONTACT_FIELDS.Checkout_Status] = "Abandoned Checkout";
  }

  // advance-only funnel step (unchanged behavior)
  if (canAdvance) {
    patch[CONTACT_FIELDS.Funnel_Step] = next;
    patch[CONTACT_FIELDS.Funnel_Updated_At] = toZohoDateTime(new Date());
  }

  // if only id => nothing to update
  if (Object.keys(patch).length === 1) return { contactId: existing.id as string };

  await zohoRequest({
    method: "PUT",
    url: `https://${configs.zohoApiCRMDomain}/crm/v2/Contacts`,
    data: { data: [patch] },
  });

  return { contactId: existing.id as string };
}
