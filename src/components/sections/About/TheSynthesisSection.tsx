import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton";
import Image from "next/image";
import Link from "next/link"

const TheSynthesisSection = () => {
	return (
		<section className="relative py-[64px] lg:py-[80px]">
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
				<div className="max-w-[800px] mx-auto text-center px-2">
					{/* Top Image */}
					<div className="flex justify-center mb-12 lg:mb-[75px]">
						<div className="relative w-[361px] h-[377px] sm:w-[320px] sm:h-[340px] md:w-[380px] md:h-[400px] lg:w-[511px] lg:h-[534px]">
							<Image
								src="/images/about/synthesis_section.png"
								alt="The Synthesis"
								fill
								quality={100}
							/>

							{/* Logo */}
							<div
								className="absolute flex bottom-[-28px] lg:bottom-[-40px] left-1/2 -translate-x-1/2 items-center justify-center bg-brand-primary rounded-[300px] 
                w-[68px] h-[100px] lg:w-[101px] lg:h-[140px] z-10"
							>
								<Image
									src="/leelu_logo.svg"
									alt=""
									width={48}
									height={46}
									className="filter brightness-0 invert"
								/>
							</div>
						</div>
					</div>

					{/* Title */}
					<h2
						className="font-thin font-canela text-brand-deep mb-6 
            text-[60px] sm:text-[60px] md:text-[60px] lg:text-[60px] leading-[100%]"
					>
						THE SYNTHESIS
					</h2>

					{/* Subtitle */}
					<p
						className="font-normal font-canela text-brand-black mb-6 
            text-[32px] sm:text-[32px] md:text-[32px] lg:text-[32px] leading-[130%]"
					>
						Filling the Gaps
					</p>

					{/* Body */}
					<p
						className="font-medium text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6 
            text-[17px] sm:text-[17px] lg:text-[17px]"
					>
						I spent the next few years traveling. I cross-referenced my
						profiling data with ancient energetic systems from India, Tibet, and
						Israel. While the government training gave me the structure, the
						Eastern systems filled the gaps in the code, creating a hybrid
						methodology uniquely unique to Leelu&apos;s tech.
					</p>

					<p className="font-medium text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6 text-[17px] sm:text-[17px] lg:text-[17px]">
						Since then, I&apos;ve decoded patterns for thousands of people, from
						pragmatic founders to whom the word &quot;spiritual&quot; is an
						insult, to artists and deep feelers with a profound call toward
						their life&apos;s purpose.
					</p>

					<p className="font-medium text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6 text-[17px] sm:text-[17px] lg:text-[17px]">
						Whether you are navigating a corporate merger or a crisis of
						identity, the friction is the same. You are trying to play a game
						without knowing the rules.
					</p>

					<p className="font-medium text-[#5A5757] font-lato leading-[26px] tracking-normal mb-10 text-[17px] sm:text-[17px] lg:text-[17px]">
						My work bridges the gap between hard data and deep intuition. I use
						numerology as the framework to organize the chaos, but the goal,
						greater than relief, can be summed up in a single word:
					</p>

					{/* Fulfillment */}
					<h3
						className="font-normal font-canela text-brand-black mb-4 
            text-[32px] sm:text-[32px] md:text-[32px] lg:text-[32px]"
					>
						Fulfillment.
					</h3>

					<p
						className="font-thin font-canela text-brand-deep mb-10 
            text-[32px] sm:text-[32px] md:text-[32px] lg:text-[32px] leading-[130%]"
					>
						It is about executing the contract you signed at birth. It is about
						removing the friction between who you are and what you do, so you
						can live the most impactful, abundant version of the life you were
						designed to live.
					</p>

					{/* CTA */}
					<Link
						className="btn-pill justify-center gap-3 font-medium tracking-[0.1em]
						rounded-[50px] text-center
						text-[15px] leading-[26px] py-4
						px-5
						bg-brand-primary text-brand-white hover:bg-[#E13954] uppercase order-2 lg:order-2 font-lato lg:max-w-[350px] w-full mx-auto lg:mx-0 mb-[24px] lg:mb-0"
						href="/decode"
					>
						START THE DECODE
					</Link>
				</div>
			</div>
		</section>
	);
};

export default TheSynthesisSection;
