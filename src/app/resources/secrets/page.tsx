import DiscoverSection from '@/components/sections/Secrets/DiscoverSection';
import SecretsHeroSection from '@/components/sections/Secrets/HeroSection';
import Footer from '@/components/ui/Footer';
import { FooterPromo } from '@/components/ui/footer/FooterPromo';
import { SECRETS_LINKS } from '@/static/links';

const footerPromoContent = {
  title: `I don’t guess. I calculate.`,
  description: [
    `I’m Lily Chystofat. I founded and scaled a nationally recognized profiling firm. To drive our growth, I deployed fifteen psychologists across five regions to validate a high-precision, 360° numerological system that assessed 11,500 individuals for multinational corporations and high net worth clients. The system revolutionized executive selection and organizational compatibility—bringing predictive precision to leadership dynamics and team cohesion.`,
    `After a successful exit, I pursued the mathematical lineage behind the system—studying its original frameworks across the Middle East and Asia. Those insights converge in The Leelu Method today: ancient pattern intelligence rendered operational through modern behavioral science. Not mysticism. Precision.`,
    `I’ve enabled over a thousand women to stop improvising their love lives and start engineering them.`,
  ],
  subtitle: 'Are you next?',
  link: SECRETS_LINKS.CLAIM_LINK,
};

export default function SecretsResourcePage() {
  return (
    <main>
      <SecretsHeroSection />
      <DiscoverSection />
      <FooterPromo {...footerPromoContent} />
      <Footer />
    </main>
  );
}
