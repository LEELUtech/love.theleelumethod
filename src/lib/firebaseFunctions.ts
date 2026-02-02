import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import type { SendEmailPayload, SendEmailResult } from "@/types";

export async function sendFreeGuideEmail(payload: SendEmailPayload) {
  const fn = httpsCallable<SendEmailPayload, SendEmailResult>(
    functions,
    "sendEmail",
  );
  const res = await fn(payload);
  return res.data;
}
