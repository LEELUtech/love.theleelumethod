import CheckoutFormSectionLazy from '@/components/sections/Compatibility/CheckoutFormSectionLazy';
import CoreValueSection from '@/components/sections/Compatibility/CoreValueSection';
import HeroSection from '@/components/sections/Compatibility/HeroSection';
import ProblemSolutionSection from '@/components/sections/Compatibility/ProblemSolutionSection';
import FooterLayout from '@/components/ui/footer/FooterLayout';
import { FooterPromo } from '@/components/ui/footer/FooterPromo';
import React from 'react';

const footerPromoContent = {
  title: 'I don’t guess. I calculate.',
  description: [
    `I’m Lily Chystofat. I founded and scaled a nationally recognized profiling firm. To drive our growth, I deployed fifteen psychologists across five regions to validate a high-precision, 360° numerological system that assessed 11,500 individuals for multinational corporations and high net worth clients. The system revolutionized executive selection and organizational compatibility—bringing predictive precision to leadership dynamics and team cohesion.`,
    `After a successful exit, I pursued the mathematical lineage behind the system—studying its original frameworks across the Middle East and Asia. Those insights converge in The Leelu Method today: ancient pattern intelligence rendered operational through modern behavioral science. Not mysticism. Precision.`,
    `I’ve enabled over a thousand women to stop improvising their love lives and start engineering them.`,
  ],
  subtitle: 'Are you next?',
  link: {
    href: '#',
    label: 'GIVE ME MY COMPATIBILITY CODE REPORT',
  },
};

const CompatibilityReport = () => {
  return (
    <main>
      <HeroSection />
      <ProblemSolutionSection />
      <CoreValueSection />
      <CheckoutFormSectionLazy />
      <FooterPromo {...footerPromoContent} buttonClassName='!px-2 md:w-[70%]' />

      <FooterLayout withNavigation={false} />
    </main>
  );
};

export default CompatibilityReport;
