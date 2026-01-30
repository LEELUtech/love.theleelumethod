"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CardBrand from "@/components/ui/CardBrand";
import Input from "@/components/ui/Input";
import { PhoneNumberInput } from "@/components/ui/phone-number-input";
import { StripeCardPart } from "@/components/sections/Checkout/StripeCardPart";

import useProductStore from "@/store/useProductStore";
import { useCheckoutStore } from "@/store/useCheckoutStore";

import { formatPriceFromCents } from "@/helpers";
import { VIP_IMMERSION } from "@/utils/constants";

import {
	type BillingForm,
	validateBilling,
	isEmptyErrors,
} from "@/helpers/checkout";

import Select from "react-select";
import { countries } from "@/helpers/countries";
import { CountryOption, selectStyles } from "@/components/ui/Select";
import CheckoutSectionLoader from "@/components/sections/Checkout/CheckoutSectionLoader";

const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
const stripePromise = loadStripe(pk);

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

export default function CheckoutFormSection() {
	const productId = VIP_IMMERSION;
	const selectId = React.useId();
	const router = useRouter();

	// stores
	const product = useProductStore((s) => s.getProduct(productId));
	const productLoading = useProductStore((s) => s.isLoading(productId));
	const fetchProduct = useProductStore((s) => s.fetchProduct);

	const {
		clientSecret,
		status,
		error: checkoutError,
		createIntent,
		reset,
		markSuccess,
		intentKey,
	} = useCheckoutStore();

	// local state
	const [billing, setBilling] = React.useState<BillingForm>(initialBilling);
	const [submitAttempted, setSubmitAttempted] = React.useState(false);
	const [hadSecretOnce, setHadSecretOnce] = React.useState(false);
	const [errors, setErrors] = React.useState(() =>
		validateBilling(initialBilling),
	);

	// derived
	const priceLabel =
		!productLoading && product
			? formatPriceFromCents(product.price, {
					currency: product.currency ?? "USD",
					showCents: false,
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


	React.useEffect(() => {
		const expectedKey = `create:${productId}`;
		if (intentKey && intentKey !== expectedKey) reset();
	}, [intentKey, productId, reset]);

	// effects

	React.useEffect(() => {
		if (clientSecret) setHadSecretOnce(true);
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

		createIntent({ productType: productId }).catch(() => {});
	}, [
		product,
		productLoading,
		productId,
		intentKey,
		clientSecret,
		status,
		createIntent,
		reset,
	]);

	// handlers
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


	React.useEffect(() => {
		return () => {
			reset();
		};
	}, [reset]);

	return (
		<section className="relative bg-white py-[37px] md:py-[56px] lg:py-[37px] lg:h-[1080px] overflow-visible">
			<div className="absolute inset-0 z-0">
				<Image
					src="/images/bg/checkout_bg.png"
					alt="Checkout bg"
					fill
					quality={100}
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

					{/* Header */}
					<div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between md:gap-8">
						<div className="max-w-[520px]">
							<p className="font-lato font-normal text-body leading-[1.2] text-[#C6ABB3] text-center md:text-left">
								Order now
							</p>

							<h2 className="mt-[23px] font-canela font-thin text-brand-black text-[32px] md:text-[52px] lg:text-[60px] leading-[105%] text-center md:text-left">
								{productLoading ? "Loading..." : product?.title}
							</h2>

							<p className="mt-4 font-lato text-body leading-[1.55] text-[#41444E] text-center md:text-left">
								{productLoading ? "Loading..." : product?.description}
							</p>
						</div>

						<div className="relative hidden md:block h-[160px] w-[154px] lg:h-[200px] lg:w-[192px]">
							<Image src="/icons/checkout_ornament_pink.svg" alt="" fill />
						</div>
					</div>

					<hr className="my-8 w-full border-t border-[#DADDE4]" />

					<div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-[164px]">
						{/* LEFT */}
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
									/>
									{showFieldError("email") ? (
										<p className="mt-1 text-xs font-lato text-brand-primary">
											{errors.email}
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
											countries.find((c) => c.value === billing.country) ?? null
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
								</div>
							</div>
						</div>

						{/* RIGHT */}
						<div>
							<h3 className="font-canela font-light text-brand-black text-[32px] md:text-[28px] lg:text-[32px]">
								Payment Info
							</h3>

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
										onSubmitAttempt={handleSubmitAttempt}
										loading={productLoading}
										productName={product?.name}
										priceLabel={priceLabel}
										onSuccess={() => {
											markSuccess();
											router.push("/success");
											// reset();
										}}
									/>
								</Elements>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
