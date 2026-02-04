import { QuizResultOrb } from "@/components/sections/QuizResult/QuizResultOrb";
import Image from "next/image";
import React from "react";

const ProfileGlitchSection = () => {
	return (
		<section className="relative overflow-hidden">
			{/* background */}
			<div className="absolute inset-0 z-0">
				<Image
					src="/images/quiz-result/profile_glitch_bg.png"
					alt=""
					fill
					priority
					quality={100}
					className="object-cover"
				/>
			</div>

			<div className="container relative z-10 px-4 py-24 md:py-20 lg:py-24">
				<div className="space-y-14 md:space-y-20">

					{/* BLOCK 1 */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-10 lg:gap-16 items-center">
						{/* ORB */}
						<div className="order-1 md:order-2 lg:justify-self-end">
							<QuizResultOrb
								bgColor="#DD4B61"
								ornamentSrc="/icons/ornament_14.svg"
								topBadgeIcon="/icons/programs_icon_red.svg"
								showBottomBadge={false}
								badgeBgColor="#ffffff"
								withNoise
							/>
						</div>

						{/* TEXT */}
						<div className="order-2 md:order-1 text-center md:text-left max-w-[560px] md:max-w-[420px] lg:max-w-[560px]">
							<h2 className="font-canela font-thin text-[42px] md:text-[42px] lg:text-[48px]leading-[1.05] text-brand-deep">
								THE PSYCHOLOGICAL
								<br />
								PROFILE:
							</h2>

							<p className="mt-[40px] font-canela font-light text-[32px] leading-[1.35] text-brand-deep">
								You are running a script of High Output / Low Return.
							</p>

							<p className="mt-4 font-lato font-medium text-body leading-[1.7] text-[#5A5757]">
								You have taken on the role of the “Architect” in this
								relationship—managing the emotions, planning the future, and
								trying to “fix” his potential. You believe that if you just love
								him harder or better, he will finally step up. Biologically, you
								are in a state of hyper-vigilance. You mistake your anxiety
								about his behavior for “passion.”
							</p>
						</div>
					</div>

					{/* BLOCK 2 */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-10 lg:gap-16 items-center">
						{/* ORB */}
						<div className="order-1 md:order-1 lg:justify-self-start">
							<QuizResultOrb
								bgColor="#0B0B0B"
								ornamentSrc="/icons/ornament_15.svg"
								topBadgeIcon="/icons/red_star.svg"
								bottomBadgeIcon="/icons/necktie_red.svg"
								badgeBgColor="#F5E9E9"
							/>
						</div>

						{/* TEXT */}
						<div className="order-2 text-center md:text-left max-w-[560px] md:max-w-[420px] lg:max-w-[560px] lg:justify-self-end">
							<h2 className="font-canela font-thin text-[42px] md:text-[42px]
							lg:text-[48px] leading-[1.05] text-brand-deep">
								THE
								<br />
								NUMEROLOGICAL
								<br />
								GLITCH:
							</h2>

							<p className="mt-[40px] font-canela font-light text-[32px] leading-[1.35] text-brand-deep">
								This is a Polarity Inversion.
							</p>

							<p className="mt-4 font-lato font-medium text-body leading-[1.7] text-[#5A5757]">
								You are likely operating in a 1 Vibration (The Masculine/Leader)
								while he has retreated into a passive frequency. By
								over-functioning, you are mathematically blocking him from
								assuming the role you want him to take. You are filling the
								space he needs to occupy.
							</p>
						</div>
					</div>

				</div>
			</div>
		</section>
	);
};

export default ProfileGlitchSection;
