import ArcAutoOnce from "@/components/ArcFlyOnce";
import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton";
import Image from "next/image";

const StopGuessingSection = () => {
	return (
		<section className="relative py-[112px]">
			{/* Background Image */}
			<div className="absolute inset-0 z-[-1]">
				<Image
					src="/images/about/stop_guessing_section_bg.jpg"
					alt=""
					fill
					priority
					quality={100}
				/>
			</div>
			<div className="container">
				<div className="max-w-[900px] mx-auto text-center">
					{/* Top Image with curved line and logo */}
					<div className="flex justify-center mb-12 relative">
						{/* Curved line decoration */}

						<div className="relative w-[358px] h-[376px] ">
							<Image
								src="/images/resources-section-1.png"
								alt="Stop Guessing"
								fill
								quality={100}
							/>
							<div className="absolute flex bottom-[-40px] left-1/2 transform -translate-x-1/2 items-center justify-center bg-brand-primary rounded-[300px] lg:w-[101px] lg:h-[140px] z-10">
								<Image
									src="/leelu_logo.svg"
									alt=""
									width={63}
									height={61}
									className="filter brightness-0 invert"
								/>
							</div>
							<ArcAutoOnce
								imgW={358}
								imgH={376}
								scale={1.2}
								biasLeft={0.52}
								yUp={0.13}
								durMs={2000}
								startDelayMs={500}
								endAt={0.9}
								arrowRotateDeg={254}
								arrowScale={1}
								arrowCenterX={6.5}
								arrowCenterY={-6}
								arrowOffsetY={3}
								arrowOffsetX={0}
								flightStart={0.2}
							/>
							{/* Logo Badge */}
							{/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-[#a84b6c] rounded-full w-[70px] h-[70px]">
								<Image
									src="/leelu_logo.svg"
									alt=""
									width={40}
									height={40}
									className="filter brightness-0 invert"
								/>
							</div> */}
						</div>
					</div>

					{/* Main Heading */}
					<h2 className="font-thin text-[60px] leading-[100%] font-canela text-brand-deep mb-6">
						Stop Guessing. Start Knowing.
					</h2>

					{/* Subheading */}
					<p className="font-thin font-canela text-[32px] leading-[130%] text-brand-deep mb-12">
						We don&apos;t just patch the relationship.
						<br />
						We rewrite the code.
					</p>

					{/* CTA Button */}
					<WebinarModalButton
						showArrow={false}
						text="Access your Operating Manual"
						className="
							justify-center gap-3 font-medium tracking-[0.1em]
							text-[15px] leading-[26px] py-4 px-10 md:px-20 lg:px-14
							bg-brand-primary hover:bg-[#E13954] uppercase
						"
					/>
				</div>
			</div>
		</section>
	);
};

export default StopGuessingSection;
