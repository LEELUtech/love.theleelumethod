import React from 'react';
import WebinarSection from '@/components/sections/Webinar/WebinarSection';
import WebinarContentSection from '@/components/sections/Webinar/WebinarContentSection';
import WebinarDiscoverSection from '@/components/sections/Webinar/WebinarDiscoverSection';
import WebinarWhatIfSection from '@/components/sections/Webinar/WebinarWhatIfSection';
import TestimonialsSection from '@/components/sections/Webinar/TestimonialsSection';
import FooterLayout from '@/components/ui/footer/FooterLayout';
import { FooterPromo } from '@/components/ui/footer/FooterPromo';
import { DESCODE_LINKS } from '@/static/links';

const footerPromoContent = {
  description: [
    `I’m Lily Chystofat. I founded and scaled a nationally recognized profiling firm. To drive our growth, I deployed fifteen psychologists across five regions to validate a high-precision, 360° numerological system that assessed 11,500 individuals for multinational corporations and high net worth clients. The system revolutionized executive selection and organizational compatibility—bringing predictive precision to leadership dynamics and team cohesion.`,
    `After a successful exit, I pursued the mathematical lineage behind the system—studying its original frameworks across the Middle East and Asia. Those insights converge in The Leelu Method today: ancient pattern intelligence rendered operational through modern behavioral science. Not mysticism. Precision.`,
    `I’ve enabled over a thousand women to stop improvising their love lives and start engineering them.`,
  ],
  subtitle: 'Are you next?',
  link: DESCODE_LINKS.FOOTER_PROMO_LINK,
};

const WebinarPage = () => {
  return (
    <main>
      <WebinarSection />
      <TestimonialsSection />
      <WebinarContentSection />
      <WebinarWhatIfSection />
      <WebinarDiscoverSection />

      <FooterPromo {...footerPromoContent} />
      <FooterLayout withNavigation={false} />
    </main>
  );
};

export default WebinarPage;
