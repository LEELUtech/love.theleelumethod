"use client";

import PillButton from "@/components/ui/buttons/PillButton";
import { QUIZ_URL } from "@/utils/constants"
import React from "react";

interface FreeQuizButtonProps {
	text?: string;
	className?: string;
}

export default function FreeQuizButton({ text = "Free Quiz", className }: FreeQuizButtonProps) {
	return (
		<PillButton
			href={QUIZ_URL}
			rel="noopener noreferrer"
			className={className}
		>
			<span>{text}</span>
		</PillButton>
	);
}
