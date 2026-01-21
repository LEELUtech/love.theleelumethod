import ArcAutoOnce from "@/components/ui/ArcFlyOnce";
import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton";
import Image from "next/image";
import React from "react";

type Card = {
	title: string;
	text: string;
};

const CARDS = {
	top: {
		title: "The Loyalty Algorithm",
		text: 'There are 87 types of "Hidden Desires." I will show you how to identify the one specific thing he needs (that he doesn\'t even know he needs) to trigger his commitment.',
	},
	left: {
		title: "The “Script” Glitch",
		text: 'Why you keep attracting the same man with a different face. We will identify if you are running the "Man in the Skirt" program or a Subconscious Childhood Loop that rejects healthy love.',
	},
	right: {
		title: "Math vs. Chemistry",
		text: 'Why "butterflies" are often a warning sign of incompatibility. We will look at the 475+ formulas that predict if a relationship will last or collapse.',
	},
	center: {
		title: "The Conflict Origin",
		text: "I don't guess who started the fight; I calculate it. We will identify exactly who is responsible for the destruction cycle in your relationship (it is rarely who you think it is) and the specific behavioral move to stop it.",
	},
	bottomLeft: {
		title: "The Energy Audit",
		text: "Why you feel drained even after 8 hours of sleep. We will map the specific Attachment Patterns still tethered to your exes that are draining your nervous system and making you invisible to new partners.",
	},
	bottomRight: {
		title: "The “Scorekeeper” Trap",
		text: 'Are you operating as an Unconditional Giver, a Scorekeeper, or a Taker? I will show you how shifting out of the "Transactional Phase" kills resentment and forces him to step up.',
	},
} satisfies Record<string, Card>;

function LearnCard({ title, text }: Card) {
	return (
		<div
			className="
        rounded-[32px]
        bg-brand-white backdrop-blur-md
        shadow-[0_4px_20px_rgba(0,0,0,0.1)]

        max-w-[392px] h-[384px] px-[38px] py-[38px]

        sm:max-w-none sm:w-full sm:h-auto sm:px-7 sm:py-7

        lg:max-w-[392px] lg:h-[384px] lg:px-[38px] lg:py-[38px]
      "
		>
			<h3
				className="
          font-canela font-light text-[32px] leading-[120%] text-brand-deep mb-4
          sm:text-[28px]
          lg:text-[32px]
        "
			>
				{title}
			</h3>

			<p
				className="
          font-lato font-medium text-[#5A5757] text-body leading-[26px]
          sm:text-[14px] sm:leading-[24px]
          lg:text-body lg:leading-[26px]
        "
			>
				{text}
			</p>
		</div>
	);
}

export default function DecodedLoveCohortSection() {
	const ornamentIcon = (
		<Image src="/icons/ornament_1.svg" alt="" width={24} height={24} />
	);
	return (
		<section className="relative py-16 pb-[150px] lg:pb-[200px] lg:py-24">
			{/* Background */}
			<div className="absolute inset-0 -z-10">
				<Image
					src="/images/landing/cohort_section_bg.png"
					alt=""
					fill
					priority
				/>
			</div>

			<div className="container relative mx-auto">
				<div className="max-w-[822px]">
					<p className="font-canela uppercase tracking-normal text-[48px] leading-[120%] lg:text-[60px] text-brand-deep font-thin mb-10 lg:mb-3">
						THE “DECODED LOVE” LIVE COHORT
					</p>

					<p className="font-lato font-medium text-[#5A5757] text-body leading-[26px]">
						This is not a standard “webinar”. I am not here to just motivate
						you. I am running a live diagnostic session to demonstrate the
						LeeluTech System in real-time. I am taking a select group of women
						and revealing the hidden architecture of their relationships.
					</p>
				</div>

				{/* Learn label */}
				<p className="lg:mt-[153px] mt-[50px] font-canela font-normal text-[#5A5757] text-[32px]">
					You will learn:
				</p>

				<ArcAutoOnce
					className="xs:hidden lg:block absolute left-1/2 -translate-x-[20px] top-[450px] pointer-events-none"
					scale={1.4}
					// biasLeft={0.5}
					// yUp={0.15}
					strokeWidth={5}
					durMs={1500}
					arcStart={{ x: -500, y: 200 }}
					arcEnd={{ x: 560, y: 340 }}
					arcRx={260}
					arcRy={190}
					arcSweep={1}
					arcLarge={1}
					arrowScale={1.8}
					arrowRotateDeg={252}
					arrowCenterY={-5}
					// flightStart={0.05}
					endAt={0.7}
				/>

				{/* Cards cluster */}
				<div className="relative mt-6">
					{/* Desktop layout (exact like screenshot) */}
					<div className="hidden lg:grid grid-cols-3 items-start gap-5 gap-x-5 ">
						{/* row 1 */}
						<div className="mt-[104px]">
							<LearnCard {...CARDS.left} />
						</div>

						<div>
							<LearnCard {...CARDS.top} />
						</div>

						<div className="mt-[104px]">
							<LearnCard {...CARDS.right} />
						</div>

						{/* row 2 */}
						<div>
							<LearnCard {...CARDS.bottomLeft} />
						</div>

						<div className="mt-[-96px]">
							<LearnCard {...CARDS.center} />
						</div>

						<div>
							<LearnCard {...CARDS.bottomRight} />
						</div>
					</div>

					{/* Mobile/Tablet layout (stack) */}
					<div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
						<LearnCard {...CARDS.left} />
						<LearnCard {...CARDS.bottomLeft} />
						<LearnCard {...CARDS.top} />
						<LearnCard {...CARDS.center} />
						<LearnCard {...CARDS.right} />
						<LearnCard {...CARDS.bottomRight} />
					</div>
				</div>

				{/* Bottom CTA */}
				<div className="lg:mt-[112px] mt-[50px] text-center">
					<p className="font-canela font-light text-brand-deep text-[32px] leading-[36px] max-w-[884px] mx-auto">
						Discover the 5 secrets to choosing the right partner, creating
						healthy connection, and ending the cycle of disappointment.
					</p>

					<WebinarModalButton
						showArrow={false}
						text="Save My Seat"
						icon={ornamentIcon}
						iconPosition="left"
						className="w-full mt-[80px] md:w-auto justify-center gap-3 font-medium text-[18px] leading-[26px] py-4 px-8 md:px-10 lg:px-[85px] bg-brand-black hover:bg-[#333333] uppercase"
					/>
				</div>

				{/* Divider */}
				<div className="mt-[80px] h-[1px] w-full bg-brand-deep opacity-50 max-w-[1224px]" />

				{/* Restrictions */}
				<div className="mt-[80px]">
					<p className="font-canela font-light uppercase tracking-[2.6px] text-[32px] text-brand-black mb-[40px]">
						THE RESTRICTIONS:
					</p>

					<div className="font-lato text-[#5A5757] text-body space-y-2 max-w-[760px] leading-[130%]">
						<p className="mb-[40px]">
							This is not a passive recording. I review live questions and
							calibrate the data in real-time. Because I personally calculate
							codes for my students, I cannot host thousands of people.
						</p>

						<ul className="list-disc pl-5 space-y-1 text-body font-lato font-normal text-[#5A5757]">
							<li>Session Capacity: Capped at 100 Attendees.</li>
							<li>Next Session: [Dynamic Date: Tomorrow at 7 PM]</li>
							<li>
								Warning: Replays are not guaranteed. This is for women ready to
								execute, not just watch.
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
