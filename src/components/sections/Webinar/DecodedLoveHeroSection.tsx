import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import ArcAutoOnce from "@/components/ui/ArcFlyOnce";

const DecodedLoveHeroSection = () => {
	return (
		<section className="min-h-screen relative flex flex-col">
			{/* Background images */}
			<Image
				src="/images/quiz-result/hero_section_bg_mobile.png"
				alt=""
				fill
				priority
				quality={100}
				className="object-cover lg:hidden"
			/>
			<Image
				src="/images/quiz-result/hero_section_bg_desktop.png"
				alt=""
				fill
				priority
				quality={100}
				className="object-cover hidden lg:block"
			/>

			{/* Logo */}
			<div className="relative z-10 px-4 md:px-8 lg:px-[56px] py-4 md:py-5 lg:py-[21px]">
				<Logo />
			</div>

			{/* Content */}
			<div className="relative z-10 container flex flex-col items-center pb-12 md:pb-16 lg:pb-20 pt-8 md:pt-10 lg:pt-[50px] flex-1 justify-center">
				{/* Portrait */}
				<div className="relative mb-14 md:mb-16">
					{/* Arc — desktop only */}
					<ArcAutoOnce
						className="absolute hidden lg:block inset-0 -z-0 -translate-y-[13%] pointer-events-none -translate-x-[-7%]"
						flightStart={0.2}
						durMs={2500}
						arrowRotateDeg={254}
						arrowScale={1.2}
						arrowCenterX={6.5}
						arrowCenterY={-6}
						arrowOffsetY={3}
						endAtByDevice={{ mobile: 0.87, desktop: 0.95 }}
						arcEnd={{ x: -60, y: 219 }}
						arcRx={260}
						arcRy={260}
						strokeWidth={5}
					/>

					{/* Circle photo */}
					<div className="relative w-[160px] h-[244px] md:w-[191px] md:h-[292px] rounded-[130px] overflow-hidden">
						<Image
							src="/images/lily/webinar_lily.png"
							alt="Lily Chystofat"
							fill
							priority
							quality={100}
							className="object-cover object-top"
						/>
					</div>

					{/* Pink badge */}
					<div className="
						absolute left-1/2 -translate-x-1/2
						bottom-[-46px] md:bottom-[-50px]
						flex items-center justify-center
						bg-[#EB4F68] overflow-hidden
						before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay
						rounded-[300px] z-10
						w-[60px] h-[84px] md:w-[74px] md:h-[102px] lg:w-[59px] lg:h-[82px]
					">
						<div className="relative w-[36px] h-[36px] md:w-[45px] md:h-[45px] lg:w-[37px] lg:h-[36px]">
							<Image
								src="/leelu_logo.svg"
								alt=""
								fill
								className="filter brightness-0 invert"
								quality={100}
							/>
						</div>
					</div>
				</div>

				{/* Text */}
				<div className="text-center">
					<p className="font-canela font-light text-[26px] md:text-[26px] lg:text-[28px] text-brand-black mb-1">
						Free Masterclass
					</p>
					<h1 className="font-canela font-light text-[36px] md:text-[48px] lg:text-[60px] leading-tight text-brand-black mb-4">
						Welcome to Decoded Love
					</h1>
					<p className="font-lato text-[17px] text-[#5A5757] mb-8">
						Discover the{" "}
						<span className="text-brand-primary italic">3 secrets</span> to
						choosing the right partner, creating healthy connection, and ending
						the cycle of disappointment forever.
					</p>

					<Button className="w-full max-w-[280px] md:max-w-[340px]">
						REGISTER NOW
					</Button>
				</div>
			</div>
		</section>
	);
};

export default DecodedLoveHeroSection;
