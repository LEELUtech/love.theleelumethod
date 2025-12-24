import { onCall } from "firebase-functions/v2/https";
import { createTransport } from "nodemailer";
import { configs } from "../configs/env";

export const sendEmail = onCall(async (req) => {
  const { to, subject, html, attachments, videoUrl, webinarUrl } = req.data || {};

  if (!to || !subject) {
    throw new Error("Missing required fields: to, subject");
  }

  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: configs.email,
      pass: configs.password,
    },
  });

  const defaultHtml = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Hello!</h2>
      <p>Thank you for your interest. We have selected a special video just for you:</p>
      <p>
        <a href="${videoUrl}" target="_blank" style="color: #3366cc;">Watch your personalized video</a>
      </p>
      <p>Don't miss our upcoming webinar! Register here:</p>
      <p>
        <a href="${webinarUrl}" target="_blank" style="color: #3366cc;">Register for the webinar</a>
      </p>
      <p>Best regards,<br/>Your Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: configs.email,
    to,
    subject,
    html: html || defaultHtml,
    attachments,
  });

  return { success: true };
});
