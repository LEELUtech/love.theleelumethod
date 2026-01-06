import { Dayjs } from "dayjs";
import { functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";
import { format } from "date-fns";

export interface CompatibilityReportUserData {
	email: string;
	birthDate1: string | Date | Dayjs;
	birthDate2: string | Date | Dayjs;
	name1?: string;
	name2?: string;
}

// Calculates program by birth date
export async function getProgramId(dateOfBirth: string | Date | undefined) {
	const formattedDateOfBirth = dateOfBirth
		? format(dateOfBirth, "yyyy-MM-dd")
		: null;
	const calculateProgram = httpsCallable(functions, "calculateProgram");
	const result = await calculateProgram({ birthDate: formattedDateOfBirth });
	const programNumber = result.data as number;

	return programNumber;
}

// Sends compatibility report for two people (dates must be DD.MM.YYYY)
export async function sendCompatibilityReport({
	email,
	birthDate1,
	birthDate2,
	name1,
	name2,
}: CompatibilityReportUserData) {
	const sendCompatibility = httpsCallable(functions, "sendCompatibilityReport");
	const result = await sendCompatibility({
		email,
		birthDate1,
		birthDate2,
		name1,
		name2,
	});

	return result.data;
}
