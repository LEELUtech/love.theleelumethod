import React from 'react';
import Image from 'next/image';
import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Button from '@/components/ui/Button';
import RotateOnView from '@/components/ui/RotateOnView';
import { HOME_LINKS } from '@/static/links';

export function MasterclassSection() {
  return (
    <section className='bg-brand-white text-brand-deep pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-[112px] lg:pb-[160px]'>
      <div className='container px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-12 lg:gap-16 overflow-hidden'>
        <div className='order-1 md:order-1 w-full md:max-w-[520px]'>
          <p className='font-canela hidden md:block lg:block font-light text-[32px] leading-[126%] tracking-normal text-black mb-6'>
            Free Live Masterclass
          </p>
          <h2 className='text-[48px] text-center md:text-left lg:text-left lg:text-h1 font-thin md:font-light lg:font-light font-canela text-brand-deep mb-6'>
            Decoded Love
          </h2>
          <p className='text-body font-canela font-light text-[#5A5757] mb-6 text-center md:text-left lg:text-left'>
            Discover the 3 secrets to choosing the right partner, creating healthy connection, and ending the cycle of
            disappointment forever.
          </p>
          <div className='text-body text-brand-deep/80 space-y-2 mb-10'>
            <p className='font-canela text-body font-light leading-[26px] text-[#5A5757] mb-6 text-center md:text-left lg:text-left'>
              What you&apos;ll learn:
            </p>
            <ul className='pl-2 md:pl-4 font-lato text-body font-medium leading-[26px] space-y-4 text-[#5A5757]'>
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
                <span>Why attraction follows algorithmic patterns—and how to stop investing in incompatible men.</span>
              </li>
            </ul>
          </div>
          <Button variant='dark' className='w-full max-w-[340px]' href={HOME_LINKS.DECODED_LINK.href}>
            {HOME_LINKS.DECODED_LINK.label}
          </Button>
        </div>
        <div className='order-2 md:order-2 flex pt-4 md:pt-0 lg:pt-0 justify-center w-full'>
          <div className='relative w-full max-w-[642px]  aspect-[642/466]'>
            <Image
              src='/images/resources/resources-webinar-section.png'
              alt='Decoded Love Masterclass'
              fill
              priority
              quality={100}
              sizes='(min-width:1024px) 642px, (min-width:768px) 80vw, 90vw'
            />

            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20'>
              <div className='flex items-center justify-center rounded-full bg-white shadow-[0px_6px_20px_rgba(0,0,0,0.12)] size-[86px] md:size-[96px] lg:size-[104px]'>
                <RotateOnView
                  duration={5}
                  amount={0.5}
                  className='relative size-[70px] md:size-[70px] lg:size-[80px]'
                  ease='easeOut'
                >
                  <Image src='/icons/ornament_2/ornament_2_black.svg' alt='' fill priority quality={100} />
                </RotateOnView>
              </div>
            </div>
            <ArcAutoOnce
              className='absolute inset-0 -z-0 -translate-y-[35%] pointer-events-none -translate-x-[-26%]'
              endAt={0.52}
              // flightStart={0.03}
              durMs={1500}
              arrowRotateDeg={254}
              arrowScale={0.8}
              arrowCenterX={6.5}
              arrowCenterY={-8}
              arrowOffsetY={3}
              // arcRx={220}
              // arcRy={208}
              // endAtByDevice={{ mobile: 0.87, desktop: 0.9 }}
              arcEnd={{ x: 40, y: 450 }}
              arcRx={1}
              arcRy={1}
              flightStart={0.01}
              flatStart={150}
              arcStart={{ x: 200, y: 100 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
