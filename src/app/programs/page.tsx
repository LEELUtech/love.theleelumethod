import ProgramPreloader from "@/app/programs/ProgramPreloader";
import BlindSpotSection from "@/components/sections/Programs/BlindSpotSection";
import ChooseYourPathSection from "@/components/sections/Programs/ChooseYourPath";
import FAQSection from "@/components/sections/Programs/FAQSection";
import HeroSection from "@/components/sections/Programs/HeroSection";
import HeyImLilySection from "@/components/sections/Programs/HeyImLilySection";
import ModulesSection from "@/components/sections/Programs/ModulesSection";
import StopImprovisingSection from "@/components/sections/Programs/StopImprovisingSection";
import TestimonialsSection from "@/components/sections/Programs/TestimonialsSection";
import WhoThisIsForSection from "@/components/sections/Programs/WhoThisIsForSection";
import Footer from "@/components/ui/Footer";
import { PRELOAD_PROGRAM_PRODUCT_IDS } from "@/utils/constants";

export default function ProgramPage() {
	return (
		<ProgramPreloader ids={[...PRELOAD_PROGRAM_PRODUCT_IDS]}>
			<main>
				<HeroSection />
				<StopImprovisingSection />
				<BlindSpotSection />
				<ModulesSection />
				<WhoThisIsForSection />
				<TestimonialsSection />
				<ChooseYourPathSection />
				<FAQSection />
				<HeyImLilySection />
				<Footer />
			</main>
		</ProgramPreloader>
	);
}
