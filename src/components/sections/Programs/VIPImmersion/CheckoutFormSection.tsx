"use client";

import CardBrand from "@/components/ui/CardBrand";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Image from "next/image";
import React from "react";

export default function CheckoutFormSection() {
	return (
		<section className="relative bg-white py-[37px] md:py-[56px] lg:py-[37px] lg:h-[1080px] overflow-visible">
			<div className="absolute inset-0 z-0">
				<Image src="/images/bg/checkout_bg.png" alt="Stop Guessing" fill quality={100} />
			</div>

			<div className="container relative z-10 lg:top-[-100px] ">
				<div
					className="
						mx-auto
						rounded-[32px]
						bg-white
						px-6 py-8
						md:px-10 md:py-10
						lg:px-[104px] lg:py-[51px]
						shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]
						ring-1 ring-black/[0.04]
					"
				>
					{/* Header */}
					<div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between md:gap-8">
						<div className="max-w-[520px]">
							<p className="font-lato font-normal text-body leading-[1.2] text-[#C6ABB3] text-center md:text-left">
								Order now
							</p>

							<h2 className="mt-[23px] font-canela font-thin text-brand-black text-[48px] md:text-[52px] lg:text-[60px] leading-[105%] text-center md:text-left">
								THE VIP
								<br />
								IMMERSION
							</h2>

							<p className="mt-4 font-lato text-body leading-[1.55] text-[#41444E] text-center md:text-left">
								For the woman who wants personalized insight and direct support.
							</p>
						</div>

						<div className="relative hidden md:block h-[160px] w-[154px] lg:h-[200px] lg:w-[192px]">
							<Image src="/icons/checkout_ornament_pink.svg" alt="" fill />
						</div>
					</div>

					<hr className="my-8 w-full border-t border-[#DADDE4]" />

					{/* Content */}
					<div
						className="
							mt-10
							grid grid-cols-1 gap-10
							md:grid-cols-2 md:gap-10
							lg:grid-cols-[0.9fr_1.1fr] lg:gap-[164px]
						"
					>
						{/* LEFT */}
						<div>
							<h3 className="font-canela font-light text-brand-black text-[32px] md:text-[28px] lg:text-[32px]">
								Billing Information
							</h3>

							<div className="mt-[40px] space-y-6 md:mt-8">
								<Input placeholder="First name" />
								<Input placeholder="Last name" />
								<Input placeholder="Email address" />
								<div className="h-3 md:h-2" />
								<Input placeholder="Street address" />
								<Input placeholder="Street address 2 (optional)" />
								<Input placeholder="City" />
								<Input placeholder="State" />
								<Input placeholder="ZIP/Postal code" />
								<Select placeholder="Country" />
								<Input placeholder="Phone number" />
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

							<div className="mt-4 space-y-3">
								<Input placeholder="Credit card number" />

								<div className="grid grid-cols-3 gap-3">
									<Select placeholder="Month" />
									<Select placeholder="Year" />
									<Input placeholder="CVC" />
								</div>
							</div>

							{/* Order summary */}
							<div className="mt-[56px] md:mt-[56px] lg:mt-[94px]">
								<h4 className="font-canela font-light text-brand-black text-[32px] md:text-[28px] lg:text-[32px]">
									Order summary
								</h4>

								<div className="mt-5 space-y-3">
									<div className="flex items-baseline justify-between gap-4">
										<p className="font-lato text-body font-normal uppercase tracking-[0.03em] text-[#5A5757]">
											GUIDED BREAKTHROUGH
										</p>
										<p className="font-lato text-body font-normal text-brand-black">$1,700</p>
									</div>

									<div className="flex items-baseline justify-between gap-4">
										<p className="font-lato text-body font-normal text-brand-black">Subtotal</p>
										<p className="font-lato text-body font-normal text-brand-black">$1,700</p>
									</div>

									<div className="!my-[43px] md:!my-8 h-px w-full bg-black/10" />

									<div className="flex items-baseline justify-between gap-4">
										<p className="font-lato text-body font-normal uppercase tracking-[0.03em] text-brand-black">
											DUE TODAY
										</p>
										<p className="font-lato text-body font-normal text-brand-black">$1,700</p>
									</div>
								</div>

								<button
									type="button"
									className="
										mt-[24px] md:mt-10 lg:mt-[80px]
										inline-flex w-full items-center justify-center
										rounded-full bg-brand-primary hover:bg-[#E13954]
										px-0 py-4 md:px-6
										font-lato text-[15px] leading-[26px] font-medium uppercase tracking-[0.10em]
										text-white
										transition-colors
									"
								>
									SIGN UP & APPLY FOR VIP ACCESS
								</button>
							</div>
						</div>
					</div>

				</div>
			</div>
		</section>
	);
}
