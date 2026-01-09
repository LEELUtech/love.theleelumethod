import FreeQuizButton from "@/components/ui/buttons/FreeQuizButton"
import CompatibilityReportModalButton from "@/components/ui/buttons/CompatibilityReportModalButton"
import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton"
import HeroSection from "@/components/sections/HeroSection"
import RelationshipTriageSection from "@/components/sections/RelationshipTriageSection"
import MasterclassSection from "@/components/sections/MasterclassSection"
import RelationshipProtocolSection from "@/components/sections/RelationshipProtocolSection"
import AboutSection from "@/components/sections/AboutSection"
import Footer from "@/components/ui/Footer"

export default function HomePage() {
	return (
		<main>
			<HeroSection />
			<RelationshipTriageSection />
			<MasterclassSection />
			<RelationshipProtocolSection />
			<AboutSection />
			<Footer />
			{/* <div className="flex gap-2 p-8">
				<CompatibilityReportModalButton />
				<WebinarModalButton />
				<FreeQuizButton />
			</div> */}
		</main>
	);
}
