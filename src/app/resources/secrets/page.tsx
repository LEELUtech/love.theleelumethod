import DiscoverSection from "@/components/sections/Secrets/DiscoverSection";
import SecretsHeroSection from "@/components/sections/Secrets/HeroSection";
import WebinarHeyImLilySection from "@/components/sections/Webinar/WebinarHeyImLilySection"
import Footer from "@/components/ui/Footer";

export default function SecretsResourcePage() {
	return (
		<main>
			<SecretsHeroSection />
			<DiscoverSection />
			<WebinarHeyImLilySection />
			<Footer />
		</main>
	);
}
