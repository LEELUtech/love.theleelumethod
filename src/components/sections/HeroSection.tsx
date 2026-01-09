import DecorativeArc from "../ui/DecorativeArc";

export default function HeroSection() {
	return (
		<section className="bg-[#ffe6de] px-8 pt-0 pb-8">
			<div className="container mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left Content */}
					<div className="space-y-8">
						<h1 className="font-canela text-5xl lg:text-6xl leading-[57px] font-light">
							LOVE ISN'T A
							<br />
							MYSTERY.
							<br />
							IT'S A DANCE.
						</h1>

						<div className="font-figtree lg:text-lg text-gray-800 max-w-xl flex flex-col gap-10">
							<p className="font-medium text-lg">
								Every relationship has a rhythm. When you know the steps, it
								flows. When you don't, it's chaos. You are improvising. Guessing
								his next move. Tripping over your own doubts. Mistaking anxiety
								for passion. Whether you're fighting for the lead or standing
								alone on the floor, the truth is the same: you've been dancing
								without knowing the steps.
							</p>

							<p className="font-normal text-base">
								I am Lily Chystofat and I have used my proprietary numerological
								system, LeeluTech, to decode the mechanics of human connection
								across thousands of sessions. I don't channel energy or offer
								platitudes. I reveal the hidden choreography of your own life.
								So you can stop guessing and start moving with clarity.
							</p>
						</div>

						<button className="bg-black text-white px-10 py-4 rounded-full font-figtree text-base font-medium hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl uppercase tracking-wide">
							START THE DECODE
						</button>
					</div>

					<DecorativeArc />
				</div>
			</div>
		</section>
	);
}
