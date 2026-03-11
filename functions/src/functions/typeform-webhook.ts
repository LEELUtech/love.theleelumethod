import { onRequest } from "firebase-functions/v2/https";
import { PATH_LABELS, TypeFormError, TypeformWebhookRequest } from "../types/typeform";
// import { db } from "../configs/firebase";
import { addTagToMember, findCircleMemberByEmail } from "../lib/circle";
// import { appendRowFunction } from "../lib/google-sheet";
// import { transformTypeformResponse } from "../utils/typeform/transformTypeformResponse";
// import { sendEmailFunction } from "../lib/nodemailer";
import { defineSecret } from "firebase-functions/params";
import { sendWelcomeMessage } from "../utils/helpers/circle";
import { transformTypeformResponse } from "../utils/typeform/transformTypeformResponse";
import { sendEmailFunction } from "../lib/nodemailer";
import { appendRowFunction } from "../lib/google-sheet";
import { db } from "../configs/firebase";

const SHEET_EMAIL = defineSecret("SHEET_EMAIL");
const SHEET_PRIVATE_KEY = defineSecret("SHEET_PRIVATE_KEY");
const SHEET_ID = defineSecret("SHEET_ID");
const SHEET_NAME = defineSecret("SHEET_NAME");

const SENDING_EMAIL = defineSecret("SENDING_EMAIL");
const SENDING_PASSWORD = defineSecret("SENDING_PASSWORD");

export const typeformWebhook = onRequest(
  {
    cors: true,
    region: "us-central1",
    secrets: [
      SHEET_EMAIL,
      SHEET_PRIVATE_KEY,
      SHEET_ID,
      SHEET_NAME,
      SENDING_EMAIL,
      SENDING_PASSWORD,
    ],
  },
  async (req, res) => {
    const body = req.body as TypeformWebhookRequest;

    const { email, tier, path, fullName } = body;

    if (!email || !fullName || !tier || !path) {
      res.status(400).json({ status: TypeFormError.MISSING_FIELDS });
      return;
    }

    const pathLabel = PATH_LABELS[path];

    const member = await findCircleMemberByEmail(email);

    if (!member) {
      res.status(404).json({ status: TypeFormError.INVALID_EMAIL });
      return;
    }

    const { first_name, last_name, id: memberId } = member;
    const memberName = first_name + " " + last_name;

    const data = transformTypeformResponse(body);

    const docRef = db.collection("circle_tags").doc(pathLabel);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();

      if (data?.id) await addTagToMember(email, data.id);
    }

    await sendEmailFunction(email, fullName, pathLabel);

    await sendWelcomeMessage(memberId, memberName, tier);

    await appendRowFunction(Object.values(data));

    res.send({ status: "ok" });
  },
);
