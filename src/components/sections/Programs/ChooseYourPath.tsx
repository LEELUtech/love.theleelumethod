import Button from "@/components/ui/Button";
import RotateOnView from "@/components/ui/RotateOnView"
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ChooseYourPathSection() {
	return (
		<section className="relative pt-[122px] pb-[122px] lg:py-[120px]">
			{/* background */}
			<div className="absolute inset-0 -z-10">
				<Image
					src="/images/programs/choose_your_path_bg.png"
					alt=""
					fill
					priority
					quality={100}
				/>
			</div>

			<div className="container">
				{/* top badge */}
				<div className="relative flex justify-center">

					<div
						className="
											absolute left-1/2 lg:top-[-220px] top-[-200px] -translate-x-1/2
											flex items-center justify-center overflow-hidden
											bg-[#EB4F68]
											before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay
											rounded-[300px]
											w-[107px] h-[148px]
											md:w-[107px] md:h-[148px]
											lg:w-[142px] lg:h-[195px]
											z-10
										"
					>
						<RotateOnView duration={5} amount={0.4} ease="easeOut">
							<Image
								src="/leelu_logo.svg"
								alt=""
								width={88}
								height={88}
								className="w-[65px] h-[65px] md:w-[65px] md:h-[65px] lg:w-[88px] lg:h-[88px] filter invert-[100%] brightness-[100%]"
							/>
						</RotateOnView>
					</div>
				</div>

				{/* title */}
				<h2 className="text-center font-canela font-thin text-brand-deep text-[60px] lg:text-[72px] leading-[110%]">
					CHOOSE YOUR PATH
				</h2>

				{/* cards */}
				<div
					className="
						mt-10 lg:mt-[178px]
						grid grid-cols-1
						md:grid-cols-1
						lg:grid-cols-3
						gap-12 lg:gap-6
						items-start
					"
				>
					{/* =================== CARD 1 =================== */}
					<div className="relative w-full rounded-[20px] bg-brand-white px-6 md:px-7 pt-[89px] pb-[48px] min-h-[860px] flex flex-col lg:translate-y-1">
						<div className="absolute top-[-40px] lg:top-[-50px] left-1/2 -translate-x-1/2 text-center font-canela font-light lg:font-thin text-brand-primary text-[72px] leading-[100%]">
							1.
						</div>

						<h3 className="text-center font-canela font-normal text-brand-black text-[30px] leading-[120%]">
							<p>SELF-GUIDED</p>
							<p>TRANSFORMATION</p>
						</h3>

						<p className="mt-3 text-center font-normal font-lato text-[#5A5757] text-body leading-[18px] mx-auto">
							For the woman ready to do the work on her own timeline.
						</p>

						<div className="mt-6 space-y-[48px]">
							<div>
								<p className="font-lato font-bold text-brand-black text-[18px] mb-3">
									What You Get:
								</p>

								<div>
									<p className="font-lato font-normal text-[#5A5757] text-[14px] leading-[26px] tracking-normal">
										• The complete 12-module video curriculum (lifetime access)
									</p>
									<p className="font-lato font-normal text-[#5A5757] text-[14px] leading-[26px] tracking-normal">
										• The Relationship Protocol Workbook (downloadable)
									</p>
									<p className="font-lato font-normal text-[#5A5757] text-[14px] leading-[26px] tracking-normal">
										• Bonus: Your Personal LeeluTech Breakdown PDF
									</p>
								</div>
							</div>

							<div>
								<p className="font-lato font-bold text-brand-black text-[18px]">
									Who This Is For:
								</p>

								<p className="font-lato font-normal text-[#5A5757] text-[14px] leading-[26px] tracking-normal">
									You’re not in crisis—you’re in clarity mode. You’ve done
									enough therapy, coaching, or self-work to know what you need
									to shift. You just need the specific steps to do it. You’re
									comfortable moving independently; you trust your own
									discipline, and you’d rather move at your own pace than wait
									for scheduled calls. You need the blueprint, not a guide
									holding your hand through it.
								</p>
							</div>
						</div>

						<div className="mt-auto">
							<Button
								variant="primary"
								size="md"
								className="w-full xs:text-[12px]"
								href="/programs/self-guided-transformation"
							>
								BEGIN THE PROTOCOL
							</Button>
						</div>
					</div>

					{/* =================== CARD 2 =================== */}
					<div className="relative w-full rounded-[20px] bg-brand-white px-6 md:px-7 pt-[89px] pb-[48px] min-h-[910px] flex flex-col lg:-translate-y-6">
						<div className="absolute top-[-40px] lg:top-[-50px] left-1/2 -translate-x-1/2 text-center font-canela font-light lg:font-thin text-brand-primary text-[72px] leading-[100%]">
							2.
						</div>

						<h3 className="text-center font-canela font-normal text-brand-black text-[30px] leading-[120%]">
							<p>GUIDED</p>
							<p>BREAKTHROUGH ⭐</p>
							<p>(Most Popular)</p>
						</h3>

						<p className="mt-3 text-center font-normal font-lato text-[#5A5757] text-body leading-[18px] mx-auto">
							For the woman who wants personalized insight and direct support.
						</p>

						<div className="mt-6 space-y-[48px]">
							<div>
								<p className="font-lato font-bold text-brand-black text-[18px] mb-3">
									Everything in Self-Guided, PLUS:
								</p>

								<div className="space-y-4">
									<p className="font-lato font-normal text-[#5A5757] text-[14px] leading-[26px] tracking-normal">
										• Written Compatibility Analysis (by personally reviewing
										your numerological code against your partner’s—identifying
										friction points, communication blind spots, and your hidden
										compatibility levers; delivered within 5 business days)
									</p>

									<p className="font-lato font-normal text-[#5A5757] text-[14px] leading-[26px] tracking-normal">
										• Private Strategy Session (90 minutes): A deep diagnostic
										call where Lily applies the system to your specific
										situation, helps you understand the root pattern, and
										scripts your next moves
									</p>
								</div>
							</div>

							<div>
								<p className="font-lato font-bold text-brand-black text-[18px]">
									Who This Is For:
								</p>

								<p className="font-lato font-normal text-[#5A5757] text-[14px] leading-[26px] tracking-normal">
									You’re at a crossroads and need clarity now. You want the
									system—but you also want a Lily in your corner, showing you
									exactly how to apply it to your relationship.
								</p>
							</div>
						</div>

						<div className="mt-auto">
							<Button
								variant="primary"
								size="md"
								className="w-full xs:text-[12px]"
								href="/programs/guided-breakthrough"
							>
								GET PERSONALIZED SUPPORT
							</Button>
						</div>
					</div>

					{/* =================== CARD 3 =================== */}
					<div className="relative w-full rounded-[20px] bg-brand-white px-6 md:px-7 pt-[89px] pb-[48px] min-h-[860px] flex flex-col lg:translate-y-1">
						<div className="absolute top-[-40px] lg:top-[-50px] left-1/2 -translate-x-1/2 text-center font-canela font-light lg:font-thin text-brand-primary text-[72px] leading-[100%]">
							3.
						</div>

						<h3 className="text-center font-canela font-normal text-brand-black text-[30px] leading-[120%]">
							VIP IMMERSION
						</h3>

						<p className="mt-3 text-center font-normal font-lato text-[#5A5757] text-body leading-[18px] mx-auto">
							For the woman who needs deep, ongoing support through the
							transformation.
						</p>

						<div className="mt-6 space-y-[48px]">
							<div>
								<p className="font-lato font-bold text-brand-black text-[18px] mb-3">
									Everything in Guided <br /> Breakthrough, PLUS:
								</p>

								<div className="space-y-4">
									<p className="font-lato font-normal text-[#5A5757] text-[14px] leading-[26px] tracking-normal">
										• The traditional 11 sessions (60 minutes each) — spaced
										strategically across 90 days for real-time course correction
										as you implement
									</p>

									<p className="font-lato font-normal text-[#5A5757] text-[14px] leading-[26px] tracking-normal">
										• Voxer/WhatsApp access to Lily for 60 days (text/voice),
										24-hour response time weekdays
									</p>

									<p className="font-lato font-normal text-[#5A5757] text-[14px] leading-[26px] tracking-normal">
										• Priority review of all materials, assignments, and
										personal situations as they arise
									</p>

									<p className="font-lato font-normal text-[#5A5757] text-[14px] leading-[26px] tracking-normal">
										• Custom Relationship Action Plan — a written strategic
										roadmap based on your unique code, crisis point, and desired
										outcome
									</p>

									<p className="font-lato font-normal text-[#5A5757] text-[14px] leading-[26px] tracking-normal">
										• Partner Profile Add-On: If your partner is willing, Lily
										will include him in one joint session to accelerate
										alignment
									</p>
								</div>
							</div>
						</div>

						<div className="mt-auto">
							<Button
								variant="primary"
								size="md"
								className="w-full xs:text-[12px]"
								href="/programs/vip-immersion"
							>
								APPLY FOR VIP ACCESS
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
