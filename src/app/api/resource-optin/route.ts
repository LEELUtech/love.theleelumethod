// app/api/resource-optin/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { upsertContactLeadCaptured } from "@/lib/zoho-functions";
import { emitFunnelEvent } from "@/lib/emitFunnelEvent";

type Body = {
  email: string;
  firstName?: string;
  lastName?: string;

  site?: string;
  pagePath?: string;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  sessionId?: string;
  resource?: string; // e.g. "secrets"
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v?: string | null): string | undefined {
  const s = (v ?? "").trim();
  return s ? s : undefined;
}

function getIncomingSite(req: Request, bodySite?: string): string {
  const raw =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    bodySite ||
    process.env.DOMAIN_URL ||
    "unknown";
  const s = (raw ?? "").trim().split(":")[0].toLowerCase();
  return s || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    const email = clean(body.email)?.toLowerCase();
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const site = getIncomingSite(req, body.site);
    const pagePath = clean(body.pagePath);

    // Zoho CRM — create/update contact (non-critical)
    try {
      await upsertContactLeadCaptured({ email, site, firstName, lastName });
    } catch (e) {
      console.error("resource-optin: Zoho upsert failed (non-critical)", e);
    }

    // Analytics event
    try {
      const sessionId = clean(body.sessionId);
      const eventId = `${sessionId ?? email}:resource_optin:${email}`;

      await emitFunnelEvent({
        event_id: eventId,
        event_time: new Date().toISOString(),
        source: "web:server",
        funnel_step: "lead_captured",
        event_name: "resource_optin",

        email,
        first_name: firstName ?? null,
        last_name: lastName ?? null,

        session_id: sessionId ?? null,
        site,
        page_path: pagePath ?? null,
        landing_page: pagePath ? `https://${site}${pagePath}` : null,

        product_type: body.resource ?? "secrets",

        utm_last_source: clean(body.utmSource) ?? null,
        utm_last_medium: clean(body.utmMedium) ?? null,
        utm_last_campaign: clean(body.utmCampaign) ?? null,
        utm_last_content: clean(body.utmContent) ?? null,
        utm_last_term: clean(body.utmTerm) ?? null,
      });
    } catch (e) {
      console.error("resource-optin: emitFunnelEvent failed (non-critical)", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("resource-optin error:", e);
    return NextResponse.json({ ok: true }); // always 200
  }
}
