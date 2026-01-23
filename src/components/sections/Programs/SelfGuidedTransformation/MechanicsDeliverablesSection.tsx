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
						This is not a course. It is a 12-Module Deprogramming Sequence based
						on the LeeluTech Numerological System.
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
								The Audit
							</p>

							<p className="mt-4 font-medium text-center font-lato text-[#5A5757] text-body leading-[1.7]">
								We identify the specific glitch corrupting your connection
								script — the “Safety” paradox, the “Savior” trap, or the
								invisible ceiling every relationship hits.
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
								The Mechanics
							</p>

							<p className="mt-4 text-center font-lato text-[#5A5757] text-body leading-[1.7]">
								Learn the 87 Hidden Desires. Calculate what triggers loyalty —
								not what he says he wants, but what his code needs.
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
								The Strategy
							</p>

							<p className="mt-4 text-center font-lato text-[#5A5757] text-body leading-[1.7]">
								Learn the 87 Hidden Desires. Calculate what triggers loyalty —
								not what he says he wants, but what his code needs.
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
				<div className="flex mt-[340px] md:mt-[280px] lg:mt-[121px] items-start gap-[24px] lg:gap-[37px] justify-center lg:justify-start">
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

				{/* === DESKTOP GRID === */}
				<div className="grid grid-cols-1 mt-[55px] lg:grid-cols-2 gap-16 items-start">
					{/* LEFT: TEXT */}
					<div>
						<div className="space-y-12 max-w-[557px] mx-auto lg:mx-0">
							{[
								{
									title: "12-Module Video System:",
									text: "Lifetime access to the full deprogramming curriculum.",
								},
								{
									title: "The Relationship Protocol Workbook:",
									text: "The exact exercises to rewrite your internal script.",
								},
								{
									title: "60-Day Reprogramming Schedule:",
									text: "Daily homework and audio assignments delivered via Circle community to ensure consistent implementation.",
								},
								{
									title: "2 Live Group Zoom Calls:",
									text: "Kick-off session to orient you to the system + wrap-up session to troubleshoot and integrate your results.",
								},
								{
									title: "Access to Quarterly Live Diagnostics:",
									text: "Watch Lily analyze VIP client cases in real-time)",
								},
								{
									title: "Bonus:",
									text: "Your Personal LeeluTech Breakdown (PDF)",
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
					<div className="hidden lg:flex">
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
