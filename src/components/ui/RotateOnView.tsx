"use client";

import React from "react";
import { motion } from "framer-motion";

type RotateOnViewProps = {
	children: React.ReactNode;

	rotateTo?: number; 

	duration?: number; 

	once?: boolean; 

	amount?: number;

	delay?: number; 

	repeat?: boolean; 
	className?: string;
	style?: React.CSSProperties;

	ease?: "linear" | "easeIn" | "easeOut" | "easeInOut";
};

export default function RotateOnView({
	children,
	rotateTo = 360,
	duration = 17,
	once = true,
	amount = 0.4,
	delay = 0,
	repeat = false,
	className = "",

	style,
	ease = "linear",
}: RotateOnViewProps) {
	return (
		<motion.div
			className={className}
			initial={{ rotate: 0 }}
			whileInView={{ rotate: rotateTo }}
			viewport={{ once, amount }}
			transition={{
				duration,
				ease: ease,
				delay,
				...(repeat ? { repeat: Infinity } : null),
			}}
			style={{ transformOrigin: "50% 50%", willChange: "transform", ...style }}
		>
			{children}
		</motion.div>
	);
}
