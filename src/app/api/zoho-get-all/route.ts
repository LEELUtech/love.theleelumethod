import { NextResponse } from "next/server";
import axios from "axios";
import { getValidAccessToken } from '@/lib/zoho-token-manager'

export async function GET() {
  try {
    const token = await getValidAccessToken();
    const res = await axios.get(
      "https://www.zohoapis.com/crm/v2/Contacts",
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      }
    );
    return NextResponse.json(res.data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Zoho request error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
