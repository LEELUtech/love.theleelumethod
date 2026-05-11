import { NextRequest, NextResponse } from "next/server";
import { markQuizCompleted } from "@/lib/zoho-crm-scoring";
import { emitFunnelEvent } from "@/lib/emitFunnelEvent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const quizResult = typeof body.quizResult === "string" ? body.quizResult.trim() : undefined;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const site = process.env.ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT || "unknown";
    await markQuizCompleted(email, site, quizResult);

    await emitFunnelEvent({
      event_id: `quiz_completed_${email.replace(/[^a-z0-9]/g, "_")}_${Date.now()}`,
      source: "web:server",
      funnel_step: "lead_captured",
      event_name: "quiz_completed",
      email,
      site,
      ...(quizResult ? { quiz_result: quizResult } : {}),
    });

    return NextResponse.json({ ok: true, email });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[quiz-completed] error", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
