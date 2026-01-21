import DecodedLoveCohortSection from "@/components/sections/Landing/DecodedLoveCohortSection";
import HeroSection from "@/components/sections/Landing/HeroSection";
import HeyImLilySection from "@/components/sections/Landing/HeyImLilySection";
import { MasterclassSection } from "@/components/sections/Landing/MasterclassSection";
import RelationShipProtocolSection from "@/components/sections/Landing/RelationShipProtocolSection"
import TriageSection from "@/components/sections/Landing/TriageSection";
import Footer from "@/components/ui/Footer";

export default function HomePage() {
	return (
		<main>
			<HeroSection />
			<TriageSection />
			<MasterclassSection />
			<DecodedLoveCohortSection />
			<RelationShipProtocolSection />
			<HeyImLilySection />
			<Footer />
		</main>
	);
}
