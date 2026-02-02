import { NextRequest, NextResponse } from "next/server";

import { getValidAccessToken } from '@/lib/zoho-token-manager'
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }


    const token = await getValidAccessToken();
    const searchParams = `email=${encodeURIComponent(email)}`;
    const zohoUrl = `https://www.zohoapis.com/crm/v2/Contacts/search?${searchParams}`;
    const response = await axios.get(zohoUrl, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
      return NextResponse.json(response.data.data[0]);
    } else {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data || error.message;
      return NextResponse.json({ error: message }, { status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
