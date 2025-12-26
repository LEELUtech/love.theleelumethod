export interface FreeReportUserData {
  dateOfBirth: string | Date | undefined;
  gender: string;
  videoId: string | number;
  name: string;
  email: string;
}

import { functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";
import { format } from "date-fns";

export async function getProgramId(dateOfBirth: string | Date | undefined) {
  const formattedDateOfBirth = dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : null;
  const calculateProgram = httpsCallable(functions, "calculateProgram");
  const result = await calculateProgram({ birthDate: formattedDateOfBirth });
  const programNumber = result.data as number;

  return programNumber;
}

export async function sendFreeReport({
  to,
  productIds,
  webinarUrl,
  userData,
}: {
  to: string;
  productIds: string[];
  webinarUrl: string;
  userData: FreeReportUserData;
}) {
  const sendEmail = httpsCallable(functions, "sendEmail");
  await sendEmail({
    to,
    subject: "Your personalized video and webinar invitation",
    productIds,
    webinarUrl,
    userData,
  });
}
