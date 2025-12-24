import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getValidAccessToken } from "@/lib/zoho-token-manager";

export async function POST(req: NextRequest) {
  try {
    const token = await getValidAccessToken();
    const body = await req.json();

    const { zohoId } = body || {};

    if (!zohoId || typeof zohoId !== "string") {
      return NextResponse.json(
        { error: "Missing required field: zohoId" },
        { status: 400 },
      );
    }

    const moduleName = "Agents";

    const res = await axios.delete(
      `https://www.zohoapis.com/crm/v2/${encodeURIComponent(
        moduleName,
      )}/${encodeURIComponent(zohoId)}`,
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
        "Zoho Delete Agent Error:",
        error.response?.data || error.message,
      );
      return NextResponse.json(
        { error: "Failed to delete Zoho Agent", details: error.response?.data },
        { status: error.response?.status || 500 },
      );
    }

    console.error("Unexpected error while deleting Zoho Agent:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
