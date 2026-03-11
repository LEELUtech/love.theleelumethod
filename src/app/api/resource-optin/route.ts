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


export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    const email = clean(body.email)?.toLowerCase();
    if (!email || !emailRegex.test(email)) {
      console.log("[resource-optin] ignored: invalid email", { raw: body.email });
      return NextResponse.json({ ok: true, ignored: true });
    }

    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const site = process.env.ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT || "unknown";
    const pagePath = clean(body.pagePath);

    console.log("[resource-optin] start", { email, firstName, lastName, site, pagePath, resource: body.resource });

    // Zoho CRM — create/update contact (non-critical)
    try {
      console.log("[resource-optin] CRM upsert start", { email });
      const crmResult = await upsertContactLeadCaptured({ email, site, firstName, lastName });
      console.log("[resource-optin] CRM upsert ok", crmResult);
    } catch (e) {
      console.error("[resource-optin] CRM upsert FAILED", {
        email,
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      });
    }

    // Analytics event
    try {
      const sessionId = clean(body.sessionId);
      const eventId = `${sessionId ?? email}:resource_optin:${email}`;

      console.log("[resource-optin] emitFunnelEvent start", { eventId });
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
      console.log("[resource-optin] emitFunnelEvent ok", { eventId });
    } catch (e) {
      console.error("[resource-optin] emitFunnelEvent FAILED", {
        error: e instanceof Error ? e.message : String(e),
      });
    }

    console.log("[resource-optin] done", { email });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("resource-optin error:", e);
    return NextResponse.json({ ok: true }); // always 200
  }
}
