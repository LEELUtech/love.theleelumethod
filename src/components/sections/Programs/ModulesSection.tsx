import Button from "@/components/ui/Button";
import Phase3Orb from "@/components/ui/Phase3Orb";
import RotateOnView from "@/components/ui/RotateOnView";
import Image from "next/image";
import React from "react";

type MiniCard = { title: string; text: string };
type Module = { title: string; text: string; accent?: "red" | "gold" | "none" };

const MINI_CARDS: MiniCard[] = [
	{ title: "WHAT", text: "Is the mathematical root of your\nconflict?" },
	{
		title: "WHY",
		text: 'Is your "Inner Devil" triggered\nby specific archetypes?',
	},
	{
		title: "HOW",
		text: "Do you shift the power dynamic\nwithout saying a word?",
	},
];

const PHASE_1: Module[] = [
	{
		title: "Module 1: The Diagnostic",
		text: "We stop treating the symptoms (the fights, the distance, the feeling of inadequacy) and locate the root cause. What is the specific “Trigger” that collapses your relationships?",
		accent: "red",
	},
	{
		title: 'Module 2: The Polarity Reset "Wearing The Pants"',
		text: "Are you the General of your household? We break the “Over-Functioning” addiction that forces men into the “Child” role. You will learn how to relinquish control to gain power.",
		accent: "red",
	},
	{
		title: "Module 3: The Fantasy Detox",
		text: "We identify the romantic script you’re unconsciously following (the “fixer-upper,” the “tragic love story,” the “he’ll change for me” narrative) and replace it with what your code actually requires to feel safe — which is often the opposite of what you’ve been chasing.",
		accent: "red",
	},
	{
		title: "Module 4: From Dependency to Sovereignty",
		text: "How to stop outsourcing your emotional regulation to your partner. We cut the “Parental Cord” so you stop negotiating for love like a child and start receiving it like a woman.",
		accent: "red",
	},
];

const PHASE_2: Module[] = [
	{
		title: "Module 5: The Independent Protocol",
		text: "How to receive support without losing autonomy. The delicate balance between being a “Strong Woman” and a “Cherished Partner”.",
		accent: "gold",
	},
	{
		title: "Module 6: The Art of the Ask",
		text: "The difference between a Demand (which repels him) and a Request (which inspires him). How to trigger his biological drive to provide for you.",
		accent: "gold",
	},
	{
		title: "Module 7 & 8: The Male Operating System",
		text: "We decode the 3 Hidden Needs of every man: Freedom, Significance, and Sex. Learn why he pulls away when he feels “managed” and how to become his sanctuary, not his stressor.",
		accent: "gold",
	},
];

const PHASE_3: Module[] = [
	{
		title: "Module 9: The Control Glitch (Jealousy)",
		text: "Jealousy is just data. We decode what your fear of loss is actually telling you and how to shift from “Paranoid” to “Magnetic.”",
		accent: "none",
	},
	{
		title: "Module 10: The Energy Audit",
		text: "We map your personal energy architecture: what drains you, what restores you, and the specific environmental and relational conditions you need to stay emotionally regulated and magnetically present.",
		accent: "none",
	},
	{
		title: "Module 11: The Compatibility Matrix",
		text: "The mathematical reality of your union. Is this a “Growth” partner, a “Karmic” teacher, or a “Life” partner? Know the difference before you invest another year.",
		accent: "none",
	},
	{
		title: "Module 12: The Hidden Desire",
		text: "The Crown Jewel of the System: Every human has a secret emotional driver (one of 87 types). I teach you how to identify *his*, so you become the only woman who truly speaks his language.",
		accent: "none",
	},
];

function MiniWhyCard({ title, text }: MiniCard) {
	return (
		<div className="rounded-[16px] bg-[#FFF8F8] px-6 py-10 md:px-[26px] md:py-[57px] text-center">
			<div className="font-canela font-thin text-brand-deep text-[42px] md:text-[42px] leading-[150%]">
				{title}
			</div>
			<p className="mt-3 whitespace-pre-line font-lato text-[#5A5757] text-[16px] md:text-[18px] leading-[26px] md:leading-[28px]">
				{text}
			</p>
		</div>
	);
}

function ModuleCard({ title, text, accent = "red" }: Module) {
	return (
		<div className="rounded-[16px] bg-[#FFF8F8] backdrop-blur-md px-[20px] py-[20px] md:px-[24px] md:py-[24px]">
			<div className="flex flex-row gap-4 items-center mb-4">
				{accent !== "none" && (
					<div className="relative w-[26px] h-[33px] shrink-0">
						<Image
							src={
								accent === "red" ? "/icons/red_star.svg" : "/icons/necktie.svg"
							}
							alt=""
							fill
							priority
							quality={100}
						/>
					</div>
				)}
				<div className="font-canela font-normal text-brand-black text-[18px] md:text-[20px] leading-[18px]">
					{title}
				</div>
			</div>

			<p className="font-lato font-normal text-[#5A5757] text-[14px] tracking-normal leading-[24px]">
				{text}
			</p>
		</div>
	);
}

