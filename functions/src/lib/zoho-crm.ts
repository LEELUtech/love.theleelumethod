// functions/src/lib/zoho-crm.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { configs } from "../configs/env";

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;

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

  if (configs.zohoApiDomain !== "sandbox.zohoapis.com") {
    throw new Error(`Zoho API domain is not sandbox: ${configs.zohoApiDomain}`);
  }
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((x) => x.trim()).filter(Boolean);
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return [];
    return s.split(/[;,]/g).map((x) => x.trim()).filter(Boolean);
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

  const bufferMs = 60_000;
  cachedAccessToken = accessToken;
  cachedAccessTokenExpiresAt = Date.now() + expiresInSec * 1000 - bufferMs;

  return accessToken;
}

async function getValidAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt) return cachedAccessToken;
  return refreshZohoAccessToken();
}

async function zohoRequest<T = any>(config: AxiosRequestConfig, retry = true): Promise<T> {
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

    if (retry && isAuthIssue) {
      cachedAccessToken = null;
      cachedAccessTokenExpiresAt = 0;
      await refreshZohoAccessToken();
      return zohoRequest<T>(config, false);
    }

    throw err;
  }
}

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

  const criteria = encodeURIComponent(`(Stripe_Payment_Intent_ID:equals:${pi})`);
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

  productNameForZoho?: string; // must match multi-select option value if used
}): Promise<{ contactId: string; isNew: boolean }> {
  const email = cleanStr(data.email)?.toLowerCase();
  if (!email) throw new Error("Email is required");

  const existing = await findContactByEmail(email);

  const amountMajor = typeof data.amount === "number" ? data.amount / 100 : 0;
  const currencyUpper = (data.currency || "usd").toUpperCase();
  const nowDT = toZohoDateTime(new Date());

  const purchasedValue = pickPurchasedProduct(data.productType, data.productNameForZoho);

  if (existing?.id) {
    const updateData: Record<string, any> = {
      id: existing.id,
      Last_Product_Purchased: data.productType,
      Last_Purchase_Amount: amountMajor,
      Last_Purchase_Currency: currencyUpper,
      Last_Purchase_Date: nowDT,
    };

    if (cleanStr(data.stripePaymentIntentId)) {
      updateData.Stripe_Payment_Intent_ID = cleanStr(data.stripePaymentIntentId);
    }

    setIfEmpty(updateData, "First_Product_Purchased", existing.First_Product_Purchased, data.productType);
    setIfEmpty(updateData, "First_Purchase_Date", existing.First_Purchase_Date, nowDT);

    setIfEmpty(updateData, "First_Name", existing.First_Name, data.firstName);
    setIfEmpty(updateData, "Last_Name", existing.Last_Name, data.lastName);
    setIfEmpty(updateData, "Phone", existing.Phone, data.phone);

    setIfEmpty(updateData, "Site", existing.Site, data.site);
    setIfEmpty(updateData, "Stripe_Customer_ID", existing.Stripe_Customer_ID, data.stripeCustomerId);

    setIfEmpty(updateData, "First_UTM_Source", existing.First_UTM_Source, data.utmSource);
    setIfEmpty(updateData, "First_UTM_Medium", existing.First_UTM_Medium, data.utmMedium);
    setIfEmpty(updateData, "First_UTM_Campaign", existing.First_UTM_Campaign, data.utmCampaign);
    setIfEmpty(updateData, "First_UTM_Content", existing.First_UTM_Content, data.utmContent);
    setIfEmpty(updateData, "First_UTM_Term", existing.First_UTM_Term, data.utmTerm);
    setIfEmpty(updateData, "First_Landing_Page", existing.First_Landing_Page, data.pagePath);

    if (purchasedValue) {
      const current = uniq(asStringArray(existing.Purchased_Products));
      const next = uniq([...current, purchasedValue]);
      if (!sameSet(current, next)) updateData.Purchased_Products = next;
    }

    const resp = await zohoRequest<any>({
      method: "PUT",
      url: `https://${configs.zohoApiDomain}/crm/v2/Contacts`,
      data: { data: [updateData] },
    });

    console.log("ZOHO CONTACT PUT", JSON.stringify(resp));
    return { contactId: existing.id, isNew: false };
  }

  const createData: Record<string, any> = {
    Email: email,
    First_Name: cleanStr(data.firstName) || "Unknown",
    Last_Name: cleanStr(data.lastName) || "Customer",

    First_Product_Purchased: data.productType,
    Last_Product_Purchased: data.productType,

    First_Purchase_Date: nowDT,
    Last_Purchase_Date: nowDT,

    Last_Purchase_Amount: amountMajor,
    Last_Purchase_Currency: currencyUpper,

    Stripe_Payment_Intent_ID: cleanStr(data.stripePaymentIntentId),
  };

  if (purchasedValue) createData.Purchased_Products = [purchasedValue];

  if (cleanStr(data.phone)) createData.Phone = cleanStr(data.phone);
  if (cleanStr(data.stripeCustomerId)) createData.Stripe_Customer_ID = cleanStr(data.stripeCustomerId);
  if (cleanStr(data.site)) createData.Site = cleanStr(data.site);

  if (cleanStr(data.utmSource)) createData.First_UTM_Source = cleanStr(data.utmSource);
  if (cleanStr(data.utmMedium)) createData.First_UTM_Medium = cleanStr(data.utmMedium);
  if (cleanStr(data.utmCampaign)) createData.First_UTM_Campaign = cleanStr(data.utmCampaign);
  if (cleanStr(data.utmContent)) createData.First_UTM_Content = cleanStr(data.utmContent);
  if (cleanStr(data.utmTerm)) createData.First_UTM_Term = cleanStr(data.utmTerm);
  if (cleanStr(data.pagePath)) createData.First_Landing_Page = cleanStr(data.pagePath);

  const createRes = await zohoRequest<any>({
    method: "POST",
    url: `https://${configs.zohoApiDomain}/crm/v2/Contacts`,
    data: { data: [createData] },
  });

  console.log("ZOHO CONTACT POST", JSON.stringify(createRes));

  const newId = createRes?.data?.[0]?.details?.id;
  if (!newId) throw new Error(`Failed to get new contact ID. Response: ${JSON.stringify(createRes)}`);

  return { contactId: newId, isNew: true };
}

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

  const existing = await findDealByPaymentIntentId(paymentIntentId);
  if (existing?.id) return existing.id;

  const amountMajor = typeof data.amount === "number" ? data.amount / 100 : 0;
  const currencyUpper = (data.currency || "usd").toUpperCase();

  const dealData: Record<string, any> = {
    Deal_Name: cleanStr(data.dealName) || `Purchase - ${paymentIntentId}`,
    Amount: amountMajor,
    Stage: "Closed Won",

    Contact_Name: { id: data.contactId },

    Product_Type: data.productType,
    Stripe_Payment_Intent_ID: paymentIntentId,
    Purchase_Currency: currencyUpper,

    Description: [
      `Product: ${data.productType}`,
      `Payment Intent: ${paymentIntentId}`,
      data.site ? `Website: ${data.site}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  };

  if (cleanStr(data.site)) dealData.Source_Website = cleanStr(data.site);
  if (cleanStr(data.customerId)) dealData.Stripe_Customer_ID = cleanStr(data.customerId);

  if (cleanStr(data.utmSource)) dealData.UTM_Source = cleanStr(data.utmSource);
  if (cleanStr(data.utmMedium)) dealData.UTM_Medium = cleanStr(data.utmMedium);
  if (cleanStr(data.utmCampaign)) dealData.UTM_Campaign = cleanStr(data.utmCampaign);
  if (cleanStr(data.utmContent)) dealData.UTM_Content = cleanStr(data.utmContent);
  if (cleanStr(data.utmTerm)) dealData.UTM_Term = cleanStr(data.utmTerm);

  if (cleanStr(data.checkoutVariant)) dealData.Checkout_Variant = cleanStr(data.checkoutVariant);
  if (cleanStr(data.pagePath)) dealData.Page_Path = cleanStr(data.pagePath);

  try {
    const createRes = await zohoRequest<any>({
      method: "POST",
      url: `https://${configs.zohoApiDomain}/crm/v2/Deals`,
      data: { data: [dealData] },
    });

    console.log("ZOHO DEAL POST", JSON.stringify(createRes));

    const dealId = createRes?.data?.[0]?.details?.id;
    return dealId || null;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Zoho create deal error", err.response?.data || err.message);
      return null;
    }
    throw err;
  }
}
