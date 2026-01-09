"use client";
import { useId } from "react";

export default function RelationshipProtocolSection() {
	const gradientId = useId();

	return (
		<section className="relative bg-white overflow-hidden py-24 px-4">
			<div className="container mx-auto text-center relative">
				{/* Arc decoration */}
				<div className="absolute -top-32 left-1/2 -translate-x-1/2 hidden md:block pointer-events-none">
					<svg
						width="450"
						height="260"
						viewBox="0 0 530 230"
						fill="none"
						className="opacity-80"
					>
						<defs>
							<linearGradient
								id={gradientId}
								x1="0"
								y1="0"
								x2="450"
								y2="0"
								gradientUnits="userSpaceOnUse"
							>
								<stop offset="0%" stopColor="#FDC5B7" stopOpacity="0" />
								<stop offset="8%" stopColor="#FDC5B7" stopOpacity="0.3" />
								<stop offset="15%" stopColor="#B69D96" stopOpacity="0.4" />
								<stop offset="40%" stopColor="#B69D96" stopOpacity="1" />
								<stop offset="60%" stopColor="#B69D96" stopOpacity="1" />
								<stop offset="85%" stopColor="#B69D96" stopOpacity="0.2" />
								<stop offset="100%" stopColor="#FDC5B7" stopOpacity="0" />
							</linearGradient>
						</defs>
						<path
							d="M30 210 C140 20 350 50 420 125"
							stroke={`url(#${gradientId})`}
							strokeWidth="5"
							strokeLinecap="round"
						/>
					</svg>
				</div>

				{/* Oval with icon */}
				<div className="relative mx-auto mb-[120px] w-[280px] h-[170px] md:w-[360px] md:h-[210px] overflow-hidden">
					<div className="absolute -bottom-[170px] md:-bottom-[210px] left-0 right-0 w-[280px] h-[340px] md:w-[360px] md:h-[420px] mx-auto rounded-[180px] bg-[#fff5f2] flex items-center justify-center">
					</div>
				</div>

				<h2 className="font-canela text-6xl font-normal leading-tight tracking-[0.08em] text-black mb-8">
					THE RELATIONSHIP
					<br />
					PROTOCOL
				</h2>

				<p className="font-canela text-3xl text-black mb-8 tracking-wide font-normal">
					The Operating Manual for Human Connection
				</p>

				<p className="text-2xl font-normal text-[#736864] mb-12 font-inter">
					For women who feel confused, anxious, or stuck in relationship loops.
				</p>

				<button className="bg-black text-white px-8 py-3 rounded-full font-figtree text-sm md:text-base font-medium hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl tracking-wide">
					Enroll Now
				</button>
			</div>
		</section>
	);
}
