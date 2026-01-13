import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton";
import Image from "next/image";

export default function HeyImLilySection() {
	return (
		<section 
			className="bg-brand-white py-12 md:py-16 lg:py-[160px]"
			
		>
			<div className="container px-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
					{/* Left side - Image */}
				<div className="relative w-full max-w-[400px] md:max-w-[480px] lg:max-w-[551px] mx-auto lg:mx-0">
					{/* Red circle badge with logo */}
					<div className="absolute left-[-30px] top-[-40px] md:left-[-40px] md:top-[-50px] lg:top-[-60px] lg:left-[-60px] flex items-center justify-center bg-[#C4334F] rounded-[300px] w-[80px] h-[100px] md:w-[100px] md:h-[126px] lg:w-[134px] lg:h-[168px] z-10">
						<Image
							src="/icons/ornament_2.svg"
							alt=""
							width={83}
							height={83}
							className="filter brightness-0 invert w-[50px] h-[50px] md:w-[65px] md:h-[65px] lg:w-[83px] lg:h-[83px]"
						/>
					</div>

					{/* Main image with rounded corners */}
					<div className="relative w-full aspect-[551/748] rounded-[24px] md:rounded-[32px] lg:rounded-[40px] overflow-hidden">
							<Image
								src="/images/lily_2.png"
								alt="Lily"
								fill
								quality={100}
								className="object-cover"
							/>
						</div>
					</div>

					{/* Right side - Content */}
					<div className="flex flex-col">
						<h1 className="font-canela font-light mb-4 md:mb-6 lg:mb-8 leading-tight text-black text-[32px] md:text-[44px] lg:text-[52px]">
							Hey, I&apos;m Lily
						</h1>

						<div className="space-y-3 md:space-y-4 lg:space-y-5 mb-6 md:mb-8 lg:mb-10">
							<p className="text-[#5A5757] font-lato text-[14px] md:text-[15px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								Lily&apos;s work began the moment her life broke open — through
								divorce, betrayal, and patterns she couldn&apos;t think her way
								out of. What she discovered on her way back to herself became
								the foundation of the system she now teaches.
							</p>

							<p className="text-[#5A5757] font-lato text-[14px] md:text-[15px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								Before guiding women in love, she ran a high-stakes HR firm
								alongside psychologists, where she learned how one misaligned
								relationship could quietly derail a woman&apos;s entire life.
								This is where she began decoding human behavior like a system.
							</p>

							<p className="text-[#5A5757] font-lato text-[14px] md:text-[15px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								Her studies took her across seven countries, blending Eastern
								energetic wisdom, advanced profiling training, and intuitive
								feminine insight into LifeDNA — a framework that has helped
								thousands of women understand compatibility, emotional patterns,
								and the roots of their relational struggles.
							</p>

							<p className="text-[#5A5757] font-lato text-[14px] md:text-[15px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								Lily teaches feminine identity because she lived its absence.
								She knows what it feels like to overfunction, harden, and carry
								everything alone — and she knows the freedom that comes from
								healing those patterns.
							</p>

							<p className="text-[#5A5757] font-lato text-[14px] md:text-[15px] lg:text-body leading-[24px] md:leading-[26px] lg:leading-[28px]">
								Today, her work helps women break relationship loops, feel
								emotionally safe, and finally experience the love their nervous
								system can rest in.
							</p>
						</div>

						<div>
							<WebinarModalButton
								text="Save my seat"
								showArrow={false}
								className="w-full md:w-auto py-4 px-[60px] md:px-[80px] lg:px-[105px] rounded-full bg-brand-primary text-white font-medium font-lato text-[15px] tracking-[0.08em] uppercase hover:bg-[#E13954] transition-colors"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
