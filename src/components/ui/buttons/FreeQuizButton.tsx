"use client";

import { QUIZ_URL } from "@/utils/constants"
import React from "react";

interface FreeQuizButtonProps {
	text?: string;
}

export default function FreeQuizButton({ text = "Free Quiz" }: FreeQuizButtonProps) {
	return (
		<a
			href={QUIZ_URL}
			rel="noopener noreferrer"
			className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-12 rounded-full text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-center inline-block"
		>
			{text}
		</a>
	);
}
