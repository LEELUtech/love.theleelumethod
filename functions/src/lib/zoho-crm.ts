import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { configs } from "../configs/env";

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;

// -------------------------
// Zoho field API names (1 place to edit)
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
  Purchased_Products: "Purchased_Products",

  First_Purchase_Date: "First_Purchase_Date",
  Last_Purchase_Date: "Last_Purchase_Date",
  Last_Purchase_Amount: "Last_Purchase_Amount",
  Last_Purchase_Currency: "Last_Purchase_Currency",

  First_UTM_Source: "First_UTM_Source",
  First_UTM_Medium: "First_UTM_Medium",
  First_UTM_Campaign: "First_UTM_Campaign",
  First_UTM_Content: "First_UTM_Content",
  First_UTM_Term: "First_UTM_Term",
  First_Landing_Page: "First_Landing_Page",

  Funnel_Step: "Funnel_Step",
  Funnel_Updated_At: "Funnel_Updated_At",
  Checkout_Status: "Checkout_Status",
  Last_Checkout_Error: "Last_Checkout_Error",
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

  UTM_Source: "UTM_Source",
  UTM_Medium: "UTM_Medium",
  UTM_Campaign: "UTM_Campaign",
  UTM_Content: "UTM_Content",
  UTM_Term: "UTM_Term",

  Checkout_Variant: "Checkout_Variant",
  Page_Path: "Page_Path",

  Description: "Description",
} as const;

// -------------------------
// Product picklist guard
// -------------------------
const ZOHO_PRODUCT_VALUES = new Set([
  "compatibility_report",
  "protocol_essentials",
  "guided_breakthrough",
  "vip_immersion",
]);

