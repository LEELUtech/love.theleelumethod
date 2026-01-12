import React from "react";

export function MasterclassSection() {
	return (
		<section className="bg-brand-white text-brand-deep py-16 md:py-24">
			<div className="container px-4 grid items-center gap-10 md:grid-cols-2">
				<div className="order-2 md:order-1">
					<p className="text-cta uppercase tracking-[0.08em] text-brand-deep/70 mb-3">
						Free live masterclass
					</p>
					<h2 className="text-h1 font-canela text-brand-deep mb-4">
						Decoded Love
					</h2>
					<p className="text-body text-brand-deep/80 mb-6">
						Discover the 3 secrets to choosing the right partner, creating
						healthy connection, and ending the cycle of disappointment.
					</p>
					<div className="text-body text-brand-deep/80 space-y-2 mb-8">
						<p>
							<span className="text-brand-primary">•</span> Why you don&apos;t
							attract who you want—you attract who you are on the inside.
						</p>
						<p>
							<span className="text-brand-primary">•</span> How your
							subconscious "love script" keeps recreating the same breakup in a
							different body.
						</p>
						<p>
							<span className="text-brand-primary">•</span> Why compatibility
							isn&apos;t chemistry—it&apos;s math—and how to stop wasting years
							on the wrong men.
						</p>
					</div>
					<a
						href="#"
						className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-brand-white text-cta font-semibold uppercase tracking-[0.02em]"
					>
						<span>Save my seat</span>
					</a>
				</div>
				<div className="order-1 md:order-2 flex justify-center">
					<div className="relative max-w-[360px] w-full rounded-full overflow-hidden aspect-[5/4] bg-brand-blush">
						<div className="absolute inset-[12px] rounded-full overflow-hidden border border-brand-blush/30 bg-brand-white">
							<div className="h-full w-full flex">
								<div className="w-1/2 h-full overflow-hidden">
									<img
										src="/images/resources/resource-1.jpg"
										alt="Portrait"
										className="h-full w-full object-cover"
									/>
								</div>
								<div className="w-1/2 h-full overflow-hidden">
									<img
										src="/images/resources/resource-2.jpg"
										alt="Working at desk"
										className="h-full w-full object-cover"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
