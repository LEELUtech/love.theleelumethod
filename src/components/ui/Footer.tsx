import Image from "next/image";
import Link from "next/link";

function SocialIcon({
	children,
	href,
}: {
	children: React.ReactNode;
	href: string;
}) {
	return (
		<Link
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="
				w-[30px] h-[30px]
				rounded-full
				border border-[#8c8c8c]
				flex items-center justify-center
				text-[#8c8c8c]
				hover:text-[#3f3f3f]
				hover:border-[#383838]
				transition-colors
			"
		>
			{children}
		</Link>
	);
}

function FacebookIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
			<path
				d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v5h3v-5h2.2l.8-3H13V9c0-.6.4-1 1-1z"
				stroke="currentColor"
				strokeWidth="1.5"
				fill="currentColor"
			/>
		</svg>
	);
}

function TikTokIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
			<path d="M12.9 2h2.9c.3 1.5 1.2 2.8 2.6 3.6 1.1.6 2.3.9 3.6.9v2.8c-1.8 0-3.6-.5-5.1-1.4v6.7c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.6-5.8 5.8-6v3c-1.6.2-2.8 1.5-2.8 3s1.3 3 3 3c1.8 0 3-1.4 3-3.4V2z" />
		</svg>
	);
}

function YouTubeIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
			<rect
				x="2"
				y="6"
				width="20"
				height="12"
				rx="3"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<polygon points="10,9 16,12 10,15" fill="currentColor" />
		</svg>
	);
}

function InstagramIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
			<rect
				x="2"
				y="2"
				width="20"
				height="20"
				rx="5"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
			<circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
		</svg>
	);
}

export default function Footer({ className }: { className?: string }) {
	return (
		<footer className={`bg-white py-8 md:py-12 lg:py-16 ${className}`}>
			<div className="container">
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
						<div className="grid grid-cols-2 gap-x-14 gap-y-12 lg:flex lg:flex-row lg:gap-[68px]">
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
											href="/resources"
											className="text-[11px] font-lato font-medium leading-6 tracking-widest text-black uppercase"
										>
											RESOURCES
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
							<div className="min-w-[150px]">
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
											href=""
											className="text-[11px] font-lato font-medium leading-6 tracking-widest text-black uppercase"
										>
											Leelu
										</Link>
									</li>
									<li>
										<Link
											href="/programs#stories"
											className="text-[11px] font-lato font-medium leading-6 tracking-widest text-black uppercase"
										>
											Client stories
										</Link>
									</li>
								</ul>
							</div>

							<div className="min-w-[130px] col-span-2 lg:col-span-1">
								<h4 className="text-[32px] md:text-[32px] font-canela font-thin text-black mb-4 md:mb-6 leading-[130%]">
									Support
								</h4>
								<ul className="space-y-2">
									<li>
										<Link
											href="https://mail.google.com/mail/?view=cm&to=hello@theleelumethod.com"
											target="_blank"
											rel="noopener noreferrer"
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
						<div className=" text-[32px]/[130%] flex gap-1 font-canela text-brand-black-100">
							<span className="font-light">THE</span>
							<span className="font-medium "> LEELU</span>
							<span className="font-light">METHOD</span>
						</div>

						<p className="mt-2 text-gray-600 font-medium font-lato leading-6 text-[11px] uppercase max-w-xs">
							Stop Guessing. Start Calculating.
						</p>

						<div className="flex items-center gap-4 mt-8 lg:mt-[56px]">
							<SocialIcon href="https://instagram.com">
								<InstagramIcon />
							</SocialIcon>

							<SocialIcon href="https://tiktok.com">
								<TikTokIcon />
							</SocialIcon>

							<SocialIcon href="https://facebook.com">
								<FacebookIcon />
							</SocialIcon>

							<SocialIcon href="https://youtube.com">
								<YouTubeIcon />
							</SocialIcon>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
