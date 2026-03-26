'use client';

import React from 'react';
import AnimatedMechanicStep from './AnimatedMechanicStep';
import Button from '@/components/ui/Button';
import { VIP_LINKS } from '@/static/links';

const mechanics = [
  {
    id: 1,
    title: 'Full Partner Audit',
    icon: '/icons/ornament_12.svg',
    size: 'lg',
    description:
      `I don't just decode your patterns—I decode his. You receive his complete behavioral manual: his wiring, his triggers, what motivates him, what shuts him down, and exactly how to communicate so he hears you.`,
  },
  {
    id: 2,
    title: 'Joint Session Capability',
    icon: '/icons/ornament_7.svg',
    size: 'lg',
    description:
      'I bring him into the room—with you, separately, or both. We decode the dynamic from both sides to accelerate alignment.',
  },
  {
    id: 3,
    title: 'Real-Time Private Access',
    size: 'lg',
    icon: '/icons/ornament_8.svg',
    description: `You don't wait for scheduled calls. You have direct access via Voxer/WhatsApp for 30 days. This means I review the exact message you’re about to send—or the one he just sent—and tell you precisely what to say next and why.`,
  },
  {
    id: 4,
    title: 'Four Private Sessions in 30 Days',
    size: 'lg',
    icon: '/icons/ornament_18.svg',
    description: `One 90-minute diagnostic plus three 60-minute course corrections. Use them for crisis intervention, rebuilding strategy, or separation navigation—whatever your situation demands.`,
  },
] as const;

export default function MechanicsDeliverablesSection() {
  return (
    <section
      className='relative overflow-hidden'
      style={{
        background: 'url("/images/bg/whatif-bg.jpg")',
      }}
    >
      <div className='container relative py-[80px] lg:pt-[110px] lg:pb-[230px]'>
        <div className='text-center'>
          <h2 className='font-canela font-thin text-brand-deep  text-[48px] lg:text-[60px] leading-[110%]'>
            THE MECHANICS
          </h2>

          <p className='lg:mt-2 mt-6 font-canela font-thin mb-[250px] text-brand-deep text-[24px] lg:text-[32px] leading-[1.6]'>
            This is the ER. We stop the bleeding immediately.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[120px] lg:gap-5 items-stretch'>
            {mechanics.map((item) => (
              <AnimatedMechanicStep key={item.id} {...item} />
            ))}
          </div>

          <Button
            className='mt-[90px] w-full max-w-[392px]'
            href={VIP_LINKS.MECHANICS_LINK.href}
            trackingData={{
              cta_name: 'vip_mechanics_cta',
              cta_text: VIP_LINKS.MECHANICS_LINK.label,
              cta_target_url: VIP_LINKS.MECHANICS_LINK.href,
              cta_location: 'mechanics',
            }}
          >
            {VIP_LINKS.MECHANICS_LINK.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
