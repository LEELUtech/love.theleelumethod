import ArcAutoOnce from "@/components/ui/ArcFlyOnce";
import Header from "@/components/ui/Header";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
	return (
		<section className="relative bg-brand-white lg:pb-[142px]">
			<Header />
			<div className="container flex flex-col lg:flex-row items-center justify-between lg:gap-12 gap-0 mt-[80px]">
				{/* Text Content */}
				<div className="lg:w-1/2 xs:relative xs:top-[-60px] flex flex-col max-w-[549px] order-2">
					<h1 className="font-canela font-thin text-brand-deep mb-12 leading-[100%] tracking-normal text-[48px] lg:text-[60px] text-center lg:text-left">
						I am Lily Chystofat.
					</h1>
					<p className="font-normal font-marcellus text-[#5A5757] leading-[26px] tracking-[0.03em] mb-6 text-[18px] text-center lg:text-left">
						My understanding of human destiny wasn’t formed in a meditation
						circle. It was forged over seven years in a restricted facility
						where electronics were banned, cameras were confiscated, and guards
						patrolled the aisles.
					</p>
					<p className="font-thin font-canela text-[28px] leading-[130%] tracking-[0.03em] text-brand-deep mb-[32px] order-3 lg:order-1 text-center lg:text-left">
						It was there, cut off from the outside world, that I learned to
						treat human behavior not as a mystery, but as a code that could be
						cracked.
					</p>

					<Link
						className="btn-pill justify-center gap-3 font-medium tracking-[0.1em]
						rounded-[50px] text-center
						text-[15px] leading-[26px] py-4
						px-5
						bg-brand-black text-brand-white hover:bg-[#333333] uppercase order-2 lg:order-2 font-lato lg:max-w-[350px] w-full mx-auto lg:mx-0 mb-[24px] lg:mb-0"
						href="/decode"
					>
						START THE DECODE
					</Link>
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
						<Image
							src="/icons/ornament_6_pink.svg"
							alt=""
							width={209}
							height={215}
							priority
							quality={100}
							className="absolute bottom-[-90px] left-1/2 -translate-x-1/2 hidden lg:block pointer-events-none"
						/>
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
