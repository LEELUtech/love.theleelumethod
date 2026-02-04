import FixSection from "@/components/sections/QuizResult/FixSection";
import HeroSection from "@/components/sections/QuizResult/HeroSection";
import ProfileGlitchSection from "@/components/sections/QuizResult/ProfileGlitchSection";
import React from "react";

const QuizResultPage = () => {
	return (
		<main>
			<HeroSection />
			<ProfileGlitchSection />
			<FixSection />
		</main>
	);
};

export default QuizResultPage;
