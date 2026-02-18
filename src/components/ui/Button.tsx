"use client";

import * as React from "react";
import Link from "next/link";
import { trackCTA } from "@/lib/tracking/trackCTA";

type ButtonVariant = "primary" | "dark";
type ButtonSize = "md" | "lg";

type CommonProps = {
	children: React.ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
	fullWidth?: boolean;

	// left icon in circle (as in design)
	leftIcon?: React.ReactNode;
	leftIconBg?: string; // e.g. "bg-white/10" if needed

	disabled?: boolean;
	loading?: boolean;
	className?: string;
	
	// Optional tracking data for analytics
	trackingData?: {
  cta_name: string;
  cta_text?: string | null;
  cta_target_url?: string | null;
  cta_location?: string | null;
};
};

type ButtonAsButton = CommonProps &
	React.ButtonHTMLAttributes<HTMLButtonElement> & {
		href?: never;
	};

type ButtonAsLink = CommonProps &
	Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
		href: string;
	};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function cx(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(" ");
}

const base =
	"inline-flex items-center justify-center rounded-full font-lato font-medium uppercase tracking-[0.10em] transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const sizes: Record<ButtonSize, string> = {
	md: "text-[13px] md:text-[14px] leading-[26px] px-8 py-3",
	lg: "text-[13px] md:text-[15px] leading-[26px] px-10 py-3",
};

const variants: Record<ButtonVariant, { base: string; hover: string }> = {
	primary: {
		base: "bg-brand-primary text-white",
		hover: "hover:bg-[#E13954]",
	},
	dark: {
		base: "bg-brand-black text-white",
		hover: "hover:bg-neutral-800",
	},
};

function Spinner() {
	return (
		<span
			aria-hidden
			className="inline-block size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
		/>
	);
}

export default function Button(props: ButtonProps) {
	const {
		children,
		variant = "primary",
		size = "lg",
		fullWidth,
		leftIcon,
		leftIconBg = "bg-white/10",
		disabled,
		loading,
		className,
		trackingData,
		onClick,
		...rest
	} = props as ButtonProps;

	const handleClick = (
		e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>,
	) => {
		if (trackingData) {
			void trackCTA(trackingData);
		}

		// Call original onClick if provided
		if (onClick && typeof onClick === "function") {
			// @ts-expect-error - onClick accepts either button or anchor events
			onClick(e);
		}
	};

	const content = (
		<>
			{leftIcon ? (
				<span
					className={cx(
						"mr-3 inline-flex shrink-0 items-center justify-center rounded-full",
						leftIconBg,
					)}
				>
					<span className="relative inline-flex items-center justify-center">
						{leftIcon}
					</span>
				</span>
			) : null}

			<span className={cx(loading ? "opacity-0" : "")}>{children}</span>

			{loading ? (
				<span className="absolute inline-flex items-center justify-center">
					<Spinner />
				</span>
			) : null}
		</>
	);

	const cls = cx(
		"relative",
		base,
		sizes[size],
		variants[variant].base,
		variants[variant].hover,
		fullWidth && "w-full",
		!!leftIcon && "pl-8 pr-8", // makes room for icon circle nicely
		className,
	);

	// Link mode
	if ("href" in props) {
		const { href, ...aProps } = rest as Omit<ButtonAsLink, keyof CommonProps>;
		return (
			<Link
				href={href}
				aria-disabled={disabled || loading}
				className={cx(cls, (disabled || loading) && "pointer-events-none")}
				onClick={handleClick}
				{...aProps}
			>
				{content}
			</Link>
		);
	}

	// Button mode
	const btnProps = rest as Omit<ButtonAsButton, keyof CommonProps>;
	return (
		<button
			type="button"
			disabled={disabled || loading}
			className={cls}
			onClick={handleClick}
			{...btnProps}
		>
			{content}
		</button>
	);
}
