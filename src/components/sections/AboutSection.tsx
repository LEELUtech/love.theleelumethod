import DecorativeArc from "@/components/ui/DecorativeArc";

export default function AboutSection() {
	return (
		<section className="bg-[#ffe6de] px-8 pt-[55px] pb-[210px]">
			<div className="container mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left - Decorative Arc */}
					<DecorativeArc />

					{/* Right - Content */}
					<div className="space-y-6">
						<h2 className="font-playfair text-5xl font-normal leading-tight">
							I don't guess.{" "}
							<span className="font-medium">I calculate.</span>
						</h2>

						<div className="space-y-4 font-playfair text-5xl md:text-lg text-[#736864] leading-relaxed">
							<p>
								<span className="font-medium">I am Lily Chystofat.</span> I didn't learn about relationships from a magazine. I learned to decode human behavior in high-stakes environments—running elite HR firms and navigating geopolitical crises where "reading people" was a matter of survival.
							</p>

							<p>
								But I have also been the woman wondering why he didn't call. The woman paralyzed by betrayal.
							</p>

							<p>
								I realized that love follows a pattern. Heartbreak follows a pattern. And if it's a pattern, it can be hacked.
							</p>

							<p>
								I built LeeluTech to give women the one thing they are missing: intelligence.
							</p>

							<p>
								I have helped 968XX+ women stop improvising their love lives and start engineering them.
							</p>

							<p className="font-medium">Are you next?</p>
						</div>

						<button className="bg-black text-white px-8 py-3 rounded-full font-figtree text-sm md:text-base font-medium hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl uppercase tracking-wide">
							YES, I'M IN - ABOUT
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
