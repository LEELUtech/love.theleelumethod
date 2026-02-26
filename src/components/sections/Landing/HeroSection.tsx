import Button from "@/components/ui/Button"
import Header from "@/components/ui/Header";
import React from "react";

const HeroSection = () => {
	return (
		<section className="relative xs:h-[968px] md:h-[968px] lg:h-[1048px] bg-[#fcefeb] w-full md:bg-transparent">
			<div
				className="hidden lg:block absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: "url(/images/landing/hero_section_bg.png)" }}
			/>

			<Header className="bg-white z-30 relative" />

			{/* ===== MOBILE + TABLET (<lg) ===== */}
			<div className="lg:hidden">
				<div className="relative w-full h-[360px] md:h-[460px]">
					<div
						className="absolute inset-0 bg-cover bg-right"
						style={{
							backgroundImage: "url(/images/landing/hero_section_bg.png)",
						}}
					/>

					{/* Overlay Card */}
					<div className="absolute left-1/2 -translate-x-1/2 bottom-[-440px] md:bottom-[-360px] w-[calc(100%-32px)] md:w-[calc(100%-64px)] max-w-[360px] md:max-w-[560px] z-40">
						<div className="rounded-[20px] bg-brand-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] px-4 md:px-8 pt-4 md:pt-6 pb-6 md:pb-8 text-center">
							<p className="font-canela font-thin text-[40px] md:text-[44px] italic text-brand-black">
								Love isn’t a mystery.
							</p>

							<h1 className="font-canela text-brand-black font-thin leading-[100%] text-[48px] md:text-[56px] mb-[24px]">
								IT’S A DANCE.
							</h1>

							<p className="text-brand-black text-body font-lato leading-[26px] md:text-[16px] md:leading-[28px] mb-[24px]">
								Every relationship has a rhythm. When you know the steps, it
								flows. When you don’t, it’s chaos. Whether you’re fighting for
								the lead or standing alone on the floor, the truth is the same:
								you’ve been dancing without knowing the steps.
							</p>

							<Button
								variant="dark"
								size="md"
								className="w-full xs:text-[12px]"
							trackingData={{
								cta_name: "start_decode",
								cta_text: "START THE DECODE",
								cta_target_url: null,
								cta_location: "landing_hero_mobile",
							}}
							>
								START THE DECODE
							</Button>

							<p className="text-[#5A5757] text-sm md:text-[14px] leading-[24px] md:leading-[26px] mt-[32px]">
								I am Lily Chystofat and I have used my proprietary numerological
								system, LeeluTech, to decode the mechanics of human connection
								across thousands of sessions. I reveal the hidden choreography
								of your own life. So you can stop guessing and start moving with
								clarity.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* ===== DESKTOP (lg+) ===== */}
			<div className="hidden lg:block">
				<div className="container px-4 flex justify-between gap-12 relative">
					<div className="relative mt-[64px] z-10 max-w-[600px] rounded-[24px] bg-brand-white backdrop-blur-md p-[60px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] max-h-[660px]">
						<p className="font-canela font-thin text-[32px] italic text-brand-black">
							Love isn’t a mystery.
						</p>

						<h1 className="font-canela text-brand-black font-thin leading-[100%] mb-[48px]">
							IT’S A DANCE.
						</h1>

						<p className="text-brand-black text-body font-lato leading-[26px] mb-[48px]">
							Every relationship has a rhythm. When you know the steps, it
							flows. When you don’t, it’s chaos. Whether you’re fighting for the
							the lead or standing alone on the floor, the truth is the same:
							you’ve been dancing without knowing the steps.
						</p>

						<p className="text-[#5A5757] text-sm leading-[24px] mb-[48px]">
							I am Lily Chystofat and I have used my proprietary numerological
							system, LeeluTech, to decode the mechanics of human connection
							across thousands of sessions. I reveal the hidden choreography of
							your own life. So you can stop guessing and start moving with
							clarity.
						</p>

							<Button
								variant="dark"
								size="md"
								className="w-full lg:w-[65%] xs:text-[12px]"
							trackingData={{
								cta_name: "start_decode",
								cta_text: "START THE DECODE",
								cta_target_url: null,
								cta_location: "landing_hero_desktop",
							}}
							>
								START THE DECODE
							</Button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
