import Link from "next/link";

function InstagramIcon() {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="hover:opacity-70 transition-opacity">
			<rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
			<circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
			<circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
		</svg>
	);
}

function XIcon() {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="hover:opacity-70 transition-opacity">
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
		</svg>
	);
}

export default function Footer() {
	return (
		<footer className="bg-white border-t border-gray-100 py-16 px-8">
			<div className="container mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
					{/* Brand Section */}
					<div className="lg:col-span-2">
						<h3 className="text-xl font-semibold text-black mb-2">Lily Chystofat</h3>
						<p className="text-sm text-gray-600 max-w-md leading-relaxed">
							Descriptive line about what your company does. Tagline.
						</p>
						<div className="flex items-center gap-4 pt-[56px]">
							<Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-700">
								<InstagramIcon />
							</Link>
							<Link href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-700">
								<XIcon />
							</Link>
						</div>
					</div>

					{/* Offers */}
					<div>
						<h4 className="text-base font-semibold text-black mb-6">Offers</h4>
						<ul className="space-y-1.5">
							<li>
								<Link href="/programs" className="text-sm text-gray-600 hover:text-black transition-colors">
									Programs
								</Link>
							</li>
							<li>
								<Link href="/freebies" className="text-sm text-gray-600 hover:text-black transition-colors">
									Freebies
								</Link>
							</li>
							<li>
								<Link href="/community" className="text-sm text-gray-600 hover:text-black transition-colors">
									Community
								</Link>
							</li>
							<li>
								<Link href="/1-on-1" className="text-sm text-gray-600 hover:text-black transition-colors">
									1-on-1
								</Link>
							</li>
						</ul>
					</div>

					{/* Learn more */}
					<div>
						<h4 className="text-base font-semibold text-black mb-6">Learn more</h4>
						<ul className="space-y-1.5">
							<li>
								<Link href="/about" className="text-sm text-gray-600 hover:text-black transition-colors">
									About
								</Link>
							</li>
							<li>
								<Link href="/leelu" className="text-sm text-gray-600 hover:text-black transition-colors">
									Leelu
								</Link>
							</li>
							<li>
								<Link href="/transformations" className="text-sm text-gray-600 hover:text-black transition-colors">
									Client stories/<br />Transformations
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h4 className="text-base font-semibold text-black mb-6">Support</h4>
						<ul className="space-y-1.5">
							<li>
								<Link href="/contact" className="text-sm text-gray-600 hover:text-black transition-colors">
									Contact
								</Link>
							</li>
							<li>
								<Link href="/legal" className="text-sm text-gray-600 hover:text-black transition-colors">
									Legal
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
}
