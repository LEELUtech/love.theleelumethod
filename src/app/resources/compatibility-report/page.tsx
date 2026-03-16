import CheckoutFormSectionLazy from '@/components/sections/Compatibility/CheckoutFormSectionLazy';
import CoreValueSection from '@/components/sections/Compatibility/CoreValueSection';
import HeroSection from '@/components/sections/Compatibility/HeroSection';
import ProblemSolutionSection from '@/components/sections/Compatibility/ProblemSolutionSection';
import FooterLayout from '@/components/ui/footer/FooterLayout';
import { FooterPromo } from '@/components/ui/footer/FooterPromo';
import { COMPABILITY_REPORT_LINKS } from '@/static/links';
import React from 'react';

const footerPromoContent = {
  description: [
    `I’m Lily Chystofat. I founded and scaled a nationally recognized profiling firm. To drive our growth, I deployed fifteen psychologists across five regions to validate a high-precision, 360° numerological system that assessed 11,500 individuals for multinational corporations and high net worth clients. The system revolutionized executive selection and organizational compatibility—bringing predictive precision to leadership dynamics and team cohesion.`,
    `After a successful exit, I pursued the mathematical lineage behind the system—studying its original frameworks across the Middle East and Asia. Those insights converge in The Leelu Method today: ancient pattern intelligence rendered operational through modern behavioral science. Not mysticism. Precision.`,
    `I’ve enabled over a thousand women to stop improvising their love lives and start engineering them.`,
  ],
  subtitle: 'Are you next?',
  link: {
    href: COMPABILITY_REPORT_LINKS.FOOTER_PROMO_LINK.href,
    label: COMPABILITY_REPORT_LINKS.FOOTER_PROMO_LINK.label,
  },
};

const CompatibilityReport = () => {
  return (
    <main>
      <HeroSection />
      <ProblemSolutionSection />
      <CoreValueSection />
      <CheckoutFormSectionLazy />

      <FooterPromo
        {...footerPromoContent}
        wrapperClassName='mt-[100px] lg:mt-[220px]'
        buttonClassName='!px-2 md:w-[70%]'
      />

      <FooterLayout className='pb-[140px]' />
    </main>
  );
};

export default CompatibilityReport;
