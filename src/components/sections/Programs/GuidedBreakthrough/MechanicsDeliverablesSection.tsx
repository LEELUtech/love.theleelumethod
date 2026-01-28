"use client";

import Button from "@/components/ui/Button"
import Image from "next/image";
import React from "react";

export default function MechanicsDeliverablesSection() {
	return (
		<section className="relative overflow-hidden">
			{/* background */}
			<div className="absolute inset-0 z-0">
				<Image
					src="/images/programs/self-guided-transformation/mechanics_section_bg.png"
					alt=""
					fill
					priority
					quality={100}
				/>
			</div>

			<div className="container relative py-[80px] lg:pt-[110px] lg:pb-[230px]">
				{/* ===== TOP TITLE + STEPS ===== */}
				<div className="text-center">
					<h2 className="font-canela font-thin text-brand-deep text-[48px] lg:text-[60px] leading-[110%]">
						THE MECHANICS
					</h2>

					<p className="lg:mt-2 mt-6 font-canela font-thin text-brand-deep text-[24px] lg:text-[32px] leading-[1.6]">
						We go beyond the video modules. We enter the lab.
					</p>

					{/* steps */}
					<div
						className="
							mt-[105px]
							grid grid-cols-1
							md:grid-cols-2
							lg:grid-cols-3
							gap-8 md:gap-8 lg:gap-10
							items-stretch
						"
					>
						{/* STEP 1 */}
						<div className="flex flex-col items-center">
							<div className="relative h-[210px] w-[177px]">
								<Image
									src="/images/programs/self-guided-transformation/mechanic_icon.png"
									alt=""
									fill
								/>
								<div className="absolute top-1/2 left-[50px] -translate-y-14 h-[80px] w-[80px]">
									<Image
										src="/icons/ornament_12.svg"
										alt=""
										fill
										className="object-contain"
									/>
								</div>
								<p className="mt-4 absolute bottom-[-15px] left-[70px] font-canela font-light text-[#C89F26] text-[60px] leading-none">
									1.
								</p>
							</div>

							<p className="mt-[76px] font-canela font-light text-brand-black lg:text-[32px] text-[24px] leading-[1.15]">
								Forensic Audit
							</p>

							<p className="mt-4 font-medium text-center font-lato text-[#5A5757] text-body leading-[1.7]">
								I personally review the mathematical frequencies in your
								numerological code against your partner&apos;s (or ex&apos;s).
							</p>
						</div>

						{/* STEP 2 */}
						<div className="flex flex-col items-center">
							<div className="relative h-[210px] w-[177px]">
								<Image
									src="/images/programs/self-guided-transformation/mechanic_icon.png"
									alt=""
									fill
								/>
								<div className="absolute top-1/2 left-[50px] -translate-y-14 h-[80px] w-[80px]">
									<Image
										src="/icons/ornament_7.svg"
										alt=""
										fill
										className="object-contain"
									/>
								</div>
								<p className="mt-4 absolute bottom-[-15px] left-[70px] font-canela font-light text-[#C89F26] text-[60px] leading-none">
									2.
								</p>
							</div>

							<p className="mt-[76px] font-canela font-light text-brand-black lg:text-[32px] text-[24px] leading-[1.15]">
								Critical Gap Analysis
							</p>

							<p className="mt-4 text-center font-lato text-[#5A5757] text-body leading-[1.7]">
								I identify the friction points, communication gaps, and hidden
								compatibility drivers you&apos;re too close to see.
							</p>
						</div>

						{/* STEP 3 */}
						<div
							className="
								flex flex-col items-center
								md:col-span-2 md:max-w-[520px] md:mx-auto
								lg:col-span-1 lg:max-w-none lg:mx-0
							"
						>
							<div className="relative h-[210px] w-[177px]">
								<Image
									src="/images/programs/self-guided-transformation/mechanic_icon.png"
									alt=""
									fill
								/>
								<div className="absolute top-1/2 left-[50px] -translate-y-14 h-[80px] w-[80px]">
									<Image
										src="/icons/ornament_8.svg"
										alt=""
										fill
										className="object-contain"
									/>
								</div>
								<p className="mt-4 absolute bottom-[-15px] left-[70px] font-canela font-light text-[#C89F26] text-[60px] leading-none">
									3.
								</p>
							</div>

							<p className="mt-[76px] font-canela font-light text-brand-black lg:text-[32px] text-[24px] leading-[1.15]">
								The Pivot
							</p>

							<p className="mt-4 text-center font-lato text-[#5A5757] text-body leading-[1.7]">
								A 90-minute strategy session where we script your next move. No
								vague advice. Specific instructions.
							</p>
						</div>
					</div>
				</div>

				{/* ===== IMAGE BLOCK (MOBILE + TABLET ONLY) ===== */}
				<div className="flex justify-center mt-[108px] lg:hidden">
					<div
						className="
							relative
							w-[361px] h-[390px]
							md:w-[520px] md:h-[520px]
						"
					>
						{/* Main image */}
						<Image
							src="/images/lily/lily_3.png"
							alt=""
							fill
							quality={100}
							className="
								[mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
								[-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
							"
						/>

						{/* Ornament */}
						<div
							className="
								absolute z-10 opacity-60
								bottom-[-400px] left-[-65px] w-[484px] h-[506px]
								md:bottom-[-320px] md:left-[-20px] md:w-[560px] md:h-[560px]
							"
						>
							<Image
								src="/icons/ornament_3.svg"
								alt=""
								fill
								quality={100}
								className="
									filter brightness-0 invert
									[mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]
									[-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]
								"
							/>
						</div>

						{/* Floating card */}
						<div
							className="
								absolute z-20
								bottom-[-280px] right-[100px]
								w-[166px] h-[238px]
								md:bottom-[-210px] md:right-[178px]
								bg-[#FFEBE5]
								rounded-[20px]
								shadow-[5.62px_5.62px_16.85px_0px_rgba(0,0,0,0.1)]
								flex flex-col items-center gap-[16px] pt-[20px] px-4
							"
						>
							<div className="flex items-center justify-center bg-brand-primary rounded-[300px] w-[58px] h-[86px]">
								<Image
									src="/leelu_logo.svg"
									alt=""
									width={39}
									height={39}
									className="filter brightness-0 invert"
								/>
							</div>

							<p className="font-canela font-light text-[18px] text-center text-brand-black">
								The Relationship Protocol Workbook
							</p>
						</div>
					</div>
				</div>

				{/* === TITLE === */}

				{/* === DESKTOP GRID === */}
				<div className="grid grid-cols-1 mt-[46px] lg:grid-cols-2 gap-16 lg:gap-[145px] items-start lg:mt-[151px]">
					{/* LEFT: TEXT */}
					<div>
						<div className="flex mt-[340px] md:mt-[280px] lg:mt-[0px] items-start gap-[24px] lg:gap-[37px] justify-center lg:justify-start">
							<Image
								src="/icons/star_with_line.png"
								alt=""
								width={48}
								height={48}
							/>
							<h2 className="font-thin text-[48px] lg:text-[60px] leading-[100%] font-canela text-brand-deep text-left">
								The Deliverables
							</h2>
						</div>

						<div className="font-lato text-center lg:text-left font-normal text-[24px] leading-[150%] mt-4">
							Everything in Protocol Essentials:
						</div>

						<div className="space-y-12 max-w-[557px] mx-auto lg:mx-0 mt-[36px] lg:mt-[46px]">
							{[
								{
									title: "Written Compatibility Analysis:",
									text: "A comprehensive dossier on your relationship's behavioral patterns delivered within 5 business days (PDF).",
								},
								{
									title: "90-Minute Strategy Session:",
									text: "A diagnostic call where we apply the system to your specific crisis.",
								},
								{
									title: "Custom Action Plan:",
									text: "A strategic roadmap based on your unique code (PDF).",
								},
							].map((item, idx) => (
								<div key={idx} className="flex items-start gap-4">
									<Image
										src="/icons/star.svg"
										alt=""
										width={20}
										height={20}
										className="flex-shrink-0 mt-1"
									/>
									<div>
										<h3 className="font-normal text-[24px] leading-[150%] font-lato text-[#8F6E0E] mb-3">
											{item.title}
										</h3>
										<p className="font-medium text-body text-[#5A5757] font-lato leading-[130%]">
											{item.text}
										</p>
									</div>
								</div>
							))}

							<Button
								variant="primary"
								size="md"
								className="w-full xs:text-[12px] mt-[32px]"
							>
								ENROLL NOW
							</Button>
						</div>
					</div>

					{/* RIGHT: IMAGE (DESKTOP ONLY) */}
					<div className="hidden lg:flex h-[800px]">
						<div className="relative w-[496px] h-[535px]">
							<Image
								src="/images/lily/lily_3.png"
								alt=""
								fill
								quality={100}
								className="
									[mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
									[-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
								"
							/>

							<div className="absolute z-30 bottom-[-300px] left-[20px] w-[484px] h-[506px] opacity-60">
								<Image
									src="/icons/ornament_3.svg"
									alt=""
									fill
									quality={100}
									className="
										filter brightness-0 invert
										[mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]
										[-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]
									"
								/>
							</div>

							<div className="relative p-4 flex flex-col gap-[27px] items-center bottom-[-490px] left-[180px] w-[166px] h-[238px] bg-[#FFEBE5] z-[40] rounded-[20px] shadow-[5.62px_5.62px_16.85px_0px_rgba(0,0,0,0.1)]">
								<div className="bottom-[50px] mt-[20px] right-[50px] flex items-center justify-center bg-brand-primary rounded-[300px] w-[58px] h-[86px] z-10">
									<Image
										src="/leelu_logo.svg"
										alt=""
										width={39}
										height={39}
										className="filter brightness-0 invert"
									/>
								</div>
								<p className="font-canela font-light text-[18px] text-center text-brand-black">
									The Relationship Protocol Workbook
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
