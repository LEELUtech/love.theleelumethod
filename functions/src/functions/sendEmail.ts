import { onCall } from "firebase-functions/v2/https";
import { upsertContactAndUpdateTags } from "../lib/zoho-campaigns";

const LM_DL_TRIGGER = "lm_dl_trigger";
export const sendEmail = onCall({ cors: true }, async (req) => {
  const { firstName, email } = req.data || {};

  if (!firstName || !email) {
    throw new Error("Missing required fields: firstName, email");
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const normalizedFirstName = String(firstName).trim();


  await upsertContactAndUpdateTags(
    normalizedEmail,
    { add: ["lm_dl", LM_DL_TRIGGER] },
    { firstName: normalizedFirstName }
  );

  console.log("sendEmail: lm_dl_trigger added", { email: normalizedEmail });
  return { success: true };
});