function cleanStr(v?: string | null) {
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

function ensureZohoConfig() {
  if (!configs.zohoRefreshToken) throw new Error("ZOHO_REFRESH_TOKEN_SANDBOX is missing");
  if (!configs.zohoClientId) throw new Error("ZOHO_CLIENT_ID_SANDBOX is missing");
  if (!configs.zohoClientSecret) throw new Error("ZOHO_CLIENT_SECRET_SANDBOX is missing");
  if (!configs.zohoAccountsDomain) throw new Error("ZOHO_ACCOUNTS_DOMAIN_SANDBOX is missing");
  if (!configs.zohoApiDomain) throw new Error("ZOHO_API_DOMAIN_SANDBOX is missing");

  // safety: sandbox only (remove if you will support prod)
  if (configs.zohoApiDomain !== "sandbox.zohoapis.com") {
    throw new Error(`Zoho API domain is not sandbox: ${configs.zohoApiDomain}`);
  }
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
  return [...new Set(arr.map((x) => x.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function sameSet(a: string[], b: string[]) {
  const A = new Set(uniq(a));
  const B = new Set(uniq(b));
  if (A.size !== B.size) return false;
  for (const x of A) if (!B.has(x)) return false;
  return true;
}

function setIfEmpty(obj: Record<string, any>, key: string, current: any, next?: any) {
  const v = typeof next === "string" ? cleanStr(next) : next;
  if (v === undefined || v === null) return;
  if (!current) obj[key] = v;
}

function pickPurchasedProduct(productType: string, override?: string) {
  const o = cleanStr(override);
  if (o && ZOHO_PRODUCT_VALUES.has(o)) return o;

  const pt = cleanStr(productType);
  if (pt && ZOHO_PRODUCT_VALUES.has(pt)) return pt;

  return undefined; // do not write invalid values
}

// -------------------------
// Funnel mapping (Zoho picklist values)
// -------------------------
/**
 * По твоему скрину Funnel_Step в Zoho:
 * - lead_captured
 * - checkout_started
 * - abandoned
 * - payment_failed
 * - paid
 * - delivered
 * - delivery_failed
 * (checkout_viewed — если его реально нет в picklist, лучше НЕ писать его)
 */
export type ZohoFunnelStep =
  | "lead_captured"
  | "checkout_started"
  | "abandoned"
  | "payment_failed"
  | "paid"
  | "delivered"
  | "delivery_failed";

/**
 * App / Firestore шаги:
 */
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
  if (step === "failed") return "payment_failed";
  if (step === "canceled") return "payment_failed"; // canceled отдельно нет — маппим сюда
  if (step === "delivery_failed") return "delivery_failed";
  if (step === "paid") return "paid";
  if (step === "delivered") return "delivered";
  if (step === "abandoned") return "abandoned";
  if (step === "checkout_started") return "checkout_started";
  if (step === "lead_captured") return "lead_captured";

  // checkout_viewed: если в Zoho нет такого значения — не пишем его никогда,
  // но сюда мы всё равно не должны приходить (см. updateContactFunnelStepByEmail).
  return "lead_captured";
}

const ZOHO_FUNNEL_RANK: Record<ZohoFunnelStep, number> = {
  lead_captured: 20,
  abandoned: 25,
  checkout_started: 30,
  paid: 40,
  delivered: 50,
  delivery_failed: 55,
  payment_failed: 60,
};

function normalizeZohoStep(v: unknown): ZohoFunnelStep | undefined {
  const s = String(v ?? "").trim();
  if (!s) return undefined;
  if (s in ZOHO_FUNNEL_RANK) return s as ZohoFunnelStep;
  return undefined;
}

/** advance-only funnel in Zoho */
function shouldAdvanceZoho(existing: unknown, next: ZohoFunnelStep) {
  const ex = normalizeZohoStep(existing);
  if (!ex) return true;
  return ZOHO_FUNNEL_RANK[next] >= ZOHO_FUNNEL_RANK[ex];
}

function toZohoCheckoutStatus(step: ZohoFunnelStep, original?: AppFunnelStep) {
  if (original === "canceled") return "Canceled";

  if (step === "checkout_started") return "Checkout Started";
  if (step === "lead_captured") return "Lead Captured";
  if (step === "abandoned") return "Abandoned Checkout";
  if (step === "payment_failed") return "Payment Failed";
  if (step === "paid") return "Paid";
  if (step === "delivered") return "Delivered";
  if (step === "delivery_failed") return "Delivery Failed";
  return undefined;
}

// -------------------------
// OAuth token
// -------------------------
async function refreshZohoAccessToken(): Promise<string> {
  ensureZohoConfig();

  const url = `https://${configs.zohoAccountsDomain}/oauth/v2/token`;
  const res = await axios.post(url, null, {
    params: {
      refresh_token: configs.zohoRefreshToken,
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

  // buffer 60s
  const bufferMs = 60_000;
  cachedAccessToken = accessToken;
  cachedAccessTokenExpiresAt = Date.now() + expiresInSec * 1000 - bufferMs;

  return accessToken;
}

async function getValidAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt) return cachedAccessToken;
  return refreshZohoAccessToken();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// -------------------------
// request wrapper with retries
// - 401 / invalid token => refresh once
// - 429 / 5xx => exponential backoff
// -------------------------
async function zohoRequest<T = any>(
  config: AxiosRequestConfig,
  opts?: { attempt?: number; refreshed?: boolean },
): Promise<T> {
  const attempt = opts?.attempt ?? 0;
  const refreshed = opts?.refreshed ?? false;

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
  } catch (err) {
    const e = err as AxiosError<any>;
    const status = e.response?.status;
    const zohoCode = e.response?.data?.code || e.response?.data?.data?.[0]?.code;

    const isAuthIssue =
      status === 401 || zohoCode === "INVALID_TOKEN" || zohoCode === "AUTHENTICATION_FAILURE";

    const isRetryable =
      status === 429 || (typeof status === "number" && status >= 500 && status <= 599);

    console.error("ZOHO REQUEST FAILED", {
      method: finalConfig.method,
      url: finalConfig.url,
      status,
      zohoCode,
      response: e.response?.data,
      attempt,
    });

    // 1) refresh token once on auth issues
    if (isAuthIssue && !refreshed) {
      cachedAccessToken = null;
      cachedAccessTokenExpiresAt = 0;
      await refreshZohoAccessToken();
      return zohoRequest<T>(config, { attempt, refreshed: true });
    }

    // 2) retry on 429/5xx with backoff (max 3 retries)
    if (isRetryable && attempt < 3) {
      const base = 400; // ms
      const backoff = base * Math.pow(2, attempt) + Math.floor(Math.random() * 150);
      await sleep(backoff);
      return zohoRequest<T>(config, { attempt: attempt + 1, refreshed });
    }

    throw err;
  }
}

// -------------------------
// search helpers
// -------------------------
async function findContactByEmail(email: string): Promise<any | null> {
  const criteria = encodeURIComponent(`(Email:equals:${email})`);
  const url = `https://${configs.zohoApiDomain}/crm/v2/Contacts/search?criteria=${criteria}`;

  try {
    const data = await zohoRequest<any>({ method: "GET", url });
    return data?.data?.[0] ?? null;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 204 || status === 404) return null;
    }
    throw err;
  }
}

async function findDealByPaymentIntentId(paymentIntentId: string): Promise<any | null> {
  const pi = cleanStr(paymentIntentId);
  if (!pi) return null;

  const criteria = encodeURIComponent(`(${DEAL_FIELDS.Stripe_Payment_Intent_ID}:equals:${pi})`);
  const url = `https://${configs.zohoApiDomain}/crm/v2/Deals/search?criteria=${criteria}`;

  try {
    const data = await zohoRequest<any>({ method: "GET", url });
    return data?.data?.[0] ?? null;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 204 || status === 404) return null;
    }
    throw err;
  }
}

// -------------------------
// CONTACT upsert (purchase)
// -------------------------
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

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  pagePath?: string;

  productNameForZoho?: string; // must match picklist option if used
}): Promise<{ contactId: string; isNew: boolean }> {
  const email = cleanStr(data.email)?.toLowerCase();
  if (!email) throw new Error("Email is required");

  const existing = await findContactByEmail(email);

  const amountMajor =
    typeof data.amount === "number" ? Math.round((data.amount / 100) * 100) / 100 : 0;
  const currencyUpper = (data.currency || "usd").toUpperCase();
  const nowDT = toZohoDateTime(new Date());

  const purchasedValue = pickPurchasedProduct(data.productType, data.productNameForZoho);

  const safeFirstName = cleanStr(data.firstName)
    ? truncate(cleanStr(data.firstName)!, 80)
    : undefined;
  const safeLastName = cleanStr(data.lastName) ? truncate(cleanStr(data.lastName)!, 80) : undefined;
  const safePhone = cleanStr(data.phone) ? truncate(cleanStr(data.phone)!, 50) : undefined;

  if (existing?.id) {
    const updateData: Record<string, any> = {
      id: existing.id,

      [CONTACT_FIELDS.Last_Product_Purchased]: cleanStr(data.productType) || undefined,
      [CONTACT_FIELDS.Last_Purchase_Amount]: amountMajor,
      [CONTACT_FIELDS.Last_Purchase_Currency]: currencyUpper,
      [CONTACT_FIELDS.Last_Purchase_Date]: nowDT,
    };

    if (cleanStr(data.stripePaymentIntentId)) {
      updateData[CONTACT_FIELDS.Stripe_Payment_Intent_ID] = cleanStr(data.stripePaymentIntentId);
    }

    setIfEmpty(
      updateData,
      CONTACT_FIELDS.First_Product_Purchased,
      existing[CONTACT_FIELDS.First_Product_Purchased],
      data.productType,
    );
    setIfEmpty(
      updateData,
      CONTACT_FIELDS.First_Purchase_Date,
      existing[CONTACT_FIELDS.First_Purchase_Date],
      nowDT,
    );

    setIfEmpty(
      updateData,
      CONTACT_FIELDS.First_Name,
      existing[CONTACT_FIELDS.First_Name],
      safeFirstName,
    );
    setIfEmpty(
      updateData,
      CONTACT_FIELDS.Last_Name,
      existing[CONTACT_FIELDS.Last_Name],
      safeLastName,
    );
    setIfEmpty(updateData, CONTACT_FIELDS.Phone, existing[CONTACT_FIELDS.Phone], safePhone);

    setIfEmpty(updateData, CONTACT_FIELDS.Site, existing[CONTACT_FIELDS.Site], cleanStr(data.site));
    setIfEmpty(
      updateData,
      CONTACT_FIELDS.Stripe_Customer_ID,
      existing[CONTACT_FIELDS.Stripe_Customer_ID],
      cleanStr(data.stripeCustomerId),
    );

    setIfEmpty(
      updateData,
      CONTACT_FIELDS.First_UTM_Source,
      existing[CONTACT_FIELDS.First_UTM_Source],
      cleanStr(data.utmSource),
    );
    setIfEmpty(
      updateData,
      CONTACT_FIELDS.First_UTM_Medium,
      existing[CONTACT_FIELDS.First_UTM_Medium],
      cleanStr(data.utmMedium),
    );
    setIfEmpty(
      updateData,
      CONTACT_FIELDS.First_UTM_Campaign,
      existing[CONTACT_FIELDS.First_UTM_Campaign],
      cleanStr(data.utmCampaign),
    );
    setIfEmpty(
      updateData,
      CONTACT_FIELDS.First_UTM_Content,
      existing[CONTACT_FIELDS.First_UTM_Content],
      cleanStr(data.utmContent),
    );
    setIfEmpty(
      updateData,
      CONTACT_FIELDS.First_UTM_Term,
      existing[CONTACT_FIELDS.First_UTM_Term],
      cleanStr(data.utmTerm),
    );
    setIfEmpty(
      updateData,
      CONTACT_FIELDS.First_Landing_Page,
      existing[CONTACT_FIELDS.First_Landing_Page],
      cleanStr(data.pagePath),
    );

    // multi-select Purchased_Products: add purchasedValue only if valid + not already present
    if (purchasedValue) {
      const current = uniq(asStringArray(existing[CONTACT_FIELDS.Purchased_Products]));
      const next = uniq([...current, purchasedValue]);
      if (!sameSet(current, next)) updateData[CONTACT_FIELDS.Purchased_Products] = next;
    }

    const resp = await zohoRequest<any>({
      method: "PUT",
      url: `https://${configs.zohoApiDomain}/crm/v2/Contacts`,
      data: { data: [updateData] },
    });

    console.log("ZOHO CONTACT PUT OK", JSON.stringify(resp));
    return { contactId: existing.id, isNew: false };
  }

  // CREATE NEW
  const createData: Record<string, any> = {
    [CONTACT_FIELDS.Email]: email,
    [CONTACT_FIELDS.First_Name]: safeFirstName || "Unknown",
    [CONTACT_FIELDS.Last_Name]: safeLastName || "Customer",

    [CONTACT_FIELDS.First_Product_Purchased]: cleanStr(data.productType) || undefined,
    [CONTACT_FIELDS.Last_Product_Purchased]: cleanStr(data.productType) || undefined,

    [CONTACT_FIELDS.First_Purchase_Date]: nowDT,
    [CONTACT_FIELDS.Last_Purchase_Date]: nowDT,

    [CONTACT_FIELDS.Last_Purchase_Amount]: amountMajor,
    [CONTACT_FIELDS.Last_Purchase_Currency]: currencyUpper,

    [CONTACT_FIELDS.Stripe_Payment_Intent_ID]: cleanStr(data.stripePaymentIntentId),
  };

  if (purchasedValue) createData[CONTACT_FIELDS.Purchased_Products] = [purchasedValue];

  if (safePhone) createData[CONTACT_FIELDS.Phone] = safePhone;
  if (cleanStr(data.stripeCustomerId))
    createData[CONTACT_FIELDS.Stripe_Customer_ID] = cleanStr(data.stripeCustomerId);
  if (cleanStr(data.site)) createData[CONTACT_FIELDS.Site] = cleanStr(data.site);

  if (cleanStr(data.utmSource))
    createData[CONTACT_FIELDS.First_UTM_Source] = cleanStr(data.utmSource);
  if (cleanStr(data.utmMedium))
    createData[CONTACT_FIELDS.First_UTM_Medium] = cleanStr(data.utmMedium);
  if (cleanStr(data.utmCampaign))
    createData[CONTACT_FIELDS.First_UTM_Campaign] = cleanStr(data.utmCampaign);
  if (cleanStr(data.utmContent))
    createData[CONTACT_FIELDS.First_UTM_Content] = cleanStr(data.utmContent);
  if (cleanStr(data.utmTerm)) createData[CONTACT_FIELDS.First_UTM_Term] = cleanStr(data.utmTerm);
  if (cleanStr(data.pagePath))
    createData[CONTACT_FIELDS.First_Landing_Page] = cleanStr(data.pagePath);

  const createRes = await zohoRequest<any>({
    method: "POST",
    url: `https://${configs.zohoApiDomain}/crm/v2/Contacts`,
    data: { data: [createData] },
  });

  console.log("ZOHO CONTACT POST OK", JSON.stringify(createRes));

  const newId = createRes?.data?.[0]?.details?.id;
  if (!newId)
    throw new Error(`Failed to get new contact ID. Response: ${JSON.stringify(createRes)}`);

  return { contactId: newId, isNew: true };
}

