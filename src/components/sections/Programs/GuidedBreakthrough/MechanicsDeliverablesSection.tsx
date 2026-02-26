'use client';

import React from 'react';

import { ProgramsReceive } from '../components/receive';
import { guidedBreakthroughModuleData, guidedBreakthroughOverviewData } from './static';
import { ProgramOverview } from '../components/overview';

export default function MechanicsDeliverablesSection() {
  return (
    <section
      style={{
        backgroundImage: "url('/images/programs/self-guided-transformation/mechanics_section_bg.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[112px] 2xl:px-[180px] relative py-[80px] lg:py-[110px]'>
        <div className='text-center mb-[150px]'>
          <ProgramsReceive {...guidedBreakthroughModuleData} />

          <ProgramOverview {...guidedBreakthroughOverviewData} />
        </div>
      </div>
    </section>
  );
}
