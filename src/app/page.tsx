import DecodedLoveCohortSection from '@/components/sections/Landing/DecodedLoveCohortSection';
import HeroSection from '@/components/sections/Landing/HeroSection';
import { MasterclassSection } from '@/components/sections/Landing/MasterclassSection';
import RelationShipProtocolSection from '@/components/sections/Landing/RelationShipProtocolSection';
import TriageSection from '@/components/sections/Landing/TriageSection';
import { ButtonVariant } from '@/components/ui/Button';
import Footer from '@/components/ui/Footer';
import { FooterPromo } from '@/components/ui/footer/FooterPromo';
import { HOME_LINKS } from '@/static/links';

const footerPromoContent = {
  title_top: `I'm Lily Chystofat.`,
  title_bottom: '',
  description: [
    `I built and scaled a national profiling firm, deploying fifteen psychologists across five regions to validate a high-precision, 360° numerological system that assessed 11,500 individuals for multinational corporations and high net worth clients. We tracked behavioral patterns and predicted future outcomes with pinpoint accuracy.`,
    `After proving the method worked at scale, I traced the same predictive methodology back through older mathematical lineages—traveling through the Middle East and Asia to study numerology at its source. What I found wasn’t mysticism, but a parallel intelligence describing the same patterns through a different language.`,
    `The Leelu Method is where those worlds converge: ancient mathematical intelligence formalized through forensic behavioral science. Not belief. Pattern recognition, grounded in precision.`,
  ],
  subtitle:
    'The result is clarity, not platitudes. Strategy, not spiritual bypass. This is where the guessing ends, and certainty begins.',

  link: { ...HOME_LINKS.FOOTER_PROMO_LINK, variant: 'dark' as ButtonVariant },
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TriageSection />
      <MasterclassSection />
      <DecodedLoveCohortSection />
      <RelationShipProtocolSection />
      <FooterPromo {...footerPromoContent} buttonClassName='!px-2 md:w-[70%]' />
      <Footer />
    </main>
  );
}
