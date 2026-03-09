import CheckoutFormSection from '@/components/sections/Checkout/CheckoutFormSection';
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

import { GUIDED_BREAKTHROUGH } from '@/utils/constants';

export default function GuidedBreakthroughPage() {
  return (
    <main>
      <ProgramsHero {...guidedBreakthroughHeroData} />
      <ProgramsWhoThis {...guidedBreakthroughWhoThisData} />
      <MechanicsDeliverablesSection />
      <ProgramResult {...guidedBreakthroughResultData} />
      <ProgramItWorks {...guidedBreakthroughItWorksData} />

      <CostOfWaitingSection />
      <CheckoutFormSection productId={GUIDED_BREAKTHROUGH} />
			<SalesPageTagger/>
    </main>
  );
}
