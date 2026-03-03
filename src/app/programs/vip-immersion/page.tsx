import CheckoutFormSection from "@/components/sections/Checkout/CheckoutFormSection";
import CostOfWaitingSection from "@/components/sections/Programs/VIPImmersion/CostOfWaitingSection";
import HeroSection from "@/components/sections/Programs/VIPImmersion/HeroSection";
import ItWorkedForMeSection from "@/components/sections/Programs/VIPImmersion/ItWorkedForMeSection";
import MechanicsDeliverablesSection from "@/components/sections/Programs/VIPImmersion/MechanicsDeliverablesSection";
import TheDiagnosisSection from "@/components/sections/Programs/VIPImmersion/TheDiagnosisSection";
import TheResultSection from "@/components/sections/Programs/VIPImmersion/TheResultSection";
import SalesPageTagger from "@/components/sections/SalesPage/SalesPageTagger"
import Footer from "@/components/ui/Footer";
import { VIP_IMMERSION } from "@/utils/constants";

export default function VIPImmersionPage() {
	return (
		<main>
			<HeroSection />
			<TheDiagnosisSection />
			<MechanicsDeliverablesSection />
			<TheResultSection />
			<ItWorkedForMeSection />
			<CostOfWaitingSection />
			<CheckoutFormSection productId={VIP_IMMERSION} />
			<SalesPageTagger/>
			{/* <Footer className="lg:pt-[150px]" /> */}
		</main>
	);
}
