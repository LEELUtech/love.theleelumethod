import { doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";
import { db } from '@/lib/firebase'

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID!;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET!;

export async function getValidAccessToken(): Promise<string> {
  const tokenRef = doc(db, "tokens", "zoho");
  const snapshot = await getDoc(tokenRef);

  if (!snapshot.exists()) throw new Error("Zoho token not found");

  const { access_token, refresh_token, expires_at } = snapshot.data();

  const now = Date.now();

  if (now < expires_at - 60_000) {
    return access_token;
  }

  const response = await axios.post(
    "https://accounts.zoho.com/oauth/v2/token",
    null,
    {
      params: {
        refresh_token,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
      },
    },
  );

  const newToken = response.data.access_token;
  const expiresIn = response.data.expires_in;

  await setDoc(tokenRef, {
    access_token: newToken,
    refresh_token,
    expires_at: Date.now() + expiresIn * 1000,
  });

  return newToken;
}
