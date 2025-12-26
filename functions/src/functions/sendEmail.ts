import { onCall } from "firebase-functions/v2/https";
import { createTransport } from "nodemailer";
import { configs } from "../configs/env";
import { generatePersonalizedPdfs } from "../utils/getProgramsPDF";


export const sendEmail = onCall(async (req) => {
  const { to, subject, html, webinarUrl, productIds, userData } = req.data || {};

  if (!to || !subject) {
    throw new Error("Missing required fields: to, subject");
  }


  let finalAttachments = [];

  let webinarUrlWithParams = webinarUrl;
  if (userData) {
    const params = [];
    if (userData.name) params.push(`name=${encodeURIComponent(userData.name)}`);
    if (userData.email) params.push(`email=${encodeURIComponent(userData.email)}`);
    if (params.length) {
      webinarUrlWithParams = webinarUrl + (webinarUrl.includes("?") ? "&" : "?") + params.join("&");
    }
  }

  const pdfResults = await generatePersonalizedPdfs(to, productIds, userData);
  finalAttachments = pdfResults.map((pdf) => ({
    filename: pdf.filename,
    content: pdf.buffer,
    contentType: "application/pdf",
  }));

  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: configs.email,
      pass: configs.password,
    },
  });

  const defaultHtml = `
    <div style="font-family: Arial, sans-serif;">
      <p style="margin-bottom: 6px;">Hi!</p>
      <p>Thank you for using our service and getting your free personalized reports.</p>
      <p style="margin-bottom: 6px;">But most importantly, thank you for trusting me with something so personal: your story.</p>
      <p>This isn’t just a PDF.</p>
      <p style="margin-bottom: 6px;">It’s a mirror. A compass. A decoder of who you are and why certain things keep happening in your life.</p>
      <p>I’ve worked with thousands of women — from celebrities to everyday heroes — and I can tell you:</p>
      <p>every breakthrough begins with awareness.</p>
      <p style="margin-bottom: 6px;">And you just took that first step.</p>
      <p style="margin-bottom: 6px;">Start by reading your report slowly!</p>
      <p style="margin-bottom: 6px;">Don’t rush. Let it sink in. Your codes were written into your birthdate long before anything else in your life happened.</p>
      <p style="margin-bottom: 6px;">In the next few days, I’ll send you a few short emails — real talk, insights, and support — to help you apply what you’ve discovered.</p>
      <p>You’re not alone anymore.</p>
      <p style="margin-bottom: 6px;">I’m with you now.</p>
      <p>With love,</p>
      <p>Lily</p>
      <div style="margin-top: 24px;">
        <p style="margin-bottom: 6px;">Don’t miss our upcoming webinar! Register here:</p>
        <a href="${webinarUrlWithParams}" target="_blank" style="color: #3366cc; font-weight: bold;">Register for the webinar</a>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: configs.email,
    to,
    subject,
    html: html || defaultHtml,
    attachments: finalAttachments,
  });

  return { success: true };
});
