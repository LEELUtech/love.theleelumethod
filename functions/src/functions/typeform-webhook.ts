import { onRequest } from "firebase-functions/v2/https";
import { TypeformWebhookRequest } from "../types/typeform";
import { TypeformColumns } from "../static/typeform";
import { db } from "../configs/firebase";
import { addTagToMember } from "../lib/circle";
import { appendRowFunction } from "../lib/google-sheet";
import { transformTypeformResponse } from "../utils/typeform/transformTypeformResponse";
import { sendEmailFunction } from "../lib/nodemailer";
import { defineSecret } from "firebase-functions/params";

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

    const { submitted_at, answers } = body.form_response;

    const data = transformTypeformResponse(submitted_at, answers);

    const path = data[TypeformColumns.PATH];
    const email = data[TypeformColumns.EMAIL];
    const name = data[TypeformColumns.HER_FULL_NAME];

    if (path && email) {
      const docRef = db.collection("circle_tags").doc(path);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const data = docSnap.data();

        if (data?.id) await addTagToMember(email, data.id);
      }
    }

    if (path && email && name) {
      await sendEmailFunction(email, name, path);
    }

    await appendRowFunction(Object.values(data));

    res.send({ status: "ok" });
  },
);
