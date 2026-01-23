"use client";

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
						This is the ER. We stop the bleeding immediately.
					</p>

					{/* steps */}
					<div
						className="
							mt-[105px]
							grid grid-cols-1
							md:grid-cols-2
							lg:grid-cols-4
							gap-8 md:gap-8 lg:gap-5
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
								Root Cause Extraction
							</p>

							<p className="mt-4 font-medium text-center font-lato text-[#5A5757] text-body leading-[1.7]">
								I don&apos;t just look at your chart; I look at your partner&apos;s chart. We decode both behavioral frequency patterns simultaneously.
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
								The Partner Protocol
							</p>

							<p className="mt-4 text-center font-lato text-[#5A5757] text-body leading-[1.7]">
								I bring him into the room—with you, separately, or both. We decode the dynamic from both sides to accelerate alignment.
							</p>
						</div>

						{/* STEP 3 */}
						<div
							className="flex flex-col items-center"
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
								Priority Course <br /> Correction
							</p>

							<p className="mt-4 text-center font-lato text-[#5A5757] text-body leading-[1.7]">
								You don&apos;t wait for a call. I review your texts, your matches, and your situations in real time to shift the power dynamic the moment it slips.
							</p>
						</div>

						{/* STEP 4 */}
						<div
							className="flex flex-col items-center"
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
									4.
								</p>
							</div>

							<p className="mt-[76px] font-canela font-light text-brand-black lg:text-[32px] text-[24px] leading-[1.15]">
								Inherited Behavioral Patterns
							</p>

							<p className="mt-4 text-center font-lato text-[#5A5757] text-body leading-[1.7]">
								We identify the relationship scripts passed down through your family of origin that are sabotaging your present.
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
									title: "3 Additional 1:1 Sessions (60 minutes each)",
									text: "Spaced over 90 days to ensure the transformation sticks. Total: 4 sessions over 90 days.",
								},
								{
									title: "Direct Access",
									text: "Priority communication channel (Voxer/WhatsApp) for 60 days. Text or voice. 24-hour response time weekdays.",
								},
								{
									title: "Joint Session Capability",
									text: "We can use your sessions for you alone, or for the couple.",
								},
								{
									title: "VIP-Only Live Diagnostic",
									text: "I analyze your specific relationship situation live in a group setting—walking through your chart, your partner's patterns, and the exact friction points. You receive real-time strategic guidance while others learn from your case study. (Offered quarterly; VIP clients receive priority scheduling.)",
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

							<button
								type="button"
								className="
									order-1 md:order-2
									mt-4 lg:mt-[48px]
									inline-flex items-center justify-center
									rounded-full
									bg-brand-primary hover:bg-[#E13954]
									text-white
									font-lato font-medium uppercase
									tracking-[1.6px]
									text-[15px]
									xs:w-full
									px-10 py-4
									 md:px-16 md:py-4
									lg:px-32 lg:py-4
									transition-colors
									w-full
								"
							>
								ENROLL NOW
							</button>
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
