import CheckoutFormSection from "@/components/sections/Compatibility/CheckoutFormSection";
import CoreValueSection from "@/components/sections/Compatibility/CoreValueSection";
import HeroSection from "@/components/sections/Compatibility/HeroSection";
import HeyImLilySection from "@/components/sections/Compatibility/HeyImLilySection";
import ProblemSolutionSection from "@/components/sections/Compatibility/ProblemSolutionSection";
import SalesPageTagger from "@/components/sections/SalesPage/SalesPageTagger"
import Footer from "@/components/ui/Footer"
import React from "react";

const CompatibilityReport = () => {
	return (
		<main>
			<HeroSection />
			<ProblemSolutionSection />
			<CoreValueSection />
			<CheckoutFormSection />
			<HeyImLilySection />
			<Footer />
			<SalesPageTagger/>
		</main>
	);
};

export default CompatibilityReport;
