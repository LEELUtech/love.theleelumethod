"use client";

import React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CardBrand from "@/components/ui/CardBrand";
import Input from "@/components/ui/Input";
import { PhoneNumberInput } from "@/components/ui/phone-number-input";
import { StripeCardPart } from "@/components/sections/Checkout/StripeCardPart";

import useProductStore from "@/store/useProductStore";
import { useCheckoutStore } from "@/store/useCheckoutStore";

import { formatPriceFromCents } from "@/helpers";
import {
	type BillingForm,
	validateBilling,
	isEmptyErrors,
} from "@/helpers/checkout";

import Select from "react-select";
import { countries } from "@/helpers/countries";
import { CountryOption, selectStyles } from "@/components/ui/Select";
import CheckoutSectionLoader from "@/components/sections/Checkout/CheckoutSectionLoader";
import {
	PROTOCOL_ESSENTIALS,
	GUIDED_BREAKTHROUGH,
	VIP_IMMERSION,
} from "@/utils/constants";
import { getStoredFirstUTM, getStoredLastUTM } from "@/utils/utm-tracker";
import { salesiqIdentify } from "@/lib/tracking/salesiqIdentify";
import { saveEmailToLS } from "@/lib/tracking/localEmail";
import { Section } from "@/components/ui/containers/section";
import { checkWebinarDiscount, checkInstallmentPlan } from "@/lib/webinarDiscount";
import { validatePromoCode, type PromoData } from "@/lib/promoDiscount";

const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LILYCHYSTOFAT!;
const stripePromise = loadStripe(pk);

function getButtonText(productId: string): string {
	switch (productId) {
		case PROTOCOL_ESSENTIALS:
			return "SIGN UP & BEGIN THE PROTOCOL";
		case GUIDED_BREAKTHROUGH:
			return "SIGN UP & GET PERSONALIZED SUPPORT";
		case VIP_IMMERSION:
			return "SIGN UP & APPLY FOR VIP ACCESS";
		default:
			return "SIGN UP NOW";
	}
}

const initialBilling: BillingForm = {
	firstName: "",
	lastName: "",
	email: "",
	address1: "",
	address2: "",
	city: "",
	state: "",
	postalCode: "",
	country: "",
	phone: "",
};

interface CheckoutFormSectionProps {
	productId: string;
}

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

