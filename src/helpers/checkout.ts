export type BillingForm = {
	firstName: string;
	lastName: string;
	email: string;
	address1: string;
	address2: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	phone: string;
};

export type BillingErrors = Partial<Record<keyof BillingForm, string>>;

export const REQUIRED_FIELDS: (keyof BillingForm)[] = [
	"firstName",
	"lastName",
	"email",
	"address1",
	"city",
	"postalCode",
	"country",
	"phone",
];

export function validateEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateBilling(values: BillingForm): BillingErrors {
	const e: BillingErrors = {};
	const v = (k: keyof BillingForm) => values[k].trim();

	if (!v("firstName")) e.firstName = "First name is required";
	if (!v("lastName")) e.lastName = "Last name is required";

	if (!v("email")) e.email = "Email is required";
	else if (!validateEmail(values.email)) e.email = "Enter a valid email";

	if (!v("address1")) e.address1 = "Street address is required";
	if (!v("city")) e.city = "City is required";
	if (!v("postalCode")) e.postalCode = "ZIP/Postal code is required";

	if (!v("country")) e.country = "Country is required";

	if (!v("phone")) e.phone = "Phone is required";
	else if (!/^\+\d{7,15}$/.test(values.phone.trim()))
		e.phone = "Enter a valid phone number";

	return e;
}

export function isEmptyErrors(errors: BillingErrors) {
	return Object.keys(errors).length === 0;
}
