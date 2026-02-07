// components/checkout/StripeCardPart.tsx
"use client";

import * as React from "react";
import {
	CardNumberElement,
	CardExpiryElement,
	CardCvcElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import type { StripeError } from "@stripe/stripe-js";
import type { BillingForm } from "@/helpers/checkout";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import Button from "@/components/ui/Button";
import { getStoredUTM } from "@/utils/utm-tracker";

const stripeElementOptions = {
	style: {
		base: {
			fontFamily: "Lato, sans-serif",
			fontSize: "16px",
			color: "#757986",
			"::placeholder": { color: "#757986" },
		},
		invalid: { color: "#dc2626" },
	},
};

const fieldClass =
	"w-full rounded-[6px] border border-[#C3C6D1] bg-white px-[18px] py-[10px] font-lato font-normal text-body text-[#757986] outline-none";

type StripeErrorWithPI = StripeError & { payment_intent?: { status?: string } };
function hasPaymentIntent(err: StripeError): err is StripeErrorWithPI {
	return typeof (err as StripeErrorWithPI).payment_intent === "object";
}

type Props = {
	clientSecret: string;
	productType: string;

	billing: BillingForm;

	onSubmitAttempt: () => boolean;

	onSuccess: () => void;

	productName?: string;
	priceLabel: string;
	loading: boolean;
	buttonText?: string;
};

export function StripeCardPart({
	clientSecret,
	productType,
	billing,
	onSubmitAttempt,
	onSuccess,
	productName,
	priceLabel,
	loading,
	buttonText = "SIGN UP & GET PERSONALIZED SUPPORT",
}: Props) {
	const stripe = useStripe();
	const elements = useElements();

	const updateIntent = useCheckoutStore((s) => s.updateIntent);

	const [paying, setPaying] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const lockRef = React.useRef(false);

	const [cardComplete, setCardComplete] = React.useState(false);
	const [expComplete, setExpComplete] = React.useState(false);
	const [cvcComplete, setCvcComplete] = React.useState(false);
	const [cardError, setCardError] = React.useState<string | null>(null);

	const canPay =
		!!stripe &&
		!!elements &&
		!paying &&
		cardComplete &&
		expComplete &&
		cvcComplete &&
		!cardError;

	console.log("1231231", productType);

	const onPay = async () => {
		const ok = onSubmitAttempt();
		if (!ok) {
			setError("Please fill in all required billing fields.");
			return;
		}

		if (!stripe || !elements || lockRef.current) return;

		if (!cardComplete) return setError("Please enter a valid card number.");
		if (!expComplete) return setError("Please enter a valid expiry date.");
		if (!cvcComplete) return setError("Please enter a valid CVC.");
		if (cardError) return setError(cardError);

		lockRef.current = true;
		setPaying(true);
		setError(null);

		try {
			const cardNumber = elements.getElement(CardNumberElement);
			if (!cardNumber) {
				setError("Card field is not ready yet.");
				return;
			}

			try {
				// Phase 2: Capture UTM params for Zoho CRM attribution
				const utm = getStoredUTM();

				await updateIntent({
					productType,
					email: billing.email,
					firstName: billing.firstName,
					lastName: billing.lastName,
					phone: billing.phone,

					address1: billing.address1,
					address2: billing.address2,
					city: billing.city,
					state: billing.state,
					postalCode: billing.postalCode,
					country: billing.country,

					// Phase 2: UTM tracking for revenue attribution
					utmSource: utm?.utm_source,
					utmMedium: utm?.utm_medium,
					utmCampaign: utm?.utm_campaign,
					utmContent: utm?.utm_content,
					utmTerm: utm?.utm_term,
					pagePath:
						typeof window !== "undefined"
							? window.location.pathname
							: undefined,
					checkoutVariant: productType, // Can be updated for A/B testing
				});
			} catch (e: unknown) {
				const msg =
					e instanceof Error
						? e.message
						: "Failed to update payment info. Please try again.";
				setError(msg);
				return;
			}

			const { error: confirmError, paymentIntent } =
				await stripe.confirmCardPayment(clientSecret, {
					payment_method: {
						card: cardNumber,
						billing_details: {
							email: billing.email?.trim() || undefined,
							name:
								`${billing.firstName ?? ""} ${billing.lastName ?? ""}`.trim() ||
								undefined,
							phone: billing.phone?.trim() || undefined,
							address: {
								line1: billing.address1?.trim() || undefined,
								line2: billing.address2?.trim() || undefined,
								city: billing.city?.trim() || undefined,
								state: billing.state?.trim() || undefined,
								postal_code: billing.postalCode?.trim() || undefined,
								country: billing.country?.trim().toUpperCase() || undefined,
							},
						},
					},
				});

			if (confirmError) {
				const piStatus = hasPaymentIntent(confirmError)
					? confirmError.payment_intent?.status
					: undefined;

				if (
					confirmError.code === "payment_intent_unexpected_state" &&
					piStatus === "succeeded"
				) {
					onSuccess();
					return;
				}

				setError(confirmError.message || "Payment failed");
				return;
			}

			if (paymentIntent?.status === "succeeded") onSuccess();
			else setError("Payment not completed. Please try again.");
		} finally {
			lockRef.current = false;
			setPaying(false);
		}
	};

	return (
		<>
			{/* Card fields */}
			<div className="mt-4 space-y-3">
				<div className={fieldClass}>
					<CardNumberElement
						options={{ ...stripeElementOptions, placeholder: "Card number" }}
						onChange={(e) => {
							setCardComplete(!!e.complete);
							setCardError(e.error?.message ?? null);
							if (error) setError(null);
						}}
					/>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className={fieldClass}>
						<CardExpiryElement
							options={{ ...stripeElementOptions, placeholder: "MM / YY" }}
							onChange={(e) => {
								setExpComplete(!!e.complete);
								if (error) setError(null);
							}}
						/>
					</div>

					<div className={fieldClass}>
						<CardCvcElement
							options={{ ...stripeElementOptions, placeholder: "CVC" }}
							onChange={(e) => {
								setCvcComplete(!!e.complete);
								if (error) setError(null);
							}}
						/>
					</div>
				</div>

				{cardError ? (
					<p className="mt-1 text-xs text-red-600">{cardError}</p>
				) : null}
				{error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
			</div>

			{/* Order summary */}
			<div className="mt-[56px] md:mt-[56px] lg:mt-[94px]">
				<h4 className="font-canela font-light text-brand-black text-[32px] md:text-[28px] lg:text-[32px]">
					Order summary
				</h4>

				<div className="mt-5 space-y-3">
					<div className="flex items-baseline justify-between gap-4">
						<p className="font-lato text-body font-normal uppercase tracking-[0.03em] text-brand-black">
							{loading ? "Loading..." : (productName ?? "")}
						</p>
						<p className="font-lato text-body font-normal text-brand-black">
							{loading ? "..." : priceLabel}
						</p>
					</div>

					<div className="flex items-baseline justify-between gap-4">
						<p className="font-lato text-body font-normal text-brand-black">
							Subtotal
						</p>
						<p className="font-lato text-body font-normal text-brand-black">
							{loading ? "..." : priceLabel}
						</p>
					</div>

					<div className="!my-[43px] md:!my-8 h-px w-full bg-black/10" />

					<div className="flex items-baseline justify-between gap-4">
						<p className="font-lato text-body font-normal uppercase tracking-[0.03em] text-brand-black">
							DUE TODAY
						</p>
						<p className="font-lato text-body font-normal text-brand-black">
							{loading ? "..." : priceLabel}
						</p>
					</div>
				</div>
			</div>

			{/* Button */}
			<Button
				type="button"
				onClick={onPay}
				disabled={!canPay}
				loading={paying}
				fullWidth
				className="mt-[24px] md:mt-10 lg:mt-[80px] px-1"
			>
				{buttonText}
			</Button>
		</>
	);
}
