import CredentialsSection from '@/components/sections/About/CredentialsSection';
import HeroSection from '@/components/sections/About/HeroSection';
import StopGuessingSection from '@/components/sections/About/StopGuessingSection';
import TheFractureAndLaboratorySection from '@/components/sections/About/TheFractureAndLaboratorySection';
import ThePivotAndAccelerantSection from '@/components/sections/About/ThePivotAndAccelerantSection';
import TheSynthesisSection from '@/components/sections/About/TheSynthesisSection';
import FooterLayout from '@/components/ui/footer/FooterLayout';

const AboutPage = () => {
  return (
    <main>
      <HeroSection />
      <TheFractureAndLaboratorySection />
      <ThePivotAndAccelerantSection />
      <TheSynthesisSection />
      <CredentialsSection />
      <StopGuessingSection />
      <FooterLayout />
    </main>
  );
};

export default AboutPage;
