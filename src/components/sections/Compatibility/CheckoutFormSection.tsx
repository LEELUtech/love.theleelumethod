"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Input from "@/components/ui/Input";
import { PhoneNumberInput } from "@/components/ui/phone-number-input";
import BirthDatePicker from "@/components/ui/BirthDatePicker";
import CardBrand from "@/components/ui/CardBrand";

import useProductStore from "@/store/useProductStore";
import { useCheckoutStore } from "@/store/useCheckoutStore";

import { formatPriceFromCents } from "@/helpers";
import { COMPATIBILITY_REPORT, DATE_FORMAT } from "@/utils/constants";
import { getStoredFirstUTM, getStoredLastUTM } from "@/utils/utm-tracker";
import { salesiqIdentify } from "@/lib/tracking/salesiqIdentify";
import { isPhoneValid } from "@/utils/is-phone-valid";
import { saveEmailToLS } from "@/lib/tracking/localEmail";

import {
	StripeCardPart,
	type StripePayState,
} from "@/components/sections/Compatibility/StripeCardPart";
import CheckoutSectionLoader from "@/components/sections/Checkout/CheckoutSectionLoader";
import Button from "@/components/ui/Button";

const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LILYCHYSTOFAT!;
const stripePromise = loadStripe(pk);

type CompatibilityCheckoutForm = {
	firstName: string;
	email: string;
	phone: string;
	birthDate1: string;
	birthDate2: string;
};

type FormErrors = Partial<Record<keyof CompatibilityCheckoutForm, string>>;

