import { onRequest } from "firebase-functions/v2/https";
import { PATH_LABELS, TypeFormError, TypeformWebhookRequest } from "../types/typeform";
import { addTagToMember, findCircleMemberByEmail } from "../lib/circle";
import { defineSecret } from "firebase-functions/params";
import { getTier, sendWelcomeMessage } from "../utils/helpers/circle";
import { transformTypeformResponse } from "../utils/typeform/transformTypeformResponse";
import { sendEmailFunction } from "../lib/nodemailer";
import { appendRowFunction } from "../lib/google-sheet";
import { db } from "../configs/firebase";
import { CIRCLE_FORM_COMPLETED_TAG_ID } from "../static/circle";
import { isTagExist } from "../utils/helpers/circle/isTagExist";

const SHEET_EMAIL = defineSecret("SHEET_EMAIL");
const SHEET_PRIVATE_KEY = defineSecret("SHEET_PRIVATE_KEY");
const SHEET_ID = defineSecret("SHEET_ID");
const SHEET_NAME = defineSecret("SHEET_NAME");

const NODEMAILER_USER = defineSecret("NODEMAILER_USER");
const NODEMAILER_PASS = defineSecret("NODEMAILER_PASS");

export const typeformWebhook = onRequest(
  {
    cors: true,
    region: "us-central1",
    secrets: [
      SHEET_EMAIL,
      SHEET_PRIVATE_KEY,
      SHEET_ID,
      SHEET_NAME,

      NODEMAILER_USER,
      NODEMAILER_PASS,
    ],
  },
  async (req, res) => {
    const body = req.body as TypeformWebhookRequest;

    const { email, path, fullName } = body;

    if (!email || !fullName || !path) {
      res.status(400).json({ status: TypeFormError.MISSING_FIELDS });
      return;
    }

    const pathLabel = PATH_LABELS[path];

    const member = await findCircleMemberByEmail(email);

    if (!member) {
      res.status(404).json({ status: TypeFormError.INVALID_EMAIL });
      return;
    }

    const { id: memberId, member_tags } = member;

    if (isTagExist(member_tags, CIRCLE_FORM_COMPLETED_TAG_ID)) {
      res.status(404).json({ status: TypeFormError.FORM_SUBMITTED });
      return;
    }

    const tier = getTier(member_tags);

    if (!tier) {
      res.status(404).json({ status: TypeFormError.MISSING_TIER });
      return;
    }

    const data = transformTypeformResponse(body, tier);

    const docRef = db.collection("circle_tags").doc(pathLabel);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();

      const promises = [addTagToMember(email, CIRCLE_FORM_COMPLETED_TAG_ID)];

      if (data?.id) {
        promises.push(addTagToMember(email, data.id));
      }

      await Promise.all(promises);
    }

    await sendWelcomeMessage(memberId, fullName, tier);

    await appendRowFunction(Object.values(data));

    await sendEmailFunction(email, fullName, pathLabel);

    res.send({ status: "ok" });
  },
);
