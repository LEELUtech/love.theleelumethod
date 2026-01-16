import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton";
import Image from "next/image";

const TheSynthesisSection = () => {
	return (
		<section className="relative py-[80px]">
			{/* Background Image */}
			<div className="absolute inset-0 z-[-1] overflow-hidden">
				<Image
					src="/images/about/synthesis_section_bg.png"
					alt=""
					fill
					priority
					quality={100}
				/>
			</div>
			<div className="container">
				<div className="max-w-[800px] mx-auto text-center">
					{/* Top Image with Logo */}
					<div className="flex justify-center mb-[75px]">
						<div className="relative w-[511px] h-[534px] ">
							<Image
								src="/images/about/synthesis_section.png"
								alt="The Synthesis"
								fill
								className="object-cover"
								quality={100}
							/>
							{/* Logo Overlay */}
							<div className="absolute flex bottom-[-40px] left-1/2 transform -translate-x-1/2 items-center justify-center bg-brand-primary rounded-[300px] lg:w-[101px] lg:h-[140px] z-10">
								<Image
									src="/leelu_logo.svg"
									alt=""
									width={63}
									height={61}
									className="filter brightness-0 invert"
								/>
							</div>
						</div>
					</div>

					{/* Title */}
					<h2 className="font-thin text-[60px] leading-[100%] font-canela text-brand-deep mb-[39px]">
						THE SYNTHESIS
					</h2>

					{/* Subtitle */}
					<p className="font-normal font-canela text-[32px] leading-[130%] text-brand-black mb-6">
						Filling the Gaps
					</p>

					{/* Body Text */}
					<p className="font-medium text-[17px] text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6 max-w-[804px] mx-auto">
						I spent the next few years traveling. I cross-referenced my
						profiling data with ancient energetic systems from India, Tibet, and
						Israel. While the government training gave me the structure, the
						Eastern systems filled the gaps in the code, creating a hybrid
						methodology uniquely unique to Leelu&apos;s tech.
					</p>

					<p className="font-medium text-[17px] text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6">
						Since then, I&apos;ve decoded patterns for thousands of people, from
						pragmatic founders to whom the word &quot;spiritual&quot; is an
						insult, to artists and deep feelers with a profound call toward
						their life&apos;s purpose.
					</p>

					<p className="font-medium text-[17px] text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6">
						Whether you are navigating a corporate merger or a crisis of
						identity, the friction is the same. You are trying to play a game
						without knowing the rules.
					</p>

					<p className="font-medium text-[17px] text-[#5A5757] font-lato leading-[26px] tracking-normal mb-12">
						My work bridges the gap between hard data and deep intuition. I use
						numerology as the framework to organize the chaos, but the goal,
						greater than relief, can be summed up in a single word:
					</p>

					{/* Fulfillment Title */}
					<h3 className="font-normal font-canela text-[32px] leading-[130%] text-brand-black mb-6">
						Fulfillment.
					</h3>

					{/* Fulfillment Text */}
					<p className="font-thin font-canela text-[32px] leading-[130%] text-brand-deep mb-12">
						It is about executing the contract you signed at birth. It is about
						removing the friction between who you are and what you do, so you
						can live the most impactful, abundant version of the life you were
						designed to live.
					</p>

					{/* CTA Button */}
					<WebinarModalButton
						showArrow={false}
						text="START THE DECODE"
						className="
							justify-center gap-3 font-medium tracking-[0.1em]
							text-[15px] leading-[26px] py-4 px-10 md:px-20 lg:px-24
							bg-brand-primary hover:bg-[#E13954] uppercase
						"
					/>
				</div>
			</div>
		</section>
	);
};

export default TheSynthesisSection;
