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
						A contested divorce costs $30,000-$100,000. Custody battles can
						exceed $250,000. Years of therapy trying to &quot;process&quot; what
						went wrong: $15,000+.
					</p>

					{/* Text (tablet only smaller) */}

					<p className="font-canela text-[32px] font-thin lg:text-[32px] leading-[130%] text-brand-deep mb-6 lg:mb-12 mx-auto text-center">
						But the real cost? The year you spend trying to fix an unfixable
						relationship. The decade you lose rebuilding after the wrong
						marriage. The life you didn&apos;t live because you were trapped in
						someone else&apos;s patterns.
					</p>

					<div
						className="
						relative mx-auto my-[26px]
                w-[8px] h-[66px]
              "
					>
						<Image src="/icons/yellow_stick.svg" alt="" fill quality={100} />
					</div>

					<p className="mt-8 font-canela font-normal text-brand-deep text-[32px] leading-[1.6]">
						This is not an expense. It is the cheapest insurance policy you will
						ever buy.
					</p>

					{/* HERE */}

					<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 mt-[102px] items-center">
						{/* LEFT */}
						<div className="text-left">
							<h2 className="font-canela font-thin text-[60px] leading-[1.05] text-brand-black lg:text-[60px] text-center lg:text-left">
								WHO THIS IS FOR
							</h2>

							<p className="mt-[32px] font-lato text-body leading-[1.6] text-[#8A8F9E]">
								This level of work requires protected capacity. I can only offer
								this depth of personal involvement to women who are:
							</p>

							<ul className="mt-6 font-normal space-y-2 pl-5 font-lato text-body leading-[1.7] text-[#8A8F9E]">
								<li className="list-disc">
									Serious about implementation (not just information gathering)
								</li>
								<li className="list-disc">
									Financially committed to the transformation
								</li>
								<li className="list-disc">
									Emotionally ready to see uncomfortable truths
								</li>
								<li className="list-disc">
									Willing to take direction and apply the system precisely
								</li>
								<li className="list-disc">
									If you’re looking for validation or someone to take your side,
									this is not the right fit. If you need a guide who can see
									what you cannot and will tell you the truth even when it’s
									difficult—apply below.
								</li>
							</ul>

							<p className="mt-14 font-canela font-light text-[32px] leading-[1.35] text-brand-deep lg:text-[32px]">
								If you&apos;re looking for validation or someone to take your
								side, this is not the right fit. If you need a guide who can see
								what you cannot and will tell you the truth even when it&apos;s
								difficult—apply below.
							</p>
						</div>

						{/* RIGHT */}
						<div className="relative mx-auto w-full max-w-[560px]">
							<div className="relative max-w-[595px] h-[530px] md:h-[813px] lg:h-[813px]">
								<Image
									src="/images/programs/vip-immersion/who_this_is_for.png"
									alt=""
									fill
									quality={100}
								/>
							</div>

							{/* Badge */}
							<div className="absolute bottom-[-60px] lg:right-[-50px] right-[-20px] h-[126px] w-[100px] lg:h-[176px] lg:w-[140px] rounded-full bg-[#E0B2A4]">
								<div className="absolute left-1/2 translate-x-[-50%] top-1/2 translate-y-[-50%] w-[56px] h-[56px] lg:w-[76px] lg:h-[76px]">
									<Image
										src="/leelu_logo.svg"
										alt=""
										fill
										   className="filter brightness-0 invert"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* HERE */}

					<p className="lg:mt-[124px] mt-[84px] font-canela font-thin text-brand-black text-[48px] lg:text-[60px]">
						Investment: $4,997
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
						APPLY FOR VIP ACCESS
					</button>

					<p className="font-lato text-body font-normal text-[#757986] mt-[21px]">
						(3 spots available per month due to the depth of personal
						involvement required)
					</p>

					<p className="font-lato text-body font-normal text-[#757986] mt-[12px]">
						Applications are reviewed within 48 hours. If accepted, you&apos;ll
						receive calendar access to book your initial diagnostic session.
					</p>
				</div>
			</div>
		</section>
	);
}
