import FreeQuizButton from "@/components/ui/buttons/FreeQuizButton";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const TriageSection = () => {
	return (
		<section className="relative pt-[57px] pb-[22px] lg:pt-[120px] lg:pb-[112px] overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0 -z-10">
				<Image
					src="/images/landing/triage_section_bg.png"
					alt=""
					fill
					priority
					quality={100}
					sizes="100vw"
				/>
			</div>
			<div className="container w-full ">
				<h2 className="font-thin text-[48px]  lg:text-[60px] leading-[100%] font-canela text-brand-deep mb-[50px] lg:mb-[100px] text-center">
					You cannot fix a pattern you cannot see.
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-[4fr,3fr] gap-[43px] lg:gap-[102px] ">
					{/* Left Column - Image */}
					<div className="flex flex-col gap-5 lg:gap-8 justify-center">
						<div className="relative md:mb-0 lg:mb-0 w-full h-[245px] lg:w-[600px] lg:h-[380px]">
							<Image
								src="/images/landing/triage_section_women.png"
								alt="Person sitting with a laptop"
								fill
								priority
								quality={100}
								className=""
							/>
						</div>

						<div className="relative flex flex-row items-center gap-3 lg:gap-6">
							<Image
								src="/images/landing/triage_section_author.png"
								alt="Person sitting with a laptop"
								width={66}
								height={66}
								priority
								quality={100}
								className=""
							/>

							<div>
								<div className="font-canela font-light text-[24px] leading-[130%] text-[#41444E]">
									Andrea A
								</div>

								<div className=" font-lato italic font-normal lg:text-[22px] leading-[26px] text-[#6F4C40] text-[18px]">
									Teacher
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - The Fracture */}
					<div>
						<p className="font-thin text-[32px] leading-[100%] font-canela text-brand-black mb-2">
							Thank you
						</p>
						<h2 className="font-thin text-[42px] leading-[100%] font-canela text-brand-deep mb-8">
							It was eye-opening
						</h2>
						<p className="font-normal italic text-[#6F4C40] font-lato leading-[26px] tracking-normal mb-6">
							“ Firstly, my fear of being alone disappeared. Secondly, I
							understood how I needed to behave, why I attracted all these men.
							I would never have thought that such things as personal
							relationships and family lineage could be connected. “
						</p>
						<Link
							className="btn-pill justify-center gap-3 font-medium tracking-[0.1em]
						rounded-[50px] text-center
						text-[15px] leading-[26px] py-4
						px-5
						bg-brand-black text-brand-white hover:bg-[#333333] uppercase order-2 lg:order-2 font-lato lg:max-w-[350px] w-full mx-auto lg:mx-0 mb-[24px] lg:mb-0"
							href="/decode"
						>
							READ MORE STORIES
						</Link>
					</div>
				</div>

				<div className="lg:mt-[250px] mt-[200px] mb-[52px] relative lg:mb-[32px]">
					<div
						className="
						absolute z-0
						left-1/2 -translate-x-1/2
						top-[-150px]
						md:top-[-180px]
						lg:top-[-200px]
				
						flex flex-row items-center justify-center gap-[130px]
						pointer-events-none
					"
					>
						{/* LEFT ornament */}
						<div
							className="
							relative
							w-[180px] h-[180px]
							lg:w-[238px] lg:h-[249px]
				
							translate-x-[250px] translate-y-[80px]
							md:translate-x-[120px] md:translate-y-[50px]
							lg:translate-x-[125px] lg:translate-y-[60px]
						"
						>
							<Image
								src="/icons/ornament_3.svg"
								alt=""
								fill
								className="absolute filter brightness-0 invert"
								style={{
									maskImage:
										"linear-gradient(to bottom, black 0%, black 10%, transparent 100%)",
									WebkitMaskImage:
										"linear-gradient(to bottom, black 0%, black 10%, transparent 100%)",
									filter: "brightness(200%)",
								}}
							/>
						</div>

						{/* CENTER ornament */}
						<div
							className="
							relative
							w-[261px] h-[266px]
							lg:w-[512px] lg:h-[524px]
						"
						>
							<Image
								src="/icons/ornament_2.svg"
								alt=""
								fill
								className="absolute filter brightness-0 invert"
								style={{
									maskImage:
										"linear-gradient(to bottom, black 0%, transparent 100%)",
									WebkitMaskImage:
										"linear-gradient(to bottom, black 0%, transparent 100%)",
									filter: "brightness(200%)",
								}}
							/>
						</div>

						{/* RIGHT ornament */}
						<div
							className="
							relative
							w-[180px] h-[180px]
							lg:w-[259px] lg:h-[242px]
				
							-translate-x-[250px] translate-y-[90px]
							md:-translate-x-[120px] md:translate-y-[50px]
							lg:-translate-x-[120px] lg:translate-y-[60px]
						"
						>
							<Image
								src="/icons/ornament_5.svg"
								alt=""
								fill
								className="absolute filter brightness-0 invert"
								style={{
									maskImage:
										"linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
									WebkitMaskImage:
										"linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
									filter: "brightness(200%)",
								}}
							/>
						</div>
					</div>
					<h2 className="relative font-thin text-[48px] lg:text-[60px] leading-[130%] font-canela text-brand-deep mb-8 text-center z-10 xs:max-w-[309px] lg:max-w-[550px] mx-auto uppercase">
						The Relationship TRIAGE
					</h2>

					<div className="mt-12 lg:mt-[100px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch justify-items-center">
						{/* Card 1 */}
						<div className="max-w-[392px] w-full rounded-[24px] bg-brand-white backdrop-blur-md px-[25px] py-[47px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col">
							<h2 className="text-center text-[38px] lg:text-[42px] font-thin text-brand-deep mb-[34px]">
								I am <span className="font-light">Confused</span>
							</h2>

							<p className="text-[20px] font-normal font-canela mb-[20px]">
								Is it a trauma bond or a soul connection?
							</p>

							<p className="font-lato font-normal text-[15px] text-[#41444E] mb-[20px]">
								Your intuition is currently biased by emotion. Numerological
								algorithms are not
							</p>

							<p className="font-lato font-normal text-[15px] text-[#41444E] mb-[20px]">
								Answer 10 questions to uncover:
							</p>

							<p className="font-lato font-normal text-[15px] text-[#41444E] mb-[20px]">
								The Friction Points: Why you keep having the same fight
							</p>

							<p className="font-lato font-normal text-[15px] text-[#41444E] mb-[20px]">
								The Probability: Is this relationship built for the long haul or
								a lesson?
							</p>

							<p className="font-lato font-normal text-[15px] text-[#41444E] mb-[48px]">
								The Truth: What his behavior is actually saying.
							</p>

							<FreeQuizButton
								text={"TAKE THE QUIZ"}
								className="mt-auto w-full justify-center rounded-full bg-brand-black px-5 py-3 text-brand-white text-cta leading-[173%] font-medium uppercase tracking-[1.5px] hover:bg-[#333333]"
								showArrow={false}
							/>
						</div>

						{/* Card 2 (raised on lg only) */}
						<div className="max-w-[392px] w-full rounded-[24px] bg-brand-white backdrop-blur-md px-[25px] py-[47px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col lg:-translate-y-10">
							<h2 className="text-center text-[38px] lg:text-[40px] font-thin text-brand-deep mb-[34px]">
								I am Ready to <span className="font-light">Fix it</span>
							</h2>

							<p className="text-[20px] font-normal font-canela mb-[20px]">
								You want the truth? Join the deep dive.
							</p>

							<p className="font-lato font-normal text-[15px] text-[#41444E] mb-[20px]">
								I will show you the exact mechanics of why men pull away and how
								to shift the power dynamic instantly.
							</p>

							<p className="font-lato font-semibold text-[15px] text-[#41444E] mb-[20px]">
								We will cover:
							</p>

							<p className="font-lato font-normal text-[15px] text-[#41444E] mb-[20px]">
								<span className="font-semibold">
									The &quot;Inner Devil&quot;:
								</span>{" "}
								The dark side of your personality that sabotages love.
							</p>

							<p className="font-lato font-normal text-[15px] text-[#41444E] mb-[20px]">
								<span className="font-semibold">Hidden Desires:</span> The one
								thing he needs (that he doesn&apos;t even know he needs).
							</p>

							<p className="font-lato font-normal text-[15px] text-[#41444E] mb-[48px]">
								<span className="font-semibold">The Script Shift:</span> How to
								stop over-functioning and inspire his loyalty.
							</p>

							<FreeQuizButton
								text={"REGISTER FOR WEBINAR"}
								className="mt-auto w-full justify-center rounded-full bg-brand-black px-5 py-3 text-brand-white text-cta leading-[173%] font-medium uppercase tracking-[1.5px] hover:bg-[#333333]"
								showArrow={false}
							/>
						</div>

						{/* Card 3 */}
						<div className="max-w-[392px] w-full rounded-[24px] bg-brand-white backdrop-blur-md px-[25px] py-[47px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col md:col-span-2 md:max-w-[820px] lg:col-span-1 lg:max-w-[392px]">
							<h2 className="text-center text-[38px] lg:text-[38px] font-thin text-brand-deep mb-[34px]">
								I am <span className="font-light">Done Guessing</span>
							</h2>

							<p className="text-[20px] font-normal font-canela mb-[20px]">
								Is this relationship compatible or are you forcing it?
							</p>

							<p className="font-lato font-normal text-[15px] text-[#41444E] mb-[20px]">
								Did the last one end because of you—or because it was coded to
								fail from the start?
							</p>

							<p className="font-lato font-normal text-[15px] text-[#41444E] mb-[20px]">
								Your personalized analysis reveals the mathematical reality:
								where your codes amplify each other and where they clash. The
								structural dynamics beneath surface conflicts. What the friction
								points mean. Whether this pairing builds or destabilizes.
							</p>

							<p className="font-lato font-normal text-[15px] text-[#41444E] mb-[48px]">
								You&apos;ll see what&apos;s actually happening. Not theories.
								Not hope. The algorithm.
							</p>

							<FreeQuizButton
								text={"GET MY ANALYSIS"}
								className="mt-auto w-full justify-center rounded-full bg-brand-black px-5 py-3 text-brand-white text-cta leading-[173%] font-medium uppercase tracking-[1.5px] hover:bg-[#333333]"
								showArrow={false}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TriageSection;
