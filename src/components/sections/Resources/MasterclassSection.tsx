import React from "react";
import Image from "next/image";
import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton";

export function MasterclassSection() {
	const ornamentIcon = (
		<Image
			src="/icons/ornament_1.svg"
			alt=""
			width={24}
			height={24}
		/>
	);

	return (
		<section className="bg-brand-white text-brand-deep pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-[112px] lg:pb-[160px]">
			<div className="container px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-12 lg:gap-16">
				<div className="order-2 md:order-1 w-full md:max-w-[520px]">
					<p className="font-canela font-light text-[32px] leading-[100%] tracking-normal text-black mb-6">
						Free live masterclass
					</p>
					<h2 className="text-h1 font-light font-canela text-black mb-6">
						Decoded Love
					</h2>
					<p className="text-body font-lato font-medium text-[#5A5757] mb-6">
						Discover the 3 secrets to choosing the right partner, creating
						healthy connection, and ending the cycle of disappointment.
					</p>
					<div className="text-body text-brand-deep/80 space-y-2 mb-8">
						<p className="font-lato text-body font-medium leading-[26px] text-[#5A5757] mb-6">
							What you’ll walk away with:
						</p>
						<ul className="space-y-2 list-disc pl-8 font-lato text-body font-medium leading-[26px] text-[#5A5757]">
							<li>
								Why you don&apos;t attract who you want—you attract who you are
								on the inside.
							</li>
							<li>
								How your subconscious &quot;love script&quot; keeps recreating
								the same breakup in a different body.
							</li>
							<li>
								Why compatibility isn&apos;t chemistry—it&apos;s math—and how to
								stop wasting years on the wrong men.
							</li>
						</ul>
					</div>
					<WebinarModalButton
						showArrow={false}
						text="Save My Seat"
						icon={ornamentIcon}
						iconPosition="left"
						className="w-full md:w-auto justify-center gap-3 font-medium text-[18px] leading-[26px] py-4 px-8 md:px-10 lg:px-[85px] bg-brand-primary hover:bg-[#E13954] uppercase"
					/>
				</div>
				<div className="order-1 md:order-2 flex justify-center w-full">
					<div className="relative w-full max-w-[642px] aspect-[642/466]">
						<Image
							src="/images/resources-webinar-section.png"
							alt="Decoded Love Masterclass"
							fill
							priority
							quality={100}
							sizes="(min-width:1024px) 642px, (min-width:768px) 80vw, 90vw"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