export default function CheckoutFormSection({
	productId,
}: CheckoutFormSectionProps) {
	const selectId = React.useId();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [webinarDiscount, setWebinarDiscount] = React.useState(false);
	const [promoDiscount, setPromoDiscount] = React.useState<PromoData | null>(null);

	const product = useProductStore((s) => s.getProduct(productId));
	const productLoading = useProductStore((s) =>
		s.isLoading(productId),
	);
	const fetchProduct = useProductStore((s) => s.fetchProduct);

	const {
		clientSecret,
		status,
		error: checkoutError,
		createIntent,
		reset,
		markSuccess,
		intentKey,
		intentId,
		intentToken,
	} = useCheckoutStore();

	const [billing, setBilling] = React.useState<BillingForm>(initialBilling);
	const [smsConsent, setSmsConsent] = React.useState(false);
	const smsConsentRef = React.useRef(false);
	const [payInInstallments, setPayInInstallments] = React.useState(false);
	const [submitAttempted, setSubmitAttempted] = React.useState(false);
	const [hadSecretOnce, setHadSecretOnce] = React.useState(false);
	const [installmentOwed, setInstallmentOwed] = React.useState<number | null>(null);
	const [errors, setErrors] = React.useState(() =>
		validateBilling(initialBilling),
	);

	const [ctx, setCtx] = React.useState<ClientCtx>({});

	React.useEffect(() => {
		setCtx(getClientContext());
	}, []);

	React.useEffect(() => {
		const promoFromUrl = searchParams.get("promo")?.trim().toUpperCase();
		if (promoFromUrl) {
			validatePromoCode(promoFromUrl, productId)
				.then((data) => { if (data) setPromoDiscount(data); })
				.catch(() => {});
		}
	}, [productId, searchParams]);

	React.useEffect(() => {
		if (productId !== "protocol_essentials") return;
		const emailFromUrl = searchParams.get("email")?.trim().toLowerCase();
		if (!emailFromUrl) return;

		saveEmailToLS(emailFromUrl);

		checkInstallmentPlan(emailFromUrl, productId)
			.then((amount) => {
				setInstallmentOwed(amount);
				if (amount !== null) return;
				return checkWebinarDiscount(emailFromUrl).then((hasDiscount) => {
					if (hasDiscount) setWebinarDiscount(true);
				});
			})
			.catch(() => {});
	}, [productId, searchParams]);

	const splitUnlocked = searchParams.get("split") === "1";
	const showInstallmentToggle =
		!productLoading &&
		!!product &&
		(product.hide_installments !== true || splitUnlocked);

	React.useEffect(() => {
		if (!showInstallmentToggle) setPayInInstallments(false);
	}, [showInstallmentToggle]);

	const effectivePrice = promoDiscount
		? promoDiscount.discountPrice
		: webinarDiscount && product?.discount_price != null
			? product.discount_price
			: (product?.price ?? 0);

	const priceLabel =
		!productLoading && product
			? formatPriceFromCents(effectivePrice, {
					currency: product.currency ?? "USD",
					showCents: false,
				})
			: "...";

	const halfPriceLabel =
		!productLoading && product
			? formatPriceFromCents(Math.ceil(effectivePrice / 2), {
					currency: product.currency ?? "USD",
					showCents: true,
				})
			: "...";

	const effectivePriceLabel = installmentOwed !== null
		? formatPriceFromCents(installmentOwed, { currency: product?.currency ?? 'USD', showCents: false })
		: priceLabel;

	const firstPaymentLabel =
		installmentOwed === null && payInInstallments && !productLoading && product
			? halfPriceLabel
			: undefined;

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

	React.useEffect(() => {
		const expectedKey = `create:${productId}`;
		if (intentKey && intentKey !== expectedKey) reset();
	}, [intentKey, productId, reset]);

	React.useEffect(() => {
		if (clientSecret) {
			setHadSecretOnce(true);
		}
	}, [clientSecret]);

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
		return () => {
			reset();
		};
	}, [reset]);

	const setField = React.useCallback(
		<K extends keyof BillingForm>(key: K, value: string) => {
			setBilling((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	const showFieldError = React.useCallback(
		<K extends keyof BillingForm>(key: K) => submitAttempted && !!errors[key],
		[submitAttempted, errors],
	);

	const handleSubmitAttempt = React.useCallback(() => {
		setSubmitAttempted(true);
		const nextErrors = validateBilling(billing);
		setErrors(nextErrors);
		return isEmptyErrors(nextErrors);
	}, [billing]);

	const lastLeadEmailRef = React.useRef<string>("");
	const lastLeadEmailWithPIRef = React.useRef<string>("");
	const leadAbortRef = React.useRef<AbortController | null>(null);
	const billingRef = React.useRef(billing);
	billingRef.current = billing;

	const captureLeadInternal = React.useCallback(
		async (opts?: { force?: boolean }) => {
			const email = (billingRef.current.email || "").trim().toLowerCase();
			if (!email) return;

			const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
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

			const payload = {
				paymentIntentId: intentId || undefined,
				intentToken: intentToken || undefined,
				email,
				firstName: (billingRef.current.firstName || "").trim() || undefined,
				lastName: (billingRef.current.lastName || "").trim() || undefined,
				sessionId: localStorage.getItem("ff_session_id") || undefined,
				smsConsent: smsConsentRef.current || undefined,
				...(ctx || {}),
			};

			salesiqIdentify({
				email,
				firstName: (billingRef.current.firstName || "").trim() || undefined,
				lastName: (billingRef.current.lastName || "").trim() || undefined,
			});

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

	const onEmailBlur: React.FocusEventHandler<HTMLInputElement> =
		React.useCallback(() => {
			saveEmailToLS(billing.email);
			captureLeadInternal().catch(() => {});
			const emailNorm = billing.email.trim().toLowerCase();
			if (emailNorm) {
				checkInstallmentPlan(emailNorm, productId)
					.then((amount) => {
						setInstallmentOwed(amount);
						if (amount !== null) return;
						if (productId === 'protocol_essentials') {
							return checkWebinarDiscount(emailNorm).then((hasDiscount) => {
								if (hasDiscount && !webinarDiscount) {
									setWebinarDiscount(true);
								}
							});
						}
					})
					.catch(() => {});
			}
		}, [billing.email, captureLeadInternal, productId]);

	return (
		<div className="relative">
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
			{/* <div className="absolute bottom-0 left-0 right-0 -z-10 pointer-events-none">
				<Image
					src="/gradiend.svg"
					alt=""
					width={1440}
					height={400}
					className="w-full h-[500px] object-cover lg:h-auto lg:object-fill"
				/>
			</div> */}
			<Section
				sectionClasses="bg-white py-[37px] md:py-[56px] lg:py-[37px]"
				wrapperClasses="lg:top-[-200px] !pb-0 lg:pt-[70px]"
				id="checkout"
			>
				<div className="">
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

								<h2 className="mt-[23px] font-canela font-thin text-brand-black-100 text-[42px] bg:text-[48px] lg:text-[60px] leading-[105%] text-center md:text-left">
									{productLoading ? "Loading..." : product?.title}
								</h2>

								<p className="mt-4 px-4 md:px-0 font-lato text-body leading-[1.55] text-[#41444E] text-center md:text-left">
									{productLoading ? "Loading..." : product?.description}
								</p>
							</div>

							<div className="relative hidden md:block h-[160px] w-[154px] lg:h-[200px] lg:w-[192px]">
								<Image src="/icons/checkout_ornament_pink.svg" alt="" fill quality={85} />
							</div>
						</div>

						<hr className="my-8 w-full border-t border-[#DADDE4]" />

						<div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-[164px]">
							<div>
								<h3 className="font-canela font-light text-brand-black text-[32px] md:text-[28px] lg:text-[32px]">
									Billing Information
								</h3>

								<div className="mt-[40px] space-y-6 md:mt-8">
									<div>
										<Input
											placeholder="First name"
											value={billing.firstName}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												setField("firstName", e.target.value)
											}
										/>
										{showFieldError("firstName") ? (
											<p className="mt-1 text-xs font-lato text-brand-primary">
												{errors.firstName}
											</p>
										) : null}
									</div>

									<div>
										<Input
											placeholder="Last name"
											value={billing.lastName}
											onChange={(e) => setField("lastName", e.target.value)}
										/>
										{showFieldError("lastName") ? (
											<p className="mt-1 text-xs font-lato text-brand-primary">
												{errors.lastName}
											</p>
										) : null}
									</div>

									<div>
										<Input
											placeholder="Email address"
											value={billing.email}
											onChange={(e) => setField("email", e.target.value)}
											onBlur={onEmailBlur}
										/>
										{showFieldError("email") ? (
											<p className="mt-1 text-xs font-lato text-brand-primary">
												{errors.email}
											</p>
										) : null}
										{installmentOwed !== null ? (
											<p className="mt-2 text-sm font-lato text-brand-primary">
												You have an outstanding installment payment of {formatPriceFromCents(installmentOwed, { currency: 'USD', showCents: false })}. Please complete your existing payment plan.
											</p>
										) : null}
									</div>

									<div className="h-3 md:h-2" />

									<div>
										<Input
											placeholder="Street address"
											value={billing.address1}
											onChange={(e) => setField("address1", e.target.value)}
										/>
										{showFieldError("address1") ? (
											<p className="mt-1 text-xs font-lato text-brand-primary">
												{errors.address1}
											</p>
										) : null}
									</div>

									<Input
										placeholder="Street address 2 (optional)"
										value={billing.address2}
										onChange={(e) => setField("address2", e.target.value)}
									/>

									<div>
										<Input
											placeholder="City"
											value={billing.city}
											onChange={(e) => setField("city", e.target.value)}
										/>
										{showFieldError("city") ? (
											<p className="mt-1 text-xs font-lato text-brand-primary">
												{errors.city}
											</p>
										) : null}
									</div>

									<Input
										placeholder="State (optional)"
										value={billing.state}
										onChange={(e) => setField("state", e.target.value)}
									/>

									<div>
										<Input
											placeholder="ZIP/Postal code"
											value={billing.postalCode}
											onChange={(e) => setField("postalCode", e.target.value)}
										/>
										{showFieldError("postalCode") ? (
											<p className="mt-1 text-xs font-lato text-brand-primary">
												{errors.postalCode}
											</p>
										) : null}
									</div>

									<div>
										<Select<CountryOption, false>
											instanceId={selectId}
											inputId={selectId}
											options={countries}
											placeholder="Select country"
											value={
												countries.find((c) => c.value === billing.country) ??
												null
											}
											onChange={(opt) => setField("country", opt?.value ?? "")}
											styles={selectStyles}
											classNamePrefix="rs"
											isSearchable
										/>
										{showFieldError("country") ? (
											<p className="mt-1 text-xs font-lato text-brand-primary">
												{errors.country}
											</p>
										) : null}
									</div>

									<div>
										<PhoneNumberInput
											value={billing.phone}
											onChange={(val) => setField("phone", val)}
											defaultCountry="us"
											placeholder="Phone number"
										/>
										{showFieldError("phone") ? (
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
								</div>
							</div>

							<div>
								<h3 className="font-canela font-light text-brand-black text-[32px] md:text-[28px] lg:text-[32px]">
									Payment Info
								</h3>

								{promoDiscount ? (
									<div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1">
										<span className="font-lato text-[12px] font-semibold text-green-700 uppercase tracking-[0.05em]">
											Promo applied: {promoDiscount.code}
										</span>
									</div>
								) : null}

								{installmentOwed !== null ? (
									<div className="mt-8 rounded-[8px] border border-brand-primary bg-brand-primary/5 px-4 py-3">
										<p className="font-lato text-[13px] font-semibold uppercase tracking-[0.05em] text-brand-black">
											Outstanding installment
										</p>
										<p className="mt-0.5 font-lato text-[15px] text-[#41444E]">
											{productLoading ? "..." : effectivePriceLabel}
										</p>
									</div>
								) : (
									<div className="mt-8 flex gap-3">
										<button
											type="button"
											onClick={() => setPayInInstallments(false)}
											className={`flex-1 rounded-[8px] border px-4 py-3 text-left transition-colors ${
												!payInInstallments
													? "border-brand-primary bg-brand-primary/5"
													: "border-[#C3C6D1] bg-white"
											}`}
										>
											<p className="font-lato text-[13px] font-semibold uppercase tracking-[0.05em] text-brand-black">
												Pay in full
											</p>
											<p className="mt-0.5 font-lato text-[15px] text-[#41444E]">
												{productLoading ? "..." : priceLabel}
											</p>
										</button>

										{showInstallmentToggle ? (
											<button
												type="button"
												onClick={() => setPayInInstallments(true)}
												className={`flex-1 rounded-[8px] border px-4 py-3 text-left transition-colors ${
													payInInstallments
														? "border-brand-primary bg-brand-primary/5"
														: "border-[#C3C6D1] bg-white"
												}`}
											>
												<p className="font-lato text-[13px] font-semibold uppercase tracking-[0.05em] text-brand-black">
													2 payments
												</p>
												<p className="mt-0.5 font-lato text-[15px] text-[#41444E]">
													{productLoading ? "..." : `${halfPriceLabel} × 2`}
												</p>
											</button>
										) : null}
									</div>
								)}

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

								{showStripe && clientSecret && elementsOptions ? (
									<Elements stripe={stripePromise} options={elementsOptions}>
										<StripeCardPart
											clientSecret={clientSecret}
											productType={productId}
											billing={billing}
											amountCents={installmentOwed ?? effectivePrice}
											ctx={ctx}
											onSubmitAttempt={handleSubmitAttempt}
											loading={productLoading}
											productName={product?.title}
											priceLabel={effectivePriceLabel}
											firstPaymentLabel={firstPaymentLabel}
											buttonText={getButtonText(productId)}
											webinarDiscount={webinarDiscount || undefined}
											promoCode={promoDiscount?.code}
											onSuccess={() => {
												markSuccess();
												router.push("/success");
											}}
										/>
									</Elements>
								) : null}
							</div>
						</div>
					</div>
				</div>{" "}
			</Section>
		</div>
	);
}
