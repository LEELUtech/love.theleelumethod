import Image from "next/image";

export default function DiscoverSection() {
	return (
		<section className="relative bg-[#f5e8e8] py-12 md:py-16 lg:pt-[84px] lg:pb-[162px]">
			{/* Background Image */}
			<div className="absolute inset-0 z-0">
				<Image
					src="/images/gradient-bg.jpg"
					alt=""
					fill
					quality={100}
					priority
				/>
			</div>
			
			<div className="container px-4 relative z-10">
				{/* Header with image */}
				<div className="flex flex-col items-center mb-8 md:mb-10 lg:mb-12">
					<div className="relative w-[200px] h-[220px] md:w-[280px] md:h-[300px] lg:w-[356px] lg:h-[384px] mb-4">
						{/* Decorative ornaments behind the image */}
						<Image
							src="/icons/ornament_2.svg"
							alt=""
							width={186}
							height={186}
							className="absolute top-[15px] left-[-50px] md:top-[20px] md:left-[-70px] lg:top-[30px] lg:left-[-90px] z-0 w-[120px] h-[120px] md:w-[150px] md:h-[150px] lg:w-[186px] lg:h-[186px]"
						/>
						<Image
							src="/icons/ornament_3.svg"
							alt=""
							width={192}
							height={192}
							className="absolute top-[15px] right-[-50px] md:top-[20px] md:right-[-70px] lg:top-[30px] lg:right-[-95px] z-0 w-[120px] h-[120px] md:w-[154px] md:h-[154px] lg:w-[192px] lg:h-[192px]"
						/>
						<Image
							src="/icons/ornament_4.svg"
							alt=""
							width={103}
							height={103}
							className="absolute top-[140px] left-[-30px] md:top-[180px] md:left-[-40px] lg:top-[200px] lg:left-[-55px] z-0 w-[70px] h-[70px] md:w-[85px] md:h-[85px] lg:w-[103px] lg:h-[103px]"
						/>
						<Image
							src="/images/lily_1.png"
							alt="Woman"
							fill
							className="object-cover relative z-10"
							quality={100}
						/>
						{/* Ornament badge */}
						<div className="absolute left-1/2 -translate-x-1/2 bottom-[-25px] md:bottom-[-30px] lg:bottom-[-35px] flex items-center justify-center bg-[#C4334F] rounded-[28px] md:rounded-[32px] lg:rounded-[36px] w-[56px] h-[80px] md:w-[65px] md:h-[90px] lg:w-[74px] lg:h-[102px] z-10">
							<Image
								src="/leelu_logo.svg"
								alt=""
								width={46}
								height={46}
								className="filter invert"
							/>
						</div>
					</div>
					<h1 className="text-center font-canela font-light leading-tight mt-4 md:mt-5 lg:mt-6 text-[28px] md:text-[36px] lg:text-[44px]">
						<span className="italic text-[#C4334F] font-thin">Inside</span>
						<br />
						YOU&apos;LL DISCOVER
					</h1>
				</div>

				{/* Cards Grid */}
				<div className="max-w-[1216px] mx-auto mb-8 md:mb-12 lg:mb-16">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-x-6 lg:gap-y-6">
						{/* Left column */}
						<div className="flex flex-col gap-6">
							<div className="bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[56px] py-6 md:py-8 lg:py-12 lg:mt-[160px] w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col">
								<h3 className="font-canela text-[24px] md:text-[28px] lg:text-[32px] mb-3 md:mb-3.5 lg:mb-4 text-black font-light leading-[100%]">
									The Emotional Detox
								</h3>
								<p className="text-[#5A5757] font-medium text-sm md:text-[15px] lg:text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]">
									Why &quot;staying strong&quot; traps the tears in your body,
									and the exact release protocol that allows you metabolize it
									safely.
								</p>
							</div>
							<div className="bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[56px] py-6 md:py-8 lg:py-12 w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col">
								<h3 className="font-canela text-[24px] md:text-[28px] lg:text-[32px] mb-3 md:mb-3.5 lg:mb-4 text-black font-light leading-[100%]">
									The Pattern Interrupt
								</h3>
								<p className="text-[#5A5757] font-medium text-sm md:text-[15px] lg:text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]">
									Why your routine is keeping you trapped in the past, and the
									radical environmental shifts that snap your brain into the
									present.
								</p>
							</div>
						</div>

						{/* Center column */}
						<div className="flex flex-col gap-6">
							<div className="bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[56px] py-6 md:py-8 lg:py-12 w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col">
								<h3 className="font-canela text-[24px] md:text-[28px] lg:text-[32px] mb-3 md:mb-3.5 lg:mb-4 text-black font-light leading-[100%]">
									The Squad Audit
								</h3>
								<p className="text-[#5A5757] font-medium text-sm md:text-[15px] lg:text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]">
									How to identify who&apos;s actually helping you heal vs.
									who&apos;s keeping you stuck in the story, and what to do
									about it.
								</p>
							</div>
							<div className="bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[56px] py-6 md:py-8 lg:py-12 w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col">
								<h3 className="font-canela text-[24px] md:text-[28px] lg:text-[32px] mb-3 md:mb-3.5 lg:mb-4 text-black font-light leading-[100%]">
									The Mind Unload
								</h3>
								<p className="text-[#5A5757] font-medium text-sm md:text-[15px] lg:text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]">
									A specific writing technique that stops the intrusive thought
									spiral, instantly.
								</p>
							</div>
							<div className="bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[56px] py-6 md:py-8 lg:py-12 w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col">
								<h3 className="font-canela text-[24px] md:text-[28px] lg:text-[32px] mb-3 md:mb-3.5 lg:mb-4 text-black font-light leading-[100%]">
									The Freedom Audit
								</h3>
								<p className="text-[#5A5757] font-medium text-sm md:text-[15px] lg:text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]">
									A line-by-line inventory of what you sacrificed for him, and
									the exact plan to take it back.
								</p>
							</div>
						</div>

						{/* Right column */}
						<div className="flex flex-col gap-6">
							<div className="bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[56px] py-6 md:py-8 lg:py-12 lg:mt-[160px] w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col">
								<h3 className="font-canela text-[24px] md:text-[28px] lg:text-[32px] mb-3 md:mb-3.5 lg:mb-4 text-black font-light leading-[100%]">
									The Belief Debug
								</h3>
								<p className="text-[#5A5757] font-medium text-sm md:text-[15px] lg:text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]">
									How to catch the &quot;I&apos;ll never love again&quot; script
									running in your subconscious, and overwrite it before it
									becomes your operating system.
								</p>
							</div>
							<div className="bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[56px] py-6 md:py-8 lg:py-12 w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col">
								<h3 className="font-canela text-[24px] md:text-[28px] lg:text-[32px] mb-3 md:mb-3.5 lg:mb-4 text-black font-light leading-[100%]">
									The Re-Entry Strategy
								</h3>
								<p className="text-[#5A5757] font-medium text-sm md:text-[15px] lg:text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]">
									How to step back into the world without getting triggered,
									overwhelmed, or pulled back into the past.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom text and CTA */}
				<div className="text-center max-w-[774px] mx-auto">
					<p className="text-black text-[32px] font-light font-canela mb-[66px] leading-[100%] tracking-normal">
						This guide gives you 7 evidence-based strategies to reclaim your
						nervous system and your life.
					</p>
					<button
						type="button"
						className="py-4 px-[40px] md:px-[60px] lg:px-[73px] rounded-full bg-brand-primary text-white font-medium font-lato text-[15px] tracking-[0.08em] uppercase hover:bg-[#E13954] transition-colors"
					>
						Download the free guide
					</button>
				</div>
			</div>
		</section>
	);
}
