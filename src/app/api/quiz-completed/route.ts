import { NextRequest, NextResponse } from "next/server";
import { markQuizCompleted } from "@/lib/zoho-crm-scoring";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const site = process.env.ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT || "unknown";
    await markQuizCompleted(email, site);

    return NextResponse.json({ ok: true, email });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[quiz-completed] error", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
