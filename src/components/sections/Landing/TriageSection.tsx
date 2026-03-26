import Button from '@/components/ui/Button';
import RotateOnView from '@/components/ui/RotateOnView';
import { HOME_LINKS } from '@/static/links';
import Image from 'next/image';
import React from 'react';

const { QUIZ_LINK, REGISTER_LINK, PERSONALIZED_LINK } = HOME_LINKS;

const cards = [
  {
    title: 'I am',
    highlight: 'Confused',
    subtitle: 'Is it a trauma bond or a soul connection?',
    paragraphs: [
      'Your intuition is currently biased by emotion. Numerological algorithms are not.',
      'Answer 10 questions to uncover:',
      {
        bold: 'The Friction Points:',
        text: 'Why you keep having the same fight',
      },
      {
        bold: 'The Probability:',
        text: 'Is this relationship built for the long haul or a lesson?',
      },
      {
        bold: 'The Truth:',
        text: 'What his behavior is actually saying.',
      },
    ],
    button: { label: QUIZ_LINK.label, href: QUIZ_LINK.href },
    trackingData: {
      cta_name: 'landing_triage_quiz_cta',
      cta_text: QUIZ_LINK.label,
      cta_location: 'triage',
    },
  },
  {
    title: 'I am Ready to',
    highlight: 'Fix it',
    subtitle: 'You want the truth? Join the deep dive.',
    paragraphs: [
      'I will show you the exact mechanics of why men pull away and the precise correction that makes him pursue you again.',
      { bold: 'We will cover:', text: '' },
      {
        bold: 'The "Inner Demon":',
        text: 'The dark side of your personality that sabotages love.',
      },
      {
        bold: 'Hidden Desires:',
        text: "The one thing he needs (that he doesn't even know he needs).",
      },
      {
        bold: 'The Script Shift:',
        text: 'How to stop over-functioning and inspire his loyalty.',
      },
    ],
    button: { label: REGISTER_LINK.label, href: REGISTER_LINK.href },
    trackingData: {
      cta_name: 'landing_triage_webinar_cta',
      cta_text: REGISTER_LINK.label,
      cta_location: 'triage',
    },
    raised: true,
  },
  {
    title: 'I want',
    highlight: 'Answers',
    subtitle: 'Should this relationship be salvaged? Was the last one doomed from the start?',
    paragraphs: [
      "This analysis shows you the structural reality: where relationship codes align, where they clash, and whether the friction you're experiencing is solvable or baked into the pairing itself.",
      "You'll see what's actually fixable versus what you've been forcing.",
      {
        bold: 'No opinions. No blame. Mathematical certainty.',
        text: '',
      },
    ],
    button: { label: PERSONALIZED_LINK.label, href: PERSONALIZED_LINK.href },
    trackingData: {
      cta_name: 'landing_triage_analysis_cta',
      cta_text: PERSONALIZED_LINK.label,
      cta_location: 'triage',
    },
  },
];

