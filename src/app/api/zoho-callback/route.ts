import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing code in query" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          // redirect_uri: "https://leelu.bndigital.dev/api/zoho-callback",
          redirect_uri: "http://localhost:3000/api/zoho-callback",
          code,
        },
      },
    );

    // Manual adding tokens to the Firebase
    // const { access_token, refresh_token, expires_in } = response.data

    // await setDoc(doc(db, 'tokens', 'zoho'), {
    //     access_token,
    //     refresh_token,
    //     expires_at: Date.now() + expires_in * 1000,
    // })

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Zoho error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch tokens from Zoho" },
      { status: 500 },
    );
  }
}
