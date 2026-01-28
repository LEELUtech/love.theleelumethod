"use client";

import ArcAutoOnce from "@/components/ui/ArcFlyOnce";
import Image from "next/image";
import React from "react";

import useProductStore from "@/store/useProductStore";
import { COMPATIBILITY_REPORT } from "@/utils/constants";
import { formatPriceFromCents } from "@/helpers";

const CoreValueSection = () => {
	const productId = COMPATIBILITY_REPORT;

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
					showCents: true,
				})
			: "...";

	return (
		<section className="relative pb-[215px] pt-[90px] md:pt-[130px] lg:pt-[130px] bg-brand-white">
			<div className="container">
				<div className="mx-auto text-center">
					{/* Top Image */}
					<div className="flex justify-center mb-12 relative">
						<div
							className="
                absolute
                w-[268px] h-[290px]
                sm:w-[358px] sm:h-[376px]
								top-[-320px]
                overflow-visible
              "
						>
							<Image
								src="/images/resources/resources-section-1.png"
								alt="Stop Guessing"
								fill
								quality={100}
								sizes="(min-width: 640px) 358px, 320px"
							/>

							{/* Logo badge */}
							<div
								className="
                  absolute left-1/2 -translate-x-1/2
                  bottom-[-50px]
                  flex items-center justify-center
                  bg-brand-primary rounded-[300px] z-10
                  w-[86px] h-[112px]
                  lg:w-[101px] lg:h-[140px]
                "
							>
								<div className="relative w-[55px] h-[55px] lg:w-[63px] lg:h-[61px]">
									<Image
										src="/leelu_logo.svg"
										alt=""
										fill
										className="object-contain filter brightness-0 invert"
									/>
								</div>
							</div>

							{/* Arc */}
							<ArcAutoOnce
								className="absolute inset-0 -z-0 -translate-y-[15%] pointer-events-none -translate-x-[2%]"
								endAt={0.9}
								flightStart={0.2}
								durMs={1500}
								startDelayMs={500}
								arrowRotateDeg={254}
								arrowScale={0.8}
								arrowCenterX={6.5}
								arrowCenterY={-6}
								arrowOffsetY={3}
								arcRx={220}
								arcRy={208}
							/>
						</div>
					</div>

					{/* Heading */}
					<h2 className="font-thin text-[32px] lg:text-[32px] leading-[150%] font-canela text-brand-deep mb-6 md:mt-[180px] lg:mt-[180px]">
						This is the foundational intelligence most couples pay thousands in
						therapy to maybe, eventually uncover.{" "}
						<span className="font-normal">
							You&apos;re getting it in 60 seconds for {priceLabel}
						</span>
						—the price of a small coffee.
					</h2>
				</div>
			</div>
		</section>
	);
};

export default CoreValueSection;
