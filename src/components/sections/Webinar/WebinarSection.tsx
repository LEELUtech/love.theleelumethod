import React from 'react';
import Image from 'next/image';
import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Button from '@/components/ui/Button';
import RotateOnView from '@/components/ui/RotateOnView';
import { DESCODE_LINKS } from '@/static/links';
import { Logo } from '@/components/ui/Logo';

const WebinarSection = () => {
  return (
    <section
      className='text-brand-deep bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: 'url(/images/bg/wooden-bg.jpg)' }}
    >
      <div className='container pt-[33px] pb-[30px] md:pb-28 lg:pt-[97px] lg:pb-[165px] px-4 flex flex-col-reverse lg:flex-row items-center justify-between md:gap-12 lg:gap-16'>
        <div className='w-full max-w-[530px] lg:text-left md:static -mt-[60px] lg:mt-0 relative z-10'>
          <div className='font-light hidden transition lg:flex text-[20px] md:text-[22px] lg:text-[24px] leading-[126%] font-canela  items-center gap-2 md:gap-2.5 lg:gap-3 text-brand-black mb-[32px] justify-center md:justify-start'>
            <Logo />
          </div>

          <div className='text-center lg:text-left relative z-[100]'>
            <p className='text-[28px]/[126%] font-canela font-light text-black'>Free Masterclass</p>
            <h1 className='lg:text-[60px] leading-tight font-thin md:text-[48px] font-canela text-brand-deep mb-6 text-[48px]'>
              Decoded Love
            </h1>
          </div>

          <p className='text-body relative z-[100] font-canela font-normal text-[#5A5757] mb-4 leading-[26px] text-center lg:text-left md:text-left'>
            Discover the <span className='text-brand-primary'>3 secrets</span> to choosing the right partner, creating
            healthy connection, and ending the cycle of disappointment forever.
          </p>

          <div className='flex flex-col'>
            <div className='order-2 md:order-1 text-body text-[#5A5757] mt-8 md:mt-0 mb-8'>
              <p className='font-canela text-body font-normal leading-[26px] mb-8 lg:mb-6 text-center lg:text-left md:text-left'>
                What you&apos;ll learn:
              </p>

              <ul className='list-none pl-2 md:pl-8 font-lato text-body font-medium leading-[26px] space-y-4'>
                <li className='flex gap-2 items-start'>
                  <div className='w-4 h-4 pt-2 flex-shrink-0'>
                    <Image src='/icons/arrow_right.svg' alt='Arrow' width={10} height={10} className='object-contain' quality={100} />
                  </div>
                  <span>Your identity-level programming that determines partner selection and how to rewire it.</span>
                </li>

                <li className='flex gap-2 items-start'>
                  <div className='w-4 h-4 pt-2 flex-shrink-0'>
                    <Image src='/icons/arrow_right.svg' alt='Arrow' width={10} height={10} className='object-contain' quality={100} />
                  </div>
                  <span>
                    How early attachment imprints create repetitive relationship dynamics across different partners.
                  </span>
                </li>

                <li className='flex gap-2 items-start'>
                  <div className='w-4 h-4 pt-2 flex-shrink-0'>
                    <Image src='/icons/arrow_right.svg' alt='Arrow' width={10} height={10} className='object-contain' quality={100} />
                  </div>
                  <span>
                    Why attraction follows algorithmic patterns—and how to stop investing in incompatible men.
                  </span>
                </li>
              </ul>
            </div>

            <div className='order-1 md:order-2 flex justify-center lg:justify-start'>
              <Button
                variant='primary'
                rel='noreferrer'
                target='blank'
                className='w-full md:w-[65%] py-[12px]'
                href={DESCODE_LINKS.HERO_LINK.href}
                trackingData={{
                  cta_name: 'webinar_hero_cta',
                  cta_text: DESCODE_LINKS.HERO_LINK.label,
                  cta_location: 'hero',
                }}
              >
                {DESCODE_LINKS.HERO_LINK.label}
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className='flex justify-center w-full'>
          <div className='relative w-[354px] h-[405px] aspect-[562/693] md:aspect-[466/626] lg:w-[466px] lg:h-[536px]'>
            <div className='flex justify-center lg:hidden mb-10 '>
              <Logo />
            </div>

            <div className='relative w-full max-w-[488px] aspect-[488/536] overflow-hidden'>
              <Image src='/images/webinar/hero_lily.png' alt='Decoded Love Masterclass' fill priority quality={100} />
            </div>

            <ArcAutoOnce
              className='absolute hidden lg:block inset-0 -z-0 -translate-y-[13%] pointer-events-none -translate-x-[-7%]'
              // endAt={0.9}
              flightStart={0.2}
              durMs={1500}
              arrowRotateDeg={254}
              arrowScale={0.8}
              arrowCenterX={6.5}
              arrowCenterY={-6}
              arrowOffsetY={3}
              // arcRx={220}
              // arcRy={208}
              endAtByDevice={{ mobile: 0.87, desktop: 0.9 }}
              arcEnd={{ x: -60, y: 219 }}
              arcRx={260}
              arcRy={260}
            />

            <RotateOnView
              className='absolute bottom-[-60px] left-[140px] hidden lg:block pointer-events-none'
              duration={5}
              ease='easeOut'
            >
              <Image
                src='/icons/ornament_2/ornament_2_pink.svg'
                alt=''
                width={209}
                height={215}
                priority
                quality={100}
              />
            </RotateOnView>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebinarSection;
