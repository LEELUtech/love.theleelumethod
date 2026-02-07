import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { configs } from "../configs/env";

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;

function assertZohoOAuthConfig() {
  if (!configs.zohoRefreshToken) throw new Error("ZOHO_REFRESH_TOKEN_SANDBOX is missing");
  if (!configs.zohoClientId) throw new Error("ZOHO_CLIENT_ID_SANDBOX is missing");
  if (!configs.zohoClientSecret) throw new Error("ZOHO_CLIENT_SECRET_SANDBOX is missing");
  if (!configs.zohoAccountsDomain) throw new Error("ZOHO_ACCOUNTS_DOMAIN_SANDBOX is missing");
  if (!configs.zohoApiDomain) throw new Error("ZOHO_API_DOMAIN_SANDBOX is missing");

  if (configs.zohoApiDomain !== "sandbox.zohoapis.com") {
    throw new Error(`❌ Zoho API domain is not sandbox: ${configs.zohoApiDomain}`);
  }
}

async function refreshZohoAccessToken(): Promise<{ accessToken: string; expiresAt: number }> {
  assertZohoOAuthConfig();

  const url = `https://${configs.zohoAccountsDomain}/oauth/v2/token`;

  const res = await axios.post(
    url,
    null,
    {
      params: {
        refresh_token: configs.zohoRefreshToken,
        client_id: configs.zohoClientId,
        client_secret: configs.zohoClientSecret,
        grant_type: "refresh_token",
      },
      timeout: 15000,
    },
  );

  const accessToken = res.data?.access_token as string | undefined;
  const expiresInSec = Number(res.data?.expires_in ?? 0);

  if (!accessToken || !expiresInSec) {
    throw new Error(`Failed to refresh Zoho access token. Response: ${JSON.stringify(res.data)}`);
  }

  const bufferMs = 60_000;
  const expiresAt = Date.now() + expiresInSec * 1000 - bufferMs;

  cachedAccessToken = accessToken;
  cachedAccessTokenExpiresAt = expiresAt;

  return { accessToken, expiresAt };
}

export async function getValidAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt) return cachedAccessToken;
  const { accessToken } = await refreshZohoAccessToken();
  return accessToken;
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
    const error = err as AxiosError<any>;
    const status = error.response?.status;

    const zohoCode =
      error.response?.data?.code ||
      error.response?.data?.data?.[0]?.code;

    const isAuthIssue =
      status === 401 ||
      zohoCode === "INVALID_TOKEN" ||
      zohoCode === "AUTHENTICATION_FAILURE";

    if (retry && isAuthIssue) {
      cachedAccessToken = null;
      cachedAccessTokenExpiresAt = 0;
      await refreshZohoAccessToken();
      return zohoRequest<T>(config, false);
    }

    throw err;
  }
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}

