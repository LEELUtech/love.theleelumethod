import React from 'react';
import Image from 'next/image';
import Header from '@/components/ui/Header';
import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Button from '@/components/ui/Button';
import RotateOnView from '@/components/ui/RotateOnView';
import { COMPABILITY_REPORT_LINKS } from '@/static/links';

const HeroSection = () => {
  return (
    <section className='relative overflow-hidden'>
      {/* Background */}
      <div className='absolute inset-0 z-0'>
        <Image src='/images/programs/hero_section_bg.png' alt='' fill priority sizes='100vw' />
      </div>

      <Header />

      <div className='container px-4 relative z-10 pt-[33px] pb-[0px] md:pb-[0px] lg:pt-[97px] lg:pb-[165px]'>
        <div className='flex flex-col items-center justify-between gap-10 lg:flex-row lg:items-start lg:gap-[127px]'>
          {/* IMAGE */}
          <div className='order-1 flex w-full justify-center lg:order-2 lg:w-auto z-10'>
            <div
              className='
								relative
								w-[380px] h-[360px]
								rounded-t-[9999px] rounded-b-[24px]
								md:w-[490px] md:h-[560px]
								lg:w-[490px] lg:h-[557px]
								lg:rounded-none
							'
            >
              {/* Image */}
              <Image
                src='/images/compatibility/hero_section.png'
                alt='THE COMPATIBILITY CODE REPORT'
                fill
                priority
                quality={100}
              />

              {/* Bottom fade (mobile + tablet) */}
              <div className='absolute bottom-0 left-0 right-0 h-[45%] md:h-[38%] bg-gradient-to-t from-[#F6EFEA] via-[#F6EFEA]/70 to-transparent pointer-events-none lg:hidden' />

              {/* Arc + ornament */}
              <ArcAutoOnce
                className='
									absolute inset-0 -z-0 pointer-events-none
									-translate-y-[13%] -translate-x-[-7%]
									md:-translate-y-[13%] md:-translate-x-[-8%]
									lg:-translate-y-[13%] lg:-translate-x-[-7%]
								'
                flightStart={0.2}
                durMs={1500}
                arrowRotateDeg={254}
                arrowScale={0.8}
                arrowCenterX={6.5}
                arrowCenterY={-6}
                arrowOffsetY={3}
                endAtByDevice={{ mobile: 0.87, desktop: 0.9 }}
                arcEnd={{ x: -60, y: 219 }}
                arcRx={260}
                arcRy={260}
              />

              <RotateOnView
                duration={5}
                ease='easeOut'
                className='absolute lg:left-[30%] left-[20%] pointer-events-none z-[1]
			bottom-[-130px]
			md:bottom-[-110px]
			lg:bottom-[-100px]
			hidden lg:block
			'
              >
                <Image
                  src='/icons/ornament_13.svg'
                  alt=''
                  width={209}
                  height={215}
                  priority
                  quality={100}
                  className='
			
		'
                />
              </RotateOnView>
            </div>
          </div>

          {/* TEXT */}
          <div className='order-2 w-full lg:order-1 lg:text-left flex flex-col z-20 translate-y-[-70px]'>
            {/* Title */}
            <h1
              className='
								relative z-10
								order-1
								font-canela font-thin text-brand-deep
								leading-[1.05]
								text-center lg:text-left
								text-[32px]
								md:text-[44px]
								lg:text-[60px]
							'
            >
              THE <br className='hidden lg:block' /> COMPATIBILITY <br className='hidden lg:block' /> CODE REPORT
            </h1>

            {/* CTA (mobile under title, desktop bottom) */}
            <div className='mt-6 md:mt-7 lg:mt-[32px] order-2 lg:order-4'>
              <Button
                variant='primary'
                className='w-full lg:w-[75%] '
                href={COMPABILITY_REPORT_LINKS.HERO_LINK.href}
                trackingData={{
                  cta_name: 'compatibility_hero_cta',
                  cta_text: COMPABILITY_REPORT_LINKS.HERO_LINK.label,
                  cta_location: 'hero',
                }}
              >
                {COMPABILITY_REPORT_LINKS.HERO_LINK.label}
              </Button>
            </div>

            {/* Subtitle */}
            <p
              className='
								mt-6 md:mt-7
								order-3 lg:order-2
								font-canela font-thin text-brand-deep
								leading-[1.25]
								text-center lg:text-left
								text-[28px]
								md:text-[32px]
								lg:text-[32px]
							'
            >
              Your Relationship Has a Code. Most People Never Crack It.
            </p>

            {/* Body */}
            <div
              className='
								mt-[32px] md:mt-6
								lg:mt-6
								order-4 lg:order-3
								text-center lg:text-left
								max-w-[680px] lg:max-w-none
								mx-auto lg:mx-0
							'
            >
              <p className='font-lato font-normal text-[#5A5757] leading-[150%] text-body md:text-body'>
                Every coupling contains an algorithm that dictates how you connect, where you clash, and whether
                you&apos;re destined to grow together or quietly unravel. Most people stumble through relationships
                blind to this algorithm. They blame &quot;communication issues&quot; or &quot;growing apart&quot; when
                the real problem was written in their numbers from day one.
              </p>

              <p
                className='mt-5 font-canela font-thin text-brand-deep leading-[120%] text-[28px]
								text-center lg:text-left
								md:text-[32px]
								lg:text-[32px]'
              >
                The question isn&apos;t whether you love each other. <br className='lg:hidden' /> It&apos;s whether you
                are coded to build together—or collide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
