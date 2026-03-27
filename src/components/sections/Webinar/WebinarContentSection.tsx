import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import LoveLevelsAnimatedBlock from '@/components/sections/Webinar/LoveLevelsAnimatedBlock';
import { DESCODE_LINKS } from '@/static/links';
import { Section } from '@/components/ui/containers/section';

const CARD_CONTENT = [
  {
    title: 'The Emotional Level',
    img: '/images/webinar/webinar_decor_up.png',
    text: 'How you show up in relationships. Your reactions, attachment patterns, and behaviors. Where anxiety, avoidance, abandonment fear, and control live.',
    icon: '/icons/ornament_7.svg',
  },
  {
    title: 'The Identity Level',
    text: "Deeper. Who you believe you are and what you believe you deserve in love. If your identity is built for survival instead of intimacy, you'll sabotage anything real.",
    img: '/images/webinar/webinar_decor_up.png',
    icon: '/icons/ornament_16.svg',
  },
  {
    title: 'The Subconscious Level',
    img: '/images/webinar/webinar_decor_down.png',
    text: 'Deepest. Your inherited "love script" from childhood and past relationships. The hidden code shaping your identity and recreating familiar dynamics—even painful ones.',
    icon: '/icons/ornament_8.svg',
  },
];

const WebinarContentSection = () => {
  return (
    <Section
      sectionClasses='relative bg-[#f5e8e8] pt-12 pb-[120px] md:py-16 lg:py-32'
      backgroundImage='/images/bg/webinar_content_bg.png'
    >
      <div className='relative'>
        <div className='flex flex-col md:flex-row items-center justify-between mb-[300px] gap-12 md:gap-10 lg:gap-20'>
          {/* IMAGE */}
          <div className='w-full md:w-1/2 flex justify-center'>
            <div className='relative overflow-hidden rounded-[60px] w-full max-w-[360px] h-[459px] lg:max-w-none lg:w-[496px] lg:h-[833px]'>
              <Image
                src='/images/beautiful-asian-woman-wrapped-blanket.png'
                alt=''
                fill
                quality={100}
                objectFit='cover'
              />
            </div>
          </div>

          {/* TEXT */}
          <div className='w-full md:text-left md:max-w-[400px] lg:max-w-none'>
            <h2 className='font-canela font-thin text-brand-deep tracking-normal text-[48px]/[130%] mb-[40px] md:mb-8 lg:text-[60px] lg:mb-[67px]'>
              You&apos;re smart, capable…
              <br />
              and still asking,
              <br />
              &quot;What&apos;s wrong with me?&quot;
            </h2>

            <div className='font-lato font-medium text-[#5A5757] tracking-[0.02em] text-[17px]/[22px] md:leading-[26px] lg:tracking-[0.03em]'>
              <p>
                You&apos;ve done the work. You&apos;ve tried communication, compromise, patience. And you still ended up
                alone or in a relationship that slowly eroded your sense of self.
              </p>

              <p className='mt-6 md:mt-5 lg:mt-6'>
                Maybe you&apos;re recovering from a breakup that demolished your confidence.
              </p>

              <p className='mt-6 md:mt-5 lg:mt-6'>
                Maybe you recognize the cycle:
                <br />
                <span className='font-normal italic'>Euphoria → distance → desperation → collapse.</span>
              </p>

              <p className='mt-6 md:mt-5 lg:mt-6'>
                Or maybe you&apos;re exhausted from carrying the emotional weight, managing everything, while secretly
                craving to be held, chosen, and cherished.
              </p>

              <p className='mt-6 md:mt-5 lg:mt-6'>If any of this resonates, this masterclass is for you.</p>

              <p className=' font-thin font-canela text-brand-deep leading-[110%] text-[32px] mt-10 md:text-[24px] lg:text-[32px] lg:mt-[60px]'>
                If this is you, you&apos;re exactly who this masterclass was created for.
              </p>
            </div>
          </div>
        </div>

        <LoveLevelsAnimatedBlock cards={CARD_CONTENT} />

        <div className='flex justify-center w-full'>
          <Button
            variant='primary'
            rel='noreferrer'
            target='blank'
            className='w-full md:w-[76%] py-[12px]'
            href={DESCODE_LINKS.RESERVE_LINK.href}
            trackingData={{
              cta_name: 'webinar_reserve_cta',
              cta_text: DESCODE_LINKS.RESERVE_LINK.label,
              cta_location: 'webinar_content',
            }}
          >
            {DESCODE_LINKS.RESERVE_LINK.label}
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default WebinarContentSection;
