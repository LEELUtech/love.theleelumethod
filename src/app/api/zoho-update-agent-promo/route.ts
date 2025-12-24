import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getValidAccessToken } from "@/lib/zoho-token-manager";

// Updates a record in Zoho CRM "Agents" module setting Promo_Code field
export async function POST(req: NextRequest) {
  try {
    const token = await getValidAccessToken();
    const body = await req.json();

    const { zohoId, promoCode } = body || {};

    if (!zohoId || typeof zohoId !== "string") {
      return NextResponse.json(
        { error: "Missing required field: zohoId" },
        { status: 400 },
      );
    }
    if (
      promoCode === undefined ||
      promoCode === null ||
      typeof promoCode !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing required field: promoCode" },
        { status: 400 },
      );
    }

    const moduleName = "Agents";

    const res = await axios.put(
      `https://www.zohoapis.com/crm/v2/${encodeURIComponent(
        moduleName,
      )}/${encodeURIComponent(zohoId)}`,
      { data: [{ Promo_Code: promoCode }] },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );

    return NextResponse.json(res.data, { status: 200 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Zoho Update Agent Promo Error:",
        error.response?.data || error.message,
      );
      return NextResponse.json(
        {
          error: "Failed to update Zoho Agent promo",
          details: error.response?.data,
        },
        { status: error.response?.status || 500 },
      );
    }

    console.error("Unexpected error while updating Zoho Agent promo:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
