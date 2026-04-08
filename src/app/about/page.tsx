export const metadata = { title: "About | The Leelu Method" };

import CredentialsSection from '@/components/sections/About/CredentialsSection';
import HeroSection from '@/components/sections/About/HeroSection';
import StopGuessingSection from '@/components/sections/About/StopGuessingSection';
import TheFractureAndLaboratorySection from '@/components/sections/About/TheFractureAndLaboratorySection';
import ThePivotAndAccelerantSection from '@/components/sections/About/ThePivotAndAccelerantSection';
import TheSynthesisSection from '@/components/sections/About/TheSynthesisSection';
import Footer from "@/components/ui/Footer"
// import FooterLayout from '@/components/ui/footer/FooterLayout';

const AboutPage = () => {
  return (
    <main className='overflow-x-hidden'>
      <HeroSection />
      <TheFractureAndLaboratorySection />
      <ThePivotAndAccelerantSection />
      <TheSynthesisSection />
      <CredentialsSection />
      <StopGuessingSection />
      {/* <FooterLayout className='pt-[64px] py-[122px]' /> */}
      <Footer className="!pt-[64px] !py-[122px]"/>
    </main>
  );
};

export default AboutPage;
