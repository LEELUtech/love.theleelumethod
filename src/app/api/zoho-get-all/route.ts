import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getValidAccessToken } from '@/lib/zoho-token-manager'

export async function GET(req: NextRequest) {
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Zoho request error" }, { status: 500 });
  }
}
