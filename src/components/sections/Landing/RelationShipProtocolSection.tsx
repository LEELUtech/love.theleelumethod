import RelationshipProtocolTiers from "@/components/sections/Landing/RelationshipProtocolTiers"
import Button from "@/components/ui/Button";
import RotateOnView from "@/components/ui/RotateOnView";
import Image from "next/image";
import React from "react";

const RelationShipProtocolSection = () => {
	const ornamentIcon = (
		<Image src="/icons/ornament_1.svg" alt="" width={24} height={24} />
	);

	return (
		<section className="relative pb-[80px] pt-[100px]">
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

			<div className="container px-4">
				<div className="text-center">

					{/* Heading */}
					<h2 className="font-thin text-[48px] lg:text-[60px] leading-[100%] font-canela text-brand-deep mb-5">
						THE RELATIONSHIP PROTOCOL
					</h2>

					{/* Subheading */}
					<p className="font-light font-canela text-[32px] lg:text-[32px] leading-[130%] text-brand-primary mb-6 lg:mb-5 text-center">
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
						<div
							className="rounded-[16px] w-full bg-[#FFF8F8] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)]
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
						<div
							className="rounded-[16px] w-full bg-[#FFF8F8] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)]
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
						<div
							className="rounded-[16px] w-full bg-[#FFF8F8] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)]
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

					<Button
						variant="dark"
						leftIcon={ornamentIcon}
						leftIconBg="transparent"
						size="md"
						className="w-full lg:w-fit xs:text-[12px] mt-[32px]"
						trackingData={{
							cta_name: "view_curriculum",
							cta_text: "VIEW THE CURRICULUM",
							cta_target_url: null,
							cta_location: "landing_protocol",
						}}
					>
						VIEW THE CURRICULUM
					</Button>
				</div>

				<div>
					<div className="flex justify-center mb-12 relative mt-[100px]">
						<div
							className="
							relative
                w-[348px] h-[363px]
                overflow-visible
              "
						>
							<Image
								src="/images/lily/lily_7.png"
								alt="Stop Guessing"
								fill
								quality={100}
							/>

							<div
								className="
											absolute left-1/2 bottom-[-40px] -translate-x-1/2
											flex items-center justify-center overflow-hidden
											bg-[#EB4F68]
											before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay
											rounded-[300px]
											w-[80px] h-[100px]
											md:w-[100px] md:h-[126px]
											lg:w-[101px] lg:h-[140px]
											z-10
										"
							>
								<RotateOnView duration={5} amount={0.4} ease="easeOut">
									<Image
										src="/leelu_logo.svg"
										alt=""
										width={63}
										height={61}
										className="w-[51px] h-[53px] md:w-[65px] md:h-[63px] lg:w-[61px] lg:h-[63px] filter invert-[100%] brightness-[100%]"
									/>
								</RotateOnView>
							</div>
						</div>
					</div>
				</div>

				<RelationshipProtocolTiers />
			</div>
		</section>
	);
};

export default RelationShipProtocolSection;
