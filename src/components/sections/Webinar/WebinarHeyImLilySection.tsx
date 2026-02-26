import Button from "@/components/ui/Button";
import RotateOnView from "@/components/ui/RotateOnView";
import { WEBINAR_URL } from "@/utils/constants";
import Image from "next/image";

export default function WebinarHeyImLilySection() {
	return (
		<section className="bg-brand-white py-12 md:py-16 lg:py-[80px]">
			<div className="container px-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
					{/* Left side - Image */}
					<div className="relative w-full max-w-[400px] md:max-w-[480px] lg:max-w-[551px] mx-auto lg:mx-0">
						{/* Red circle badge with logo */}
						<div className="absolute left-[-10px] top-[-30px] md:left-[-40px] md:top-[-50px] lg:top-[-60px] lg:left-[-60px] flex items-center justify-center overflow-hidden bg-[#EB4F68] before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay rounded-[300px] w-[80px] h-[100px] md:w-[100px] md:h-[126px] lg:w-[134px] lg:h-[168px] z-10">
							<RotateOnView duration={5} amount={0.4} ease="easeOut">
								<Image
									src="/icons/ornament_2/ornament_2_light.svg"
									alt=""
									width={83}
									height={83}
									className="w-[65px] h-[65px] md:w-[65px] md:h-[65px] lg:w-[83px] lg:h-[83px]"
								/>
							</RotateOnView>
						</div>

						{/* Main image with rounded corners */}
						<div className="relative w-full aspect-[551/748] rounded-[24px] md:rounded-[32px] lg:rounded-[40px] overflow-hidden">
							<Image
								src="/images/lily/lily_2.png"
								alt="Lily"
								fill
								quality={100}
								className="object-cover"
							/>
						</div>
					</div>

					{/* Right side - Content */}
					<div className="flex flex-col">
						<h1 className="font-canela font-light mb-8 md:mb-8 lg:mb-8 leading-	[130%] text-brand-black text-[60px] md:text-[60px] lg:text-[60px]">
							Hey, I&apos;m Lily
						</h1>

						<div className="space-y-8 md:space-y-8 lg:space-y-8 mb-8 md:mb-8 lg:mb-10">
							<p className="text-[#5A5757] font-lato text-[17px] md:text-[17px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								I ran an HR firm placing candidates in sensitive, high-risk
								roles, where a bad hire meant a security liability. Seven years
								of profiling taught me to read human behavior as a system
							</p>

							<p className="text-[#5A5757] font-lato text-[17px] md:text-[17px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								My real work began when my own life unraveled—divorce, betrayal,
								and patterns I couldn&apos;t think my way out of.
							</p>

							<p className="text-[#5A5757] font-lato text-[17px] md:text-[17px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								Studies across seven countries, blending Eastern wisdom with
								advanced profiling, led to LeeluTech—a proprietary numerological
								framework that&apos;s helped over a thousand women decode
								compatibility and relational patterns.
							</p>

							<p className="text-[#5A5757] font-lato text-[17px] md:text-[17px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								Today, my work helps women break negative relationship loops,
								feel emotionally safe, and finally experience the partnership
								they&apos;ve always desired-a love where they are fully met,
								deeply understood, and truly at home.
							</p>

							<p
								className="
								font-canela font-thin text-brand-deep tracking-normal

								/* MOBILE */
								text-[32px] leading-[130%]

								/* TABLET */
								md:text-[32px] md:leading-[130%]

								/* DESKTOP */
								lg:text-[32px] lg:leading-[130%]
								"
							>
								Stop Guessing. Start Knowing.
							</p>
						</div>

						<Button
							variant="primary"
							size="md"
							className="w-full md:w-[55%]"
							href={WEBINAR_URL}
							trackingData={{
								cta_name: "claim_guide",
								cta_text: "CLAIM YOUR FREE GUIDE",
								cta_target_url: null,
								cta_location: "decode_lily",
							}}
						>
							CLAIM YOUR FREE GUIDE
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
