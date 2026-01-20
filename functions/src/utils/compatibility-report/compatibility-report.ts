import { createTransport } from "nodemailer";
import { storage } from "../../configs/firebase";
import { calculateCompatibility } from "./compatibility-report.service"
import Stripe from "stripe";
import { configs } from "../../configs/env";

export async function handleCompatibilityReport(session: Stripe.Checkout.Session) {
  const email = session.customer_email || session.customer_details?.email;
  const birthDate1 = session.metadata?.birth_date_1;
  const birthDate2 = session.metadata?.birth_date_2;

  if (!email || !birthDate1 || !birthDate2) {
    throw new Error("Missing required fields for compatibility report");
  }

  console.log("💕 Processing compatibility report for:", email);

  // Calculate compatibility
  const compatibility = calculateCompatibility(birthDate1, birthDate2);
  const compatibilityType = compatibility.type.toLowerCase();

  // Get PDF from Firebase Storage
  const storagePath = `pdf/${compatibilityType}/${compatibilityType}.pdf`;
  const bucket = storage.bucket();
  const file = bucket.file(storagePath);

  const [exists] = await file.exists();
  if (!exists) {
    throw new Error(`PDF file not found: ${storagePath}`);
  }

  const [pdfBuffer] = await file.download();

  // Setup email transporter
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: configs.email,
      pass: configs.password,
    },
  });

  const webinarUrl = "https://leelutech.ewebinar.com/webinar/decoded-love-22610";
  const webinarLink = `${webinarUrl}?email=${encodeURIComponent(email)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
      <p style="margin: 0 0 10px;">Hi!</p>
      <p style="margin: 0 0 10px;">Thank you for using our compatibility analysis service.</p>
      <p style="margin: 0 0 10px;">Your personalized compatibility report is ready.</p>
      <p style="margin: 0 0 10px;"><strong>Compatibility Type:</strong> ${compatibility.type}</p>
      <p style="margin: 0 0 10px;"><strong>Compatibility Score:</strong> ${compatibility.diff.toFixed(1)}%</p>
      <p style="margin: 0 0 14px;">Take your time reading the attached PDF. It highlights your unique dynamics and gives ideas on how to grow together.</p>
      <p style="margin: 18px 0 22px;">
        <a
          href="${webinarLink}"
          style="color: #222; text-decoration: underline; font-weight: 600; font-size: 17px; background: none; border: none; padding: 0;"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join the live webinar
        </a>
      </p>
      <p style="margin: 0 0 10px;">Remember, every relationship is a mirror showing us what we need to learn and grow.</p>
      <p style="margin: 0 0 6px;">With love,</p>
      <p style="margin: 0;">Lily</p>
    </div>
  `;

  await transporter.sendMail({
    from: configs.email,
    to: email,
    subject: "Your Compatibility Report",
    html,
    attachments: [
      {
        filename: `compatibility-report-${compatibilityType}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  console.log("✅ Compatibility report sent to:", email);

  return {
    compatibility_type: compatibility.type,
    compatibility_score: compatibility.diff,
    report_sent: true,
  };
}