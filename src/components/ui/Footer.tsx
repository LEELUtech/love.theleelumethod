import Image from "next/image";
import Link from "next/link";

function InstagramIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			className="hover:opacity-70 transition-opacity text-[#8c8c8c]"
		>
			<rect
				x="2"
				y="2"
				width="20"
				height="20"
				rx="5"
				stroke="currentColor"
				strokeWidth="1.5"
				fill="none"
			/>
			<circle
				cx="12"
				cy="12"
				r="4"
				stroke="currentColor"
				strokeWidth="1.5"
				fill="none"
			/>
			<circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
		</svg>
	);
}

function XIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			className="hover:opacity-70 transition-opacity text-[#8c8c8c]"
		>
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

export default function Footer() {
	return (
		<footer className="bg-white py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8">
			<div className="container mx-auto">
				<span className="inline-block w-[57px] h-[57px] md:w-12 md:h-12 relative mb-[12px] lg:mb-[12px]">
					<Image
						src="/leelu_logo.svg"
						alt="Lily Chystofat Logo"
						fill
						className="object-contain"
						priority
					/>
				</span>
				<div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-10 lg:gap-0">
					<div className="order-2 lg:order-2">
						<div className="grid grid-cols-2 gap-x-14 gap-y-12 sm:flex sm:flex-row sm:gap-12 md:gap-16 lg:gap-[68px]">
							{/* Offers */}
							<div className="min-w-[130px]">
								<h4 className="text-[32px] md:text-[32px] font-canela font-thin text-black mb-4 md:mb-6 leading-[130%]">
									Offers
								</h4>
								<ul className="space-y-2">
									<li>
										<Link
											href="/programs"
											className="text-[11px] font-lato font-medium leading-6 tracking-widest text-black uppercase"
										>
											Programs
										</Link>
									</li>
									<li>
										<Link
											href="/freebies"
											className="text-[11px] font-lato font-medium leading-6 tracking-widest text-black uppercase"
										>
											Freebies
										</Link>
									</li>
									<li>
										<Link
											href="/community"
											className="text-[11px] font-lato font-medium leading-6 tracking-widest text-black uppercase"
										>
											Community
										</Link>
									</li>
									<li>
										<Link
											href="/1-on-1"
											className="text-[11px] font-lato font-medium leading-6 tracking-widest text-black uppercase"
										>
											1-on-1
										</Link>
									</li>
								</ul>
							</div>

							{/* Learn more */}
							<div className="min-w-[130px]">
								<h4 className="text-[32px] md:text-[32px] font-canela font-thin text-black mb-4 md:mb-6 leading-[130%]">
									Learn more
								</h4>
								<ul className="space-y-2">
									<li>
										<Link
											href="/about"
											className="text-[11px] font-lato font-medium leading-6 tracking-widest text-black uppercase"
										>
											About
										</Link>
									</li>
									<li>
										<Link
											href="/leelu"
											className="text-[11px] font-lato font-medium leading-6 tracking-widest text-black uppercase"
										>
											Leelu
										</Link>
									</li>
									<li>
										<Link
											href="/transformations"
											className="text-[11px] font-lato font-medium leading-6 tracking-widest text-black uppercase"
										>
											Client stories
										</Link>
									</li>
								</ul>
							</div>

							<div className="min-w-[130px] col-span-2 sm:col-span-1">
								<h4 className="text-[32px] md:text-[32px] font-canela font-thin text-black mb-4 md:mb-6 leading-[130%]">
									Support
								</h4>
								<ul className="space-y-2">
									<li>
										<Link
											href="/contact"
											className="text-[11px] font-lato font-medium leading-6 tracking-widest text-black uppercase"
										>
											Contact
										</Link>
									</li>
									<li>
										<Link
											href="/legal"
											className="text-[11px] font-lato font-medium leading-6 tracking-widest text-black uppercase"
										>
											Legal
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="order-1 lg:order-1">
						<div className=" text-[32px] md:text-[32px] leading-[130%]">
							<span className="font-medium font-canela tracking-tight mr-1">
								LILY
							</span>
							<span className="font-canela font-light">CHYSTOFAT</span>
						</div>

						<p className="mt-2 text-gray-600 font-medium font-lato leading-6 text-[11px] uppercase max-w-xs">
							Descriptive line about what your company does. Tagline.
						</p>

						<div className="flex items-center gap-4 mt-8 lg:mt-[56px]">
							<Link
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-700"
							>
								<InstagramIcon />
							</Link>
							<Link
								href="https://x.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-700"
							>
								<XIcon />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