export async function createOrUpdateContact(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  productType: string;
  amount: number;
  currency: string;
  site: string;
  stripePaymentIntentId: string;
  stripeCustomerId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  pagePath?: string;
}): Promise<{ contactId: string; isNew: boolean }> {
  const {
    email,
    firstName,
    lastName,
    phone,
    productType,
    amount,
    currency,
    site,
    stripePaymentIntentId,
    stripeCustomerId,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    pagePath,
  } = data;

  // 1) Search by email
  let existing: any | null = null;
  try {
    const criteria = encodeURIComponent(`(Email:equals:${email})`);
    const url = `https://${configs.zohoApiDomain}/crm/v2/Contacts/search?criteria=${criteria}`;
    const searchData = await zohoRequest<any>({ method: "GET", url });
    existing = searchData?.data?.[0] ?? null;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 204 || status === 404) existing = null;
      else throw err;
    } else {
      throw err;
    }
  }

  // 2) Update
  if (existing?.id) {
    const existingStatus = asStringArray(existing.contactStatus);
    const newStatus = `Purchased: ${productType}`;
    const combinedStatus = [...new Set([...existingStatus, newStatus])];

    const updateData: Record<string, unknown> = {
      id: existing.id,
      contactStatus: combinedStatus,
      Last_Product_Purchased: productType,
      Last_Purchase_Amount: amount / 100,
      Last_Purchase_Currency: currency.toUpperCase(),
      Last_Purchase_Date: new Date().toISOString(),
      Stripe_Payment_Intent_ID: stripePaymentIntentId,
    };

    // fill blanks only
    if (firstName && !existing.First_Name) updateData.First_Name = firstName;
    if (lastName && !existing.Last_Name) updateData.Last_Name = lastName;
    if (phone && !existing.Phone) updateData.Phone = phone;

    // site: keep clean
    if (site && !existing.Site) updateData.Site = site;
    // if (site && !existing.Site_Source) updateData.Site_Source = site;

    if (stripeCustomerId) updateData.Stripe_Customer_ID = stripeCustomerId;

    // first-touch attribution only if empty
    if (utmSource && !existing.First_UTM_Source) updateData.First_UTM_Source = utmSource;
    if (utmMedium && !existing.First_UTM_Medium) updateData.First_UTM_Medium = utmMedium;
    if (utmCampaign && !existing.First_UTM_Campaign) updateData.First_UTM_Campaign = utmCampaign;
    if (utmContent && !existing.First_UTM_Content) updateData.First_UTM_Content = utmContent;
    if (utmTerm && !existing.First_UTM_Term) updateData.First_UTM_Term = utmTerm;
    if (pagePath && !existing.First_Landing_Page) updateData.First_Landing_Page = pagePath;

    await zohoRequest<any>({
      method: "PUT",
      url: `https://${configs.zohoApiDomain}/crm/v2/Contacts`,
      data: { data: [updateData] },
    });

    return { contactId: existing.id, isNew: false };
  }

  // 3) Create new
  const createData: Record<string, unknown> = {
    Email: email,
    First_Name: firstName || "Unknown",
    Last_Name: lastName || "Customer",
    contactStatus: [`Purchased: ${productType}`],
    First_Product_Purchased: productType,
    Last_Product_Purchased: productType,
    Last_Purchase_Amount: amount / 100,
    Last_Purchase_Currency: currency.toUpperCase(),
    First_Purchase_Date: new Date().toISOString(),
    Last_Purchase_Date: new Date().toISOString(),
    Stripe_Payment_Intent_ID: stripePaymentIntentId,
  };

  if (phone) createData.Phone = phone;
  if (stripeCustomerId) createData.Stripe_Customer_ID = stripeCustomerId;
  if (site) {
    createData.Site = site;
    createData.Site_Source = site;
  }

  if (utmSource) createData.First_UTM_Source = utmSource;
  if (utmMedium) createData.First_UTM_Medium = utmMedium;
  if (utmCampaign) createData.First_UTM_Campaign = utmCampaign;
  if (utmContent) createData.First_UTM_Content = utmContent;
  if (utmTerm) createData.First_UTM_Term = utmTerm;
  if (pagePath) createData.First_Landing_Page = pagePath;

  const createRes = await zohoRequest<any>({
    method: "POST",
    url: `https://${configs.zohoApiDomain}/crm/v2/Contacts`,
    data: { data: [createData] },
  });

  const newId = createRes?.data?.[0]?.details?.id;
  if (!newId) {
    throw new Error(`Failed to get new contact ID from Zoho. Response: ${JSON.stringify(createRes)}`);
  }

  return { contactId: newId, isNew: true };
}

export async function createDeal(data: {
  contactId: string;
  dealName: string;
  amount: number;
  currency: string;
  productType: string;
  paymentIntentId: string;
  site: string;
  customerId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  checkoutVariant?: string;
  pagePath?: string;
}): Promise<string | null> {
  const {
    contactId,
    dealName,
    amount,
    currency,
    productType,
    paymentIntentId,
    site,
    customerId,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    checkoutVariant,
    pagePath,
  } = data;

  const dealData: Record<string, unknown> = {
    Deal_Name: dealName,
    Amount: amount / 100,
    Stage: "Closed Won",
    Contact_Name: { id: contactId },
    Product_Type: productType,
    Stripe_Payment_Intent_ID: paymentIntentId,
    Purchase_Currency: currency.toUpperCase(),
    Description: `Product: ${productType}\nPayment Intent: ${paymentIntentId}\nWebsite: ${site || ""}`,
  };

  if (site) dealData.Source_Website = site;
  if (customerId) dealData.Stripe_Customer_ID = customerId;

  if (utmSource) dealData.UTM_Source = utmSource;
  if (utmMedium) dealData.UTM_Medium = utmMedium;
  if (utmCampaign) dealData.UTM_Campaign = utmCampaign;
  if (utmContent) dealData.UTM_Content = utmContent;
  if (utmTerm) dealData.UTM_Term = utmTerm;

  if (checkoutVariant) dealData.Checkout_Variant = checkoutVariant;
  if (pagePath) dealData.Page_Path = pagePath;

  try {
    const createRes = await zohoRequest<any>({
      method: "POST",
      url: `https://${configs.zohoApiDomain}/crm/v2/Deals`,
      data: { data: [dealData] },
    });

    const dealId = createRes?.data?.[0]?.details?.id;
    return dealId || null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("⚠️ Zoho create deal error:", error.response?.data || error.message);
      return null;
    }
    throw error;
  }
}
