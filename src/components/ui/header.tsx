import Link from "next/link";

const NAV_LINKS = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/program", label: "Program Page" },
	{ href: "/reports", label: "Reports" },
	{ href: "/freebies", label: "Freebies" },
] as const;

export default function Header() {
	return (
		<header className="p-8">
			<nav className="flex flex-wrap items-center justify-between w-full gap-4">
				<Link
					href="/"
					className="px-4 py-2 border-2 border-blue-500 rounded text-blue-700 font-medium hover:bg-blue-50 hover:underline transition"
				>
					Home
				</Link>
				<div className="flex gap-2">
					{NAV_LINKS.slice(1).map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="px-4 py-2 border-2 border-blue-500 rounded text-blue-700 font-medium hover:bg-blue-50 hover:underline transition"
						>
							{link.label}
						</Link>
					))}
				</div>
			</nav>
		</header>
	);
}
