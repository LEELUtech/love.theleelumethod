'use client';

import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Image from 'next/image';
import React from 'react';

import useProductStore from '@/store/useProductStore';
import { PROTOCOL_ESSENTIALS } from '@/utils/constants';
import { formatPriceFromCents } from '@/helpers';
import Button from '@/components/ui/Button';

export default function CostOfWaitingSection() {
  const productId = PROTOCOL_ESSENTIALS;

  // product store
  const product = useProductStore((s) => s.getProduct(productId));
  const loading = useProductStore((s) => s.isLoading(productId));
  const fetchProduct = useProductStore((s) => s.fetchProduct);

  React.useEffect(() => {
    if (!product && !loading) fetchProduct(productId);
  }, [product, loading, fetchProduct, productId]);

  const priceLabel =
    !loading && product
      ? formatPriceFromCents(product.price, {
          currency: product.currency ?? 'USD',
          showCents: false,
        })
      : '...';

  return (
    <section className='relative lg:pb-[116px] pb-[180px]'>
      <div className='max-w-[1600px] mx-auto sm:px-6 lg:px-[112px] 2xl:px-[180px] relative py-[80px] lg:py-[110px] px-4'>
        <div className='text-center'>
          {/* Top Image */}
          <div className='flex justify-center mb-12 relative pt-[230px] md:pt-[300px] lg:pt-[300px]'>
            <div
              className='
                absolute
                w-[268px] h-[290px]
                sm:w-[358px] sm:h-[376px]
                top-[-100px]
                overflow-visible
              '
            >
              <Image
                src='/images/programs/self-guided-transformation/sad-anxiety-depressed.jpg'
                alt='Stop Guessing'
                fill
                quality={100}
                className='object-cover rounded-t-[200px] object-[90%_50%]'
              />
              {/* Logo badge */}
              <div
                className="
                  absolute left-1/2 -translate-x-1/2
                  bottom-[-50px] sm:bottom-[-50px]
                  flex items-center justify-center
                  bg-[#EB4F68] overflow-hidden
                  before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay rounded-[300px] z-10
                  w-[74px] h-[102px]
                  lg:w-[101px] lg:h-[140px]
                "
              >
                <div className='relative w-[45px] h-[45px] lg:w-[58px] lg:h-[56px]'>
                  <Image src='/leelu_logo.svg' alt='' fill className='filter brightness-0 invert' />
                </div>
              </div>

              {/* Arc */}
              <ArcAutoOnce
                className='absolute inset-0 -z-0 -translate-y-[13%] pointer-events-none -translate-x-[2%]'
                endAt={0.9}
                flightStart={0.2}
                durMs={1500}
                startDelayMs={500}
                arrowRotateDeg={254}
                arrowScale={0}
                arrowCenterX={6.5}
                arrowCenterY={-6}
                arrowOffsetY={3}
                arcRx={220}
                arcRy={208}
              />
            </div>
          </div>

          {/* Heading */}
          <h2 className='font-thin text-[48px] lg:text-[60px] leading-[100%] font-canela text-brand-deep mb-8'>
            THE COST OF WAITING
          </h2>

          {/* Subheading */}
          <p className='font-normal font-lato text-[17px] lg:text-[17px] leading-[130%] text-[#5A5757] mb-6 lg:mb-8 text-center'>
            Every month you delay is another month running corrupted code. Another argument that never needed to happen.
            Another year invested in the wrong man.
          </p>

          <p className='font-canela text-[32px] font-thin lg:text-[32px] leading-[130%] text-brand-deep mb-6 lg:mb-12 mx-auto text-center'>
            The average divorce costs $15,000–$30,000. And that’s the small part. The real cost is weighed in years of
            recovery, fractured family dynamics, and the emotional tax of rebuilding from wreckage.
          </p>

          <div className='relative mx-auto my-[26px] w-[8px] h-[66px]'>
            <Image src='/icons/yellow_stick.svg' alt='' fill quality={100} />
          </div>

          <p className='text-[17px]/[44px] font-lato text-brand-deep'>
            This system costs less than 5 therapy sessions—and gives you the diagnostic framework those sessions never
            will.
          </p>

          <p className='font-canela font-normal text-brand-deep text-[32px] leading-[1.6]'>
            You&apos;re not paying for information. You&apos;re paying for the precise correction
            <br className='hidden md:block' />
            that prevents catastrophic decisions.
          </p>

          <p className='mt-[57px] font-canela font-thin text-brand-black text-[48px] lg:text-[60px]'>
            Investment: {priceLabel}
          </p>

          <Button variant='primary' size='md' className='w-full lg:w-[30%] py-4 px-[60px] xs:text-[12px] mt-[32px]'>
            DECODE MY RELATIONSHIP
          </Button>
        </div>
      </div>

      <div
        className='w-full h-[530px] absolute bottom-0 -z-10'
        style={{
          background: `radial-gradient(120% 100% at 50% 0%,#ffffff 0%,#FFF4F1 20%)`,
          WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
          maskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
        }}
      >
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: "url('/images/bg/noise_bottom_bg.jpg')",
            backgroundSize: 'cover',
            opacity: 0.25,
            mixBlendMode: 'overlay',
          }}
        />
      </div>
    </section>
  );
}
