import CheckoutFormSection from "@/components/sections/Programs/VIPImmersion/CheckoutFormSection"
import CostOfWaitingSection from "@/components/sections/Programs/VIPImmersion/CostOfWaitingSection"
import HeroSection from "@/components/sections/Programs/VIPImmersion/HeroSection"
import ItWorkedForMeSection from "@/components/sections/Programs/VIPImmersion/ItWorkedForMeSection"
import MechanicsDeliverablesSection from "@/components/sections/Programs/VIPImmersion/MechanicsDeliverablesSection"
import TheDiagnosisSection from "@/components/sections/Programs/VIPImmersion/TheDiagnosisSection"
import TheResultSection from "@/components/sections/Programs/VIPImmersion/TheResultSection"
import Footer from "@/components/ui/Footer"

export default function VIPImmersionPage() {
	return (
		<main>
			<HeroSection />
			<TheDiagnosisSection />
			<MechanicsDeliverablesSection />
			<TheResultSection />
			<ItWorkedForMeSection />
			<CostOfWaitingSection />
			<CheckoutFormSection />
			<Footer className="lg:pt-[150px]" />
		</main>
	);
}
