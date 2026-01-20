import { onCall } from "firebase-functions/v2/https";
import { createTransport } from "nodemailer";
import { storage } from "../configs/firebase";
import { configs } from "../configs/env";
import { calculateCompatibility } from "../utils/compatibility-report/compatibility-report.service";

// Webinar CTA URL
const WEBINAR_URL = "https://leelutech.ewebinar.com/webinar/decoded-love-22610";

export const sendCompatibilityReport = onCall(async (req) => {
  const { email, birthDate1, birthDate2, name1, name2 } = req.data || {};

  if (!email || !birthDate1 || !birthDate2) {
    throw new Error("Missing required fields: email, birthDate1, birthDate2");
  }

  try {
    // Calculate compatibility
    const compatibility = calculateCompatibility(birthDate1, birthDate2);

    // Map compatibility type to lowercase for file path
    const compatibilityType = compatibility.type.toLowerCase();

    // Get PDF from Firebase Storage
    const storagePath = `pdf/${compatibilityType}/${compatibilityType}.pdf`;
    const bucket = storage.bucket();
    const file = bucket.file(storagePath);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error(`PDF file not found: ${storagePath}`);
    }

    // Download the PDF
    const [pdfBuffer] = await file.download();

    // Setup email transporter
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: configs.email,
        pass: configs.password,
      },
    });

    // Prepare email content
    const subject = "Your Compatibility Report";
    const names = name1 && name2 ? `${name1} and ${name2}` : "you and your partner";

    const webinarLink = `${WEBINAR_URL}?name=${encodeURIComponent(name1)}&email=${encodeURIComponent(email)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
        <p style="margin: 0 0 10px;">Hi!</p>
        <p style="margin: 0 0 10px;">Thank you for using our compatibility analysis service.</p>
        <p style="margin: 0 0 10px;">Your personalized compatibility report for ${names} is ready.</p>
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

    // Send email with PDF attachment
    await transporter.sendMail({
      from: configs.email,
      to: email,
      subject,
      html,
      attachments: [
        {
          filename: `compatibility-report-${compatibilityType}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return {
      success: true,
      compatibility: {
        type: compatibility.type,
        score: compatibility.diff,
        kchh1: compatibility.kchh1,
        kchh2: compatibility.kchh2,
      },
    };
  } catch (error) {
    console.error("Error sending compatibility report:", error);
    throw new Error(`Failed to send compatibility report: ${error}`);
  }
});
