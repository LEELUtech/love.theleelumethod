import Button from '@/components/ui/Button';
import { CantFix } from '@/components/ui/CantFix';
import { PROGRAMS_LINKS } from '@/static/links';
import Image from 'next/image';
import React from 'react';

type BlindCard = {
  title: string;
  text: string;
  variant: 'light' | 'peach' | 'warm' | 'mauve';
};

const CARDS: BlindCard[] = [
  {
    title: 'The "Safety"\nGlitch:',
    text: 'You crave stability, yet you feel sexually bored by men who offer it. Your nervous system mistakes “peace” for “dead air.”',
    variant: 'light',
  },
  {
    title: 'The\n"Potential"\nTrap:',
    text: 'You are in a relationship with a man’s future, not his present. You are investing in a version of him that does not yet exist.',
    variant: 'peach',
  },
  {
    title: 'The "Project\nManager"\nSyndrome:',
    text: 'You are the one planning, the one initiating talks, and guiding space. You are over-functioning to compensate for his passivity, killing his attraction in the process.',
    variant: 'light',
  },
  {
    title: 'The Invisible\nCeiling:',
    text: 'Every relationship hits the exact same wall at the 6-month or 2-year mark. The dynamics shift, the warmth evaporates, and you don’t know why.',
    variant: 'mauve',
  },
];

function variantClass(v: BlindCard['variant']) {
  switch (v) {
    case 'light':
      return 'bg-[#f3e3e4]';
    case 'peach':
      return 'bg-[#fedad1]';
    case 'mauve':
      return 'bg-[#c7adb5]';
  }
}

function BlindSpotCard({ title, text, variant }: BlindCard) {
  return (
    <div
      className={[
        'w-full rounded-[20px] px-[24px] py-[40px] lg:min-h-[399px] shadow-[0_8px_30px_rgba(0,0,0,0.06)]',
        variantClass(variant),
      ].join(' ')}
    >
      <h3
        className={[
          'font-canela font-thin leading-[120%] whitespace-pre-line mb-4',
          'text-[42px] lg:text-[42px] text-center text-brand-deep',
        ].join(' ')}
      >
        {title}
      </h3>

      <p className={['font-lato font-normal text-body leading-[26px] text-center text-[#5A5757]'].join(' ')}>{text}</p>
    </div>
  );
}

export default function BlindSpotSection() {
  return (
    <section className='relative py-[72px] lg:py-[120px]'>
      <div className='absolute inset-0 -mt-[120px] z-'>
        <Image
          src='/images/programs/blindspot_section_bg.png'
          alt=''
          fill
          priority
          className='object-cover'
          sizes='100vw'
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 100%)',
          }}
        />
      </div>

      <div className='container relative z-10'>
        <div className='text-center mx-auto'>
          <h2 className='font-canela font-thin text-brand-deep text-[48px] md:text-[48px] lg:text-[60px] leading-[110%]'>
            THE BLIND SPOT: Why You Can’t See It
          </h2>

          <p className='mt-3 font-lato text-[#5A5757] font-normal text-[22px] leading-[150%] mx-auto'>
            The faces change. The names change. But the mathematical trajectory of your relationships remains identical.
            <br />
            The mechanism of the blind spot:
          </p>
        </div>

        <div className='mt-10 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-[100px] lg:mb-[112px]'>
          {CARDS.map((c) => (
            <BlindSpotCard key={c.title} {...c} />
          ))}
        </div>

        <CantFix
          linkLabel={PROGRAMS_LINKS.BLIND_LINK.label}
          href={PROGRAMS_LINKS.BLIND_LINK.href}
          trackingData={{
            cta_name: 'programs_blind_spot_cta',
            cta_text: PROGRAMS_LINKS.BLIND_LINK.label,
            cta_location: 'blind_spot',
          }}
        />
      </div>
    </section>
  );
}
