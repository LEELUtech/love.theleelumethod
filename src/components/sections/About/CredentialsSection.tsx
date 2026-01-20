import Image from "next/image";

const CredentialsSection = () => {
	return (
		<section className="relative pt-[80px] lg:pt-[112px] pb-[250px] lg:pb-[319px]">
			<div className="container">

				{/* === MOBILE + TABLET IMAGE (TOP) === */}
				<div className="flex justify-center mb-[128px] lg:hidden">
					<div className="relative 
						w-[361px] h-[550px] md:w-[461px] md:h-[700px]
					">
						<Image
							src="/images/about/credentials_img.png"
							alt="Credentials"
							fill
							quality={100}
						/>

						{/* Logo Badge */}
						<div className="absolute 
							bottom-[-35px] right-[-10px]
							flex items-center justify-center 
							bg-[#d8ac9e] rounded-[300px]
							w-[100px] h-[130px]
							md:w-[90px] md:h-[115px]
							z-10
						">
							<Image
								src="/leelu_logo.svg"
								alt=""
								width={65}
								height={65}
								className="filter brightness-0 invert"
							/>
						</div>
					</div>
				</div>

				{/* === TITLE === */}
				<div className="flex items-start gap-[24px] lg:gap-[37px] mb-[60px] lg:mb-[82px] justify-center lg:justify-start">
					<Image
						src="/icons/star_with_line.png"
						alt=""
						width={48}
						height={48}
					/>
					<h2 className="font-thin text-[48px] lg:text-[60px] leading-[100%] font-canela text-brand-deep text-center lg:text-left">
						Credentials At Glance
					</h2>
				</div>

				{/* === DESKTOP GRID === */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

					{/* LEFT: TEXT */}
					<div>
						<div className="space-y-12 max-w-[557px] mx-auto lg:mx-0">

							{[
								{
									title: "Specialized Training",
									text: "Graduate of the elite St. Petersburg Personality Profiling Program (Levels 1-8).",
								},
								{
									title: "Validated Data",
									text: "Methodology stress-tested on 11,500+ profiles in a commercial HR environment.",
								},
								{
									title: "Clinical Oversight",
									text: "Formulas verified by a team of 15 in-house psychologists.",
								},
								{
									title: "Human Potential & Mentoring",
									text: "Former Founder of Miss Crimea (2013-2016) and international modeling/etiquette agencies. Mentored young women in confidence and self-awareness across Europe and Asia.",
								},
								{
									title: "Awards & Recognition",
									text: "Recipient of the Gold Medal from the Ministry of Culture for contributions to regional cultural development. Featured in Canal+ documentaries on the entertainment industry.",
								},
								{
									title: "Global Perspective",
									text: "Systems synthesized from training in Eastern Europe, Japan, India, China, and Israel.",
								},
							].map((item, idx) => (
								<div key={idx} className="flex items-start gap-4">
									<Image
										src="/icons/star.svg"
										alt=""
										width={20}
										height={20}
										className="flex-shrink-0 mt-1"
									/>
									<div>
										<h3 className="font-medium text-body font-lato text-[#8F6E0E] mb-3 italic">
											{item.title}
										</h3>
										<p className="font-normal text-body text-[#5A5757] font-canela leading-[130%]">
											{item.text}
										</p>
									</div>
								</div>
							))}

						</div>
					</div>

					{/* RIGHT: IMAGE (DESKTOP ONLY) */}
					<div className="hidden lg:flex">
						<div className="relative w-[795px] h-[850px]">
							<Image
								src="/images/about/credentials_img.png"
								alt="Credentials"
								fill
								quality={100}
							/>

							{/* Logo Badge */}
							<div className="absolute 
								bottom-[-50px] right-[-60px]
								flex items-center justify-center 
								bg-[#d8ac9e] rounded-[300px]
								w-[123px] h-[155px]
								z-10
							">
								<Image
									src="/leelu_logo.svg"
									alt=""
									width={75}
									height={75}
									className="filter brightness-0 invert"
								/>
							</div>
						</div>
					</div>

				</div>
			</div>
		</section>
	);
};

export default CredentialsSection;
