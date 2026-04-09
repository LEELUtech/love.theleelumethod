export const metadata = { title: "Self-Guided Transformation | The Leelu Method" };

import { Suspense } from 'react';
import ScrollToCheckout from './ScrollToCheckout';
import CheckoutFormSectionLazy from '@/components/sections/Checkout/CheckoutFormSectionLazy';
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
import FooterLayout from '@/components/ui/footer/FooterLayout';
import SalesPageTagger from '@/components/sections/SalesPage/SalesPageTagger';

export default function SelfGuidedTransformationPage() {
  return (
    <>
      <main className='overflow-x-hidden'>
        <ProgramsHero {...selfGuidedHeroData} />
        <ProgramsWhoThis {...selfGuidedWhoThisData} />
        <MechanicsDeliverablesSection />
        <InsideProtocol />
        <ProgramResult {...selfGuidedResultData} />
        <ProgramItWorks {...selfGuidedItWorksData} />

        <CostOfWaitingSection />
        <Suspense><ScrollToCheckout /></Suspense>
        <CheckoutFormSectionLazy productId={PROTOCOL_ESSENTIALS} />
        <SalesPageTagger />
      </main>{' '}
      <FooterLayout withNavigation={false} className='lg:mt-[-200px]' noise={true} />
    </>
  );
}