const initialForm: CompatibilityCheckoutForm = {
	firstName: "",
	email: "",
	phone: "",
	birthDate1: "",
	birthDate2: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientContext() {
	if (typeof window === "undefined") return {};

	const utmFirst = getStoredFirstUTM();
	const utmLast = getStoredLastUTM();

	return {
		site: window.location.hostname,
		pagePath: window.location.pathname,

		utmSource: utmFirst?.utm_source,
		utmMedium: utmFirst?.utm_medium,
		utmCampaign: utmFirst?.utm_campaign,
		utmContent: utmFirst?.utm_content,
		utmTerm: utmFirst?.utm_term,

		utmLastSource: utmLast?.utm_source,
		utmLastMedium: utmLast?.utm_medium,
		utmLastCampaign: utmLast?.utm_campaign,
		utmLastContent: utmLast?.utm_content,
		utmLastTerm: utmLast?.utm_term,
	};
}

type ClientCtx = ReturnType<typeof getClientContext>;

export default function CheckoutFormSection() {
	const productId = COMPATIBILITY_REPORT;
	const router = useRouter();

	const product = useProductStore((s) => s.getProduct(productId));
	const productLoading = useProductStore((s) => s.isLoading(productId));
	const fetchProduct = useProductStore((s) => s.fetchProduct);

	const {
		clientSecret,
		status,
		error: checkoutError,
		createIntent,
		markSuccess,
		reset,
		intentKey,
		intentId,
		intentToken,
	} = useCheckoutStore();

	const [form, setForm] =
		React.useState<CompatibilityCheckoutForm>(initialForm);

	const [smsConsent, setSmsConsent] = React.useState(false);
	const smsConsentRef = React.useRef(false);
	const [submitAttempted, setSubmitAttempted] = React.useState(false);
	const [errors, setErrors] = React.useState<FormErrors>({});
	const [hadSecretOnce, setHadSecretOnce] = React.useState(false);

	const [ctx, setCtx] = React.useState<ClientCtx>({});

	const lastLeadEmailRef = React.useRef<string>("");
	const lastLeadEmailWithPIRef = React.useRef<string>("");
	const leadAbortRef = React.useRef<AbortController | null>(null);
	const formRef = React.useRef(form);
	formRef.current = form;

	const payFnRef = React.useRef<null | (() => Promise<void>)>(null);
	const [payState, setPayState] = React.useState<StripePayState>({
		canPay: false,
		paying: false,
		error: null,
		cardError: null,
	});

	const priceLabel =
		!productLoading && product
			? formatPriceFromCents(product.price, {
					currency: product.currency ?? "USD",
					showCents: true,
				})
			: "...";

	const showStripe = !!clientSecret;

	const isStripeInitializing =
		!hadSecretOnce &&
		!clientSecret &&
		(status === "idle" || status === "creating");

	const elementsOptions = React.useMemo<
		StripeElementsOptions | undefined
	>(() => {
		if (!clientSecret) return undefined;
		return { clientSecret, appearance: { theme: "stripe" } };
	}, [clientSecret]);

	const emailValid = React.useMemo(() => {
		const v = form.email.trim();
		return !!v && emailRegex.test(v);
	}, [form.email]);

	const buttonDisabled =
		!clientSecret ||
		isStripeInitializing ||
		!payState.canPay ||
		payState.paying;

	React.useEffect(() => {
		setCtx(getClientContext());
	}, []);

	React.useEffect(() => {
		if (clientSecret) setHadSecretOnce(true);
	}, [clientSecret]);

	React.useEffect(() => {
		const expectedKey = `create:${productId}`;
		if (intentKey && intentKey !== expectedKey) reset();
	}, [intentKey, productId, reset]);

	React.useEffect(() => {
		if (!product && !productLoading) fetchProduct(productId);
	}, [product, productLoading, fetchProduct, productId]);

	React.useEffect(() => {
		if (!product || productLoading) return;

		const expectedKey = `create:${productId}`;

		if (intentKey && intentKey !== expectedKey) {
			reset();
			return;
		}

		if (clientSecret && intentKey === expectedKey) return;

		if (status !== "idle") return;

		if (!ctx?.site) return;

		createIntent({
			productType: productId,
			sessionId: localStorage.getItem("ff_session_id") || undefined,
			salesiqVisitorId:
				localStorage.getItem("ff_salesiq_visitor_id") || undefined,
			...(ctx || {}),
		}).catch(() => {});
	}, [
		product,
		productLoading,
		productId,
		intentKey,
		clientSecret,
		status,
		createIntent,
		reset,
		ctx,
	]);

	React.useEffect(() => {
		if (!checkoutError) return;
		setPayState((prev) => ({ ...prev, error: checkoutError }));
	}, [checkoutError]);

	React.useEffect(() => {
		return () => {
			reset();
		};
	}, [reset]);

	const captureLeadInternal = React.useCallback(
		async (opts?: { force?: boolean }) => {
			const email = (formRef.current.email || "").trim().toLowerCase();
			if (!email) return;

			if (!emailRegex.test(email)) return;

			const hasPI = !!intentId && !!intentToken;
			const force = !!opts?.force;

			if (!force && lastLeadEmailRef.current === email) return;
			if (hasPI && lastLeadEmailWithPIRef.current === email) return;

			lastLeadEmailRef.current = email;
			if (hasPI) lastLeadEmailWithPIRef.current = email;

			leadAbortRef.current?.abort();
			const controller = new AbortController();
			leadAbortRef.current = controller;

			const firstName = (formRef.current.firstName || "").trim() || undefined;

			salesiqIdentify({ email, firstName });
			saveEmailToLS(email);

			const payload = {
				paymentIntentId: intentId || undefined,
				intentToken: intentToken || undefined,
				email,
				firstName,
				phone: (formRef.current.phone || "").trim() || undefined,
				sessionId: localStorage.getItem("ff_session_id") || undefined,
				salesiqVisitorId:
					localStorage.getItem("ff_salesiq_visitor_id") || undefined,
				smsConsent: smsConsentRef.current || undefined,
				...(ctx || {}),
			};

			try {
				await fetch("/api/lead-captured", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
					signal: controller.signal,
					keepalive: true,
				});
			} catch {
				//
			}
		},
		[intentId, intentToken, ctx],
	);

	const setField = React.useCallback(
		<K extends keyof CompatibilityCheckoutForm>(key: K, value: string) => {
			setForm((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	const onEmailBlur: React.FocusEventHandler<HTMLInputElement> =
		React.useCallback(() => {
			saveEmailToLS(form.email);
			captureLeadInternal().catch(() => {});
		}, [form.email, captureLeadInternal]);

	const handleStripeStateChange = React.useCallback((s: StripePayState) => {
		setPayState((prev) => {
			if (
				prev.canPay === s.canPay &&
				prev.paying === s.paying &&
				prev.error === s.error &&
				prev.cardError === s.cardError
			) {
				return prev;
			}
			return s;
		});
	}, []);

	const onSuccess = React.useCallback(() => {
		markSuccess?.();
		router.push("/success");
	}, [router, markSuccess]);

	const validateOnSubmit = React.useCallback(
		(data: CompatibilityCheckoutForm) => {
			const next: FormErrors = {};

			if (!data.firstName.trim()) next.firstName = "Please enter your first name.";
			if (!data.birthDate1) next.birthDate1 = "Please select your birthdate.";
			if (!data.birthDate2)
				next.birthDate2 = "Please select partner’s birthdate.";

			const email = data.email.trim();
			if (!email || !emailRegex.test(email))
				next.email = "Please enter a valid email.";

			if (!data.phone || !isPhoneValid(data.phone))
				next.phone = "Please enter a valid phone number.";

			return next;
		},
		[],
	);

	const onPayClick = React.useCallback(async () => {
		setSubmitAttempted(true);

		const nextErrors = validateOnSubmit(form);
		setErrors(nextErrors);

		if (Object.keys(nextErrors).length !== 0) return;

		if (!payFnRef.current) {
			setPayState((p) => ({
				...p,
				error: "Payment form is not ready yet. Please wait a moment.",
			}));
			return;
		}

		await payFnRef.current();
	}, [form, validateOnSubmit]);

	const showFirstNameError = submitAttempted && !!errors.firstName;
	const showEmailError = submitAttempted && !!errors.email;
	const showPhoneError = submitAttempted && !!errors.phone;
	const showBirth1Error = submitAttempted && !!errors.birthDate1;
	const showBirth2Error = submitAttempted && !!errors.birthDate2;

	const renderProiceLabel = () => (
		<p className="font-lato text-[22px]/[150%] font-normal text-brand-black">
			{productLoading ? "..." : priceLabel}
		</p>
	);

	return (
		<section
			id="checkout"
			className="relative bg-white overflow-visible lg:h-[742px] py-[80px] lg:py-0"
		>

			<div className="absolute inset-0 z-10">
				<Image
					src="/noise_bg.svg"
					alt=""
					fill
					quality={85}
					sizes="100vw"
					className="object-cover"
				/>
			</div>

			<div className="container relative z-10 lg:top-[-100px]">
				<div className="relative mx-auto rounded-[32px] bg-white px-6 py-8 md:px-10 md:py-10 lg:px-[104px] lg:py-[51px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]">
					{isStripeInitializing ? (
						<CheckoutSectionLoader text="Initializing payment..." />
					) : null}

					{status === "error" && checkoutError ? (
						<p className="mb-4 text-sm font-lato text-red-600">
							{checkoutError}
						</p>
					) : null}

					<div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between md:gap-8">
						<div className="max-w-[520px]">
							<p className="font-lato font-normal text-body leading-[1.2] text-[#C6ABB3] text-center md:text-left">
								Order now
							</p>

							<h2 className="mt-[23px] font-canela font-thin text-brand-black text-[48px] md:text-[52px] lg:text-[52px] leading-[105%] text-center md:text-left">
								{productLoading ? "Loading..." : product?.title}
							</h2>
						</div>

						<div className="relative hidden md:block h-[160px] w-[154px] lg:h-[200px] lg:w-[192px]">
							<Image src="/icons/checkout_ornament_pink.svg" alt="" fill quality={85} />
						</div>
					</div>

					<hr className="my-8 w-full border-t border-[#DADDE4]" />

					<div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10 lg:grid-cols-[1fr_1fr] lg:gap-[96px]">
						<div>
							<h3 className="font-canela font-light text-brand-black text-[32px] md:text-[28px] lg:text-[32px]">
								Enter Your Birthdates &amp; Get Instant Access:
							</h3>

							<div className="mt-[26px] space-y-4">
								<div>
									<Input
										placeholder="First Name"
										value={form.firstName}
										onChange={(e) => setField("firstName", e.target.value)}
									/>
									{showFirstNameError ? (
										<p className="mt-1 text-xs font-lato text-brand-primary">
											{errors.firstName}
										</p>
									) : null}
								</div>

								<div>
									<BirthDatePicker
										placeholder="Your Birthdate"
										onChange={(val) =>
											setField("birthDate1", val ? val.format(DATE_FORMAT) : "")
										}
									/>
									{showBirth1Error ? (
										<p className="mt-1 text-xs font-lato text-brand-primary">
											{errors.birthDate1}
										</p>
									) : null}
								</div>

								<div>
									<BirthDatePicker
										placeholder="Partner’s Birthdate"
										onChange={(val) =>
											setField("birthDate2", val ? val.format(DATE_FORMAT) : "")
										}
									/>
									{showBirth2Error ? (
										<p className="mt-1 text-xs font-lato text-brand-primary">
											{errors.birthDate2}
										</p>
									) : null}
								</div>

								<div>
									<Input
										placeholder="Email address"
										value={form.email}
										onChange={(e) => setField("email", e.target.value)}
										onBlur={onEmailBlur}
									/>
									{showEmailError ? (
										<p className="mt-1 text-xs font-lato text-brand-primary">
											{errors.email}
										</p>
									) : null}
								</div>

								<div>
									<PhoneNumberInput
										value={form.phone}
										onChange={(val) => setField("phone", val)}
										defaultCountry="us"
										placeholder="Phone number"
									/>
									{showPhoneError ? (
										<p className="mt-1 text-xs font-lato text-brand-primary">
											{errors.phone}
										</p>
									) : null}
									<label className="mt-3 flex items-start gap-2 cursor-pointer">
										<input
											type="checkbox"
											checked={smsConsent}
											onChange={(e) => {
												setSmsConsent(e.target.checked);
												smsConsentRef.current = e.target.checked;
												if (e.target.checked) captureLeadInternal({ force: true });
											}}
											className="mt-0.5 shrink-0 accent-brand-primary"
										/>
										<span className="font-lato text-xs text-[#5A5757] leading-relaxed">
											By checking this box, you agree to receive SMS messages from The Leelu Method. Message and data rates may apply. Reply STOP to opt out at any time.{" "}
											<a href="/legal" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-primary">
												View our Privacy Policy.
											</a>
										</span>
									</label>
								</div>

								<div className="pt-6">
									<p className="font-canela font-light text-brand-black text-[20px]">
										Payment Info
									</p>

									<p className="mt-10 font-lato font-normal text-[15px] text-[#41444E] md:mt-8">
										We accept
									</p>

									<div className="mt-2 flex flex-wrap items-center gap-3">
										<CardBrand label="visa" />
										<CardBrand label="mastercard" />
										<CardBrand label="amex" />
										<CardBrand label="paypal" />
										<CardBrand label="discover" />
									</div>

									{showStripe && elementsOptions ? (
										<Elements stripe={stripePromise} options={elementsOptions}>
											<StripeCardPart
												clientSecret={clientSecret!}
												productType={productId}
												amountCents={product?.price ?? 0}
												firstName={form.firstName}
												email={form.email}
												emailValid={emailValid}
												phone={form.phone}
												birthDate1={form.birthDate1}
												birthDate2={form.birthDate2}
												onSuccess={onSuccess}
												onRegisterPay={(fn) => {
													payFnRef.current = fn;
												}}
												onStateChange={handleStripeStateChange}
											/>
										</Elements>
									) : null}
								</div>
							</div>
						</div>

						<div>
							<h4 className="font-canela font-light text-brand-black text-[32px] md:text-[28px] lg:text-[32px]">
								Order summary
							</h4>

							<div className="mt-5 space-y-3">
								<div className="flex items-baseline justify-between gap-4">
									<p className="font-lato text-body uppercase tracking-[3%] text-[#5A5757]">
										{productLoading ? "Loading..." : (product?.title ?? "")}
									</p>

									{renderProiceLabel()}
								</div>

								<div className="flex items-baseline justify-between gap-4">
									<p className="font-lato text-body font-normal text-brand-black">
										Subtotal
									</p>
									{renderProiceLabel()}
								</div>

								<div className="!my-[43px] md:!my-8 h-px w-full bg-[#DADDE4]" />

								<div className="flex items-baseline justify-between gap-4">
									<p className="font-lato text-body font-normal uppercase tracking-[0.03em] text-brand-black">
										DUE TODAY
									</p>
									{renderProiceLabel()}
								</div>
							</div>

							<Button
								type="button"
								onClick={onPayClick}
								disabled={buttonDisabled}
								loading={payState.paying}
								fullWidth
								className="mt-[24px] md:mt-10 lg:mt-[80px] xs:px-0 xs:text-[12px] md:px-6 md:text-[15px] lg:px-0 lg:text-[12px] xl:px-6 xl:text-[15px]"
								trackingData={{
									cta_name: "complete_purchase",
									cta_text: "UNLOCK MY COMPATIBILITY CODE",
									cta_target_url: null,
									cta_location: "checkout_compatibility",
								}}
							>
								UNLOCK MY COMPATIBILITY CODE
								{!productLoading && product ? ` - ${priceLabel}` : ""}
							</Button>

							<p className="mt-4 text-center font-lato text-[11px] leading-[1.6] text-[#9B9DA8]">
								All sales are final. No refunds. By purchasing you agree to our{' '}
								<a href="/legal#refund-policy" className="underline hover:text-[#757986] transition-colors">
									Terms of Purchase
								</a>
								.
							</p>

							{payState.error ? (
								<p className="mt-3 text-sm font-lato text-red-600">
									{payState.error}
								</p>
							) : null}
							{payState.cardError ? (
								<p className="mt-2 text-sm font-lato text-red-600">
									{payState.cardError}
								</p>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