// -------------------------
// DEAL create (with Layout + Closing_Date)
// -------------------------
export async function createDeal(data: {
  contactId: string;
  dealName: string;

  amount: number; // cents
  currency: string;

  productType: string;
  paymentIntentId: string;

  site?: string;
  customerId?: string;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  checkoutVariant?: string;
  pagePath?: string;
}): Promise<string | null> {
  const paymentIntentId = cleanStr(data.paymentIntentId);
  if (!paymentIntentId) throw new Error("paymentIntentId is required");

  // dedupe by PI
  const existing = await findDealByPaymentIntentId(paymentIntentId);
  if (existing?.id) return existing.id;

  const amountMajor =
    typeof data.amount === "number" ? Math.round((data.amount / 100) * 100) / 100 : 0;
  const currencyUpper = (data.currency || "usd").toUpperCase();

  // ✅ Closing_Date format required by Zoho: YYYY-MM-DD
  const closingDate = new Date().toISOString().slice(0, 10);

  // ✅ take from env (recommended). fallback to hardcoded if not set
  const layoutId = cleanStr(process.env.ZOHO_DEAL_LAYOUT_ID_SANDBOX) || undefined;

  if (!layoutId) {
    console.warn(
      "ZOHO: missing deal layout id (ZOHO_DEAL_LAYOUT_ID_SANDBOX). Deal will be created in default layout.",
    );
  }

  const dealData: Record<string, any> = {
    [DEAL_FIELDS.Deal_Name]: cleanStr(data.dealName)
      ? truncate(cleanStr(data.dealName)!, 120)
      : `Purchase - ${paymentIntentId}`,

    [DEAL_FIELDS.Amount]: amountMajor,
    [DEAL_FIELDS.Stage]: "Closed Won",
    [DEAL_FIELDS.Contact_Name]: { id: data.contactId },

    [DEAL_FIELDS.Product_Type]: cleanStr(data.productType) || undefined,
    [DEAL_FIELDS.Stripe_Payment_Intent_ID]: paymentIntentId,
    [DEAL_FIELDS.Purchase_Currency]: currencyUpper,

    // ✅ required by your layout (keep it required in Zoho)
    [DEAL_FIELDS.Closing_Date]: closingDate,

    [DEAL_FIELDS.Description]: [
      `Product: ${cleanStr(data.productType) || "-"}`,
      `Payment Intent: ${paymentIntentId}`,
      cleanStr(data.site) ? `Website: ${cleanStr(data.site)}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  };

  // ✅ Force your layout so you don't affect other websites / setups
  if (layoutId) {
    dealData[DEAL_FIELDS.Layout] = { id: layoutId };
  }

  // Your custom deal field "Site"
  if (cleanStr(data.site)) dealData[DEAL_FIELDS.Site] = cleanStr(data.site);

  if (cleanStr(data.customerId)) {
    dealData[DEAL_FIELDS.Stripe_Customer_ID] = cleanStr(data.customerId);
  }

  if (cleanStr(data.utmSource)) dealData[DEAL_FIELDS.UTM_Source] = cleanStr(data.utmSource);
  if (cleanStr(data.utmMedium)) dealData[DEAL_FIELDS.UTM_Medium] = cleanStr(data.utmMedium);
  if (cleanStr(data.utmCampaign)) dealData[DEAL_FIELDS.UTM_Campaign] = cleanStr(data.utmCampaign);
  if (cleanStr(data.utmContent)) dealData[DEAL_FIELDS.UTM_Content] = cleanStr(data.utmContent);
  if (cleanStr(data.utmTerm)) dealData[DEAL_FIELDS.UTM_Term] = cleanStr(data.utmTerm);

  if (cleanStr(data.checkoutVariant)) {
    dealData[DEAL_FIELDS.Checkout_Variant] = cleanStr(data.checkoutVariant);
  }
  if (cleanStr(data.pagePath)) {
    dealData[DEAL_FIELDS.Page_Path] = cleanStr(data.pagePath);
  }

  try {
    const createRes = await zohoRequest<any>({
      method: "POST",
      url: `https://${configs.zohoApiDomain}/crm/v2/Deals`,
      data: { data: [dealData] },
    });

    const row = createRes?.data?.[0];

    if (!row) {
      console.error("ZOHO DEAL POST: empty response", { createRes, dealData });
      return null;
    }

    if (row.status === "error") {
      console.error("ZOHO DEAL POST ERROR", {
        code: row.code,
        message: row.message,
        details: row.details,
        dealData,
      });
      return null;
    }

    const dealId = row?.details?.id;
    if (!dealId) {
      console.error("ZOHO DEAL POST: missing id in success response", { row, createRes });
      return null;
    }

    return dealId;
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

// -------------------------
// Funnel update by email (advance-only)
// -------------------------
export async function updateContactFunnelStepByEmail(params: {
  email: string;
  funnelStep: AppFunnelStep;
  checkoutStatus?: string;
  lastError?: string;
}): Promise<{ contactId: string } | null> {
  const email = cleanStr(params.email)?.toLowerCase();
  if (!email) throw new Error("Email is required");

  const existing = await findContactByEmail(email);
  if (!existing?.id) return null;

  // ✅ НЕ пишем checkout_viewed в Zoho (если его нет в picklist — будет ошибка)
  if (params.funnelStep === "checkout_viewed") {
    return { contactId: existing.id };
  }

  const zohoStep = toZohoFunnelStep(params.funnelStep);

  // ✅ advance-only (если в CRM уже paid/delivered, то abandoned не перетрёт)
  if (!shouldAdvanceZoho(existing[CONTACT_FIELDS.Funnel_Step], zohoStep)) {
    // но статус/ошибку можно обновить (например, lastError), без step
    const patch: Record<string, any> = { id: existing.id };

    const errMsg = cleanStr(params.lastError);
    if (errMsg) patch[CONTACT_FIELDS.Last_Checkout_Error] = truncate(errMsg, 240);

    const st = cleanStr(params.checkoutStatus);
    if (st) patch[CONTACT_FIELDS.Checkout_Status] = truncate(st, 60);

    if (Object.keys(patch).length === 1) return { contactId: existing.id };

    await zohoRequest<any>({
      method: "PUT",
      url: `https://${configs.zohoApiDomain}/crm/v2/Contacts`,
      data: { data: [patch] },
    });

    return { contactId: existing.id };
  }

  const updateData: Record<string, any> = {
    id: existing.id,
    [CONTACT_FIELDS.Funnel_Step]: zohoStep,
    [CONTACT_FIELDS.Funnel_Updated_At]: toZohoDateTime(new Date()),
  };

  // Checkout_Status: если не передали — ставим автоматически
  const autoStatus = toZohoCheckoutStatus(zohoStep, params.funnelStep);
  const statusToWrite = cleanStr(params.checkoutStatus) || cleanStr(autoStatus);
  if (statusToWrite) updateData[CONTACT_FIELDS.Checkout_Status] = truncate(statusToWrite, 60);

  // Last_Checkout_Error: ограничим длину
  const errMsg = cleanStr(params.lastError);
  if (errMsg) updateData[CONTACT_FIELDS.Last_Checkout_Error] = truncate(errMsg, 240);

  const resp = await zohoRequest<any>({
    method: "PUT",
    url: `https://${configs.zohoApiDomain}/crm/v2/Contacts`,
    data: { data: [updateData] },
  });

  console.log("ZOHO FUNNEL PUT OK", JSON.stringify(resp));

  return { contactId: existing.id };
}
