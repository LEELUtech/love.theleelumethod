import { NextRequest, NextResponse } from "next/server";
import { markSalesPageVisited, markPricingPageVisited, markSessionCompleted } from "@/lib/zoho-crm-scoring";

const KNOWN_EVENTS = ["sales_page_visited", "pricing_page_visited", "session_completed"] as const;
type ScoringEvent = (typeof KNOWN_EVENTS)[number];

function isScoringEvent(v: unknown): v is ScoringEvent {
  return typeof v === "string" && (KNOWN_EVENTS as readonly string[]).includes(v);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const event = body.event;

    if (!email || !isScoringEvent(event)) {
      return NextResponse.json({ ok: false, error: "missing or invalid email/event" }, { status: 400 });
    }

    if (event === "sales_page_visited") {
      await markSalesPageVisited(email);
    } else if (event === "pricing_page_visited") {
      await markPricingPageVisited(email);
    } else if (event === "session_completed") {
      await markSessionCompleted(email);
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[score-crm] error", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
