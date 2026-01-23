"use client";

import ArcAutoOnce from "@/components/ui/ArcFlyOnce";
import Image from "next/image";
import React from "react";

export default function CostOfWaitingSection() {
	return (
		<section className="relative lg:pb-[166px] pb-[80px]">
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
								src="/images/resources/resources-section-1.png"
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
                  bg-[#EB4F68] rounded-[300px] z-10
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
					<h2 className="font-thin text-[48px] lg:text-[60px] leading-[100%] font-canela text-brand-deep mb-8">
						THE COST OF WAITING
					</h2>

					{/* Subheading */}
					<p className="font-normal font-lato text-[17px] lg:text-[17px] leading-[130%] text-[#5A5757] mb-6 lg:mb-8 text-center">
						Every month you delay is another month operating on corrupted code.
						Another argument that didn&apos;t need to happen. Another year
						invested in the wrong man. Another divorce attorney consultation you
						could have avoided.
					</p>

					{/* Text (tablet only smaller) */}
					<p className="font-canela text-[32px] font-thin lg:text-[32px] leading-[130%] text-brand-deep mb-6 lg:mb-12 mx-auto text-center">
						The average divorce costs $15,000-$30,000. Two months of weekly
						therapy costs $1,600-$3,200. This system costs less than 5 therapy
						sessions—and gives you the diagnostic framework those sessions never
						will.
					</p>


					<div
						className="
						relative mx-auto my-[26px]
                w-[8px] h-[66px]
              "
					>
						<Image
							src="/icons/yellow_stick.svg"
							alt=""
							fill
							quality={100}
						/>
					</div>

					<p className="mt-8 font-canela font-normal text-brand-deep text-[32px] leading-[1.6]">
						You&apos;re not paying for information. You&apos;re paying for the
						precise correction
						<br className="hidden md:block" />
						that prevents catastrophic decisions.
					</p>

					<p className="mt-[57px] font-canela font-thin text-brand-black text-[48px] lg:text-[60px]">
						Investment: $697
					</p>

					<button 
						type="button"
						className="
							mt-6
							inline-flex items-center justify-center
							rounded-full bg-brand-primary hover:bg-[#E13954]
							text-white font-lato font-medium uppercase tracking-[1.6px]
							text-[13px] md:text-[14px]
							px-10 md:px-12 py-4
							transition-colors
							w-full
							lg:w-[33%]
						"
					>
						BEGIN THE PROTOCOL
					</button>
				</div>
			</div>
		</section>
	);
}
