import { onRequest } from "firebase-functions/v2/https";
import { createTransport } from "nodemailer";
import { PDFDocument, rgb } from "pdf-lib";
import { db, storage } from "../configs/firebase";
import { configs } from "../configs/env";
import { getSeasonDates } from "../utils/getsSeasonDates";
import { calculateProgram, ProductType } from "../utils/calculate-program";
import Stripe from "stripe";


let stripe: Stripe | null = null;
const getStripeClient = () => {
  if (!stripe) {
    stripe = new Stripe(configs.stripeSecretKey || "", {
      apiVersion: "2025-04-30.basil",
    });
  }
  return stripe;
};

export const stripeWebhook = onRequest({
  cors: true,
  region: "us-central1",
}, async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  const rawBody = req.rawBody;

  console.log("Received Stripe webhook");
  console.log("stripeSecretKey:", configs.stripeSecretKey);
  console.log("Signature:", sig);
  console.log("Raw body type:", typeof rawBody);
  console.log("Raw body", rawBody);
  console.log("configs.stripeWebhookSecret:", configs.stripeWebhookSecret );

  try {

    if (!rawBody || !sig || !configs.stripeWebhookSecret) {
      console.error("Missing required webhook data:", {
        hasRawBody: !!req.rawBody,
        hasSignature: !!sig,
        hasSecret: !!configs.stripeWebhookSecret
      });
      res.status(400).send("Missing required webhook data");
      return;
    }

    event = getStripeClient().webhooks.constructEvent(rawBody, sig!, configs.stripeWebhookSecret!);
    console.log("✅ Webhook signature verified successfully:", event.id);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const existingEvent = await db.collection("stripeEvents").doc(session.id).get();
    if (existingEvent.exists) {
      console.log("Event already processed:", session.id);
      res.status(200).send("Already processed");
      return;
    }

    await db
      .collection("stripeEvents")
      .doc(session.id)
      .set({ processedAt: new Date().toISOString() });

    const email = session.metadata?.email;
    const productIds = session.metadata?.productIds?.split(",") || [];
    const promoCode = session.metadata?.promoCode;
    const agentId = session.metadata?.agentId;
    const agentName = session.metadata?.agentName;
    const agentZohoId = session.metadata?.agentZohoId;

    if (!email || productIds.length === 0) {
      res.status(400).send("Missing metadata");
      return;
    }

    try {
      const referralData = promoCode && agentId && agentName && agentZohoId ? {
        promoCode,
        agentId,
        agentName,
        agentZohoId,
      } : null;

      await sendConfirmationEmail(email, productIds, referralData);
      res.status(200).send("Email sent");
    } catch (error) {
      console.error("Send email failed:", error);
      res.status(500).send("Failed to send email");
    }
  } else {
    res.status(200).send("Event ignored");
  }
});

