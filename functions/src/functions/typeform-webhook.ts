import { onRequest } from "firebase-functions/https";
import { TypeformWebhookRequest } from "../types/typeform";
import { transformTypeformResponse } from "../utils/typeform/transformTypeformResponse";

export const typeformWebhook = onRequest((req, res) => {
  const body = req.body as TypeformWebhookRequest;

  const { submitted_at, answers } = body.form_response;

  const data = transformTypeformResponse(submitted_at, answers);

  console.log(data);

  // form_response.definition.fields.forEach((field) => {
  //   console.log(field);
  // });

  // answers.forEach(console.log);

  res.send({ status: "ok" });
});
