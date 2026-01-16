import ArcAutoOnce from "@/components/ArcFlyOnce"
import Header from "@/components/ui/Header";
import Image from "next/image";

const HeroSection = () => {
	return (
		<section className="relative bg-brand-white pb-[88px]">
			<Header />
			<div className="container flex flex-col lg:flex-row items-center justify-between gap-12 mt-[80px]">
				{/* Text Content */}
				<div className="lg:w-1/2 max-w-[549px]">
					<h1 className="font-canela font-thin text-brand-deep mb-12 leading-[100%] tracking-normal">
						I am Lily Chystofat.
					</h1>
					<p className="font-normal font-marcellus text-[#5A5757] leading-[26px] tracking-[0.03em] mb-6 text-[18px]">
						My understanding of human destiny wasn’t formed in a meditation
						circle. It was forged over seven years in a restricted facility
						where electronics were banned, cameras were confiscated, and guards
						patrolled the aisles.
					</p>
					<p className="font-thin font-canela text-[28px] leading-[130%] tracking-[0.03em] text-brand-deep">
						It was there, cut off from the outside world, that I learned to
						treat human behavior not as a mystery, but as a code that could be
						cracked.
					</p>
				</div>

				{/* Image Content */}
				<div className="lg:w-1/2 relative flex justify-center">
					<div className="relative w-[510px] h-[659px]">
						<Image
							src="/images/about/hero_test.png"
							alt="I am Lily Chystofat"
							fill
							priority
							quality={100}
						/>
						<ArcAutoOnce
							imgW={510}
							imgH={659}
							scale={1.2}
							biasLeft={0.52}
							yUp={0.10}
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
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