const TriageSection = () => {
  return (
    <section className='relative pt-[57px] pb-[22px] lg:pt-[120px] lg:pb-[112px] overflow-hidden'>
      <div className='absolute inset-0 -z-10'>
        <Image src='/images/landing/triage_section_bg.png' alt='' fill priority quality={100} sizes='100vw' />
      </div>
      <div className='container w-full px-1'>
        <p className='font-canela text-[42px]/[126%] lg:text-[60px] font-thin text-brand-deep text-center mb-[200px] md:mb-[300px] lg:mb-[400px]'>
          We fought for years and tried everything. A friend referred us to Lily. She ran our codes, showing us exactly
          where we clash, where we naturally align, and how to navigate our differences. Words cannot describe the
          impact she had. Without Lily, our relationship would have crumbled.
        </p>

        {/* <CantFix
          buttonVariant='dark'
          href=''
          linkLabel='READ MORE STORIES'
          trackingData={{
            cta_name: 'landing_triage_read_stories_cta',
            cta_text: 'READ MORE STORIES',
            cta_location: 'triage',
          }}
        /> */}

        <div className='lg:mt-[250px] mt-[200px] mb-[52px] relative lg:mb-[32px]'>
          <div className='absolute z-0 left-1/2 -translate-x-1/2 top-[-150px] md:top-[-180px] lg:top-[-200px] flex flex-row items-center justify-center gap-[130px]'>
            {/* LEFT ornament */}
            <div
              className='
      relative overflow-hidden
      w-[180px] h-[180px]
      lg:w-[238px] lg:h-[249px]

      translate-x-[250px] translate-y-[80px]
      md:translate-x-[120px] md:translate-y-[50px]
      lg:translate-x-[125px] lg:translate-y-[60px]
    '
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            >
              <RotateOnView
                duration={10}
                amount={0.2}
                ease='easeOut'
                className='absolute inset-0'
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                <Image
                  src='/icons/ornament_3.svg'
                  alt=''
                  fill
                  className='object-contain'
                  style={{ filter: 'brightness(200%)' }}
                />
              </RotateOnView>
            </div>
            {/* CENTER ornament */}
            <div
              className='relative overflow-hidden w-[261px] h-[266px] lg:w-[512px] lg:h-[524px]'
              style={{
                WebkitMaskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,0.6) 58%, rgba(0,0,0,0) 88%)',
                maskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,0.6) 58%, rgba(0,0,0,0) 88%)',

                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            >
              <RotateOnView
                duration={5}
                amount={0.2}
                ease='easeOut'
                className='absolute inset-0'
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                <Image
                  src='/icons/ornament_2/ornament_2_light.svg'
                  alt=''
                  fill
                  className='object-contain'
                  style={{ filter: 'brightness(200%)' }}
                />
              </RotateOnView>
            </div>

            {/* RIGHT ornament */}
            <div
              className='
      relative overflow-hidden
      w-[180px] h-[180px]
      lg:w-[259px] lg:h-[242px]

      -translate-x-[250px] translate-y-[90px]
      md:-translate-x-[120px] md:translate-y-[50px]
      lg:-translate-x-[120px] lg:translate-y-[60px]
    '
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            >
              <RotateOnView
                duration={10}
                amount={0.2}
                ease='easeOut'
                className='absolute inset-0'
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                <Image
                  src='/icons/ornament_right.svg'
                  alt=''
                  fill
                  className='object-contain'
                  style={{ filter: 'brightness(200%)' }}
                />
              </RotateOnView>
            </div>
          </div>
          <h2 className='relative font-thin text-[48px] lg:text-[60px] leading-[130%] font-canela text-brand-deep mb-8 text-center z-10 xs:max-w-[309px] lg:max-w-[550px] mx-auto uppercase'>
            The Relationship TRIAGE
          </h2>

          <div className='mt-12 lg:mt-[100px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-2 xl:gap-6 items-stretch justify-items-center'>
            {cards.map((card, i) => {
              const containerClass = i === 1 ? 'lg:h-[672px]' : 'lg:h-[658px]';

              return (
                <div
                  key={i}
                  className={`
                  max-w-[392px] w-full rounded-[24px] bg-brand-white backdrop-blur-md px-[22.5px] lg:px-2
                  xl:px-[22.5px] py-[47px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]
                  flex flex-col
                  ${card.raised ? 'lg:-translate-y-10' : ''} ${containerClass}
                  ${i === 2 ? 'md:col-span-2 md:max-w-[820px] lg:col-span-1 lg:max-w-[392px]' : ''}
                `}
                >
                  <h2 className='text-center text-[38px] lg:text-[40px] font-thin text-brand-deep mb-8 lg:mb-[47px]'>
                    {card.title} <span className='font-light'>{card.highlight}</span>
                  </h2>

                  <p className='text-[20px] font-normal font-canela mb-[20px]'>{card.subtitle}</p>

                  {card.paragraphs.map((p, idx) =>
                    typeof p === 'string' ? (
                      <p key={idx} className='font-lato font-normal text-[15px] text-[#41444E] mb-6'>
                        {p}
                      </p>
                    ) : (
                      <p key={idx} className='font-lato font-normal text-[15px] text-[#41444E] mb-6'>
                        {p.bold && <span className='font-semibold'>{p.bold}</span>} {p.text}
                      </p>
                    ),
                  )}

                  <Button variant='dark' className='w-full mt-auto px-4' href={card.button.href}>
                    {card.button.label}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TriageSection;
