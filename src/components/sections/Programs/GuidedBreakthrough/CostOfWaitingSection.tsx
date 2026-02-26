"use client";

import ArcAutoOnce from "@/components/ui/ArcFlyOnce";
import Button from "@/components/ui/Button";
import { formatPriceFromCents } from "@/helpers";
import useProductStore from "@/store/useProductStore";
import { GUIDED_BREAKTHROUGH } from "@/utils/constants";
import Image from "next/image";
import React from "react";

export default function CostOfWaitingSection() {
	const productId = GUIDED_BREAKTHROUGH;

	// product store
	const product = useProductStore((s) => s.getProduct(productId));
	const loading = useProductStore((s) => s.isLoading(productId));
	const fetchProduct = useProductStore((s) => s.fetchProduct);

	React.useEffect(() => {
		if (!product && !loading) fetchProduct(productId);
	}, [product, loading, fetchProduct, productId]);

	const priceLabel =
		!loading && product
			? formatPriceFromCents(product.price, {
					currency: product.currency ?? "USD",
					showCents: false,
				})
			: "...";
	return (
		<section className="relative lg:pb-[116px] pb-[80px]">
			<div className="container">
				<div className="text-center">
					{/* Top Image */}
					<div className="flex justify-center mb-12 relative pt-[230px] md:pt-[300px] lg:pt-[300px]">
						<div
							className="
                absolute
                w-[268px] h-[290px]
                sm:w-[358px] sm:h-[376px]
                top-[-100px]
                overflow-visible
              "
						>
							<Image
								src="/images/programs/guided-breakthrough/man-holding-rose-flower-back.png"
								alt="Stop Guessing"
								fill
								quality={100}
								sizes="(min-width: 640px) 358px, 320px"
								className="object-contain"
							/>

							{/* Logo badge */}
							<div
								className="
																absolute left-1/2 -translate-x-1/2
																bottom-[-50px] sm:bottom-[-50px]
																flex items-center justify-center
																bg-[#EB4F68] overflow-hidden
																before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay rounded-[300px] z-10
																w-[74px] h-[102px]
																lg:w-[101px] lg:h-[140px]
															"
							>
								<div className="relative w-[45px] h-[45px] lg:w-[58px] lg:h-[56px]">
									<Image
										src="/leelu_logo.svg"
										alt=""
										fill
										className="filter brightness-0 invert"
									/>
								</div>
							</div>

							{/* Arc */}
							<ArcAutoOnce
								className="absolute inset-0 -z-0 -translate-y-[13%] pointer-events-none -translate-x-[2%]"
								endAt={0.9}
								flightStart={0.2}
								durMs={1500}
								startDelayMs={500}
								arrowRotateDeg={254}
								arrowScale={0}
								arrowCenterX={6.5}
								arrowCenterY={-6}
								arrowOffsetY={3}
								arcRx={220}
								arcRy={208}
								strokeWidth={3}
							/>
						</div>
					</div>

					{/* Heading */}
					<h2 className="font-thin text-[48px] lg:text-[60px] leading-[100%] font-canela text-brand-deep mb-8">
						THE COST OF WAITING
					</h2>

					{/* Subheading */}
					<p className="font-normal font-lato text-[17px] lg:text-[17px] leading-[130%] text-[#5A5757] mb-6 lg:mb-8 text-center">
						Six more months of &quot;should I stay or should I go?&quot; Six
						more months of second-guessing every conversation. Six more months
						watching other women build the relationships you want while
						you&apos;re stuck analyzing why yours doesn&apos;t work.
					</p>

					{/* Text (tablet only smaller) */}

					<div
						className="
						relative mx-auto my-[26px]
                w-[8px] h-[66px]
              "
					>
						<Image src="/icons/yellow_stick.svg" alt="" fill quality={100} />
					</div>

					<p className="font-canela text-[32px] font-thin lg:text-[32px] leading-[130%] text-brand-deep mb-6 lg:mb-12 mx-auto text-center">
						Time is the one currency you can&apos;t get back. This removes the
						guesswork immediately.
					</p>

					<p className="mt-[57px] font-canela font-thin text-brand-black text-[48px] lg:text-[60px]">
						Investment: {priceLabel}
					</p>

					<Button
						variant="primary"
						size="md"
						className="w-full lg:w-[30%] xs:text-[12px] mt-[32px]"
					trackingData={{
						cta_name: "get_personalized_support",
						cta_text: "GET PERSONALIZED SUPPORT",
						cta_target_url: null,
						cta_location: "guided_cost",
					}}
					>
						GET PERSONALIZED SUPPORT
					</Button>

					<p className="text-brand-primary font-lato font-normal text-[24px] leading-[150%] mt-[33px]">
						<span className="text-brand-deep">Next cohort starts</span> March 18
					</p>
				</div>
			</div>
		</section>
	);
}
