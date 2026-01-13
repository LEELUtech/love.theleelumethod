"use client";

import PillButton from "@/components/ui/buttons/PillButton";
import { QUIZ_URL } from "@/utils/constants";
import React from "react";

interface FreeQuizButtonProps {
	text?: string;
	className?: string;
	showArrow?: boolean;
}

export default function FreeQuizButton({
	text = "Free Quiz",
	className,
	showArrow,
}: FreeQuizButtonProps) {
	return (
		<PillButton
			href={QUIZ_URL}
			rel="noopener noreferrer"
			className={className}
			showArrow={showArrow}
		>
			<span>{text}</span>
		</PillButton>
	);
}
