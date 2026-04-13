import Button from "@/components/ui/Button";
import RotateOnView from "@/components/ui/RotateOnView";
import { SECRETS_LINKS } from "@/static/links";
import Image from "next/image";

interface ICard {
	title: string;
	description: string;
	withMarginTop?: boolean;
}

const Card = ({ title, description, withMarginTop = false }: ICard) => {
	const marginTop = withMarginTop ? "lg:mt-[160px]" : "";

	return (
		<div
			className={`bg-white rounded-[32px] w-full p-8 md:py-8 lg:py-12 lg:px-[56px] min-h-[233px] lg:min-h-[256px] flex flex-col ${marginTop}`}
		>
			<h3 className="font-canela text-[32px] mb-4 text-brand-black-100 font-light leading-[126%]">
				{title}
			</h3>
			<p className="text-[#5A5757] font-medium font-lato tracking-[3%] text-[17px]/[26px]">
				{description}
			</p>
		</div>
	);
};

export default function DiscoverSection() {
	return (
		<section className="relative bg-[#f5e8e8] py-12 md:py-16 lg:pt-[84px] lg:pb-[162px] overflow-hidden">

			<div className="absolute inset-0 z-10">
				<Image
					src="/noise_bg.svg"
					alt=""
					fill
					priority
					quality={100}
					sizes="100vw"
					className="object-cover"
				/>
			</div>
			<div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
				<Image
					src="/gradiend.svg"
					alt=""
					quality={100}
					width={1440}
					height={400}
					className="w-full h-[1000px] object-cover lg:h-auto lg:object-fill"
				/>
			</div>

			<div className="container relative z-10 px-4">
				<div className="flex flex-col items-center mb-8 md:mb-10 lg:mb-12">
					<div className="relative w-full max-w-[361px] min-h-[379px] md:h-[379px] lg:w-[356px] lg:h-[384px] mb-8">
						<Image
							src="/icons/ornament_4.svg"
							alt=""
							width={103}
							height={103}
							className="absolute hidden md:block lg:block top-[140px] left-[-30px] md:top-[180px] md:left-[-40px] lg:top-[200px] lg:left-[-55px] z-0 w-[180px] h-[180px] md:w-[180px] md:h-[180px] lg:w-[103px] lg:h-[103px]"
							quality={100}
						/>
						<Image
							src="/images/lily/lily_1.png"
							alt="Woman"
							fill
							className="relative z-10"
							quality={100}
						/>
						<RotateOnView
							className="hidden absolute z-[10] bottom-[-120px] lg:flex left-[25px] w-[298px] h-[272px] lg:w-[298px] lg:h-[272px]"
							duration={17}
							amount={0.4}
							ease="linear"
							repeat={true}
						>
							<Image src="/icons/ornament_14.svg" alt="" fill quality={100} />
						</RotateOnView>

						{/* Ornament badge */}
						<div className="hidden absolute left-1/2 -translate-x-1/2 bottom-[-25px] md:bottom-[-30px] lg:bottom-[-35px] lg:flex items-center justify-center rounded-[300px] overflow-hidden bg-[#EB4F68] before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay w-[74px] h-[102px] md:w-[74px] md:h-[102px] lg:w-[74px] lg:h-[102px] z-10">
							<Image
								src="/leelu_logo.svg"
								alt=""
								width={46}
								height={46}
								className="filter invert"
								quality={100}
							/>
						</div>
					</div>

					<h1 className="text-center font-canela font-light leading-tight mt-4 md:mt-5 lg:mt-6 text-[42px] lowercase md:uppercase lg:uppercase md:text-[36px] lg:text-[60px]">
						<span className="relative italic text-[#C4334F] font-thin text-[48px] lg:text-[60px] capitalize z-[20]">
							Inside
						</span>
						<br />
						YOU&apos;LL DISCOVER
					</h1>
				</div>

				{/* Cards Grid */}
				<div className="max-w-[1216px] mx-auto mb-[67px] md:mb-12 lg:mb-16">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-x-6 lg:gap-y-6">
						{/* Left column */}
						<div className="flex flex-col gap-6">
							<Card
								withMarginTop
								title="The Discharge"
								description={`Why "staying strong" reroutes your grief into your emotional baseline, and the timed release method that lets you metabolize it on your terms.`}
							/>

							<Card
								title="The Signal Fast"
								description={`Every check resets the withdrawal clock to zero. The protocol that starves the dopamine loop and forces neurological stabilization.`}
							/>
						</div>

						{/* Center column */}
						<div className="flex flex-col gap-6">
							<Card
								title="The Squad Audit"
								description={`How to identify who's actually helping you heal versus who's keeping you stuck in the story, and what to do about it.`}
							/>

							<div className="relative flex justify-center">
								<Image
									src="/icons/ornament_14.svg"
									alt=""
									width={320}
									height={292}
									className="w-[325px] md:w-[325px] lg:w-[325px] h-auto"
									quality={100}
								/>
								<div className="absolute top-1/2 left-1/2 -translate-x-[32px] -translate-y-1/2 flex items-center justify-center rounded-[300px] overflow-hidden bg-[#EB4F68] before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay w-[74px] h-[102px] z-10">
									<Image
										src="/leelu_logo.svg"
										alt=""
										width={46}
										height={46}
										className="filter invert"
										quality={100}
									/>
								</div>
							</div>

							<Card
								title="The Pattern Interrupt"
								description={`Why your routine keeps you trapped in the past, and the environmental shifts that force your brain to build new pathways.`}
							/>
						</div>

						{/* Right column */}
						<div className="flex flex-col gap-6">
							<Card
								withMarginTop
								title="The Territory Reclaim"
								description={`A line-by-line inventory of what you sacrificed for him, and the exact plan to take it back.`}
							/>

							<Card
								title="The Rerun Override"
								description={`How to identify the corrupted connection script still running your selections, and rewrite it before it executes again.`}
							/>
						</div>
					</div>
				</div>

				{/* Bottom text and CTA */}
				<div className="text-center max-w-[774px] mx-auto">
					<p className="text-black text-[32px] font-light font-canela mb-[32px] leading-[130%] tracking-normal">
						This guide gives you 6 evidence-based strategies to reclaim your
						nervous system and your life.
					</p>
					<Button
						variant="primary"
						href={SECRETS_LINKS.ACCESS_LINK.href}
						className="w-full mt-[16px] md:w-[45%] md:mt-[66px]"
						trackingData={{
							cta_name: "secrets_discover_access_cta",
							cta_text: SECRETS_LINKS.ACCESS_LINK.label,
							cta_location: "discover",
						}}
					>
						{SECRETS_LINKS.ACCESS_LINK.label}
					</Button>
				</div>
			</div>
		</section>
	);
}
