"use client";

import Image from "next/image";
import React from "react";

export default function TheDiagnosisSection() {
	return (
		<section className="relative bg-brand-white overflow-visible">
			{/* soft background glow */}
			<div className="absolute inset-0 left-0 right-0 -top-[180px] bottom-0 z-0 pointer-events-none">
				<Image
					src="/images/programs/self-guided-transformation/diagnosis_bg.png"
					alt=""
					fill
					priority
					style={{
						maskImage:
							"linear-gradient(to bottom, transparent 0%, black 15%, black 100%)",
						WebkitMaskImage:
							"linear-gradient(to bottom, transparent 0%, black 15%, black 100%)",
					}}
				/>
			</div>

			<div className="container relative py-[12px] md:py-[70px] lg:py-[110px] z-10">
				<div className="grid grid-cols-1 lg:grid-cols-[1.50fr_0.50fr] gap-12 md:gap-14 lg:gap-16 items-center">
					{/* ================= LEFT ================= */}
					<div className="order-2 lg:order-1">
						<h2 className="font-canela font-thin text-brand-black text-[44px] md:text-[52px] lg:text-[60px] leading-[105%]">
							THE DIAGNOSIS
						</h2>

						<div className="mt-[40px] md:mt-[44px] lg:mt-[56px] space-y-6">
							{/* item */}
							{[
								{
									icon: "/icons/red_star.svg",
									title: "IN A RELATIONSHIP:",
									text: `You love him, but the friction is exhausting. You're constantly "managing" the emotional labor. You feel like the Project Manager, not the Partner.`,
								},
								{
									icon: "/icons/necktie.svg",
									title: "IN CRISIS:",
									text: `You just ended things again. You're determined not to repeat the cycle, but you don't trust your instincts anymore because it feels like you attract the same man with a different face.`,
								},
								{
									icon: "/icons/red_star.svg",
									title: "LOOKING:",
									text: `You're high-achieving in every area except love. You're tired of "potential." You want to know exactly how to screen for a builder, not a project.`,
								},
							].map((item) => (
								<div key={item.title} className="rounded-[16px] bg-[#FFF8F8] px-6 py-6">
									<div className="flex items-start gap-4">
										<div>
											<div className="flex flex-row gap-4 items-center">
												<div className="relative h-[33px] w-[27px] flex-shrink-0">
													<Image src={item.icon} alt="" fill className="object-contain" />
												</div>
												<p className="font-canela font-light text-brand-deep text-[26px] md:text-[28px] lg:text-[32px] tracking-[0.02em]">
													{item.title}
												</p>
											</div>

											<p className="mt-4 font-lato font-normal text-[#6A6A6A] text-body leading-[1.75]">
												{item.text}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* ================= RIGHT ================= */}
					<div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
						<div className="relative w-full max-w-[380px] md:max-w-[420px] lg:max-w-[520px]">
							{/* image card */}
							<div className="relative">
								<div
									className="
										relative w-full
										h-[520px]
										md:h-[620px]
										lg:w-[496px] lg:h-[834px]
									"
								>
									<Image
										src="/images/programs/self-guided-transformation/diagnosis_section.png"
										alt=""
										fill
										priority
										quality={100}
									/>
								</div>
							</div>

							{/* bottom badge */}
							<div className="absolute -bottom-[22px] md:-bottom-[28px] lg:-bottom-[26px] left-1/2 -translate-x-1/2">
								<div
									className="
										bg-[#EB4F68] flex items-center justify-center rounded-full
										w-[96px] h-[132px]
										md:w-[120px] md:h-[170px]
										lg:w-[171px] lg:h-[238px]
									"
								>
									<div
										className="
											relative
											w-[52px] h-[80px]
											md:w-[60px] md:h-[110px]
											lg:w-[69px] lg:h-[167px]
										"
									>
										<Image
											src="/icons/programs_icon_star.svg"
											alt=""
											fill
											className="object-contain filter brightness-0 invert"
										/>
									</div>
								</div>
							</div>

							{/* spacing for badge */}
							<div className="h-10 md:h-14 lg:h-12" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
