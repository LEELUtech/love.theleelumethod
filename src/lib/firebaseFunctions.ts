import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export type SendEmailPayload = {
	firstName: string;
	email: string;
};

export type SendEmailResult = {
	success: boolean;
};

export async function sendFreeGuideEmail(payload: SendEmailPayload) {
	const fn = httpsCallable<SendEmailPayload, SendEmailResult>(
		functions,
		"sendEmail",
	);
	const res = await fn(payload);
	return res.data;
}
