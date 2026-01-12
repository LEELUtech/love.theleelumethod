import CompatibilityReportModalButton from "@/components/ui/buttons/CompatibilityReportModalButton";
import FreeQuizButton from "@/components/ui/buttons/FreeQuizButton";
import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton";
import RelationshipTriageCard from "@/components/sections/RelationshipTriageCard";

function WaveIcon() {
	return (
		<svg width="44" height="16" viewBox="0 0 44 16" fill="none" className="mx-auto mb-6">
			<path
				d="M1 8c4-5.333 8-5.333 12 0 4 5.333 8 5.333 12 0 4-5.333 8-5.333 12 0 4 5.333 8 5.333 12 0"
				stroke="#1F1F1F"
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function SparkIcon() {
	return (
		<svg width="44" height="26" viewBox="0 0 44 26" fill="none" className="mx-auto mb-6">
			<path
				d="M22 1v8M22 17v8M9 13h8M27 13h8M13.5 6.5l5.5 5.5M25 14l5.5 5.5M18.5 14l-5.5 5.5M25 12l5.5-5.5"
				stroke="#1F1F1F"
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function ArrowsIcon() {
	return (
		<svg width="44" height="24" viewBox="0 0 44 24" fill="none" className="mx-auto mb-6">
			<path
				d="M1 12h15M28 12h15M14 6l2 6-2 6M30 18l-2-6 2-6"
				stroke="#1F1F1F"
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default function RelationshipTriageSection() {
	return (
		<section className="relative bg-white overflow-hidden py-24 px-4">
			<div className="container mx-auto relative">
				<header className="text-center mb-14">
					<h2 className="font-canela text-4xl md:text-5xl lg:text-6xl leading-tight tracking-[0.08em] text-black font-light" >
						THE RELATIONSHIP
						<br />
						TRIAGE
					</h2>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end">
					<RelationshipTriageCard
						backgroundClass="bg-[#f7f7f7]"
						className="max-h-[727px]"
						icon={<WaveIcon />}
						title="I AM CONFUSED"
						cta={<FreeQuizButton text="Start Quiz" className="text-center w-full" />}
					>
						<p>Is it a trauma bond or a soul connection?</p>
						<p>Your intuition is currently biased by emotion. Numerological algorithms are not.</p>
						<p>Answer 10 questions to uncover:</p>
						<div className="space-y-2">
							<p>The Friction Points: Why you keep having the same fight.</p>
							<p>The Probability: Is this relationship built for the long haul or a lesson?</p>
							<p>The Truth: What his behavior is actually saying.</p>
						</div>
					</RelationshipTriageCard>

					<RelationshipTriageCard
						backgroundClass="bg-[#fde7df]"
						className="max-h-[765px] h-[1500px] pt-[70px]"
						icon={<SparkIcon />}
						title="I AM READY TO FIX IT"
						cta={<WebinarModalButton text="Register to Webinar" className="text-center w-full" />}
					>
						<p>You want the truth? Join the deep dive.</p>
						<p>I will show you the exact mechanics of why men pull away and how to shift the power dynamic instantly.</p>
						<p>We will cover:</p>
						<div className="space-y-2">
							<p>
								The "Inner Devil": <span className="font-bold">The dark side of your personality that sabotages love.</span>
							</p>
							<p>
								Hidden Desires: <span className="font-bold">The one thing he needs (that he doesn't even know he needs).</span>
							</p>
							<p>
								The Script Shift: <span className="font-bold">How to stop over-functioning and inspire his loyalty.</span>
							</p>
						</div>
					</RelationshipTriageCard>

					<RelationshipTriageCard
						backgroundClass="bg-[#f7f7f7]"
						className="max-h-[727px]"
						icon={<ArrowsIcon />}
						title="I AM HEARTBROKEN"
						cta={<CompatibilityReportModalButton text="Report" className="text-center w-full" />}
					>
						<p>Pain is biological. It is a withdrawal symptom.</p>
						<p>When you are in this state, your nervous system is overwhelmed. You cannot make logical choices. Relying on the passage of time to heal you is not a strategy. It is a gamble.</p>
						<p>
							You need a protocol. One that interrupts the biology of heartbreak before it becomes your new emotional and bioenergetic baseline.
						</p>
						<p>
							<span className="font-semibold">This guide gives you 7 evidence-based strategies to reclaim your nervous system and your life.</span>
						</p>
					</RelationshipTriageCard>
				</div>
			</div>
		</section>
	);
}
