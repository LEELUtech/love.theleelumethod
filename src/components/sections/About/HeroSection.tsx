import ArcAutoOnce from "@/components/ui/ArcFlyOnce";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import RotateOnView from "@/components/ui/RotateOnView";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
	return (
		<section className="relative bg-brand-white lg:pb-[142px]">
			<Header />
			<div className="container px-4 flex flex-col lg:flex-row items-center justify-between lg:gap-12 gap-0 mt-[80px]">
				{/* Text Content */}
				<div className="lg:w-1/2 xs:relative xs:top-[-60px] flex flex-col max-w-[549px] order-2">
					<h1 className="font-canela font-thin text-brand-deep mb-12 leading-[100%] tracking-normal text-[48px] lg:text-[60px] text-center lg:text-left">
						I am Lily Chystofat.
					</h1>
					<p className="font-thin font-canela text-[28px] leading-[130%] tracking-[0.03em] text-brand-deep mb-[32px] order-3 lg:order-1 text-center lg:text-left mt-[32px] lg:mt-0">
						I spent seven years running a high-stakes HR firm, profiling over
						15,000 candidates for sensitive roles where one wrong hire could
						become a security liability.
					</p>
					<p className="font-normal font-lato text-[#5A5757] leading-[26px] tracking-[0.03em] mb-6 lg:mb-0 text-[18px] text-center lg:text-left order-1 lg:order-3">
						That work trained me to see human behavior differently. Not as
						chaos, but as code. Across seven countries and thousands of clients,
						that lens evolved into LeeluTech. A method that helps people see
						themselves clearly. Their patterns. Their blind spots. The invisible
						forces shaping their decisions and their lives.
					</p>

					<Button
						variant="dark"
						size="md"
						className="w-full lg:w-[55%] order-2 lg:order-4 lg:mt-[32px]"
						href="#checkout"
					>
						START THE DECODE
					</Button>
				</div>

				{/* Image Content */}
				<div className="lg:w-1/2 relative flex justify-center order-1 lg:order-2">
					<div className="relative lg:w-[500px] lg:h-[549px] w-[330px] h-[350px] lg:pt-0">
						<Image
							src="/images/lily/lily_3.png"
							alt="I am Lily Chystofat"
							fill
							priority
							quality={100}
							className="

							/* MOBILE: fade bottom */
							[mask-image:linear-gradient(to_bottom,black_55%,transparent_75%)]
							[-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent_75%)]

							/* DESKTOP: no mask */
							lg:[mask-image:none]
							lg:[-webkit-mask-image:none]
  "
						/>
						<RotateOnView
							className="absolute bottom-[-80px] left-[140px] hidden lg:block pointer-events-none"
							duration={5}
							ease="easeOut"
						>
							<Image
								src="/icons/ornament_13.svg"
								alt=""
								width={209}
								height={215}
								priority
								quality={100}
								className=""
							/>
						</RotateOnView>
						<ArcAutoOnce
							className="absolute inset-0 -z-0 -translate-y-[13%] pointer-events-none -translate-x-[-7%]"
							// endAt={0.9}
							flightStart={0.2}
							durMs={1500}
							arrowRotateDeg={254}
							arrowScale={0.8}
							arrowCenterX={6.5}
							arrowCenterY={-6}
							arrowOffsetY={3}
							endAtByDevice={{ mobile: 0.87, desktop: 0.95 }}
							arcEnd={{ x: -60, y: 219 }}
							arcRx={260}
							arcRy={260}
							strokeWidth={2}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
