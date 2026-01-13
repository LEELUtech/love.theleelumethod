import Header from "@/components/ui/Header";
import Image from "next/image";

export default function SecretsHeroSection() {
	return (
		<section
			className="relative bg-cover bg-center bg-no-repeat"
			style={{ backgroundImage: "url(/images/sand-bg.jpg)" }}
		>
			<Header />
			<div className="container pt-8 pb-16 md:pt-12 md:pb-20 lg:pt-16 lg:pb-[112px]">
				<div className="relative flex flex-col items-center justify-center w-full text-center gap-4 md:gap-5 lg:gap-6">
					<div className="relative flex flex-col items-center gap-3 md:gap-4 mt-4 md:mt-5 lg:mt-6">
						<div className="relative">
							<Image
								src="/icons/decorative_arc.svg"
								alt=""
								width={558}
								height={197}
								className="max-w-none absolute left-[-55px] top-[-30px] md:left-[-95px] md:top-[-42px] lg:left-[-135px] lg:top-[-55px] z-10 w-[280px] md:w-[400px] lg:w-[558px]"
							/>
							<div className="relative w-[180px] h-[200px] md:w-[220px] md:h-[240px] lg:w-[288px] lg:h-[290px]">
								<Image
									src="/images/resources-section-1.png"
									alt="Woman smiling in a red sweater"
									fill
									priority
									quality={100}
								/>
								{/* Ornament overlaps the top image */}
								<div className="absolute left-1/2 -translate-x-1/2 bottom-[-25px] md:bottom-[-30px] lg:bottom-[-35px] flex items-center justify-center bg-[#C4334F] rounded-[28px] md:rounded-[32px] lg:rounded-[36px] w-[56px] h-[80px] md:w-[65px] md:h-[90px] lg:w-[74px] lg:h-[102px] z-10">
									<Image
										src="/leelu_logo.svg"
										alt=""
										width={46}
										height={46}
										className="filter invert"
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-6">
						<h1 className="font-canela font-light leading-[100%] text-black">
							<span className="text-[#BD2E45] italic mr-2">7 Secrets</span> to
							Mend a Broken Heart
						</h1>
						<p className="text-base mt-3 md:text-lg text-[#5A5757] font-lato font-medium leading-[26px]">
							This guide gives you 7 evidence-based strategies to reclaim your
							nervous system and your life.
						</p>
					</div>
					<form className="w-full max-w-[340px] md:max-w-[360px] lg:max-w-[384px] px-4 md:px-0">
						<input
							type="text"
							name="firstName"
							placeholder="First Name"
							className="w-full rounded-md border border-[#E3D6CF] bg-white px-4 py-3 text-base text-[#1A0F0A] placeholder:text-[#5A5757] placeholder:text-lg outline-none"
						/>
						<input
							type="email"
							name="email"
							placeholder="Email Address"
							className="w-full mt-4 rounded-md border border-[#E3D6CF] bg-white px-4 py-3 text-base text-[#1A0F0A] placeholder:text-[#5A5757] placeholder:text-lg outline-none"
						/>
						<button
							type="button"
							className="w-full mt-6 rounded-full bg-brand-primary text-white font-medium font-lato text-[15px] tracking-[0.08em] uppercase py-4 hover:bg-[#E13954] transition-colors"
						>
							Download the free guide
						</button>
					</form>
				</div>
			</div>
		</section>
	);
}
