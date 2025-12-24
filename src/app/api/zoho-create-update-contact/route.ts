import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getValidAccessToken } from "@/lib/zoho-token-manager";

export async function POST(req: NextRequest) {
  const token = await getValidAccessToken();
  const body = await req.json();

  const {
    firstName,
    lastName,
    email,
    gender,
    dateOfBirth,
    phoneNumber,
    contactStatus,
    videoId,
    userId,
  } = body;

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { error: "Missing contact fields" },
      { status: 400 },
    );
  }

  const dataToSend = {
    First_Name: firstName,
    Last_Name: lastName,
    Email: email,
    Gender: gender,
    Date_of_Birth: dateOfBirth,
    Phone: phoneNumber,
    contactStatus,
    videoId,
    userId,
    layout: {
      id: process.env.ZOHO_LAYOUT_LEELU_ID,
    },
  };

  try {
    const searchRes = await axios.get(
      `https://www.zohoapis.com/crm/v2/Contacts/search?email=${encodeURIComponent(
        email,
      )}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );

    const existingContact = searchRes.data?.data?.[0];

    if (existingContact?.id) {
      const existingStatus = existingContact.contactStatus || [];
      const newStatuses = Array.isArray(contactStatus)
        ? contactStatus
        : [contactStatus];
      const combinedStatus: string[] = [
        ...new Set([...existingStatus, ...newStatuses]),
      ];

      const updateRes = await axios.put(
        "https://www.zohoapis.com/crm/v2/Contacts",
        {
          data: [
            {
              id: existingContact.id,
              ...dataToSend,
              contactStatus: combinedStatus,
            },
          ],
        },
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${token}`,
          },
        },
      );
      return NextResponse.json(updateRes.data);
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status !== 204 && status !== 404) {
        console.error("Zoho Search Error:", err.response?.data || err.message);
        return NextResponse.json(
          { error: "Failed to search contact" },
          { status: 500 },
        );
      }
    } else {
      console.error("Unexpected error during search:", err);
      return NextResponse.json(
        { error: "Failed to search contact" },
        { status: 500 },
      );
    }
  }

  try {
    const createRes = await axios.post(
      "https://www.zohoapis.com/crm/v2/Contacts",
      {
        data: [dataToSend],
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );

    return NextResponse.json(createRes.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Zoho Create Contact Error:",
        error.response?.data || error.message,
      );
    } else {
      console.error("Unexpected error:", error);
    }

    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 },
    );
  }
}
