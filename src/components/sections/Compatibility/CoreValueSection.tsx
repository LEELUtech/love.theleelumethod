'use client';

import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Image from 'next/image';
import React from 'react';

import useProductStore from '@/store/useProductStore';
import { COMPATIBILITY_REPORT } from '@/utils/constants';
import { formatPriceFromCents } from '@/helpers';
import RotateOnView from '@/components/ui/RotateOnView';

const CoreValueSection = () => {
  const productId = COMPATIBILITY_REPORT;

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
          showCents: true,
        })
      : '...';

  return (
    <section className='relative pb-[100px] lg:pb-[215px] pt-[90px] md:pt-[130px] lg:pt-[130px] bg-brand-white'>
      <div className='container px-4'>
        <div className='mx-auto text-center'>
          {/* Top Image */}
          <div className='flex justify-center mb-12 relative'>
            <div className='absolute w-[346px] h-[331px] top-[-320px] overflow-visible'>
              <Image src='/images/compatibility/core_value_section.png' alt='' fill quality={100} />

              <div
                className="
									absolute left-1/2 bottom-[-40px] -translate-x-1/2
									flex items-center justify-center overflow-hidden
									bg-[#EB4F68]
									before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay
									rounded-[300px]
									w-[80px] h-[100px]
									md:w-[100px] md:h-[126px]
									lg:w-[101px] lg:h-[140px]
									z-10
								"
              >
                <RotateOnView duration={17} amount={0.4} ease='easeOut'>
                  <Image
                    src='/leelu_logo.svg'
                    alt=''
                    width={63}
                    height={61}
                    className='w-[51px] h-[53px] md:w-[65px] md:h-[63px] lg:w-[61px] lg:h-[63px] filter invert-[100%] brightness-[100%]'
                    quality={100}
                  />
                </RotateOnView>
              </div>

              {/* Arc */}
              {/* <ArcAutoOnce
								className="absolute inset-0 -z-0 -translate-y-[15%] pointer-events-none -translate-x-[2%]"
								endAt={0.9}
								flightStart={0.2}
								durMs={2500}
								startDelayMs={800}
								arrowRotateDeg={254}
								arrowScale={0}
								arrowCenterX={6.5}
								arrowCenterY={-6}
								arrowOffsetY={3}
								arcRx={220}
								arcRy={208}
							/> */}

              <ArcAutoOnce
                className='absolute inset-0 -z-0 -translate-y-[18%] pointer-events-none -translate-x-[4%]'
                endAt={0.9}
                flightStart={0.2}
                durMs={2500}
                startDelayMs={800}
                arrowRotateDeg={254}
                arrowScale={0}
                arrowCenterX={6.5}
                arrowCenterY={-6}
                arrowOffsetY={3}
                arcRx={220}
                arcRy={208}
                strokeWidth={3}
              />
            </div>
          </div>

          {/* Heading */}
          <h2 className='max-w-[1000px] mx-auto font-thin text-[32px]/[44px] font-canela text-brand-deep mb-6 mt-[80px] md:mt-[180px]'>
            This is the foundational intelligence most couples pay thousands in therapy to maybe, eventually uncover.{' '}
            <span className='font-normal'>You&apos;re getting it in 60 seconds for {priceLabel}</span>
            —the price of a small coffee.
          </h2>
        </div>
      </div>
    </section>
  );
};

export default CoreValueSection;
