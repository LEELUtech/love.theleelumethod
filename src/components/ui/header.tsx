import Link from "next/link";

const NAV_LINKS = [
	{ href: "/about", label: "About" },
	{ href: "/program", label: "Programs" },
	{ href: "/reports", label: "Resources" },
] as const;

export default function Header() {
	return (
		<header className="p-8 bg-[#ffe6de]">
			<div className="container">
				<nav className="flex flex-wrap items-center justify-between w-full gap-4">
					<Link
						href="/"
						className="px-4 py-2 font-extralight transition text-[22px] leading-[73px] font-canela"
					>
						<span className="font-medium">LILY</span> CHYSTOFAT
					</Link>
					<div className="flex gap-[33px]">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="py-2 font-medium text-[16px] leading-[150%] tracking-[-0.5%]"
							>
								{link.label}
							</Link>
						))}
					</div>
				</nav>
			</div>
		</header>
	);
}
