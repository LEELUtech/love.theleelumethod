export const metadata = { title: "VIP Immersion | The Leelu Method" };
export const revalidate = 300;

import CheckoutFormSectionLazy from '@/components/sections/Checkout/CheckoutFormSectionLazy';
import { ProgramsHero } from '@/components/sections/Programs/components/hero';
import { ProgramItWorks } from '@/components/sections/Programs/components/it-works';
import { ProgramResult } from '@/components/sections/Programs/components/result';
import { ProgramsWhoThis } from '@/components/sections/Programs/components/who-this';
import { VIPImmersionAudit } from '@/components/sections/Programs/VIPImmersion/Audit';
import CostOfWaitingSection from '@/components/sections/Programs/VIPImmersion/CostOfWaitingSection';
import MechanicsDeliverablesSection from '@/components/sections/Programs/VIPImmersion/MechanicsDeliverablesSection';
import { VIPImmersionOverview } from '@/components/sections/Programs/VIPImmersion/Overwie';
import { VIPImmersionReceive } from '@/components/sections/Programs/VIPImmersion/Receive';
import {
  vipImmersionHeroData,
  vipImmersionItWorksData,
  vipImmersionOverviewData,
  vipImmersionResultData,
  vipImmersionWhoThisData,
} from '@/components/sections/Programs/VIPImmersion/static';
import SalesPageTagger from '@/components/sections/SalesPage/SalesPageTagger';
import FooterLayout from '@/components/ui/footer/FooterLayout';
import { getCohortData } from '@/lib/cohort';
import { VIP_IMMERSION } from '@/utils/constants';

export default async function VIPImmersionPage() {
  const { label: cohortLabel } = await getCohortData();
  return (
    <>
      <main className='overflow-x-hidden'>
        <ProgramsHero {...vipImmersionHeroData} />
        <ProgramsWhoThis {...vipImmersionWhoThisData} />
        <MechanicsDeliverablesSection />
        <VIPImmersionReceive />
        <VIPImmersionAudit />
        <VIPImmersionOverview overviews={vipImmersionOverviewData} />
        <ProgramResult {...vipImmersionResultData} />
        <ProgramItWorks {...vipImmersionItWorksData} />

        <CostOfWaitingSection cohortLabel={cohortLabel} />
        <CheckoutFormSectionLazy productId={VIP_IMMERSION} />
        <SalesPageTagger />
      </main>

      <FooterLayout withNavigation={false} className='lg:mt-[-200px]' noise={true} />
    </>
  );
}
