import Button from "@/components/ui/Button";
import RotateOnView from "@/components/ui/RotateOnView"
import Image from "next/image";

export default function HeyImLilySection() {
	return (
		<section className="bg-brand-white py-24 md:py-16 lg:py-[160px] lg:pt-[220px]">
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
						<h1 className="font-canela font-thin mb-4 md:mb-6 lg:mb-8 leading-tight text-black text-[60px] md:text-[44px] lg:font-light lg:text-[52px]">
							I’m Lily Chystofat.
						</h1>

						<div className="space-y-5 md:space-y-4 lg:space-y-5 mb-6 md:mb-8 lg:mb-10">
							<p className="text-[#5A5757] font-lato text-body md:text-[15px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								For seven years, I profiled behavioral patterns for sensitive
								positions—high-stakes work where reading people accurately
								wasn&apos;t in optional, and miscalibrations had real
								consequences
							</p>

							<p className="text-[#5A5757] font-lato text-body md:text-[15px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								I&apos;ve translated that training into a systematic framework
								for understanding relationship dynamics. Not through mystical
								interpretation, but through pattern recognition and algorithmic
								analysis of how different personality frequencies interact.
							</p>

							<p className="text-[#5A5757] font-lato text-body md:text-[15px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								I&apos;ve helped thousands of couples decode their relationships
								and make decisions based on data, not hope.
							</p>
						</div>

						<p className="text-brand-deep font-thin font-canela text-[32px] md:text-[32px] leading-[130%] md:leading-[130%] lg:leading-[130%] mt-8 lg:mt-1">
							Stop Guessing. Start Knowing.
						</p>

						<div className="mt-8">
							<Button
								variant="primary"
								size="md"
								className="w-full lg:w-[85%] xs:text-[12px]"
								href="#checkout"
								trackingData={{
									cta_name: "get_report",
									cta_text: "GIVE ME MY COMPATIBILITY CODE REPORT",
									cta_target_url: "#checkout",
									cta_location: "compatibility_lily",
								}}
							>
								GIVE ME MY COMPATIBILITY CODE REPORT
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
