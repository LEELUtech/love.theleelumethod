import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { WEBINAR_URL } from '@/utils/constants';
import LoveLevelsAnimatedBlock from '@/components/sections/Webinar/LoveLevelsAnimatedBlock';

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
    title: 'The Subconscius Level',
    img: '/images/webinar/webinar_decor_down.png',
    text: 'Deepest. Your inherited "love script" from childhood and past relationships. The hidden code shaping your identity and recreating familiar dynamics—even painful ones.',
    icon: '/icons/ornament_8.svg',
  },
];

const WebinarContentSection = () => {
  return (
    <section className='relative bg-[#f5e8e8] pt-12 pb-[120px] md:py-16 lg:py-32'>
      {/* Background Image */}
      <div className='absolute inset-0 z-[0] overflow-hidden'>
        <Image src='/images/bg/webinar_content_bg.png' alt='' fill priority quality={100} />
      </div>

      {/* Carousel
			<TestimonialsCarousel className="absolute z-20 top-[-140px] md:top-[-90px] lg:top-[-110px]" /> */}

      <div className='container px-4 relative z-10 '>
        {/* FIRST BLOCK */}
        <div
          className='
		flex flex-col md:flex-row items-center justify-between

		/* SPACING */
		gap-12 md:gap-10 lg:gap-20

		/* MARGINS */
		mb-[300px] md:mb-[300px] lg:mb-[300px]
	'
        >
          {/* IMAGE */}
          <div className='w-full md:w-1/2 flex justify-center'>
            <div
              className='
				relative overflow-hidden rounded-[60px]

				/* MOBILE */
				w-full max-w-[360px] h-[459px]

				/* TABLET */
				md:max-w-[360px]

				/* DESKTOP (UNTOUCHED) */
				lg:max-w-none lg:w-[496px] lg:h-[833px]
			'
            >
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
            <h2
              className='
				font-canela font-thin text-brand-deep tracking-normal leading-[130%]

				/* MOBILE */
				text-[48px]
				mb-[40px]

				/* TABLET */
				md:text-[48px]
				md:mb-8

				/* DESKTOP */
				lg:text-[60px]
				lg:mb-[67px]
			'
            >
              You&apos;re smart, capable…
              <br />
              and still asking,
              <br />
              &quot;What&apos;s wrong with me?&quot;
            </h2>

            <div
              className='
				font-lato font-medium text-[#5A5757] tracking-[0.02em]

				/* MOBILE */
				text-[17px]
				leading-[22px]

				/* TABLET */
				md:text-[17px]
				md:leading-[24px]

				/* DESKTOP */
				lg:text-body
				lg:leading-[26px]
				lg:tracking-[0.03em]
			'
            >
              <p>
                You&apos;ve done the work. You&apos;ve tried communication, compromise, patience. And you still ended up
                alone or in a relationship that slowly eroded your sense of self.
              </p>

              <p className='mt-4 md:mt-5 lg:mt-6'>
                Maybe you&apos;re recovering from a breakup that demolished your confidence.
              </p>

              <p className='mt-4 md:mt-5 lg:mt-6'>
                Maybe you recognize the cycle:
                <br />
                <span className='font-normal italic'>Euphoria → distance → desperation → collapse.</span>
              </p>

              <p className='mt-4 md:mt-5 lg:mt-6'>
                Or maybe you&apos;re exhausted from carrying the emotional weight, managing everything, while secretly
                craving to be held, chosen, and cherished
              </p>

              <p className='mt-4 md:mt-5 lg:mt-6'>If any of this resonates, this masterclass is for you.</p>

              <p
                className='
					font-thin font-canela text-brand-deep leading-[110%]

					/* MOBILE */
					text-[32px]
					mt-10

					/* TABLET */
					md:text-[24px]
					md:mt-10

					/* DESKTOP */
					lg:text-[32px]
					lg:mt-[60px]
				'
              >
                If this is you, you&apos;re exactly who this masterclass was created for.
              </p>
            </div>
          </div>
        </div>

        <LoveLevelsAnimatedBlock cards={CARD_CONTENT} />

        {/* CTA BUTTON */}
        <div className='flex justify-center w-full'>
          <Button variant='primary' size='md' className='w-full md:w-[76%] py-[12px]' href={WEBINAR_URL}>
            Reserve My Spot
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WebinarContentSection;
