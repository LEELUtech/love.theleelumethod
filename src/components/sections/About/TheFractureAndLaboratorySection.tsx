import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton";
import Image from "next/image";

const TheFractureAndLaboratorySection = () => {
	return (
		<section className="relative py-[112px]">
			{/* Background Image */}
			<div className="absolute inset-0 z-[-1] overflow-hidden">
				<Image
					src="/images/about/fracture_section_bg.png"
					alt=""
					fill
					priority
					quality={100}
				/>
			</div>
			<div className="container">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
					{/* Left Column - Image */}
					<div className="flex justify-center">
						<div className="relative w-[551px] h-[748px] rounded-lg">
							<Image
								src="/images/about/fracture_section.png" // Replace with actual image path
								alt="Person sitting with a laptop"
								layout="fill"
							/>
							<div className="absolute flex bottom-[-30px] left-[-60px] items-center justify-center bg-[#d8ac9e] rounded-[300px] w-[80px] h-[100px] md:w-[100px] md:h-[126px] lg:w-[123px] lg:h-[155px] z-10">
								<Image
									src="/leelu_logo.svg"
									alt=""
									width={75}
									height={75}
									className="filter brightness-0 invert"
								/>
							</div>
						</div>
					</div>

					{/* Right Column - The Fracture */}
					<div>
						<h2 className="font-thin text-[60px] leading-[100%] font-canela text-brand-deep mb-8">
							The Fracture
						</h2>
						<p className="font-normal text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6">
							My journey began with collapse.
						</p>
						<p className="font-normal text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6">
							Years ago, I faced a brutal divorce. My life felt like it was
							incinerating. Therapy, religion, spiritual leaders—they offered
							comfort, but no map.
						</p>
						<p className="font-normal text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6">
							Then, a numerologist laid out the last 12 months of my life with
							terrifying accuracy before I spoke a word. I realized my pain
							wasn’t random. It was a pattern. And if it was a pattern, it could
							be calculated.
						</p>

						<p className="font-thin font-canela text-[28px] leading-[130%] text-brand-deep mb-[30px]">
							That session was the spark that lit my path into the world of
							numerology.
						</p>
						<WebinarModalButton
							showArrow={false}
							text="START THE DECODE"
							className="
								justify-center gap-3 font-medium tracking-[0.1em]
								text-[15px] leading-[26px] py-4 px-10 md:px-20 lg:px-22
								bg-brand-black hover:bg-[#333333] uppercase
							"
						/>
					</div>
				</div>

				{/* The Laboratory Section */}
				<div className="mt-[400px] relative">
					<div className="flex flex-row items-center justify-center absolute top-[-300px] left-[90px]">
						<Image
							src="/icons/ornament_3.svg"
							alt=""
							width={238}
							height={249}
							className="filter brightness-0 invert"
							style={{
								maskImage:
									"linear-gradient(to bottom, black 0%, black 30%, transparent 100%)",
								WebkitMaskImage:
									"linear-gradient(to bottom, black 0%, black 30%, transparent 100%)",
								filter: "brightness(200%)",
							}}
						/>

						<Image
							src="/icons/ornament_2.svg"
							alt=""
							width={512}
							height={524}
							className="filter brightness-0 invert"
							style={{
								maskImage:
									"linear-gradient(to bottom, black 0%, transparent 80%)",
								WebkitMaskImage:
									"linear-gradient(to bottom, black 0%, transparent 80%)",
								filter: "brightness(200%)",
							}}
						/>

						<Image
							src="/icons/ornament_5.svg"
							alt=""
							width={259}
							height={242}
							className="filter brightness-0 invert"
							style={{
								maskImage:
									"linear-gradient(to bottom, black 0%, black 30%, transparent 100%)",
								WebkitMaskImage:
									"linear-gradient(to bottom, black 0%, black 30%, transparent 100%)",
								filter: "brightness(200%)",
							}}
						/>
					</div>
					<h2 className="font-thin text-[112px] leading-[100%] font-canela text-brand-deep mb-8 text-center">
						The Laboratory
					</h2>
					<p className="text-body font-lato leading-[26px] mb-6 text-center text-[#5A5757] max-w-[903px] mx-auto">
						In 20XX, I ran a successful Human Resources firm serving my
						country’s elite—high-net-worth families who needed staff to live
						inside their homes. The stakes were high; a bad hire was a security
						risk.
					</p>
					<p className="text-body font-lato leading-[26px] mb-6 text-center text-[#5A5757] max-w-[903px] mx-auto">
						I turned the company into a testing ground for applied numerology,
						hiring 15 clinical psychologists to work alongside me.
					</p>
					<p className="text-body font-lato leading-[26px] mb-2 text-center text-[#5A5757] max-w-[903px] mx-auto italic">
						For each candidate, we ran two tracks:
					</p>
					<p className="font-thin font-canela text-brand-deep text-[32px] leading-[100%] tracking-normal max-w-[903px] mx-auto text-center mb-8">
						Traditional clinical interviews and background checks. Independent
						numerology-based profiling.
					</p>
					<p className="font-thin font-canela text-brand-deep text-[32px] leading-[100%] tracking-normal max-w-[903px] mx-auto text-center mb-8">
						<span className="font-normal">The results were undeniable.</span> Numerology didn’t just
						match the psychological profiles—it predicted behavioral traits
						psychologists missed in 75% of cases.
					</p>
				</div>
			</div>
		</section>
	);
};

export default TheFractureAndLaboratorySection;
