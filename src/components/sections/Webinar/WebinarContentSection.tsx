import React from "react";
import Image from "next/image";
import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton";
import TestimonialsCarousel from "@/components/ui/TestimonialsCarousel";
import Button from "@/components/ui/Button"
import { WEBINAR_URL } from "@/utils/constants"

const CARD_CONTENT = [
	{
		title: "The Emotional Level",
		img: "/images/webinar/webinar_decor_up.png",
		text: "How you show up in relationships. Your reactions, attachment patterns, and behaviors. Where anxiety, avoidance, abandonment fear, and control live.",
		icon: "/icons/ornament_7.svg",
	},
	{
		title: "The Identity Level",
		text: "Deeper. Who you believe you are and what you believe you deserve in love. If your identity is built for survival instead of intimacy, you'll sabotage anything real.",
	},
	{
		title: "The Subconscius Level",
		img: "/images/webinar/webinar_decor_down.png",
		text: 'Deepest. Your inherited "love script" from childhood and past relationships. The hidden code shaping your identity and recreating familiar dynamics—even painful ones.',
		icon: "/icons/ornament_8.svg",
	},
];

const WebinarContentSection = () => {
	return (
		<section className="relative bg-[#f5e8e8] pt-12 pb-[120px] md:py-16 lg:py-32">
			{/* Background Image */}
			<div className="absolute inset-0 z-[0] overflow-hidden">
				<Image
					src="/images/bg/webinar_content_bg.png"
					alt=""
					fill
					priority
					quality={100}
				/>
			</div>

			{/* Carousel */}
			<TestimonialsCarousel className="absolute z-20 top-[-140px] md:top-[-90px] lg:top-[-110px]" />

			<div className="container px-4 relative z-10 mt-[170px] md:mt-[220px] lg:mt-[250px]">
				{/* FIRST BLOCK */}
				<div
					className="
		flex flex-col md:flex-row items-center justify-between

		/* SPACING */
		gap-12 md:gap-10 lg:gap-20

		/* MARGINS */
		mb-[300px] md:mb-[300px] lg:mb-[300px]
	"
				>
					{/* IMAGE */}
					<div className="w-full md:w-1/2 flex justify-center">
						<div
							className="
				relative overflow-hidden rounded-[60px]

				/* MOBILE */
				w-full max-w-[360px] h-[459px]

				/* TABLET */
				md:max-w-[360px]

				/* DESKTOP (UNTOUCHED) */
				lg:max-w-none lg:w-[496px] lg:h-[833px]
			"
						>
							<Image
								src="/images/woman-sitting-windowsill.png"
								alt="Woman sitting by window"
								fill
								quality={100}
								objectFit="cover"
							/>
						</div>
					</div>

					{/* TEXT */}
					<div className="w-full md:text-left md:max-w-[400px] lg:max-w-none">
						<h2
							className="
				font-canela font-thin text-brand-deep tracking-normal leading-[100%]

				/* MOBILE */
				text-[48px]
				mb-[40px]

				/* TABLET */
				md:text-[48px]
				md:mb-8

				/* DESKTOP */
				lg:text-[60px]
				lg:mb-[67px]
			"
						>
							You&apos;re smart, capable…
							<br />
							and still asking,
							<br />
							&quot;What&apos;s wrong with me?&quot;
						</h2>

						<div
							className="
				font-lato font-medium text-[#5A5757] tracking-[0.02em]

				/* MOBILE */
				text-[17px]
				leading-[22px]

				/* TABLET */
				md:text-[17px]
				md:leading-[24px]

				/* DESKTOP */
				lg:text-body
				lg:leading-[26px]
				lg:tracking-[0.03em]
			"
						>
							<p>
								You&apos;ve done the work. You&apos;ve tried communication,
								compromise, patience. And you still ended up alone or in a
								relationship that slowly eroded your sense of self.
							</p>

							<p className="mt-4 md:mt-5 lg:mt-6">
								Maybe you&apos;re recovering from a breakup that demolished your
								confidence.
							</p>

							<p className="mt-4 md:mt-5 lg:mt-6">
								Maybe you recognize the cycle:
								<br />
								<span className="font-normal italic">
									Euphoria → distance → desperation → collapse.
								</span>
							</p>

							<p className="mt-4 md:mt-5 lg:mt-6">
								Or maybe you&apos;re exhausted from carrying the emotional
								weight, managing everything, while secretly craving to be held,
								chosen, and cherished
							</p>

							<p className="mt-4 md:mt-5 lg:mt-6">
								If any of this resonates, this masterclass is for you.
							</p>

							<p
								className="
					font-thin font-canela text-brand-deep leading-[110%]

					/* MOBILE */
					text-[32px]
					mt-10

					/* TABLET */
					md:text-[24px]
					md:mt-10

					/* DESKTOP */
					lg:text-[32px]
					lg:mt-[60px]
				"
							>
								If this is you, you&apos;re exactly who this masterclass was
								created for.
							</p>
						</div>
					</div>
				</div>

				{/* SECOND BLOCK */}
				<div className="relative text-center mb-12 md:mb-16 lg:mb-[34px]">
					<Image
						src="/icons/ornament_2.svg"
						alt=""
						width={400}
						height={400}
						className="
							absolute left-1/2 -translate-x-1/2 z-0

							/* MOBILE */
							top-[-220px] w-[350px]

							/* TABLET */
							md:top-[-160px] md:w-[300px]

							/* DESKTOP */
							lg:top-[-210px] lg:w-[400px]
						"
						style={{
							maskImage:
								"linear-gradient(to bottom, black 0%, transparent 80%)",
							WebkitMaskImage:
								"linear-gradient(to bottom, black 0%, transparent 80%)",
							filter: "brightness(200%)",
						}}
					/>

					<h3
						className="
							relative z-10 font-canela font-thin tracking-normal text-brand-deep mb-4 leading-[100%]

							text-[48px]
							md:text-[48px]
							lg:text-[60px]
						"
					>
						Love isn&apos;t just about who you choose…
						<br />
						It&apos;s about what you&apos;re available for.
					</h3>

					<p
						className="
							font-light font-canela tracking-normal leading-[100%]

							text-[20px]
							md:text-[26px]
							lg:text-[32px]
						"
					>
						And that&apos;s determined at three levels <br />
						each deeper than the last.
					</p>
				</div>

				{/* THIRD BLOCK */}
				<div className="grid grid-cols-1 gap-6 items-center justify-items-center mb-10">
					{CARD_CONTENT.map((card, i) => (
						<div
							key={i}
							className="
										bg-white rounded-[32px] text-center flex flex-col items-center justify-center

										/* MOBILE */
										w-full max-w-[361px]
										min-h-[497px]
										p-1

										/* TABLET */
										md:max-w-[600px]
										md:min-h-[320px]
										md:p-8

										/* DESKTOP */
										lg:max-w-none
										lg:w-[904px]
										lg:h-[449px]
										lg:p-10
									"
						>
							{card.img && (
								<div className="relative w-[139px] h-[139px] mb-4">
									{/* Main image */}
									<Image src={card.img} alt="" fill />

									{/* Center icon */}
									{card.icon && (
										<Image
											src={card.icon}
											alt=""
											width={90}
											height={90}
											className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
										/>
									)}
								</div>
							)}

							<h4
								className="
									font-canela font-normal md:font-light text-brand-black mb-3

									text-[48px]
									md:text-[40px]
									lg:text-[60px]
								"
							>
								{card.title}
							</h4>

							<p
								className="
									font-lato text-[#5A5757] font-normal leading-relaxed max-w-[680px]

									text-[17px]
									md:text-[17px]
									lg:text-[18px]
								"
							>
								{card.text}
							</p>
						</div>
					))}
				</div>

				{/* CTA BUTTON */}
				<div className="flex justify-center w-full">
					<Button
						variant="primary"
						size="md"
						className="w-full md:w-[76%] py-[12px]"
						href={WEBINAR_URL}
					>
						Reserve My Spot
					</Button>
				</div>
			</div>
		</section>
	);
};

export default WebinarContentSection;
