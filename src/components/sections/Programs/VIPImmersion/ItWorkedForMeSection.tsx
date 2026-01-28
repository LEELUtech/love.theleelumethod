"use client";

import Button from "@/components/ui/Button"
import Image from "next/image";
import React from "react";

export default function ItWorkedForMeSection() {
	return (
		<section className="relative overflow-hidden">
			{/* background */}
			<div className="absolute inset-0 z-0">
				<Image
					src="/images/programs/self-guided-transformation/itworks_bg.png"
					alt=""
					fill
					priority
					quality={100}
					className="object-cover"
				/>
			</div>

			<div className="container relative z-10 pt-[80px] pb-[160px] md:pt-[110px] md:pb-[300px] lg:pt-[160px] lg:pb-[360px]">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-10 items-center">
					{/* LEFT */}
					<div className="lg:max-w-[492px] lg:order-1 order-2 md:mx-auto lg:mx-0">
						<h2 className="font-canela font-thin text-brand-deep leading-[130%] text-[60px] md:text-[78px] lg:text-[112px]">
							It Worked <br className="hidden lg:block" />
							For Me
						</h2>

						<p className="mt-6 font-lato text-[#5A5757] leading-[26px] text-[17px] md:text-[18px] md:leading-[28px]">
							This isn&apos;t academic theory. It&apos;s the exact system that
							saved my relationship before it started. <br /> I ran Don&apos;s
							chart before our second date. I identified his Hidden Desire in 20
							minutes—the emotional driver most women spend years trying to
							guess. I knew which behaviors would trigger his desire and which
							would make me irreplaceable. Four years later, we have what my
							clients call &quot;unicorn love.&quot; Not luck. Not chemistry.
							Code-level compatibility engineered from day one.
						</p>

						<p className="mt-6 font-canela font-light text-brand-deep leading-[130%] text-[28px] md:text-[30px] lg:text-[32px]">
							The system works because it&apos;s based on mathematical pattern
							recognition, not intuition.
						</p>

						<p className="mt-6 font-canela font-light text-brand-deep leading-[130%] text-[28px] md:text-[30px] lg:text-[32px]">
							Your relationship isn&apos;t broken. You&apos;re just running
							corrupted code.
						</p>

						<Button
							variant="primary"
							size="md"
							className="w-full lg:w-[70%] xs:text-[12px] mt-[32px]"
						>
							APPLY FOR VIP ACCESS
						</Button>
					</div>

					{/* RIGHT */}
					<div className="flex order-1 lg:order-2 justify-center lg:justify-end">
						<div className="relative w-full max-w-[420px] md:max-w-[560px] lg:max-w-[520px]">
							{/* big rounded image */}
							<div className="relative overflow-hidden rounded-[44px] md:rounded-[56px] lg:rounded-[64px]">
								<div className="relative w-full h-[510px] md:h-[806px] lg:h-[806px]">
									<Image
										src="/images/programs/vip-immersion/it_worked_for_me.png"
										alt="It worked for me"
										fill
										priority
										quality={100}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
