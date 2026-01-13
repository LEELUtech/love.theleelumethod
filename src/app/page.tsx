import FreeQuizButton from "@/components/ui/buttons/FreeQuizButton";
import CompatibilityReportModalButton from "@/components/ui/buttons/CompatibilityReportButton";
import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton";
import HeroSection from "@/components/sections/HeroSection";
import RelationshipTriageSection from "@/components/sections/RelationshipTriageSection";
import MasterclassSection from "@/components/sections/MasterclassSection";
import RelationshipProtocolSection from "@/components/sections/RelationshipProtocolSection";
import AboutSection from "@/components/sections/AboutSection";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";

export default function HomePage() {
	return (
		<main>
			<Header />
			<HeroSection />
			<RelationshipTriageSection />
			<MasterclassSection />
			<RelationshipProtocolSection />
			<AboutSection />
			<Footer />
		</main>
	);
}
