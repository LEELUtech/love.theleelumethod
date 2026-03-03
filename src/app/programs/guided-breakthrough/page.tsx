import CheckoutFormSection from "@/components/sections/Checkout/CheckoutFormSection";
import CostOfWaitingSection from "@/components/sections/Programs/GuidedBreakthrough/CostOfWaitingSection";
import HeroSection from "@/components/sections/Programs/GuidedBreakthrough/HeroSection";
import ItWorkedForMeSection from "@/components/sections/Programs/GuidedBreakthrough/ItWorkedForMeSection";
import MechanicsDeliverablesSection from "@/components/sections/Programs/GuidedBreakthrough/MechanicsDeliverablesSection";
import TheDiagnosisSection from "@/components/sections/Programs/GuidedBreakthrough/TheDiagnosisSection";
import TheResultSection from "@/components/sections/Programs/GuidedBreakthrough/TheResultSection";
import SalesPageTagger from "@/components/sections/SalesPage/SalesPageTagger"
import Footer from "@/components/ui/Footer";
import { GUIDED_BREAKTHROUGH } from "@/utils/constants";

export default function GuidedBreakthroughPage() {
	return (
		<main>
			<HeroSection />
			<TheDiagnosisSection />
			<MechanicsDeliverablesSection />
			<TheResultSection />
			<ItWorkedForMeSection />
			<CostOfWaitingSection />
			<CheckoutFormSection productId={GUIDED_BREAKTHROUGH} />
			<SalesPageTagger/>
			{/* <Footer className="lg:pt-[200px]" /> */}
		</main>
	);
}
