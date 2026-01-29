import DiscoverSection from "@/components/sections/Secrets/DiscoverSection";
import SecretsHeroSection from "@/components/sections/Secrets/HeroSection";
import HeyImLilySection from "@/components/sections/Secrets/HeyImLilySection"
import Footer from "@/components/ui/Footer";

export default function SecretsResourcePage() {
	return (
		<main>
			<SecretsHeroSection />
			<DiscoverSection />
			<HeyImLilySection />
			<Footer />
		</main>
	);
}
