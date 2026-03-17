'use client';

import React from 'react';

import { ProgramsReceive } from '../components/receive';
import { guidedBreakthroughModuleData, guidedBreakthroughOverviewData } from './static';
import { ProgramOverview } from '../components/overview';
import { Section } from '@/components/ui/containers/section';

export default function MechanicsDeliverablesSection() {
  return (
    <Section backgroundImage={'/images/programs/self-guided-transformation/mechanics_section_bg.png'}>
      <div className='text-center mb-[60px] lg:mb-[150px]'>
        <ProgramsReceive {...guidedBreakthroughModuleData} />
        <ProgramOverview {...guidedBreakthroughOverviewData} />
      </div>
    </Section>
  );
}
