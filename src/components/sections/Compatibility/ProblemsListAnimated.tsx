"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

type Problem = {
	id: string;
	text: string;
	icon?: "red_star";
};

const listVariants: Variants = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.28, delayChildren: 0.1 },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 10 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.45, ease: "easeOut" },
	},
};

function ProblemCard({ text, icon = "red_star" }: { text: string; icon?: "red_star" }) {
	return (
		<div className="rounded-[16px] bg-[#FFF8F8] backdrop-blur-md px-[20px] py-[20px] md:px-[24px] md:py-[24px]">
			<div className="flex flex-row gap-4 items-center">
				{icon === "red_star" && (
					<div className="relative mt-[2px] w-[26px] h-[33px] shrink-0">
						<Image src={"/icons/red_star.svg"} alt="" fill priority quality={100} />
					</div>
				)}
				<p className="font-canela font-normal text-brand-black text-[20px] md:text-[18px] leading-[1.4]">
					{text}
				</p>
			</div>
		</div>
	);
}

export default function ProblemsListAnimated({
	items,
	className = "flex flex-col gap-6 mb-[30px]",
	once = true,
	amount = 0.25,
}: {
	items: readonly Problem[];
	className?: string;
	once?: boolean;
	amount?: number;
}) {
	return (
		<motion.div
			className={className}
			variants={listVariants}
			initial="hidden"
			whileInView="show"
			viewport={{ once, amount }}
		>
			{items.map((item) => (
				<motion.div key={item.id} variants={itemVariants}>
					<ProblemCard text={item.text} icon={item.icon ?? "red_star"} />
				</motion.div>
			))}
		</motion.div>
	);
}
