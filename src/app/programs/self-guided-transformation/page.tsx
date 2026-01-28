import CheckoutFormSection from "@/components/sections/Programs/SelfGuidedTransformation/CheckoutFormSection";
import CostOfWaitingSection from "@/components/sections/Programs/SelfGuidedTransformation/CostOfWaitingSection";
import HeroSection from "@/components/sections/Programs/SelfGuidedTransformation/HeroSection";
import ItWorkedForMeSection from "@/components/sections/Programs/SelfGuidedTransformation/ItWorkedForMeSection";
import MechanicsDeliverablesSection from "@/components/sections/Programs/SelfGuidedTransformation/MechanicsDeliverablesSection";
import TheDiagnosisSection from "@/components/sections/Programs/SelfGuidedTransformation/TheDiagnosisSection";
import TheResultSection from "@/components/sections/Programs/SelfGuidedTransformation/TheResultSection";
import Footer from "@/components/ui/Footer";

export default function SelfGuidedTransformationPage() {
	return (
		<main>
			<HeroSection />
			<TheDiagnosisSection />
			<MechanicsDeliverablesSection />
			<TheResultSection />
			<ItWorkedForMeSection />
			<CostOfWaitingSection />
			<CheckoutFormSection />
			<Footer className="lg:pt-[200px]" />
		</main>
	);
}
