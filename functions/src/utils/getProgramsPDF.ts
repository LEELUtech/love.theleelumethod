import { storage } from "firebase-admin";
import { db } from "../configs/firebase";
import { calculateProgram, ProductType } from "./calculate-program";
import { getSeasonDates } from "./getsSeasonDates";
import { PDFDocument, rgb } from "pdf-lib";


export interface UserData {
  videoId: string | number;
  gender: string;
  dateOfBirth: string;
  name: string;
  email: string;
}

export const generatePersonalizedPdfs = async (
  to: string,
  productIds: string[],
  userData: UserData
) => {
  const { videoId, gender, dateOfBirth } = userData;
  if (!videoId || !gender || !dateOfBirth) throw new Error("Missing user data: videoId, gender, or dateOfBirth");

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

  const results = [];

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

    const bucket = storage().bucket();
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
            rgb(1, 1, 1),
            10,
            165,
          );
          break;
        case 5:
          if (
            [4, 5, 7].includes(Number(videoId)) ||
              (Number(videoId) === 6 && gender === "female")
          ) {
            drawText(
              `Your key tasks before ${endSeasonDate}:`,
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

    results.push({
      programId: programNumber,
      product: productId,
      filename: `${productId}-report.pdf`,
      buffer: finalPdfBuffer,
      createdAt: new Date().toISOString(),
    });
  }

  return results;
};
