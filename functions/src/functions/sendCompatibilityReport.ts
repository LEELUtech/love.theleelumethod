import { onCall } from "firebase-functions/v2/https";
import { createTransport } from "nodemailer";
import { storage } from "../configs/firebase";
import { configs } from "../configs/env";
import { calculateCompatibility } from "../utils/free-report/free-report.service";

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

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <p style="margin-bottom: 6px;">Hi!</p>
        <p>Thank you for using our compatibility analysis service.</p>
        <p style="margin-bottom: 6px;">Your personalized compatibility report for ${names} is ready!</p>
        <p style="margin-bottom: 6px;"><strong>Compatibility Type:</strong> ${compatibility.type}</p>
        <p style="margin-bottom: 6px;"><strong>Compatibility Score:</strong> ${compatibility.diff.toFixed(1)}%</p>
        <p>This report reveals the unique dynamics between your energies and provides insights into your relationship patterns.</p>
        <p style="margin-bottom: 6px;">Take your time reading through the attached PDF.</p>
        <p style="margin-bottom: 6px;">Remember, every relationship is a mirror showing us what we need to learn and grow.</p>
        <p>With love,</p>
        <p>Lily</p>
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
