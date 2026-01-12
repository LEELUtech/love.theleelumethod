import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
	{ href: "/about", label: "About" },
	{ href: "/programs", label: "Programs" },
	{ href: "/resources", label: "Resources" },
] as const;

export default function Header() {
	return (
		<header className="py-[21px] px-[56px] bg-transparent">
			<nav className="flex flex-wrap items-center justify-between w-full gap-4">
				<Link
					href="/"
					className="px-4 font-light transition text-[24px] leading-[100%] font-canela flex items-center gap-3"
				>
					<span className="inline-block w-8 h-8 relative">
						<Image
							src="/leelu_logo.svg"
							alt="Lily Chystofat Logo"
							fill
							className="object-contain"
							priority
						/>
					</span>
					<div>
						<span className="font-medium font-canela tracking-tight mr-1">LILY</span>
						<span className="font-canela font-light text-2xl">CHYSTOFAT</span>
					</div>
				</Link>
				<div className="flex gap-[33px]">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="font-medium text-[15px] leading-[145%] tracking-[2px] text-[#6F4C40] font-lato uppercase"
						>
							{link.label}
						</Link>
					))}
				</div>
			</nav>
		</header>
	);
}
