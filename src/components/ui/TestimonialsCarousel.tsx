"use client";

import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/free-mode";

const testimonials = [
	{
		text: "Lily reminded me again how silly it was to worry, it's already written in the stars, and it's our job to unfold with the most wonderful awe & enjoyment & curiosity. Lily brings an incredible combination of analytical left brain & mystical right brain to helping you realize what's most true in your life!",
	},
	{
		text: "Thanks for the session, Lilly. You literally made me understand so many aspects and the reason for the crisis that is happening in my life. I also feel more confident about the next steps I need to take, and your insights have really helped me see things from a different perspective.",
	},
	{
		text: "Hey Lily, just wanted to drop a quick note that your content really helped me break free from a toxic relationship. I've learned so much about setting boundaries and valuing myself. Keep up the amazing work ‚you're truly making a difference!",
	},
	{
		text: "I love this group!!! Thanks to all you amazing women. You are helping me get through this.",
	},
	{
		text: "Ur power is very real lily.",
	},
];

const TestimonialsCarousel = ({ className }: { className?: string }) => {
	return (
		<div className={`w-full ${className}`}>

			<div className="overflow-hidden py-6">

				<div className="flex w-max gap-4 md:gap-6 animate-marquee">

					{[...testimonials, ...testimonials].map((t, i) => (

						<div
							key={i}
							className="
								shrink-0
								rounded-3xl
								bg-brand-white
								shadow-[0_4px_12px_0_rgba(0,0,0,0.08)]
								flex flex-col justify-between

								/* MOBILE */
								w-[280px]
								min-h-[220px]
								p-5

								/* TABLET */
								md:w-[330px]
								md:min-h-[250px]
								md:p-6

								/* DESKTOP (UNCHANGED LOOK) */
								lg:w-[392px]
								lg:h-[282px]
								lg:p-[30px]
							"
						>
							<p
								className="
									font-lato italic text-[#5A5757] font-medium

									/* MOBILE */
									text-[14px]
									leading-[22px]

									/* TABLET */
									md:text-[16px]
									md:leading-[24px]

									/* DESKTOP */
									lg:text-[17px]
									lg:leading-[26px]
								"
							>
								&quot;{t.text}&quot;
							</p>
						</div>

					))}

				</div>

			</div>

		</div>
	);
};

export default TestimonialsCarousel;
