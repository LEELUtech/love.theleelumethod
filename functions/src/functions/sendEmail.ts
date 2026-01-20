import { onCall } from "firebase-functions/v2/https";
import { createTransport } from "nodemailer";
import { configs } from "../configs/env";
import { getStorage } from "firebase-admin/storage";

export const sendEmail = onCall(async (req) => {
  const { firstname, email } = req.data || {};

  if (!firstname || !email) {
    throw new Error("Missing required fields: firstname, email");
  }

  const storage = getStorage();
  const bucket = storage.bucket();
  const filePath = `pdfs/${firstname}_report.pdf`;
  const file = bucket.file(filePath);

  const [pdfBuffer] = await file.download();

  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: configs.email,
      pass: configs.password,
    },
  });

  const subject = "Your Personalized PDF";
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <p>Hi ${firstname},</p>
      <p>Thank you for using our service. Attached is your personalized PDF.</p>
      <p>Best regards,</p>
      <p>The Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: configs.email,
    to: email,
    subject,
    html,
    attachments: [
      {
        filename: `${firstname}_report.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  return { success: true };
});
