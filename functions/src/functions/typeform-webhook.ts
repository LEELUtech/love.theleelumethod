import { onRequest } from "firebase-functions/https";
import { TypeformWebhookRequest } from "../types/typeform";
import { transformTypeformResponse } from "../utils/typeform/transformTypeformResponse";
import { TypeformColumns } from "../static/type-form";
import { db } from "../configs/firebase";
import { addTagToMember } from "../lib/circle";
import { configs } from "../configs/env";
import { appendToSheet } from "../lib/google-sheet";

export const typeformWebhook = onRequest(async (req, res) => {
  const body = req.body as TypeformWebhookRequest;

  const { submitted_at, answers } = body.form_response;

  const data = transformTypeformResponse(submitted_at, answers);

  const path = data[TypeformColumns.PATH];
  const email = data[TypeformColumns.EMAIL];

  if (path && email) {
    const docRef = db.collection("circle_tags").doc(path);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();

      if (data?.id) await addTagToMember(email, data.id);
    }
  }

  await appendToSheet(configs.sheetId, configs.sheetName, Object.values(data));

  res.send({ status: "ok" });
});
