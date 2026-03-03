import ProgramFooter from "@/app/programs/ProgramFooter";
import CheckoutFormSection from "@/components/sections/Checkout/CheckoutFormSection";
import CostOfWaitingSection from "@/components/sections/Programs/SelfGuidedTransformation/CostOfWaitingSection";
import HeroSection from "@/components/sections/Programs/SelfGuidedTransformation/HeroSection";
import ItWorkedForMeSection from "@/components/sections/Programs/SelfGuidedTransformation/ItWorkedForMeSection";
import MechanicsDeliverablesSection from "@/components/sections/Programs/SelfGuidedTransformation/MechanicsDeliverablesSection";
import TheDiagnosisSection from "@/components/sections/Programs/SelfGuidedTransformation/TheDiagnosisSection";
import TheResultSection from "@/components/sections/Programs/SelfGuidedTransformation/TheResultSection";
import SalesPageTagger from "@/components/sections/SalesPage/SalesPageTagger"
import Footer from "@/components/ui/Footer";
import { PROTOCOL_ESSENTIALS } from "@/utils/constants";

export default function SelfGuidedTransformationPage() {
	return (
		<main>
			<HeroSection />
			<TheDiagnosisSection />
			<MechanicsDeliverablesSection />
			<TheResultSection />
			<ItWorkedForMeSection />
			<CostOfWaitingSection />
			<CheckoutFormSection productId={PROTOCOL_ESSENTIALS} />
			<SalesPageTagger/>
			{/* <Footer className="lg:pt-[200px]" /> */}
		</main>
	);
}
