import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { db } from "../configs/firebase";

const WEBINAR_DISCOUNT_HOURS = 48;
const CHECKOUT_BASE_URL = "https://love.theleelumethod.com/programs/self-guided-transformation";

const WEBINAR_DISCOUNT_KEY = defineSecret("WEBINAR_DISCOUNT_KEY");

function normEmail(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim().toLowerCase();
  return s && s.includes("@") ? s : null;
}

export const claimWebinarDiscount = onRequest(
  {
    region: "us-central1",
    secrets: [WEBINAR_DISCOUNT_KEY],
  },
  async (req, res) => {
    const rawEmail = req.query.email;
    const email = normEmail(rawEmail);
    const checkoutUrl = email
      ? `${CHECKOUT_BASE_URL}?email=${encodeURIComponent(email)}`
      : CHECKOUT_BASE_URL;

    try {
      if (!email) {
        res.redirect(302, CHECKOUT_BASE_URL);
        return;
      }

      const expectedKey = WEBINAR_DISCOUNT_KEY.value();
      const providedKey = String(req.query.key || "");

      if (!expectedKey || providedKey !== expectedKey) {
        console.warn("claimWebinarDiscount: invalid key", { email });
        res.redirect(302, checkoutUrl);
        return;
      }

      const expiresAt = new Date(Date.now() + WEBINAR_DISCOUNT_HOURS * 60 * 60 * 1000);
      const docId = email.replace(/[^a-z0-9]/g, "_");

      await db.collection("webinar_discounts").doc(docId).set({ email, expires_at: expiresAt });
      console.log("claimWebinarDiscount: discount written", { email, expiresAt });

      res.redirect(302, checkoutUrl);
    } catch (err) {
      console.error("claimWebinarDiscount error:", err);
      // Still redirect to checkout — discount just won't show
      res.redirect(302, checkoutUrl);
    }
  }
);