const sendConfirmationEmail = async (to: string, productIds: string[], referralData?: {
  promoCode: string;
  agentId: string;
  agentName: string;
  agentZohoId: string;
} | null) => {
  const usersSnapshot = await db.collection("users").where("email", "==", to).limit(1).get();

  if (usersSnapshot.empty) throw new Error("User not found");

  const userDoc = usersSnapshot.docs[0];
  const { videoId, gender, firstName, dateOfBirth } = userDoc.data();

  if (!videoId || !gender) throw new Error("User missing videoId or gender");

  const {
    dates: [
      firstSeasonEndDate,
      secondSeasonEndDate,
      thirdSeasonEndDate,
      formatedPrevSeasonEndDate,
      endSeasonDate,
      turboYearStartDate,
    ],
    seasonNumber,
  } = getSeasonDates(dateOfBirth);

  const attachments = [];
  const orders = [];
  const userRef = userDoc.ref;


  const expandedProductIds: ProductType[] = productIds.flatMap((id) => {
    if (id === "bundle") return ["destiny", "karmic", "weaknesses", "money"] as ProductType[];
    return [id as ProductType];
  });

  for (const productId of expandedProductIds) {
    const birthDateObj = new Date(dateOfBirth);
    const programNumber = calculateProgram(birthDateObj, productId as ProductType);
    const programRef = db
      .collection("products")
      .doc(productId)
      .collection("programs")
      .doc(String(programNumber));

    const programSnapshot = await programRef.get();
    if (!programSnapshot.exists) continue;

    const { malePdf, femalePdf } = programSnapshot.data() || {};
    const storagePath = gender === "male" ? malePdf : femalePdf;
    if (!storagePath) continue;

    const bucket = storage.bucket();
    const file = bucket.file(storagePath);
    const [existingPdfBytes] = await file.download();
    let finalPdfBuffer = existingPdfBytes;

    if (productId === "destiny") {
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const penultimatePageIndex = pages.length - 2;
      const thirdPageIndexToLast = penultimatePageIndex - 1;
      const fourthPageIndexToLast = thirdPageIndexToLast - 1;

      pages.forEach((page, i) => {
        const { height } = page.getSize();
        const drawText = (
          text: string,
          x: number,
          y: number,
          color = rgb(1, 1, 1),
          size = 10,
          maxWidth = 170,
          lineHeight = 14,
        ) =>
          page.drawText(text, {
            x,
            y,
            size,
            color,
            maxWidth,
            lineHeight,
          });

        switch (i) {
        case 3:
          drawText(
            `From birth to ${firstSeasonEndDate}`,
            51,
            height - 207,
            rgb(0.91, 0.855, 0.882),
            10,
            360,
          );
          drawText(
            `From ${firstSeasonEndDate} to ${secondSeasonEndDate}`,
            51,
            height - 268,
            rgb(0.91, 0.855, 0.882),
            10,
            360,
          );
          drawText(
            `From ${secondSeasonEndDate} to ${thirdSeasonEndDate}`,
            51,
            height - 328,
            rgb(0.91, 0.855, 0.882),
            10,
            360,
          );
          drawText(
            `You are now in your ${seasonNumber} season of life! Your current avatar is called`,
            46,
            height - 370,
            rgb(0.91, 0.855, 0.882),
          );
          break;
        case 4:
          drawText(
            `Your current life phase began on ${formatedPrevSeasonEndDate}, and will end on ${endSeasonDate}`,
            236,
            height - 252,
            rgb(1,1,1),
            10,
            165,
          );
          break;
        case 5:
          if ([4, 5, 7].includes(Number(videoId)) || (Number(videoId) === 6 && gender === "female")) {
            drawText(`Your key tasks before ${endSeasonDate}:`,
              52,
              height - 376,
              rgb(0.91, 0.855, 0.882),
              10,
              155,
            );
          }
          break;
        case thirdPageIndexToLast:
        case fourthPageIndexToLast:
          drawText(
            `${turboYearStartDate.toUpperCase()} - ${endSeasonDate.toUpperCase()}`,
            54,
            i === fourthPageIndexToLast ? height - 250 : height - 122,
            rgb(1, 1, 1),
            16,
            360,
            20,
          );
          if (i === thirdPageIndexToLast) {
            drawText(
              `After ${endSeasonDate}, you won't be able to change the outcome.`,
              231,
              height - 330,
              rgb(0.91, 0.855, 0.882),
            );
          }
          break;
        case penultimatePageIndex:
          drawText(
            `After ${endSeasonDate}, your results are permanent.`,
            54,
            height - 130,
            rgb(1, 1, 1),
            26,
            320,
            32,
          );
          break;
        }
      });

      finalPdfBuffer = Buffer.from(await pdfDoc.save());
    }

    const destFile = bucket.file(`invoices/${userDoc.id}/${productId}-${Date.now()}.pdf`);
    await destFile.save(finalPdfBuffer, { contentType: "application/pdf" });

    // Link valid for 7 days
    const [signedUrl] = await destFile.getSignedUrl({
      action: "read",
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    orders.push({
      programId: programNumber,
      product: productId,
      pdfUrl: signedUrl,
      createdAt: new Date().toISOString(),
    });

    attachments.push({
      filename: `${productId}-report.pdf`,
      content: finalPdfBuffer,
      contentType: "application/pdf",
    });
  }

  const updateData: {
    orders: typeof orders;
    referral?: {
      Agent_Name: string;
      AgentID: string;
      Promo_Code: string;
      createdAt: string;
    };
  } = { orders };


  if (referralData) {
    updateData.referral = {
      Agent_Name: referralData.agentName,
      AgentID: referralData.agentZohoId,
      Promo_Code: referralData.promoCode,
      createdAt: new Date().toISOString(),
    };
  }

  await userRef.update(updateData);

  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: configs.email,
      pass: configs.password,
    },
  });

  const htmlContent = `
    <p style={marginBottom: 6}>Hi ${firstName || ""},</p>
    <p>Thank you — not just for your purchase,</p>
    <p style={marginBottom: 6}>but for trusting me with something so personal: your story.</p>
    <p>This isn’t just a PDF.</p>
    <p style={marginBottom: 6}>It’s a mirror. A compass. A decoder of who you are and why certain things keep happening in your life.</p>
    <p>I’ve worked with thousands of women — from celebrities to everyday heroes — and I can tell you:</p>
    <p>every breakthrough begins with awareness.</p>
    <p style={marginBottom: 6}>And you just took that first step.</p> 
    <p style={marginBottom: 6}>Start by reading your report slowly!</p>
     <p style={marginBottom: 6}>Don’t rush. Let it sink in. Your codes were written into your birthdate long before anything else in your life happened.</p>
     <p style={marginBottom: 6}>In the next few days, I’ll send you a few short emails — real talk, insights, and support — to help you apply what you’ve discovered.</p>
     <p>You’re not alone anymore.</p>
     <p style={marginBottom: 6}>I’m with you now.</p>
     <p>With love,</p>
     <p>Lily</p>
  `;

  await transporter.sendMail({
    from: configs.email,
    to,
    subject: `Your journey begins now, ${firstName || ""}`,
    html: htmlContent,
    attachments,
  });
};

