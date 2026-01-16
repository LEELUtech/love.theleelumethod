import React from "react";
import Image from "next/image";
import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton";

const WebinarWhatIfSection = () => {
	return (
		<section
			className="
				relative

				/* MOBILE */
				py-16

				/* TABLET */
				md:py-24

				/* DESKTOP (unchanged) */
				lg:py-[111px] lg:h-[1500px]
			"
		>
			{/* Background */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<Image
					src="/images/bg/whatif-bg.jpg"
					alt=""
					fill
					priority
					className="object-cover"
				/>
			</div>

			<div className="container px-4 mx-auto">
				<div className="max-w-[1200px] mx-auto">
					{/* TOP SECTION */}
					<div
						className="
							flex flex-col items-center gap-8 mb-12

							md:flex-row md:gap-12 md:mb-20
						"
					>
						{/* Image */}
						<div
							className="
							relative flex justify-center

							/* MOBILE */
							w-full max-w-[280px] aspect-[5/7]

							/* TABLET */
							md:max-w-[380px]

							/* DESKTOP */
							lg:max-w-none
							lg:w-[500px] lg:h-[700px]
							lg:aspect-auto
						"
						>
							<Image src="/images/whatif-section.png" alt="" fill />
						</div>

						{/* Text */}
						<div className="w-full md:w-1/2">
							<h2
								className="
									font-canela font-thin text-brand-deep tracking-normal

									/* MOBILE */
									text-[32px] leading-[110%] mb-6

									/* TABLET */
									md:text-[44px] md:mb-8 md:text-left

									/* DESKTOP */
									lg:text-[60px] lg:leading-[100%] lg:mb-[50px]
								"
							>
								What if the women who have the love you want... AREN&apos;T
								lucky or special?
							</h2>

							<div
								className="font-lato font-medium text-[#5A5757]

									/* MOBILE */
									text-[14px] leading-[22px]

									/* TABLET */
									md:text-[16px] md:leading-[26px] md:text-left
								"
							>
								<p>
									Women who have the love you want aren&apos;t luckier, more
									confident, or more charming than you.
								</p>

								<p className="mt-4 md:mt-5">
									They simply stopped guessing. They learned to read the
									internal codes driving their relationships instead of fighting
									them. In this training, I don&apos;t teach you how to
									&apos;act&apos;. I show you how to read the data.
								</p>

								<p
									className="
										font-canela font-thin text-brand-deep tracking-normal mt-8

										/* MOBILE */
										text-[20px] leading-[110%]

										/* TABLET */
										md:text-[26px]

										/* DESKTOP */
										lg:text-[32px] lg:leading-[100%]
									"
								>
									Because once you understand the architecture of your own love
									script, you stop repeating the pattern—and start rewriting it.
								</p>
							</div>
						</div>
					</div>

					{/* WHITE BOX */}
					<div
						className="
							bg-white rounded-[32px] shadow-[0_4px_12px_0_#00000014] z-10

							/* MOBILE */
							relative p-6 mt-8

							/* TABLET */
							md:p-10 md:mt-16

							/* DESKTOP (unchanged) */
							lg:absolute lg:p-[80px] lg:h-[877px] w-full lg:max-w-[1224px] lg:mx-auto lg:bottom-[-300px] lg:left-1/2 lg:-translate-x-1/2
						"
					>
						<h3
							className="
								font-canela font-thin text-center text-brand-deep

								/* MOBILE */
								text-[28px] mb-8 leading-[110%]

								/* TABLET */
								md:text-[40px] md:mb-12

								/* DESKTOP */
								lg:text-[60px] lg:leading-[100%] lg:mb-[64px]
							"
						>
							By the end of this free training, you will:
						</h3>

						<div className="mb-[58px] max-w-[845px] mx-auto">
							{[
								{
									parts: [
										{ text: "Break the emotional", bold: true },
										{
											text: " loops that cause anxiety, fear, and self-sabotage.",
										},
									],
								},
								{
									parts: [
										{ text: "Decode your love script", bold: true },
										{
											text: " so you stop repeating the same painful patterns.",
										},
									],
								},
								{
									parts: [
										{
											text: 'Identify the "Compatibility Code" required for true partnership—so you can vet for ',
										},
										{
											text: "long-term fit instead of just short-term chemistry.",
											bold: true,
										},
									],
								},
								{
									parts: [
										{ text: "Shift into an identity that " },
										{ text: "naturally", bold: true },
										{
											text: " attracts healthy, grounded, emotionally available men.",
										},
									],
								},
								{
									parts: [
										{
											text: "Create lasting, meaningful connection from clarity, ensuring your next relationship is built on a foundation of ",
										},
										{ text: "deep intimacy and enduring love.", bold: true },
									],
								},
							].map((item, i) => (
								<div
									key={i}
									className={`flex gap-4 lg:gap-6 items-center ${
										i !== 0 ? "mt-6 lg:mt-8" : ""
									}`}
								>
									<div className="font-canela font-light text-[22px] lg:text-[32px] flex-shrink-0">
										{i + 1}.
									</div>

									<p
										className="
					font-lato font-medium text-[#5A5757]

					/* MOBILE */
					text-[14px] leading-[22px]

					/* TABLET */
					md:text-[16px]

					/* DESKTOP */
					lg:text-[20px] lg:leading-[26px]
				"
									>
										{item.parts.map((part, idx) =>
											part.bold ? (
												<span key={idx} className="font-bold">
													{part.text}
												</span>
											) : (
												<span key={idx}>{part.text}</span>
											)
										)}
									</p>
								</div>
							))}
						</div>

						<div className="flex justify-center">
							<WebinarModalButton
								showArrow={false}
								text="REGISTER NOW"
								className="
									w-full md:w-auto justify-center gap-3 font-medium tracking-[0.1em]
									text-[15px] leading-[26px] py-4 px-10 md:px-16
									bg-brand-primary hover:bg-[#E13954] uppercase rounded-full

									/* DESKTOP */
									lg:px-[106px]
								"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default WebinarWhatIfSection;
