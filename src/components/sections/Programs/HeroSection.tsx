import Header from "@/components/ui/Header";
import Image from "next/image";
import React from "react";

const HeroSection = () => {
	return (
		<section className="relative overflow-hidden">
			{/* Background */}
			<div className="absolute inset-0 -z-10">
				<Image
					src="/images/programs/hero_section_bg.png"
					alt=""
					fill
					priority
					className="object-cover"
					sizes="100vw"
				/>
			</div>

			<Header className="relative z-20" />

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
                lg:w-[356px] lg:h-[384px]
              "
						>
							<Image
								src="/images/programs/hero_section_lily.png"
								alt="Lily"
								fill
								quality={100}
								priority
								className="object-cover object-top md:object-top lg:object-center"
								style={{
									maskImage:
										"linear-gradient(to bottom, black 70%, transparent 100%)",
									WebkitMaskImage:
										"linear-gradient(to bottom, black 70%, transparent 100%)",
								}}
							/>
						</div>

						{/* Badge */}
						<div
							className="
                absolute left-1/2 -translate-x-1/2
                bottom-[-18px]
                w-[74px] h-[102px]
                md:w-[84px] md:h-[112px]
                lg:w-[84px] lg:h-[112px]
                rounded-[999px]
                bg-[#EB4F68]
                flex items-center justify-center
                shadow-[0_8px_22px_rgba(0,0,0,0.10)]
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

					{/* Title */}
					<h1
						className="
              mt-[44px]
              font-canela font-thin uppercase text-brand-deep text-center
              text-[48px] leading-[110%]
              md:text-[56px] md:leading-[110%]
              lg:text-[60px] lg:leading-[110%]
              max-w-[680px]
            "
					>
						THE RELATIONSHIP <br className="hidden lg:block" />
						PROTOCOL
					</h1>

					{/* Subtitle */}
					<p
						className="
              mt-4
              font-canela font-thin text-brand-deep text-center
              text-[32px]
              md:text-[28px]
              lg:text-[32px]
            "
					>
						The Operating Manual for Human Connection
					</p>

					<p
						className="
              order-2 md:order-1
              mt-4
              font-lato font-normal text-center text-[#5A5757]
              text-[18px] leading-[145%]
              md:text-[18px] md:leading-[150%]
              lg:text-[22px] lg:leading-[150%]
            "
					>
						For women who feel confused, anxious, or stuck in relationship
						loops.
					</p>

					{/* CTA */}
					<button
						type="button"
						className="
              order-1 md:order-2
              mt-8
              inline-flex items-center justify-center
              rounded-full
              bg-brand-primary hover:bg-[#9f3445]
              text-white
              font-lato font-medium uppercase
              tracking-[1.6px]
              text-[15px]
              xs:w-full
              px-10 py-4
              md:w-auto md:min-w-[420px] md:px-16 md:py-4
              lg:px-32 lg:py-4
              shadow-[0_10px_28px_rgba(0,0,0,0.10)]
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
