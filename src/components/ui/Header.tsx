"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
	{ href: "/programs", label: "Programs" },
	{ href: "/resources", label: "Resources" },
	{ href: "/about", label: "About" },
] as const;

export default function Header() {
	const [open, setOpen] = useState(false);

	// ESC + lock scroll while menu open
	useEffect(() => {
		if (!open) return;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};

		document.addEventListener("keydown", onKeyDown);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = "";
		};
	}, [open]);

	// optional: close on route click already handled by onClick

	return (
		<header className="relative py-4 md:py-5 lg:py-[21px] px-4 md:px-8 lg:px-[56px] bg-transparent z-50">
			<nav className="flex items-center justify-between md:justify-between lg:justify-between w-full">
				{/* Logo */}
				<Link
					href="/"
					className="px-2 md:px-3 lg:px-4 font-light transition text-[20px] md:text-[22px] lg:text-[24px] leading-[100%] font-canela flex items-center gap-2 md:gap-2.5 lg:gap-3"
					onClick={() => setOpen(false)}
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
						<span className="font-medium font-canela tracking-tight mr-1">
							LILY
						</span>
						<span className="font-canela font-light">CHYSTOFAT</span>
					</div>
				</Link>

				{/* Desktop menu (ONLY on lg+) */}
				<div className="hidden lg:flex gap-4 md:gap-6 lg:gap-[33px]">
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

				{/* Burger button (mobile + tablet, hidden on lg+) */}
				<button
					className="lg:hidden w-10 h-10 flex items-center justify-center relative z-[70]"
					onClick={() => setOpen((v) => !v)}
					aria-label="Toggle menu"
					aria-expanded={open}
					type="button"
				>
					{/* fixed-size box so burger & X always align perfectly */}
					<div className="relative w-6 h-6">
						{/* Top */}
						<span
							className={[
								"absolute left-0 top-[5px] w-6 h-[2px] bg-[#6F4C40] origin-center transition-transform duration-200",
								open ? "translate-y-[7px] rotate-45" : "translate-y-0 rotate-0",
							].join(" ")}
						/>
						{/* Middle */}
						<span
							className={[
								"absolute left-0 top-[12px] w-6 h-[2px] bg-[#6F4C40] transition-opacity duration-200",
								open ? "opacity-0" : "opacity-100",
							].join(" ")}
						/>
						{/* Bottom */}
						<span
							className={[
								"absolute left-0 top-[19px] w-6 h-[2px] bg-[#6F4C40] origin-center transition-transform duration-200",
								open
									? "-translate-y-[7px] -rotate-45"
									: "translate-y-0 rotate-0",
							].join(" ")}
						/>
					</div>
				</button>
			</nav>

			{/* Mobile/Tablet overlay menu */}
			<AnimatePresence>
				{open && (
					<motion.div
						className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-10"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.18 }}
					>
						{/* optional: subtle background scale-in without changing visuals */}
						<motion.div
							className="absolute inset-0"
							initial={{ scale: 0.98 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0.98 }}
							transition={{ duration: 0.18, ease: "easeOut" }}
						/>

						<div className="relative z-10 flex flex-col items-center justify-center gap-10">
							{NAV_LINKS.map((link, idx) => (
								<motion.div
									key={link.href}
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 12 }}
									transition={{
										duration: 0.22,
										ease: "easeOut",
										delay: 0.05 + idx * 0.06,
									}}
								>
									<Link
										href={link.href}
										onClick={() => setOpen(false)}
										className="text-[28px] font-canela text-[#6F4C40]"
									>
										{link.label}
									</Link>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
