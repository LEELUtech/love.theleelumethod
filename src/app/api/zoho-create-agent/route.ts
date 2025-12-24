import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getValidAccessToken } from "@/lib/zoho-token-manager";

type ZohoCreateResponse = {
  data: Array<{
    code?: string;
    status?: string;
    message?: string;
    details?: { id?: string };
  }>;
};

export async function POST(req: NextRequest) {
  try {
    const token = await getValidAccessToken();
    const body = await req.json();

    const { name, email, phone } = body || {};

    if (!name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 },
      );
    }

    const dataToSend = {
      Name: name,
      Agent_Email: email,
      Phone_Number: phone,
    } as Record<string, unknown>;

    const moduleName = "Agents";

    const res = await axios.post<ZohoCreateResponse>(
      `https://www.zohoapis.com/crm/v2/${encodeURIComponent(moduleName)}`,
      { data: [dataToSend] },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );

    try {
      const createdId = res.data.data[0]?.details?.id;
      if (createdId) {
        await axios.put(
          `https://www.zohoapis.com/crm/v2/${encodeURIComponent(moduleName)}`,
          {
            data: [
              {
                id: createdId,
                Agent_id: createdId,
              },
            ],
          },
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${token}`,
            },
          },
        );
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(
          "Zoho post-create Agent_id update failed:",
          e.response?.data || e.message,
        );
      } else {
        console.error(
          "Zoho post-create Agent_id update failed:",
          e instanceof Error ? e.message : String(e),
        );
      }
    }

    return NextResponse.json(res.data, { status: 200 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Zoho Create Agent Error:",
        error.response?.data || error.message,
      );
      return NextResponse.json(
        { error: "Failed to create Zoho Agent", details: error.response?.data },
        { status: error.response?.status || 500 },
      );
    }

    console.error("Unexpected error while creating Zoho Agent:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
