import BlindSpotSection from "@/components/sections/Programs/BlindSpotSection";
import ChooseYourPathSection from "@/components/sections/Programs/ChooseYourPath";
import FAQSection from "@/components/sections/Programs/FAQSection";
import HeroSection from "@/components/sections/Programs/HeroSection";
import HeyImLilySection from "@/components/sections/Programs/HeyImLilySection";
import ModulesSection from "@/components/sections/Programs/ModulesSection";
import StopImprovisingSection from "@/components/sections/Programs/StopImprovisingSection";
import WhoThisIsForSection from "@/components/sections/Programs/WhoThisIsForSection";
import Footer from "@/components/ui/Footer";

export default function ProgramPage() {
	return (
		<main>
			<HeroSection />
			<StopImprovisingSection />
			<BlindSpotSection />
			<ModulesSection />
			<WhoThisIsForSection />
			<ChooseYourPathSection />
			<FAQSection />
			<HeyImLilySection />
			<Footer />
		</main>
	);
}
