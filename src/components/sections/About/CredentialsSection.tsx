import Image from "next/image";

const CredentialsSection = () => {
	return (
		<section className="relative pt-[112px] pb-[319px]">
			<div className="container">
				<div className="flex items-start gap-[37px] mb-[82px]">
					<Image
						src="/icons/star_with_line.png"
						alt=""
						width={48}
						height={48}
						className="text-[#d4a574]"
					/>
					<h2 className="font-thin text-[60px] leading-[100%] font-canela text-brand-deep">
						Credentials At Glance
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
					{/* Left Column - Credentials List */}
					<div>
						{/* Credentials List */}
						<div className="space-y-16 max-w-[557px] p-6">
							{/* Specialized Training */}
							<div className="flex items-start gap-3">
								<Image
									src="/icons/star.svg"
									alt=""
									width={20}
									height={20}
									className="flex-shrink-0 mt-1"
								/>
								<div>
									<h3 className="font-medium text-body font-lato text-[#8F6E0E] mb-4 italic">
										Specialized Training
									</h3>
									<p className="font-normal text-body text-[#5A5757] font-canela leading-[130%]">
										Graduate of the elite St. Petersburg Personality Profiling Program (Levels 1-8).
									</p>
								</div>
							</div>

							{/* Validated Data */}
							<div className="flex items-start gap-3">
								<Image
									src="/icons/star.svg"
									alt=""
									width={20}
									height={20}
									className="flex-shrink-0 mt-1"
								/>
								<div>
									<h3 className="font-medium text-body font-lato text-[#8F6E0E] mb-4 italic">
										Validated Data
									</h3>
									<p className="font-normal text-body text-[#5A5757] font-canela leading-[130%]">
										Methodology stress-tested on 11,500+ profiles in a commercial HR environment.
									</p>
								</div>
							</div>

							{/* Clinical Oversight */}
							<div className="flex items-start gap-4">
								<Image
									src="/icons/star.svg"
									alt=""
									width={20}
									height={20}
									className="flex-shrink-0 mt-1"
								/>
								<div>
									<h3 className="font-medium text-body font-lato text-[#8F6E0E] mb-4 italic">
										Clinical Oversight
									</h3>
									<p className="font-normal text-body text-[#5A5757] font-canela leading-[130%]">
										Formulas verified by a team of 15 in-house psychologists.
									</p>
								</div>
							</div>

							{/* Human Potential & Mentoring */}
							<div className="flex items-start gap-4">
								<Image
									src="/icons/star.svg"
									alt=""
									width={20}
									height={20}
									className="flex-shrink-0 mt-1"
								/>
								<div>
									<h3 className="font-medium text-body font-lato text-[#8F6E0E] mb-4 italic">
										Human Potential & Mentoring
									</h3>
									<p className="font-normal text-body text-[#5A5757] font-canela leading-[130%]">
										Former Founder of Miss Crimea (2013-2016) and international modeling/etiquette agencies. Mentored young women in confidence and self-awareness across Europe and Asia.
									</p>
								</div>
							</div>

							{/* Awards & Recognition */}
							<div className="flex items-start gap-4">
								<Image
									src="/icons/star.svg"
									alt=""
									width={20}
									height={20}
									className="flex-shrink-0 mt-1"
								/>
								<div>
									<h3 className="font-medium text-body font-lato text-[#8F6E0E] mb-4 italic">
										Awards & Recognition
									</h3>
									<p className="font-normal text-body text-[#5A5757] font-canela leading-[130%]">
										Recipient of the Gold Medal from the Ministry of Culture for contributions to regional cultural development. Featured in Canal+ documentaries on the entertainment industry.
									</p>
								</div>
							</div>

							{/* Global Perspective */}
							<div className="flex items-start gap-4">
								<Image
									src="/icons/star.svg"
									alt=""
									width={20}
									height={20}
									className="flex-shrink-0 mt-1"
								/>
								<div>
									<h3 className="font-medium text-body font-lato text-[#8F6E0E] mb-4 italic">
										Global Perspective
									</h3>
									<p className="font-normal text-body text-[#5A5757] font-canela leading-[130%]">
										Systems synthesized from training in Eastern Europe, Japan, India, China, and Israel.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Image */}
					<div className="flex justify-center">
						<div className="relative w-[595px] h-[913px] ">
							<Image
								src="/images/about/credentials_img.png"
								alt="Credentials"
								fill
								quality={100}
							/>
							{/* Logo Badge */}
								<div className="absolute flex bottom-[-50px] right-[-60px] items-center justify-center bg-[#d8ac9e] rounded-[300px] w-[80px] h-[100px] md:w-[100px] md:h-[126px] lg:w-[123px] lg:h-[155px] z-10">
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
