import React from "react";
import Image from "next/image";

const WebinarDiscoverSection = () => {
	return (
		<section className="relative bg-brand-white py-16 pt-16 md:pt-16 lg:pt-[400px]">
			<div className="container px-4 mx-auto">
				<div className="max-w-[1200px] mx-auto">
					{/* Title */}
					<h2
						className="font-canela font-thin leading-[110%] text-center text-brand-deep mb-10 md:mb-12 lg:mb-16
						text-[30px] md:text-[42px] lg:text-[54px]"
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
								<div className="relative mb-5 md:mb-6 w-[140px] md:w-[160px] lg:w-[177px]">
									<Image
										src="/images/webinar_discover_icon.png"
										alt=""
										width={177}
										height={251}
										className="w-full h-auto"
									/>

									<div
										className="
				font-canela font-light text-brand-black
				absolute bottom-0 left-0
				text-[44px] md:text-[52px] lg:text-[60px]
			"
									>
										1.
									</div>
								</div>
							</div>

							<div>
								<h3
									className="font-canela font-light text-brand-black mb-3 lg:mb-4
								text-[20px] leading-[110%] md:text-[22px] lg:text-[24px] lg:leading-[100%]"
								>
									Why You Attract Who You Are Not Who You Want
								</h3>

								<p
									className="font-lato font-medium text-[#5A5757] tracking-[0.03em]
								text-[14px] leading-[22px] md:text-[15px] md:leading-[24px] lg:text-body lg:leading-[26px]"
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
								<div className="relative mb-5 md:mb-6 w-[140px] md:w-[160px] lg:w-[177px]">
									<Image
										src="/images/webinar_discover_icon.png"
										alt=""
										width={177}
										height={251}
										className="w-full h-auto"
									/>

									<div
										className="
				font-canela font-light text-brand-black
				absolute bottom-0 left-0
				text-[44px] md:text-[52px] lg:text-[60px]
			"
									>
										2.
									</div>
								</div>
							</div>

							<div>
								<h3
									className="font-canela font-light text-brand-black mb-3 lg:mb-4
								text-[20px] leading-[110%] md:text-[22px] lg:text-[24px] lg:leading-[110%]"
								>
									Your Subconscious Love Script
								</h3>

								<p
									className="font-lato font-medium text-[#5A5757] tracking-[0.03em]
								text-[14px] leading-[22px] md:text-[15px] md:leading-[24px] lg:text-body lg:leading-[26px]"
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
								<div className="relative mb-5 md:mb-6 w-[140px] md:w-[160px] lg:w-[177px]">
									<Image
										src="/images/webinar_discover_icon.png"
										alt=""
										width={177}
										height={251}
										className="w-full h-auto"
									/>

									<div
										className="
				font-canela font-light text-brand-black
				absolute bottom-0 left-0
				text-[44px] md:text-[52px] lg:text-[60px]
			"
									>
										3.
									</div>
								</div>
							</div>

							<div>
								<h3
									className="font-canela font-light text-brand-black mb-3 lg:mb-4
								text-[20px] leading-[110%] md:text-[22px] lg:text-[24px] lg:leading-[110%]"
								>
									Your Relationship Code & Compatibility Formula
								</h3>

								<p
									className="font-lato font-medium text-[#5A5757] tracking-[0.03em]
								text-[14px] leading-[22px] md:text-[15px] md:leading-[24px] lg:text-body lg:leading-[26px]"
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
