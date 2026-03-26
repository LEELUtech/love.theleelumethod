import CheckoutFormSectionLazy from '@/components/sections/Checkout/CheckoutFormSectionLazy';
import { ProgramsHero } from '@/components/sections/Programs/components/hero';
import { ProgramItWorks } from '@/components/sections/Programs/components/it-works';
import { ProgramResult } from '@/components/sections/Programs/components/result';
import { ProgramsWhoThis } from '@/components/sections/Programs/components/who-this';
import CostOfWaitingSection from '@/components/sections/Programs/GuidedBreakthrough/CostOfWaitingSection';
import MechanicsDeliverablesSection from '@/components/sections/Programs/GuidedBreakthrough/MechanicsDeliverablesSection';
import {
  guidedBreakthroughHeroData,
  guidedBreakthroughItWorksData,
  guidedBreakthroughResultData,
  guidedBreakthroughWhoThisData,
} from '@/components/sections/Programs/GuidedBreakthrough/static';
import SalesPageTagger from '@/components/sections/SalesPage/SalesPageTagger';
import FooterLayout from '@/components/ui/footer/FooterLayout';
import { getCohortData } from '@/lib/cohort';
import { GUIDED_BREAKTHROUGH } from '@/utils/constants';

export default async function GuidedBreakthroughPage() {
  const { label: cohortLabel } = await getCohortData();
  return (
    <>
      <main>
        <ProgramsHero {...guidedBreakthroughHeroData} />
        <ProgramsWhoThis {...guidedBreakthroughWhoThisData} />
        <MechanicsDeliverablesSection />
        <ProgramResult {...guidedBreakthroughResultData} />
        <ProgramItWorks {...guidedBreakthroughItWorksData} />

        <CostOfWaitingSection cohortLabel={cohortLabel} />
        <CheckoutFormSectionLazy productId={GUIDED_BREAKTHROUGH} />
        <SalesPageTagger />
      </main>{' '}
      <FooterLayout withNavigation={false} className='lg:mt-[-200px]' backgroundImage='/images/bg/checkout_bg.png' />
    </>
  );
}
