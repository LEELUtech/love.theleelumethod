import { NextRequest, NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/zoho-token-manager";

export async function POST(req: NextRequest) {
  try {
    const token = await getValidAccessToken();
    const { email, agentName, agentZohoId, promoCode } = await req.json();

    if (!email || !agentName || !agentZohoId || !promoCode) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: email, agentName, agentZohoId, promoCode",
        },
        { status: 400 },
      );
    }

    // First, search for the contact by email
    const searchUrl = `https://www.zohoapis.com/crm/v2/Contacts/search?criteria=Email:equals:${encodeURIComponent(
      email,
    )}`;

    const searchResponse = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!searchResponse.ok) {
      console.error(
        "Failed to search ZOHO contact:",
        await searchResponse.text(),
      );
      return NextResponse.json(
        { error: "Failed to search contact in ZOHO" },
        { status: 500 },
      );
    }

    const searchData = await searchResponse.json();

    if (!searchData.data || searchData.data.length === 0) {
      return NextResponse.json(
        { error: "Contact not found in ZOHO" },
        { status: 404 },
      );
    }

    const contactId = searchData.data[0].id;

    // Update the contact with referral information
    const updateUrl = `https://www.zohoapis.com/crm/v2/Contacts/${contactId}`;

    const updateData = {
      data: [
        {
          Agent_Name: agentName,
          AgentID: agentZohoId,
          Promo_Code: promoCode,
        },
      ],
    };

    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!updateResponse.ok) {
      console.error(
        "Failed to update ZOHO contact:",
        await updateResponse.text(),
      );
      return NextResponse.json(
        { error: "Failed to update contact in ZOHO" },
        { status: 500 },
      );
    }

    const updateResult = await updateResponse.json();

    return NextResponse.json({
      success: true,
      message: "Contact updated successfully",
      data: updateResult,
    });
  } catch (error) {
    console.error("ZOHO update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
