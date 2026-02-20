// app/api/campaigns/add-tags/route.ts

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  email: string;
  tags: string[];
};

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * 🔥 AUTO ACCESS TOKEN MANAGER
 */
async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (cachedAccessToken && now < tokenExpiresAt) {
    return cachedAccessToken;
  }

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

  if (!resp.ok || !data.access_token) {
    throw new Error("Failed to refresh Zoho access token");
  }

  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

  return cachedAccessToken!;
}

function authHeaders(token: string) {
  return { Authorization: `Zoho-oauthtoken ${token}` };
}

/**
 * Ensure contact exists in Campaigns list
 */
async function ensureSubscribed(email: string) {
  const token = await getAccessToken();
  const listkey = process.env.ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT;

  if (!listkey) {
    throw new Error("Missing ZOHO_CAMPAIGNS_LISTKEY_LILYCHYSTOFAT");
  }

  const contactinfo = `{Contact Email:${email}}`;

  const body = new URLSearchParams();
  body.set("resfmt", "JSON");
  body.set("listkey", listkey);
  body.set("contactinfo", contactinfo);

  const resp = await fetch(
    "https://campaigns.zoho.com/api/v1.1/json/listsubscribe",
    {
      method: "POST",
      headers: {
        ...authHeaders(token),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error("listsubscribe failed " + txt);
  }
}

async function ensureTag(tag: string) {
  const token = await getAccessToken();

  const url = new URL("https://campaigns.zoho.com/api/v1.1/tag/add");
  url.searchParams.set("tagName", tag);

  await fetch(url.toString(), {
    method: "GET",
    headers: authHeaders(token),
  });
}

async function addTag(tag: string, email: string) {
  const token = await getAccessToken();

  const url = new URL("https://campaigns.zoho.com/api/v1.1/tag/associate");
  url.searchParams.set("resfmt", "JSON");
  url.searchParams.set("tagName", tag);
  url.searchParams.set("lead_email", email);

  const resp = await fetch(url.toString(), {
    method: "GET",
    headers: authHeaders(token),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error("associate tag failed " + txt);
  }
}

/**
 * 🚀 UNIVERSAL ENTRY POINT
 */
async function upsertContactAndAddTags(email: string, tags: string[]) {
  const uniq = Array.from(new Set(tags)).filter(Boolean);

  if (!uniq.length) return;

  await ensureSubscribed(email);

  for (const tag of uniq) {
    await ensureTag(tag);
    await addTag(tag, email);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;

    const email = body.email?.trim().toLowerCase();
    const tags = Array.isArray(body.tags) ? body.tags : [];

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    if (!tags.length) {
      return NextResponse.json(
        { ok: false, error: "No tags provided" },
        { status: 400 }
      );
    }

    await upsertContactAndAddTags(email, tags);

    return NextResponse.json({
      ok: true,
      email,
      tags,
    });
  } catch (err: unknown) {
    console.error("campaigns/add-tags error:", err);

    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";

    return NextResponse.json(
      {
        ok: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
