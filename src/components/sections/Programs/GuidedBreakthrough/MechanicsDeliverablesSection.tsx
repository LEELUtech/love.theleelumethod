'use client';

import React from 'react';

import { ProgramsReceive } from '../components/receive';
import { guidedBreakthroughModuleData, guidedBreakthroughOverviewData } from './static';
import { ProgramOverview } from '../components/overview';
import { Section } from '@/components/ui/containers/section';

export default function MechanicsDeliverablesSection() {
  return (
    <Section backgroundImage={'https://firebasestorage.googleapis.com/v0/b/leelu-tech.firebasestorage.app/o/love.theleelumethod%2Fbg%2Fmechanics_section_bg.png?alt=media'}>
      <div className='text-center xs:mb-[60px]'>
        <ProgramsReceive {...guidedBreakthroughModuleData} />
        <ProgramOverview {...guidedBreakthroughOverviewData} />
      </div>
    </Section>
  );
}
