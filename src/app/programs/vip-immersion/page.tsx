import CheckoutFormSection from '@/components/sections/Checkout/CheckoutFormSection';
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
import { VIP_IMMERSION } from '@/utils/constants';

export default function VIPImmersionPage() {
  return (
    <>
      <main>
        <ProgramsHero {...vipImmersionHeroData} />
        <ProgramsWhoThis {...vipImmersionWhoThisData} />
        <MechanicsDeliverablesSection />
        <VIPImmersionReceive />
        <VIPImmersionAudit />
        <VIPImmersionOverview overviews={vipImmersionOverviewData} />
        <ProgramResult {...vipImmersionResultData} />
        <ProgramItWorks {...vipImmersionItWorksData} />

        <CostOfWaitingSection />
        <CheckoutFormSection productId={VIP_IMMERSION} />
        <SalesPageTagger />
      </main>

      <FooterLayout withNavigation={false} className='lg:mt-[-200px]' backgroundImage='/images/bg/checkout_bg.png' />
    </>
  );
}
