import React from "react";
import Image from "next/image";

const WebinarDiscoverSection = () => {
	return (
		<section className="relative bg-brand-white py-16 md:pt-[550px] pt-[1030px] lg:pt-[450px]">
			<div className="container px-4 mx-auto">
				<div className="max-w-[1200px] mx-auto">
					{/* Title */}
					<h2
						className="font-canela font-thin leading-[110%] text-center text-brand-deep mb-10 md:mb-12 lg:mb-16
						text-[48px] md:text-[48px] lg:text-[60px]"
					>
						During our time together you&apos;ll discover:
					</h2>

					{/* Three cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
						{/* Card 1 */}
						<div
							className="
								bg-white rounded-[32px] flex flex-col items-center

								/* MOBILE */
								p-6

								/* TABLET */
								md:p-7 md:text-left

								/* DESKTOP (unchanged visual) */
								lg:p-8 lg:text-left
							"
						>
							<div className="w-full flex justify-center md:justify-start">
								<div className="relative mb-5 md:mb-6 w-[140px] md:w-[160px] lg:w-[177px] aspect-[177/251]">
									{/* Background image */}
									<Image src="/images/webinar/webinar_discover_icon.png" alt="" fill />

									{/* Center ornament */}
									<Image
										src="/icons/ornament_7.svg"
										alt=""
										width={87}
										height={87}
										className="absolute left-1/2 top-1/2 -translate-x-1/2 lg:-translate-y-[70px] -translate-y-[60px] pointer-events-none"
									/>

									{/* Number */}
									<div className="font-canela font-light text-[#C89F26] absolute bottom-0 left-0 text-[60px]">
										1.
									</div>
								</div>
							</div>

							<div>
								<h3
									className="font-canela font-light text-brand-black mb-3 lg:mb-4
								text-[24px] leading-[130%] md:text-[24px] lg:text-[24px] lg:leading-[130%] lg:text-left text-center"
								>
									Why You Attract Who You Are Not Who You Want
								</h3>

								<p
									className="font-lato font-medium text-[#5A5757] tracking-[0.03em]
								text-[17px] leading-[26px] md:text-[17px] md:leading-[26px] lg:text-body lg:leading-[26px] lg:text-left text-center"
								>
									How your internal baseline dictates partner selection, and the
									specific identity shift that finally attracts your ideal mate.
								</p>
							</div>
						</div>

						{/* Card 2 */}
						<div
							className="
								bg-white rounded-[32px] flex flex-col items-center

								/* MOBILE */
								p-6

								/* TABLET */
								md:p-7 md:text-left

								/* DESKTOP */
								lg:p-8 lg:text-left
							"
						>
							<div className="w-full flex justify-center md:justify-start">
								<div className="relative mb-5 md:mb-6 w-[140px] md:w-[160px] lg:w-[177px] aspect-[177/251]">
									{/* Background image */}
									<Image src="/images/webinar/webinar_discover_icon.png" alt="" fill />

									{/* Center ornament */}
									<Image
										src="/icons/ornament_7.svg"
										alt=""
										width={87}
										height={87}
										className="absolute left-1/2 top-1/2 -translate-x-1/2 lg:-translate-y-[70px] -translate-y-[60px] pointer-events-none"
									/>

									{/* Number */}
									<div className="font-canela font-light text-[#C89F26] absolute bottom-0 left-0 text-[60px]">
										2.
									</div>
								</div>
							</div>

							<div>
								<h3
									className="font-canela font-light text-brand-black mb-3 lg:mb-4
								text-[24px] leading-[130%] md:text-[24px] lg:text-[24px] lg:leading-[130%] lg:text-left text-center"
								>
									Your Subconscious Love Script
								</h3>

								<p
									className="font-lato font-medium text-[#5A5757] tracking-[0.03em]
								text-[17px] leading-[26px] md:text-[17px] md:leading-[26px] lg:text-body lg:leading-[26px] lg:text-left text-center"
								>
									The childhood programming creating repetitive relationship
									dynamics—and how energetic ties to past partners keep you
									locked in destructive patterns.
								</p>
							</div>
						</div>

						{/* Card 3 */}
						<div
							className="
								bg-white rounded-[32px] flex flex-col items-center

								/* MOBILE */
								p-6

								/* TABLET */
								md:p-7 md:text-left

								/* DESKTOP */
								lg:p-8 lg:text-left
							"
						>
							<div className="w-full flex justify-center md:justify-start">
								<div className="relative mb-5 md:mb-6 w-[140px] md:w-[160px] lg:w-[177px] aspect-[177/251]">
									{/* Background image */}
									<Image src="/images/webinar/webinar_discover_icon.png" alt="" fill />

									{/* Center ornament */}
									<Image
										src="/icons/ornament_7.svg"
										alt=""
										width={87}
										height={87}
										className="absolute left-1/2 top-1/2 -translate-x-1/2 lg:-translate-y-[70px] -translate-y-[60px] pointer-events-none"
									/>

									{/* Number */}
									<div className="font-canela font-light text-[#C89F26] absolute bottom-0 left-0 text-[60px]">
										3.
									</div>
								</div>
							</div>

							<div>
								<h3
									className="font-canela font-light text-brand-black mb-3 lg:mb-4
								text-[24px] leading-[130%] md:text-[24px] lg:text-[24px] lg:leading-[130%] lg:text-left text-center"
								>
									Your Relationship Code & Compatibility Formula
								</h3>

								<p
									className="font-lato font-medium text-[#5A5757] tracking-[0.03em]
								text-[17px] leading-[26px] md:text-[17px] md:leading-[26px] lg:text-body lg:leading-[26px] lg:text-left text-center"
								>
									The measurable LeeluTech markers predicting partnership
									outcomes—and why incompatible men keep matching your current
									frequency.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default WebinarDiscoverSection;
