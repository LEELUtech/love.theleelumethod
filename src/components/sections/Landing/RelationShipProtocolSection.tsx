import ArcAutoOnce from "@/components/ui/ArcFlyOnce";
import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton";
import Image from "next/image";
import React from "react";

const RelationShipProtocolSection = () => {
	const ornamentIcon = (
		<Image src="/icons/ornament_1.svg" alt="" width={24} height={24} />
	);

	return (
		<section className="relative pb-[80px]">
			{/* Background Image */}
			<div className="absolute inset-0 -z-10">
				<Image
					src="/images/landing/relationship_protocol_section_bg.png"
					alt=""
					fill
					priority
					quality={100}
					className="object-cover"
					sizes="100vw"
				/>
			</div>

			<div className="container">
				<div className="text-center">
					{/* Top Image */}
					<div className="flex justify-center mb-12 relative pt-[230px] md:pt-[300px] lg:pt-[300px]">
						<div
							className="
                absolute
                w-[268px] h-[290px]
                sm:w-[358px] sm:h-[376px]
                top-[-100px]
                overflow-visible
              "
						>
							<Image
								src="/images/resources/resources-section-1.png"
								alt="Stop Guessing"
								fill
								quality={100}
								sizes="(min-width: 640px) 358px, 320px"
								className="object-contain"
							/>

							{/* Logo badge */}
							<div
								className="
                  absolute left-1/2 -translate-x-1/2
                  bottom-[-50px] sm:bottom-[-50px]
                  flex items-center justify-center
                  bg-[#FFC8C8] rounded-[300px] z-10
                  w-[86px] h-[112px]
                  lg:w-[101px] lg:h-[140px]
                "
							>
								<div className="relative w-[55px] h-[55px] lg:w-[58px] lg:h-[56px]">
									<Image
										src="/leelu_logo.svg"
										alt=""
										fill
										className="object-contain"
									/>
								</div>
							</div>

							{/* Arc */}
							<ArcAutoOnce
								className="absolute inset-0 -z-0 -translate-y-[13%] pointer-events-none -translate-x-[2%]"
								endAt={0.9}
								flightStart={0.2}
								durMs={1500}
								startDelayMs={500}
								arrowRotateDeg={254}
								arrowScale={0.8}
								arrowCenterX={6.5}
								arrowCenterY={-6}
								arrowOffsetY={3}
								arcRx={220}
								arcRy={208}
							/>
						</div>
					</div>

					{/* Heading */}
					<h2 className="font-thin text-[48px] lg:text-[60px] leading-[100%] font-canela text-brand-deep mb-5 max-w-[550px] mx-auto">
						THE RELATIONSHIP PROTOCOL
					</h2>

					{/* Subheading */}
					<p className="font-light font-canela text-[32px] lg:text-[32px] leading-[130%] text-brand-black mb-6 lg:mb-5 text-center">
						The Operating Manual for Human Connection
					</p>

					{/* Text (tablet only smaller) */}
					<p className="font-normal font-lato text-[22px] md:text-[18px] lg:text-[22px] leading-[130%] text-[#41444E] lg:text-brand-black mb-6 lg:mb-12 mx-auto text-center">
						Most relationship advice is guesswork. &quot;Just be yourself.&quot;
						&quot;Wait for the right one.&quot;
						<br />
						That is bad advice. It leaves you powerless. The Relationship
						Protocol is a forensic audit of your love life. <br /> It is 12
						modules of deep deprogramming designed to take you from Burnout to
						Balance.
					</p>

					{/* Cards (ONLY tablet tweaks) */}
					<div className="w-full grid gap-8 md:gap-6 lg:gap-5 lg:grid-cols-3 mb-12 lg:mt-[100px] mt-[50px]">
						{/* Card 1 */}
						<div className="rounded-[16px] w-full bg-[#FFF8F8] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)]
              px-[56px] py-[48px]
              md:px-8 md:py-8
              text-left"
						>
							<h3 className="font-canela font-light text-[32px] md:text-[28px] lg:text-[32px] leading-[120%] text-brand-deep mb-4 text-center lg:text-left">
								Identify Your &quot;Inner Devil&quot;:
							</h3>
							<p className="font-lato font-medium text-[#757986] text-body md:text-[14px] lg:text-body leading-[26px] md:leading-[24px] text-center lg:text-left">
								The darkest aspect of your personality that pushes love away.
							</p>
						</div>

						{/* Card 2 (raised ONLY on desktop) */}
						<div className="rounded-[16px] w-full bg-[#FFF8F8] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)]
              px-[56px] py-[48px]
              md:px-8 md:py-8
              text-left
              lg:-translate-y-6"
						>
							<h3 className="font-canela font-light text-[32px] md:text-[28px] lg:text-[32px] leading-[120%] text-brand-deep mb-4 text-center lg:text-left">
								Map Your <br /> Comfort Zone:
							</h3>
							<p className="font-lato font-medium text-[#757986] text-body md:text-[14px] lg:text-body leading-[26px] md:leading-[24px] text-center lg:text-left">
								Find the energy leaks draining your magnetism.
							</p>
						</div>

						{/* Card 3 */}
						<div className="rounded-[16px] w-full bg-[#FFF8F8] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)]
              px-[56px] py-[48px]
              md:px-8 md:py-8
              text-left"
						>
							<h3 className="font-canela font-light text-[32px] md:text-[28px] lg:text-[32px] leading-[120%] text-brand-deep mb-4 text-center lg:text-left">
								The Cheating Protocol:
							</h3>
							<p className="font-lato font-medium text-[#757986] text-body md:text-[14px] lg:text-body leading-[26px] md:leading-[24px] text-center lg:text-left">
								How to handle jealousy, rebuild trust, or know exactly when to
								walk away.
							</p>
						</div>
					</div>

					<p className="font-light font-canela text-[32px] lg:text-[32px] leading-[130%] text-brand-deep mb-6 lg:mb-12 max-w-[500px] mx-auto">
						We don&apos;t just patch the relationship. We rewrite the code.
					</p>

					<WebinarModalButton
						showArrow={false}
						text="VIEW THE CURRICULUM"
						icon={ornamentIcon}
						iconPosition="left"
						className="w-full mt-[10px] md:w-auto justify-center gap-3 font-medium text-[18px] leading-[26px] py-4 px-8 md:px-10 lg:px-[45px] bg-brand-black hover:bg-[#333333] uppercase"
					/>
				</div>
			</div>
		</section>
	);
};

export default RelationShipProtocolSection;
