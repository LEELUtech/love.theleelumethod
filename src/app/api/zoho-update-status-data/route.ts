import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getValidAccessToken } from "@/lib/zoho-token-manager";

export async function POST(req: NextRequest) {
  const token = await getValidAccessToken();

  try {
    const { email, contactStatus } = await req.json();

    const searchResponse = await axios.get(
      `https://www.zohoapis.com/crm/v3/Contacts/search?email=${encodeURIComponent(
        email,
      )}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );
    let updatedContactStatus = contactStatus;

    if (Array.isArray(contactStatus) && contactStatus.length === 4) {
      updatedContactStatus = ["bought_bundle"];
    }

    let existingStatuses = [];
    if (searchResponse.data.data && searchResponse.data.data.length > 0) {
      existingStatuses = searchResponse.data.data[0].contactStatus || [];
    }

    if (contactStatus.some((status: string) => status.startsWith("bought"))) {
      existingStatuses = existingStatuses.filter(
        (status: string) =>
          status !== "video_viewed" && status !== "filledForm_noPurchase",
      );
    }

    const updatedStatuses = [
      ...new Set([...existingStatuses, updatedContactStatus].flat()),
    ];

    const zohoResponse = await axios.post(
      "https://www.zohoapis.com/crm/v3/Contacts/upsert",
      {
        data: [
          {
            Email: email,
            contactStatus: updatedStatuses,
          },
        ],
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );

    return NextResponse.json(zohoResponse.data);
  } catch (error) {
    console.error("ZOHO update error:", error);
    return NextResponse.json(
      { message: "Failed to update ZOHO contact" },
      { status: 500 },
    );
  }
}
