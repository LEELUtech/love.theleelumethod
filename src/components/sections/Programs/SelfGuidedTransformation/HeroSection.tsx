import ArcAutoOnce from "@/components/ui/ArcFlyOnce";
import Image from "next/image";
import React from "react";

const HeroSection = () => {
	return (
		<section className="relative lg:py-[131px] pt-[54px] bg-brand-white overflow-hidden">
			<div className="container relative z-10">
				<div
					className="
						flex flex-col items-center
						pt-[10px]
						md:pt-[56px]
						lg:pt-[40px]
						lg:pb-[76px]
						pb-[62px]
					"
				>
					{/* Top image (arched) */}
					<div className="relative">
						{/* Arch frame */}
						<div
							className="
								w-[359px] h-[305px]
								md:w-[520px] md:h-[420px]
								lg:w-[356px] lg:h-[322px]
								 overflow-hidden
							"
						>
							<Image
								src="/images/lily/lily_4.jpg"
								alt="Lily"
								fill
								quality={100}
								priority
								className="object-cover object-top md:object-top lg:object-top rounded-t-[999px]"
								style={{
									maskImage:
										"linear-gradient(to bottom, black 70%, transparent 100%)",
									WebkitMaskImage:
										"linear-gradient(to bottom, black 70%, transparent 100%)",
								}}
							/>
						</div>

						<ArcAutoOnce
							className="absolute inset-0 -z-0 -translate-y-[15%] pointer-events-none -translate-x-[-8%]"
							// endAt={0.9}
							flightStart={0.2}
							durMs={1500}
							arrowRotateDeg={254}
							arrowScale={0.8}
							arrowCenterX={6.5}
							arrowCenterY={-6}
							arrowOffsetY={3}
							// arcRx={220}
							// arcRy={208}
							endAtByDevice={{ mobile: 0.87, desktop: 0.9 }}
							arcEnd={{ x: -60, y: 219 }}
							arcRx={260}
							arcRy={260}
						/>

						{/* Badge */}
						<div
							className="
								absolute left-1/2 -translate-x-1/2
								bottom-[-28px]
								w-[74px] h-[102px]
								md:w-[84px] md:h-[112px]
								lg:w-[84px] lg:h-[112px]
								rounded-[999px]
								bg-[#EB4F68]
								flex items-center justify-center
							"
						>
							<div className="relative w-[46px] h-[45px] md:w-[46px] md:h-[45px] lg:w-[46px] lg:h-[45px]">
								<Image
									src="/leelu_logo.svg"
									alt=""
									fill
									className="object-contain filter brightness-0 invert"
								/>
							</div>
						</div>
					</div>

					<div className="font-light transition text-[24px] md:text-[22px] lg:text-[24px] leading-[100%] font-canela flex items-center gap-2 md:gap-2.5 lg:gap-3 text-brand-black  justify-center md:justify-start mt-[43px]">
						<span className=" w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 relative flex-shrink-0">
							<Image
								src="/leelu_logo.svg"
								alt="Lily Chystofat Logo"
								fill
								className="object-contain"
								priority
							/>
						</span>
						<div className="whitespace-nowrap lg:order-2">
							<span className="font-medium font-canela tracking-tight mr-1">
								LILY
							</span>
							<span className="font-canela font-light">CHYSTOFAT</span>
						</div>
					</div>

					{/* Title */}
					<h1
						className="
							mt-4
							font-canela font-thin uppercase text-brand-deep text-center
							text-[46px] leading-[110%]
							md:text-[56px] md:leading-[110%]
							lg:text-[60px] lg:leading-[110%]
						"
					>
						THE PROTOCOL ESSENTIALS
					</h1>

					{/* Subtitle */}
					<p
						className="
							mt-4
							font-canela font-thin text-brand-deep text-center
							text-[24px]
							md:text-[28px]
							lg:text-[32px]
						"
					>
						YOUR RELATIONSHIP ISN&apos;T BROKEN. YOU&apos;RE RUNNING THE <br />{" "}
						WRONG CODE.
					</p>

					<p
						className="
							order-2 md:order-1
							mt-4
							font-lato font-normal text-center text-[#5A5757]
							text-[17px] leading-[145%]
							md:text-[17px] md:leading-[150%]
							lg:text-[17px] lg:leading-[150%]
						"
					>
						You don&apos;t need another conversation about &quot;feelings.&quot;
						You need a structural audit of why your relationships keep hitting
						the same wall.
					</p>

					{/* CTA */}
					<button
						type="button"
						className="
							order-1 md:order-2
							mt-4
							lg:mt-[48px]
							inline-flex items-center justify-center
							rounded-full
							bg-brand-primary hover:bg-[#E13954]
							text-white
							font-lato font-medium uppercase
							tracking-[1.6px]
							text-[15px]
							xs:w-full
							px-10 py-4
							md:w-auto md:min-w-[420px] md:px-16 md:py-4
							lg:px-32 lg:py-4
							transition-colors
						"
					>
						ENROLL NOW
					</button>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
