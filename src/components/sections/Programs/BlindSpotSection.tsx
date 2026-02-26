import Button from '@/components/ui/Button';
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
      {/* background */}
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
        {/* top heading */}
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

        {/* 4 cards */}
        <div className='mt-10 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-[100px] lg:mb-[112px]'>
          {CARDS.map((c) => (
            <BlindSpotCard key={c.title} {...c} />
          ))}
        </div>

        {/* big statement */}

        <h2 className='font-thin text-[48px] lg:text-[60px] leading-[126%] font-canela text-brand-deep mb-[50px] lg:mb-[100px] text-center'>
          You cannot fix a pattern you cannot see.
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-[4fr,3fr] gap-[43px] lg:gap-[102px] '>
          {/* Left Column - Image */}
          <div className='flex flex-col gap-5 lg:gap-8 justify-center'>
            <div className='relative md:mb-0 lg:mb-0 w-full h-[245px] lg:w-[600px] lg:h-[380px]'>
              <Image
                src='/images/landing/triage_section_women.png'
                alt='Person sitting with a laptop'
                fill
                priority
                quality={100}
                className=''
              />
            </div>

            <div className='relative flex flex-row items-center gap-3 lg:gap-6'>
              <Image
                src='/images/landing/triage_section_author.png'
                alt='Person sitting with a laptop'
                width={66}
                height={66}
                priority
                quality={100}
                className=''
              />

              <div>
                <div className='font-canela font-light text-[32px]/[130%] text-brand-gray'>Lisa B. Gold, M.A., CH</div>

                <div className='font-lato italic font-normal lg:text-[22px] leading-[26px] text-[#6F4C40] text-[18px]'>
                  Applied Behavior Analyst
                </div>

                <div className='font-lato text-[16px] leading-[22px] text-brand-gray-100 mt-1'>Boca Raton, FL</div>
              </div>
            </div>
          </div>

          {/* Right Column - The Fracture */}
          <div>
            <p className='font-thin text-[32px] leading-[126%] font-canela text-brand-black mb-2'>Thank you</p>
            <h2 className='font-thin text-[42px] leading-[126%] font-canela text-brand-deep mb-8'>
              It was eye-opening
            </h2>
            <p className='font-normal italic text-[#6F4C40] font-lato leading-[26px] tracking-normal mb-6'>
              {`"I've been a behavioral analyst for 25 years, and I am literally`}
              <span className='text-brand-primary'>blown away</span> by the accuracy. She hit it{' '}
              <span className='text-brand-primary'>spot on</span> what my relationship patterns were… She completed the{' '}
              <span className='text-brand-primary'>missing piece</span>
              {`. I have broken through my block, and I am living
              everything I've ever dreamed of."`}
            </p>
            <Button variant='primary' size='md' className='w-full lg:w-[80%] xs:text-[12px]' href='#checkout'>
              READ MORE STORIES
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
