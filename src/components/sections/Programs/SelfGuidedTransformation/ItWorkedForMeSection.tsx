"use client";

import Button from "@/components/ui/Button"
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

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

		<motion.div 
			className="container px-4 relative z-10 pt-[80px] pb-[160px] md:pt-[110px] md:pb-[300px] lg:pt-[160px] lg:pb-[360px]"
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.8, delay: 0.2 }}
		>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-10 items-center">
					{/* LEFT */}
					<div className="lg:max-w-[492px] lg:order-1 order-2 md:mx-auto lg:mx-0">
						<h2 className="font-canela font-thin text-brand-deep leading-[130%] text-[60px] md:text-[78px] lg:text-[112px]">
							It Worked <br className="hidden lg:block" />
							For Me
						</h2>

						<p className="mt-6 font-lato text-[#5A5757] leading-[26px] text-[17px] md:text-[18px] md:leading-[28px]">
							Before we got serious, I got analytical. I ran our numbers to
							ensure our compatibility was structural, not just chemical. The
							result? Four years of excitement, fulfillment, and peace.
						</p>

						<p className="mt-6 font-canela font-light text-brand-deep leading-[130%] text-[28px] md:text-[30px] lg:text-[32px]">
							I didn&apos;t waste a decade finding the
							<br />
							right one— I engineered it.
						</p>

						<Button
							variant="primary"
							size="md"
							className="w-full lg:w-[70%] xs:text-[12px] mt-[32px]"
						trackingData={{
							cta_name: "begin_protocol",
							cta_text: "BEGIN THE PROTOCOL",
							cta_target_url: null,
							cta_location: "self_guided_itworked",
						}}
						>
							BEGIN THE PROTOCOL
						</Button>
					</div>

					{/* RIGHT */}
					<div className="flex order-1 lg:order-2 justify-center lg:justify-end">
						<div className="relative w-full max-w-[420px] md:max-w-[560px] lg:max-w-[520px]">
							{/* big rounded image */}
							<div className="relative overflow-hidden rounded-[44px] md:rounded-[56px] lg:rounded-[64px]">
								<div className="relative w-full h-[510px] md:h-[806px] lg:h-[806px]">
									<Image
										src="/images/programs/self-guided-transformation/it_worked_for_me.png"
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
		</motion.div>
		</section>
	);
}
