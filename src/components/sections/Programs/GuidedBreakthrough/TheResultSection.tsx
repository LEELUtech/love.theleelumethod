import Image from "next/image";
import React from "react";

export default function TheResultSection() {
	return (
		<section className="relative overflow-hidden bg-white">
			<div
				className="
					container relative text-center
					pt-[300px] pb-[100px]
					md:pt-[240px] md:pb-[120px]
					lg:pt-[200px] lg:pb-[163px]
				"
			>
				{/* background ornament */}
				<div
					className="
						absolute pointer-events-none z-0
						top-[120px] left-1/2 -translate-x-1/2
						w-[456px] h-[421px]
						md:top-[70px] md:w-[520px] md:h-[480px]
						lg:top-[80px] lg:w-[406px] lg:h-[391px]
						opacity-100 md:opacity-100 lg:opacity-100
					"
				>
					<Image src="/icons/logo_orange.svg" alt="" fill />
				</div>

				{/* top badge */}
				<div className="relative z-10 flex justify-center mb-8 md:mb-10 lg:mb-8">
					<div className="h-[129px] w-[93px] md:h-[140px] md:w-[100px] lg:h-[140px] lg:w-[96px] bg-brand-primary rounded-full flex items-center justify-center">
						<div className="relative w-[56px] h-[56px]">
							<Image
								src="/leelu_logo.svg"
								alt=""
								fill
								className="object-contain filter brightness-0 invert"
							/>
						</div>
					</div>
				</div>

				{/* title */}
				<p className="relative z-10 font-canela font-thin text-brand-deep text-[48px] md:text-[52px] lg:text-[60px] tracking-normal uppercase">
					THE RESULT
				</p>

				<h2
					className="
						relative z-10 mt-4 font-canela font-thin text-brand-deep tracking-normal
						text-[60px] leading-[100%]
						md:text-[84px] md:leading-[0.95]
						lg:text-[112px] lg:leading-[100%]
					"
				>
					Precision.
				</h2>

				{/* description */}
				<p
					className="
						relative z-10 mt-12 font-lato font-normal text-[#5A5757]
						text-[24px] leading-[150%]
						md:mt-10 md:text-[22px]
						lg:mt-12 lg:text-[24px]
						max-w-[808px] mx-auto
					"
				>
					The Protocol gives you the map, but you&apos;re learning a new language. Without a guide, you will second-guess every application. In this session, we remove the trial and error. You walk away with absolute certainty on your next move.
				</p>
			</div>
		</section>
	);
}
