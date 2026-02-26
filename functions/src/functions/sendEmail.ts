import { onCall } from "firebase-functions/v2/https";
import { createTransport } from "nodemailer";
import { configs } from "../configs/env";
import { getStorage } from "firebase-admin/storage";
import { upsertContactAndAddTags } from "../lib/zoho-campaigns";

export const sendEmail = onCall(async (req) => {
  const { firstName, email } = req.data || {};

  if (!firstName || !email) {
    throw new Error("Missing required fields: firstName, email");
  }

  const storage = getStorage();
  const bucket = storage.bucket();
  const filePath = "pdf/battle/battle.pdf";
  const file = bucket.file(filePath);

  const [pdfBuffer] = await file.download();

  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: configs.email,
      pass: configs.password,
    },
  });

  const subject = "Your free guide: 7 Secrets to Mend a Broken Heart";
  const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hi ${firstName},</p>
        <p>Thanks for downloading our free guide.</p>
        <p>Your PDF <b>“7 Secrets to Mend a Broken Heart”</b> is attached to this email.</p>
        <p>Wishing you all the best,<br/>The Team</p>
      </div>
    `;

  await transporter.sendMail({
    from: configs.email,
    to: email,
    subject,
    html,
    attachments: [
      {
        filename: "7_secrets_to_mend_a_broken_heart.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
  await upsertContactAndAddTags(email, ["lm_dl"]);

  return { success: true };
});
