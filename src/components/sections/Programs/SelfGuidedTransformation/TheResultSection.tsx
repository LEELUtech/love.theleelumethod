import Image from 'next/image';
import React from 'react';
import RotateOnView from '@/components/ui/RotateOnView';
import { LogoIC } from '@/components/icons';
import Button from '@/components/ui/Button';

export default function TheResultSection() {
  return (
    <section className='relative overflow-hidden bg-[#FFAD9821]'>
      <div
        className='absolute inset-0'
        style={{
          background: 'url("/images/bg/waves_bg.jpg")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: '0.05',
        }}
      />

      <div className='text-center	max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[112px] 2xl:px-[180px] relative py-[80px] lg:pb-[143px] lg:pt-[70px]'>
        <div className='relative'>
          <RotateOnView duration={10} repeat={false} amount={0.1} ease='easeOut' className='w-full h-full'>
            <LogoIC className='text-white mx-auto' />
          </RotateOnView>
        </div>

        <div className='relative z-10 flex -mt-[285px] justify-center mb-8 md:mb-10 lg:mb-8'>
          <div className="relative h-[129px] w-[93px] md:h-[140px] md:w-[100px] lg:h-[140px] lg:w-[96px] overflow-hidden bg-[#EB4F68] before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay rounded-full flex items-center justify-center">
            <div className='relative w-[56px] h-[56px]'>
              <Image src='/leelu_logo.svg' alt='' fill className='object-contain filter brightness-0 invert' />
            </div>
          </div>
        </div>

        <p className='relative z-10 font-canela font-thin text-brand-deep text-[48px] md:text-[52px] lg:text-[60px] tracking-normal uppercase'>
          THE RESULT
        </p>

        <h2
          className='
						relative z-10 mt-4 font-canela font-thin text-brand-deep tracking-normal
						text-[60px] leading-[100%]
						md:text-[84px] md:leading-[0.95]
						lg:text-[112px] lg:leading-[100%]
					'
        >
          Clarity.
        </h2>

        <p className='mt-12 font-lato font-normal text-[#5A5757] text-[24px]/[150%] mb-[60px] md:mt-10 md:text-[22px] lg:mt-12 lg:text-[24px] max-w-[808px] mx-auto'>
          You stop operating on instinct (which is traumatized) and start operating on intelligence. You will know
          exactly why your past relationships failed and have the specific behavioral blueprint to build the next one on
          solid ground.
        </p>

        <p className='text-[32px]/[100%] font-canela font-light mb-5'>Investment: $697</p>
        <Button href='#' className='px-[80px] py-4'>
          BEGIN THE PROTOCOL
        </Button>
      </div>
    </section>
  );
}
