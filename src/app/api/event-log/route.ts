export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { emitFunnelEvent, type FunnelEventRow } from "@/lib/emitFunnelEvent";

type Body = Partial<FunnelEventRow>;

function safeString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s : null;
}

function toNumberOrNull(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    const event_id = safeString(body?.event_id);
    const source = safeString(body?.source);
    const funnel_step = safeString(body?.funnel_step);
    const event_name = safeString(body?.event_name);

    if (!event_id) {
      return NextResponse.json({ ok: false, error: "event_id is required" }, { status: 400 });
    }
    if (!source) {
      return NextResponse.json({ ok: false, error: "source is required" }, { status: 400 });
    }

    if (!event_name && !funnel_step) {
      return NextResponse.json(
        { ok: false, error: "event_name or funnel_step is required" },
        { status: 400 },
      );
    }

    const normalized: FunnelEventRow = {
      ...(body as FunnelEventRow),

      event_id,
      source,

      event_name: event_name ?? null,
      funnel_step: funnel_step ?? null,

      scroll_depth: toNumberOrNull(body.scroll_depth),
      time_on_page_sec: toNumberOrNull(body.time_on_page_sec),
      amount: toNumberOrNull(body.amount),
    };

    try {
      await emitFunnelEvent(normalized);
    } catch (err) {
      console.error("event-log emit failed", err);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("event-log fatal", e);
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
