import CheckoutFormSection from "@/components/sections/Checkout/CheckoutFormSection";
import CostOfWaitingSection from "@/components/sections/Programs/VIPImmersion/CostOfWaitingSection";
import HeroSection from "@/components/sections/Programs/VIPImmersion/HeroSection";
import ItWorkedForMeSection from "@/components/sections/Programs/VIPImmersion/ItWorkedForMeSection";
import MechanicsDeliverablesSection from "@/components/sections/Programs/VIPImmersion/MechanicsDeliverablesSection";
import TheDiagnosisSection from "@/components/sections/Programs/VIPImmersion/TheDiagnosisSection";
import TheResultSection from "@/components/sections/Programs/VIPImmersion/TheResultSection";
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
			{/* <Footer className="lg:pt-[150px]" /> */}
		</main>
	);
}
