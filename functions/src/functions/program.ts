import { onCall } from "firebase-functions/v2/https";
import { calculateProgramNumber } from "../utils/calculate-program";

export const calculateProgram = onCall<{ birthDate: string }, Promise<number>>(async (request) => {
  const { birthDate } = request.data;
  const birthDateObj = new Date(birthDate);

  return calculateProgramNumber(birthDateObj);
});