export default function ModulesSection() {
	return (
		<section className="relative overflow-hidden">
			{/* Background for whole section */}
			<div className="absolute inset-0 -z-10">
				<Image
					src="/images/programs/modules_section_bg.png"
					alt=""
					fill
					priority
				/>
			</div>

			<div className="container px-4">
				{/* ====== TOP BLOCK (WHY / WHAT / HOW) ====== */}
				<div className="pt-[198px] lg:pt-[176px] pb-[80px] lg:pb-[110px] text-center">
					{/* portrait + badge */}
					<div className="mx-auto relative">
						<div className="relative z-[10] mx-auto w-full max-w-[356px] aspect-[356/384] overflow-hidden">
							<Image
								src="/images/programs/modules_lily.png"
								alt=""
								fill
								priority
								quality={100}
								className="object-cover"
							/>
						</div>

						{/* ornaments: hide on mobile, keep from md+ */}
						<div
							className="
								absolute z-0
								left-1/2 -translate-x-[49.5%]
								top-[-100px]
								lg:top-[-90px]
								flex
								flex-row items-center justify-center gap-[130px]
								pointer-events-none
							"
						>
							{/* LEFT ornament */}
							<div className="relative hidden md:block w-[180px] h-[180px] lg:w-[238px] lg:h-[249px] md:translate-x-[120px] md:translate-y-[50px] lg:translate-x-[125px] lg:translate-y-[60px]">
								<Image
									src="/icons/ornament_3.svg"
									alt=""
									fill
									className="absolute filter brightness-0 invert"
									style={{
										maskImage:
											"linear-gradient(to bottom, black 0%, black 10%, transparent 90%)",
										WebkitMaskImage:
											"linear-gradient(to bottom, black 0%, black 10%, transparent 90%)",
										filter: "brightness(200%)",
									}}
								/>
							</div>

							{/* CENTER ornament */}
							<div className="relative w-[261px] h-[266px] lg:w-[500px] lg:h-[500px]">
								<Image
									src="/icons/ornament_2/ornament_2_light.svg"
									alt=""
									fill
									className="absolute filter brightness-0 invert"
									style={{
										maskImage:
											"linear-gradient(to bottom, black 0%, transparent 80%)",
										WebkitMaskImage:
											"linear-gradient(to bottom, black 0%, transparent 80%)",
										filter: "brightness(200%)",
									}}
								/>
							</div>

							{/* RIGHT ornament */}
							<div className="relative hidden md:block w-[180px] h-[180px] lg:w-[259px] lg:h-[242px] md:-translate-x-[120px] md:translate-y-[50px] lg:-translate-x-[120px] lg:translate-y-[60px]">
								<Image
									src="/icons/ornament_5.svg"
									alt=""
									fill
									className="absolute filter brightness-0 invert"
									style={{
										maskImage:
											"linear-gradient(to bottom, black 0%, black 20%, transparent 100%)",
										WebkitMaskImage:
											"linear-gradient(to bottom, black 0%, black 20%, transparent 100%)",
										filter: "brightness(200%)",
									}}
								/>
							</div>
						</div>

						<div
							className="
											absolute left-1/2 bottom-[-40px] -translate-x-1/2
											flex items-center justify-center overflow-hidden
											bg-[#EB4F68]
											before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay
											rounded-[300px]
											w-[80px] h-[100px]
											md:w-[100px] md:h-[126px]
											lg:w-[101px] lg:h-[140px]
											z-10
										"
						>
							<RotateOnView duration={5} amount={0.4} ease="easeOut">
								<Image
									src="/leelu_logo.svg"
									alt=""
									width={63}
									height={61}
									className="w-[51px] h-[53px] md:w-[65px] md:h-[63px] lg:w-[61px] lg:h-[63px] filter invert-[100%] brightness-[100%]"
								/>
							</RotateOnView>
						</div>
					</div>

					<h2 className="mt-16 font-canela font-thin text-brand-deep text-[48px] md:text-[48px] lg:text-[48px] leading-[120%] max-w-[860px] mx-auto">
						<span className="text-brand-primary">The LeeluTech system </span>{" "}
						answers the questions
						<br />
						traditional therapy circles for years:
					</h2>

					<div className="mt-10 lg:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-[980px] mx-auto">
						{MINI_CARDS.map((c, idx) => (
							<div
								key={c.title}
								className={
									idx === 1 ? "md:-translate-y-6 lg:-translate-y-8" : ""
								}
							>
								<MiniWhyCard {...c} />
							</div>
						))}
					</div>

					<Button
						variant="primary"
						size="md"
						className="w-full lg:w-[28%] xs:text-[12px]"
						href="#checkout"
					>
						INITIATE THE PROTOCOL
					</Button>
				</div>

				{/* ====== MODULES BLOCK ====== */}
				<div className="pb-[110px] lg:pb-[96px]">
					<h2 className="text-center font-canela font-thin text-brand-deep text-[48px] md:text-[48px] lg:text-[80px] tracking-normal leading-[130%] mx-auto">
						You are 12 modules away from the
						<br />
						relationship
						<span className="text-brand-primary">you were destined for.</span>
					</h2>

					<p className="mt-6 md:mt-8 text-center font-lato text-brand-deep text-[24px] md:text-[24px] lg:leading-[26px] leading-[150%]">
						This is not a lecture series. It is a step-by-step reconfiguration
						of your relationship architecture.
					</p>

					{/* ================= PHASE 1 ================= */}
					<div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
						{/* left */}
						<div className="text-left">
							<p className="font-canela font-thin text-brand-black text-[22px] md:text-[28px] tracking-[0.18em] uppercase">
								PHASE 1:
							</p>

							<h3 className="mt-1 font-canela font-thin text-brand-deep text-[34px] md:text-[46px] lg:text-[56px] leading-[105%]">
								THE AUDIT
								<span className="font-canela font-thin leading-[100%] tracking-normal text-brand-primary">
									(You)
								</span>
							</h3>

							<div className="mt-4 relative w-full max-w-[420px] mx-auto lg:mx-0">
								<div className="relative w-full aspect-[420/338]">
									<Image
										src="/images/programs/phase_1.png"
										alt="Phase 1"
										fill
										priority
										quality={100}
										className="object-cover"
									/>
								</div>

							<div className="absolute left-[2%] bottom-[2%] h-[64px] w-[64px] md:h-[81px] md:w-[81px] rounded-full overflow-hidden bg-[#EB4F68] before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay flex items-center justify-center">
									<div className="relative w-[26px] h-[32px] md:w-[32px] md:h-[39px]">
										<Image
											src="/icons/red_star.svg"
											alt=""
											fill
											priority
											quality={100}
											className="filter brightness-0 invert"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* right modules */}
						<div className="grid gap-4">
							{PHASE_1.map((m) => (
								<ModuleCard key={m.title} {...m} />
							))}
						</div>
					</div>

					{/* divider (fix: mt-22 is not valid Tailwind by default) */}
					<div className="mt-[88px] hidden lg:block lg:mt-24 h-px w-full bg-brand-deep/20" />

					{/* ================= PHASE 2 ================= */}
					<div className="mt-14 lg:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
						{/* left modules */}
						<div className="lg:order-1 order-2 grid gap-4">
							{PHASE_2.map((m) => (
								<ModuleCard key={m.title} {...m} />
							))}
						</div>

						{/* right title + image */}
						<div className="lg:order-2 order-1 text-left">
							<p className="font-canela font-thin text-brand-black text-[22px] md:text-[28px] tracking-[0.18em] uppercase">
								PHASE 2:
							</p>

							<h3 className="mt-1 font-canela font-thin text-brand-deep text-[34px] md:text-[46px] lg:text-[56px] leading-[105%]">
								THE MECHANICS
								<br />
								<span className="font-canela font-thin leading-[100%] tracking-normal text-[#C89F26]">
									(Him)
								</span>
							</h3>

							<div className="mt-4 md:mt-[65px] relative w-full max-w-[460px] mx-auto lg:mx-0">
								<div className="relative w-full aspect-[460/378]">
									<Image
										src="/images/programs/phase_2.png"
										alt="Phase 2"
										fill
										priority
										quality={100}
										className="object-cover rounded-b-[300px]"
									/>
								</div>

								<div className="absolute right-[8%] bottom-[11%] h-[64px] w-[64px] md:h-[81px] md:w-[81px] pt-2 rounded-full bg-[#C89F26] flex items-center justify-center">
									<div className="relative w-[34px] h-[20px] md:w-[42px] md:h-[26px]">
										<Image
											src="/icons/necktie.svg"
											alt=""
											fill
											priority
											quality={100}
											className="filter brightness-0 invert"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* ================= PHASE 3 ================= */}
					<div className="mt-14 lg:mt-28 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
						{/* left */}
						<div className="text-left">
							<p className="font-canela font-thin text-brand-black text-[22px] md:text-[28px] tracking-[0.18em] uppercase">
								PHASE 3:
							</p>

							<h3 className="mt-1 font-canela font-thin text-brand-deep text-[34px] md:text-[46px] lg:text-[56px] leading-[105%]">
								THE STRATEGY
								<br />
								<span className="font-canela font-thin leading-[100%] tracking-normal text-brand-primary">
									(The Future)
								</span>
							</h3>

							<div className="mt-4 md:mt-[65px] relative mx-auto lg:mx-0">
								<Phase3Orb/>
							</div>
						</div>

						{/* right modules */}
						<div className="grid gap-4">
							{PHASE_3.map((m) => (
								<ModuleCard key={m.title} {...m} />
							))}
						</div>
					</div>

					{/* ================= FINAL CTA ================= */}
					<div className="text-center relative mt-12 lg:mt-[100px]">
						
						<h3 className="font-canela font-light text-brand-deep text-[28px] md:text-[32px] leading-[120%]">
							Reconfigure your relationship architecture.
						</h3>

						<Button
							variant="primary"
							size="md"
							className="w-full lg:w-[38%] xs:text-[12px] mt-[32px]"
							href="#checkout"
						>
							INITIATE THE PROTOCOL
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
