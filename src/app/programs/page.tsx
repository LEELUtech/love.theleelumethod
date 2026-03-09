import ProgramPreloader from '@/app/programs/ProgramPreloader';
import BlindSpotSection from '@/components/sections/Programs/BlindSpotSection';
import ChooseYourPathSection from '@/components/sections/Programs/ChooseYourPath';
import FAQSection from '@/components/sections/Programs/FAQSection';
import HeroSection from '@/components/sections/Programs/HeroSection';
import ModulesSection from '@/components/sections/Programs/ModulesSection';
import StopImprovisingSection from '@/components/sections/Programs/StopImprovisingSection';
import TestimonialsSection from '@/components/sections/Programs/TestimonialsSection';
import WhoThisIsForSection from '@/components/sections/Programs/WhoThisIsForSection';
import FooterLayout from '@/components/ui/footer/FooterLayout';
import { FooterPromo } from '@/components/ui/footer/FooterPromo';
import { PROGRAMS_LINKS } from '@/static/links';
import SalesPageTagger from "@/components/sections/SalesPage/SalesPageTagger";
import { PRELOAD_PROGRAM_PRODUCT_IDS } from '@/utils/constants';

const footerPromoContent = {
  title: 'I don’t guess. I calculate.',
  description: [
    `I’m Lily Chystofat. I founded and scaled a nationally recognized profiling firm. To drive our growth, I deployed fifteen psychologists across five regions to validate a high-precision, 360° numerological system that assessed 11,500 individuals for multinational corporations and high net worth clients. The system revolutionized executive selection and organizational compatibility—bringing predictive precision to leadership dynamics and team cohesion.`,
    `After a successful exit, I pursued the mathematical lineage behind the system—studying its original frameworks across the Middle East and Asia. Those insights converge in The Leelu Method today: ancient pattern intelligence rendered operational through modern behavioral science. Not mysticism. Precision.`,
    `I’ve enabled over a thousand women to stop improvising their love lives and start engineering them.`,
  ],
  link: PROGRAMS_LINKS.FOOTER_PROMO_LINK,
};

export default function ProgramPage() {
  return (
    <ProgramPreloader ids={[...PRELOAD_PROGRAM_PRODUCT_IDS]}>
      <main>
				<SalesPageTagger scoringEvent="pricing_page_visited" campaignTag="pp_view" />
        <HeroSection />
        <StopImprovisingSection />
        <BlindSpotSection />
        <ModulesSection />
        <WhoThisIsForSection />
        <TestimonialsSection />
        <ChooseYourPathSection />
        <FAQSection />
        <FooterPromo {...footerPromoContent} buttonClassName='!px-2 md:w-[70%]' />
        <FooterLayout withNavigation={false} />
      </main>
    </ProgramPreloader>
  );
}
