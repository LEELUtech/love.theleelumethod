import { NextRequest, NextResponse } from "next/server";
import { emitFunnelEvent } from "@/lib/emitFunnelEvent";

// Only allow safe filename characters — no path traversal
const SAFE_FILENAME = /^[a-z0-9-_]+$/;

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;

  if (!filename || !SAFE_FILENAME.test(filename)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!bucket) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 500 });
  }

  const { searchParams } = req.nextUrl;
  const email = searchParams.get("email") ?? null;
  const site = process.env.ZOHO_WEBSITE_DOMAIN_LILYCHYSTOFAT ?? "love.theleelumethod.com";

  try {
    await emitFunnelEvent({
      event_id: `report_dl_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      source: site,
      funnel_step: "report_downloaded",
      email,
      report_name: filename,
      utm_last_source: searchParams.get("utm_source") ?? null,
      utm_last_medium: searchParams.get("utm_medium") ?? null,
      utm_last_campaign: searchParams.get("utm_campaign") ?? null,
      utm_last_content: searchParams.get("utm_content") ?? null,
      utm_last_term: searchParams.get("utm_term") ?? null,
    });
  } catch {
    // non-critical — don't block the download
  }

  const encodedPath = encodeURIComponent(`reports/${filename}.pdf`);
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;

  return NextResponse.redirect(url, { status: 302 });
}
