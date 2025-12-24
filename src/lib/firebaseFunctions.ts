import { functions, db } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";
import { doc, getDoc } from "firebase/firestore";
import { format } from "date-fns";

export async function getProgramVideoUrl(dateOfBirth: Date | null): Promise<string> {
  const formattedDateOfBirth = dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : null;
  const calculateProgram = httpsCallable(functions, "calculateProgram");
  const result = await calculateProgram({ birthDate: formattedDateOfBirth });
  const programNumber = result.data as number;
  const videoId = programNumber.toString();
  const programDocRef = doc(db, "programs", videoId);
  const programSnapshot = await getDoc(programDocRef);
  if (programSnapshot.exists()) {
    const programData = programSnapshot.data();
    return programData.webUrl;
  }
  return "";
}

export async function sendPersonalizedEmail({
  to,
  videoUrl,
  webinarUrl,
}: {
  to: string;
  videoUrl: string;
  webinarUrl: string;
}) {
  const sendEmail = httpsCallable(functions, "sendEmail");
  await sendEmail({
    to,
    subject: "Your personalized video and webinar invitation",
    videoUrl,
    webinarUrl,
  });
}
