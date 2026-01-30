import Button from "@/components/ui/Button";
import RotateOnView from "@/components/ui/RotateOnView"
import { WEBINAR_URL } from "@/utils/constants";
import Image from "next/image";

export default function HeyImLilySection() {
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
						<h1 className="font-canela font-thin mb-8 md:mb-8 lg:mb-8 leading-	[130%] text-brand-deep text-[60px] md:text-[60px] lg:text-[60px]">
							Hey, I&apos;m Lily
						</h1>

						<div className="space-y-8 md:space-y-8 lg:space-y-8 mb-8 md:mb-8 lg:mb-10">
							<p className="text-[#5A5757] font-lato text-[17px] md:text-[17px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								My work began the moment my life broke open—through divorce,
								betrayal, and patterns I couldn&apos;t think my way out of. What
								I discovered on my way back to myself became the foundation of
								the system I now teach.
							</p>

							<p className="text-[#5A5757] font-lato text-[17px] md:text-[17px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								Before guiding women in love, I ran a high-stakes HR firm
								alongside psychologists, where I learned how one misaligned
								relationship could quietly derail a woman&apos;s entire life.
								This is where I began decoding human behavior like a system. My
								studies took me across seven countries, blending Eastern
								energetic wisdom, advanced profiling training, and intuitive
								feminine insight into LeeluTech—a framework that has helped
								thousands of women understand compatibility, emotional patterns,
								and the roots of their relational struggles.
							</p>

							<p className="text-[#5A5757] font-lato text-[17px] md:text-[17px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								I teach feminine identity because I lived its absence. I know
								what it feels like to overfunction, harden, and carry everything
								alone—and I know the freedom that comes from healing those
								patterns.
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
								Today, my work helps women break relationship loops, feel
								emotionally safe, and finally experience the partnership they’ve
								always desired—a love where they are fully met, deeply
								understood, and truly at home.
							</p>
						</div>

						<Button
							variant="primary"
							size="md"
							className="w-full lg:w-[60%] xs:text-[12px]"
							href={WEBINAR_URL}
						>
							ACCESS THE PROTOCOL
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
