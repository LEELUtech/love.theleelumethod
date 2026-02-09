/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/zoho/lead-captured/route.ts
import { NextRequest, NextResponse } from "next/server";
import { upsertContactLeadCaptured } from "@/lib/zoho-functions.sandbox";

type Body = {
  email: string;
  pagePath?: string;
  site?: string;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v?: string | null) {
  const s = (v ?? "").trim();
  return s ? s : undefined;
}

function normalizeSite(raw?: string | null): string | undefined {
  const s = (raw || "").trim();
  if (!s) return undefined;

  try {
    if (s.startsWith("http://") || s.startsWith("https://")) {
      const host = new URL(s).host.toLowerCase();
      return host.split(":")[0]; // remove port
    }
  } catch {}

  const host = s.replace(/\/+$/, "").toLowerCase();
  return host.split(":")[0]; // remove port
}

function getIncomingSite(req: Request): string | undefined {
  const raw = req.headers.get("x-forwarded-host") || req.headers.get("host");
  return normalizeSite(raw);
}

function errToLogObject(e: any) {
  const status = e?.response?.status;
  const data = e?.response?.data;
  const headers = e?.response?.headers;
  return {
    status,
    data,
    zohoRequestId: headers?.["x-request-id"] ?? headers?.["X-Request-Id"],
    url: e?.config?.url,
    method: e?.config?.method,
    message: e?.message,
  };
}

export async function POST(req: NextRequest) {
  const requestId = `zl_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const body = (await req.json()) as Body;

    const email = clean(body.email)?.toLowerCase();
    if (!email || !emailRegex.test(email)) {
      // onBlur: never break UI
      return NextResponse.json({ ok: false, ignored: true, requestId }, { status: 200 });
    }

    const site = normalizeSite(body.site) || getIncomingSite(req);
    const pagePath = clean(body.pagePath);

    try {
      const zoho = await upsertContactLeadCaptured({
        email,
        site,
        pagePath,

        utmSource: clean(body.utmSource),
        utmMedium: clean(body.utmMedium),
        utmCampaign: clean(body.utmCampaign),
        utmContent: clean(body.utmContent),
        utmTerm: clean(body.utmTerm),
      });

      return NextResponse.json({ ok: true, requestId, zoho }, { status: 200 });
    } catch (e: any) {
      console.error("⚠️ Zoho lead-captured failed (non-critical)", { requestId, ...errToLogObject(e) });
      return NextResponse.json({ ok: false, requestId }, { status: 200 });
    }
  } catch (err: unknown) {
    console.error("❌ lead-captured endpoint error:", { requestId, err });
    return NextResponse.json({ ok: false, requestId }, { status: 200 });
  }
}
