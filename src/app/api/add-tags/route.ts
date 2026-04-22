export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getCohortData } from "@/lib/cohort";

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedAccessToken && now < tokenExpiresAt) return cachedAccessToken;

  const refreshToken = process.env.ZOHO_REFRESH_TOKEN_CAMPAIGN_LILYCHYSTOFAT;
  const clientId = process.env.ZOHO_CLIENT_ID_LILYCHYSTOFAT;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET_LILYCHYSTOFAT;

  if (!refreshToken || !clientId || !clientSecret) {
    throw new Error("Missing Zoho Campaigns credentials");
  }

  const url = new URL("https://accounts.zoho.com/oauth/v2/token");
  url.searchParams.set("refresh_token", refreshToken);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("client_secret", clientSecret);
  url.searchParams.set("grant_type", "refresh_token");

  const resp = await fetch(url.toString(), { method: "POST" });
  const data = await resp.json();

  if (!resp.ok || !data.access_token) throw new Error("Failed to refresh Zoho access token");

  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedAccessToken!;
}

function authHeaders(token: string) {
  return { Authorization: `Zoho-oauthtoken ${token}` };
}

async function ensureSubscribed(email: string, token: string, listkey?: string) {
  const resolvedListKey = listkey || process.env.ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT;
  if (!resolvedListKey) throw new Error("Missing ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT or listkey param");

  const contact: Record<string, string> = { "Contact Email": email };

  const cohort = await getCohortData();
  if (cohort.date) contact["Cohort Start Date"] = cohort.date;
  if (cohort.label) contact["Cohort Start Date Name"] = cohort.label;

  const body = new URLSearchParams();
  body.set("resfmt", "JSON");
  body.set("listkey", resolvedListKey);
  body.set("contactinfo", JSON.stringify(contact));

  const resp = await fetch("https://campaigns.zoho.com/api/v1.1/json/listsubscribe", {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = await resp.json().catch(() => null);
  console.log("[add-tags] listsubscribe response", { email, status: resp.status, result });
}

async function ensureTag(tag: string, token: string) {
  const url = new URL("https://campaigns.zoho.com/api/v1.1/tag/add");
  url.searchParams.set("tagName", tag);
  await fetch(url.toString(), { method: "GET", headers: authHeaders(token) });
}

async function addTag(tag: string, email: string, token: string) {
  const url = new URL("https://campaigns.zoho.com/api/v1.1/tag/associate");
  url.searchParams.set("resfmt", "JSON");
  url.searchParams.set("tagName", tag);
  url.searchParams.set("lead_email", email);
  await fetch(url.toString(), { method: "GET", headers: authHeaders(token) });
}

async function removeTag(tag: string, email: string, token: string) {
  const url = new URL("https://campaigns.zoho.com/api/v1.1/tag/deassociate");
  url.searchParams.set("resfmt", "JSON");
  url.searchParams.set("tagName", tag);
  url.searchParams.set("lead_email", email);
  await fetch(url.toString(), { method: "GET", headers: authHeaders(token) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = (body.email || "").trim().toLowerCase();
    const add: string[] = Array.isArray(body.add) ? body.add : [];
    const remove: string[] = Array.isArray(body.remove) ? body.remove : [];

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    if (!add.length && !remove.length) {
      return NextResponse.json({ ok: false, error: "No tags provided" }, { status: 400 });
    }

    const token = await getAccessToken();

    const skipSubscribe = !!body.skip_subscribe || !!body.skipSubscribe || false;
    if (!skipSubscribe) {
      const listkeyFromBody = typeof body.listkey === "string" && body.listkey.trim() ? String(body.listkey).trim() : undefined;
      await ensureSubscribed(email, token, listkeyFromBody);
    }

    for (const tag of [...new Set(remove)].filter(Boolean)) {
      await removeTag(tag, email, token);
    }

    for (const tag of [...new Set(add)].filter(Boolean)) {
      await ensureTag(tag, token);
      await addTag(tag, email, token);
    }

    return NextResponse.json({ ok: true, email, add, remove });
  } catch (err: unknown) {
    console.error("campaigns/update-tags error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}