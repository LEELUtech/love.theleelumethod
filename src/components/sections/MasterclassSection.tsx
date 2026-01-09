import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton";

export default function MasterclassSection() {
	return (
		<section className="bg-[#fde7df] py-16 px-4">
			<div className="container mx-auto grid gap-10 md:grid-cols-2 items-center">
				<div className="space-y-4 max-w-md flex flex-col gap-6">
					<p className="text-xl font-medium uppercase tracking-[0.18em] text-[#736864]">
						Free live masterclass
					</p>
					<h2 className="font-playfair text-6xl font-bold text-black">
						Decoded Love
					</h2>
					<p className="leading-relaxed font-medium text-2xl text-[#736864]">
						Discover the 3 secrets to choosing the right partner, creating
						healthy connection, and ending the cycle of disappointment.
					</p>

					<div className="text-sm text-[#2f2f2f] leading-relaxed">
						<p className="font-medium text-lg text-[#736864]">What you'll walk away with:</p>
						<ul className="list-disc pl-5 font-medium text-lg text-[#736864] [&>li]:m-0">
							<li>
								Why you don't attract who you want—you attract who you are on
								the inside.
							</li>
							<li>
								How your subconscious "love script" keeps recreating the same
								breakup in a different body.
							</li>
							<li>
								Why compatibility isn't chemistry—it's math—and how to stop
								wasting years on the wrong men.
							</li>
						</ul>
					</div>

					<WebinarModalButton
						text="Save My Seat"
						showArrow={false}
						className="px-16 w-fit"
					/>
				</div>

				<div className="w-full h-full bg-white rounded-[14px] shadow-[0_14px_36px_rgba(0,0,0,0.08)]" />
			</div>
		</section>
	);
}
