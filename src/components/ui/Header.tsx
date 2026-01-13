import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
	{ href: "/programs", label: "Programs" },
	{ href: "/resources", label: "Resources" },
	{ href: "/about", label: "About" },
] as const;

export default function Header() {
	return (
		<header className="py-4 md:py-5 lg:py-[21px] px-4 md:px-8 lg:px-[56px] bg-transparent">
			<nav className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full gap-3 md:gap-4">
				<Link
					href="/"
					className="px-2 md:px-3 lg:px-4 font-light transition text-[20px] md:text-[22px] lg:text-[24px] leading-[100%] font-canela flex items-center gap-2 md:gap-2.5 lg:gap-3"
				>
					<span className="inline-block w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 relative flex-shrink-0">
						<Image
							src="/leelu_logo.svg"
							alt="Lily Chystofat Logo"
							fill
							className="object-contain"
							priority
						/>
					</span>
					<div className="whitespace-nowrap">
						<span className="font-medium font-canela tracking-tight mr-1">LILY</span>
						<span className="font-canela font-light">CHYSTOFAT</span>
					</div>
				</Link>
				<div className="flex gap-4 md:gap-6 lg:gap-[33px]">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="font-medium text-[11px] md:text-[13px] lg:text-[15px] leading-[145%] tracking-[1.5px] md:tracking-[2px] text-[#6F4C40] font-lato uppercase"
						>
							{link.label}
						</Link>
					))}
				</div>
			</nav>
		</header>
	);
}
