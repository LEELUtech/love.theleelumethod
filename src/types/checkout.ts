export type BillingForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type BillingErrors = Partial<Record<keyof BillingForm, string>>;

export type CompatibilityCheckoutForm = {
  firstName: string;
  email: string;
  phone: string;
  birthDate1: string;
  birthDate2: string;
};

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type StripePayState = {
  canPay: boolean;
  paying: boolean;
  error: string | null;
  cardError: string | null;
};

export type CreateIntentPayload = {
	productType: string;

	email?: string;
	site?: string;
	pagePath?: string;
	sessionId?: string;
	salesiqVisitorId?: string;

	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	utmContent?: string;
	utmTerm?: string;

	utmLastSource?: string;
	utmLastMedium?: string;
	utmLastCampaign?: string;
	utmLastContent?: string;
	utmLastTerm?: string;
};

export type UpdateIntentPayload = {
	productType: string;

	email: string;
	firstName?: string;
	lastName?: string;
	phone?: string;

	address1?: string;
	address2?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	country?: string;

	birthDate1?: string;
	birthDate2?: string;

	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	utmContent?: string;
	utmTerm?: string;

	checkoutVariant?: string;
	pagePath?: string;

	site?: string;
	installment?: string;
	webinarDiscount?: boolean;
	promoCode?: string;
};

export type CreateIntentResponse = {
  clientSecret: string;
  intentId: string;
  intentToken: string;
};

export type UpdateIntentResponse = {
  ok: boolean;
  intentId: string;
  metadata?: Record<string, string>;
};

export type CheckoutStatus =
  | "idle"
  | "creating"
  | "ready"
  | "updating"
  | "processing"
  | "success"
  | "error";
