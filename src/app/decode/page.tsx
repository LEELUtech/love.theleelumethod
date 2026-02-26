import React from 'react';
import WebinarSection from '@/components/sections/Webinar/WebinarSection';
import WebinarContentSection from '@/components/sections/Webinar/WebinarContentSection';
import WebinarDiscoverSection from '@/components/sections/Webinar/WebinarDiscoverSection';
import WebinarWhatIfSection from '@/components/sections/Webinar/WebinarWhatIfSection';
import WebinarHeyImLilySection from '@/components/sections/Webinar/WebinarHeyImLilySection';
import TestimonialsSection from '@/components/sections/Webinar/TestimonialsSection';
import FooterLayout from '@/components/ui/footer/FooterLayout';
import HeyImLilySection from '@/components/sections/Secrets/HeyImLilySection';

const WebinarPage = () => {
  return (
    <main>
      <WebinarSection />
      <TestimonialsSection />
      <WebinarContentSection />
      <WebinarWhatIfSection />
      <WebinarDiscoverSection />

      <HeyImLilySection />
      <WebinarHeyImLilySection />

      <FooterLayout withNavigation={false} />
    </main>
  );
};

export default WebinarPage;
