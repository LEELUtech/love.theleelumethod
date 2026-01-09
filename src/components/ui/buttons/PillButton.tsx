"use client";

import React from "react";
import clsx from "clsx";

type PillButtonBaseProps = {
	showArrow?: boolean;
	className?: string;
	children: React.ReactNode;
};

type PillButtonAnchorProps = {
	href: string;
	type?: never;
} & PillButtonBaseProps &
	React.AnchorHTMLAttributes<HTMLAnchorElement>;

type PillButtonButtonProps = {
	href?: undefined;
	type?: "button" | "submit" | "reset";
} & PillButtonBaseProps &
	React.ButtonHTMLAttributes<HTMLButtonElement>;

type PillButtonProps = PillButtonAnchorProps | PillButtonButtonProps;

export default function PillButton(props: PillButtonProps) {

	const classes = clsx("btn-pill", props.className);

	// Render anchor if href is provided
	if ("href" in props && props.href !== undefined) {
		const { children, showArrow = true, className, ...anchorProps } = props;
		return (
			<a className={classes} {...anchorProps}>
				{children}
				{showArrow && (
					<span aria-hidden className="btn-pill__icon">
						&rarr;
					</span>
				)}
			</a>
		);
	}

	const { children, showArrow = true, type, className, ...buttonProps } = props;
	const resolvedType = type ?? "button";
	return (
		<button className={classes} type={resolvedType} {...buttonProps}>
			{children}
			{showArrow && (
				<span aria-hidden className="btn-pill__icon">
					&rarr;
				</span>
			)}
		</button>
	);
}
