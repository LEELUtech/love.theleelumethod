import CheckoutFormSection from '@/components/sections/Checkout/CheckoutFormSection';
import { ProgramsHero } from '@/components/sections/Programs/components/hero';
import { ProgramItWorks } from '@/components/sections/Programs/components/it-works';
import { ProgramResult } from '@/components/sections/Programs/components/result';
import { ProgramsWhoThis } from '@/components/sections/Programs/components/who-this';
import CostOfWaitingSection from '@/components/sections/Programs/SelfGuidedTransformation/CostOfWaitingSection';
import { InsideProtocol } from '@/components/sections/Programs/SelfGuidedTransformation/InsideProtocol';
import MechanicsDeliverablesSection from '@/components/sections/Programs/SelfGuidedTransformation/MechanicsDeliverablesSection';
import {
  selfGuidedHeroData,
  selfGuidedItWorksData,
  selfGuidedResultData,
  selfGuidedWhoThisData,
} from '@/components/sections/Programs/SelfGuidedTransformation/static';
import { PROTOCOL_ESSENTIALS } from '@/utils/constants';

export default function SelfGuidedTransformationPage() {
  return (
    <main>
      <ProgramsHero {...selfGuidedHeroData} />
      <ProgramsWhoThis {...selfGuidedWhoThisData} />
      <MechanicsDeliverablesSection />
      <InsideProtocol />
      <ProgramResult {...selfGuidedResultData} />
      <ProgramItWorks {...selfGuidedItWorksData} />

      <CostOfWaitingSection />
      <CheckoutFormSection productId={PROTOCOL_ESSENTIALS} />
    </main>
  );
}
