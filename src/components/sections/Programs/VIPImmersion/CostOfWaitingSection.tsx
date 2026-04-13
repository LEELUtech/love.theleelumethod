'use client';

import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Button from '@/components/ui/Button';
import { ArrowList } from '@/components/ui/lists';
import { formatPriceFromCents } from '@/helpers';
import { VIP_LINKS } from '@/static/links';
import useProductStore from '@/store/useProductStore';
import { VIP_IMMERSION } from '@/utils/constants';
import { Flex } from 'antd';
import Image from 'next/image';
import React from 'react';

const whosThisList = [
  'Serious about implementation (not just information gathering)',
  'Financially committed to the transformation',
  'Emotionally ready to see uncomfortable truths',
  'Willing to take direction and apply the system precisely',
];

const wthoThisHightlight = [
  `If you're looking for someone to tell you you're right and he's wrong, this isn't the right fit. `,
  `I'll validate your experience—but I won't validate the pattern that's keeping you stuck. If you need a guide who can see what you cannot, who will tell you the truth even when it's difficult, and who respects you enough to be direct, apply below.`,
];

export default function CostOfWaitingSection({ cohortLabel }: { cohortLabel?: string | null }) {
  const productId = VIP_IMMERSION;

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
    <section className='text-center'>
      <article className='relative'>
        <div className='relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[112px] 2xl:px-[180px] pb-[110px]'>
          <div className='flex justify-center mb-12 relative pt-[230px] md:pt-[300px] lg:pt-[300px]'>
            <div className='absolute w-[268px] h-[290px] sm:w-[358px] sm:h-[376px] top-[-100px] overflow-visible'>
              <Image
                src='/images/programs/vip-immersion/man-holding-rose-flower-back_1.png'
                alt='Stop Guessing'
                fill
                quality={85}
                sizes='(min-width: 640px) 358px, 320px'
                className='object-contain'
              />

              <div
                className='
                  absolute left-1/2 -translate-x-1/2
                  bottom-[-50px] sm:bottom-[-50px]
                  flex items-center justify-center
                  bg-[#EB4F68] rounded-[300px] z-10
                  w-[74px] h-[102px]
                  lg:w-[101px] lg:h-[140px]
                '
              >
                <div className='relative w-[45px] h-[45px] lg:w-[58px] lg:h-[56px]'>
                  <Image src='/leelu_logo.svg' alt='' fill className='filter brightness-0 invert' quality={85} />
                </div>
              </div>

              {/* Arc */}
              <ArcAutoOnce
                className='absolute inset-0 -z-0 -translate-y-[13%] pointer-events-none -translate-x-[2%]'
                endAt={0.9}
                flightStart={0.2}
                durMs={2500}
                startDelayMs={800}
                arrowRotateDeg={254}
                arrowScale={0}
                arrowCenterX={6.5}
                arrowCenterY={-6}
                arrowOffsetY={3}
                arcRx={200}
                arcRy={188}
                strokeWidth={3}
              />
            </div>
          </div>

          <h2 className='font-thin text-[48px] mt-[60px] md:mt-0 lg:text-[60px] leading-[126%] font-canela text-brand-deep mb-8'>
            THE COST OF WAITING
          </h2>

          <p className='font-normal font-lato text-[17px]/[26px] text-[#5A5757] mb-6 lg:mb-8 text-center'>
            {`A contested divorce costs $30,000-$100,000. Custody battles can exceed $250,000. Years of therapy trying to "process" what went wrong: $15,000+.`}
          </p>

          <p className='font-canela text-[32px] font-thin lg:text-[32px] leading-[130%] text-brand-deep mb-6 lg:mb-6 mx-auto text-center'>
            {`But the real cost? The year you spend trying to fix an unfixable relationship. The decade you lose rebuilding after the wrong marriage. The life you didn't live because you were trapped in someone else's patterns.`}
          </p>

          <div className='relative mx-auto w-[8px] h-[66px]'>
            <Image src='/icons/yellow_stick.svg' alt='' fill quality={85} />
          </div>

          <p className='mt-4 font-canela font-normal text-brand-deep text-[32px] leading-[1.6]'>
            The Leelu Method VIP Immersion is the cheapest insurance policy you will ever buy.
          </p>
        </div>{' '}
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
      </article>

      <article className='relative'>
        <div className='relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[112px] 2xl:px-[180px] lg:pb-[100px]'>
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 mt-[102px] items-center'>
            <div className='text-left'>
              <h2 className='font-canela font-thin text-[60px] leading-[1.05] text-brand-deep lg:text-[60px] text-center lg:text-left'>
                WHO THIS IS FOR
              </h2>

              <p className='my-8 font-lato text-body leading-[1.6] text-[#8A8F9E]'>
                This level of work requires protected capacity. I can only offer this depth of personal involvement to
                women who are:
              </p>

              <ArrowList list={whosThisList} type='light' />

              <Flex vertical gap={24} className='mt-12 max-w-[500px]'>
                {wthoThisHightlight.map((c, idx) => (
                  <p key={idx} className='font-canela font-light text-[32px]/[130%] text-brand-deep'>
                    {c}
                  </p>
                ))}
              </Flex>
            </div>

            <div className='relative mx-auto w-full max-w-[560px]'>
              <div className='relative max-w-[595px] h-[530px] md:h-[813px] lg:h-[813px] rounded-[100px] overflow-hidden'>
                <Image src='/images/lily/lily_15.jpeg' alt='' fill quality={85} className='object-cover' />
              </div>
            </div>
          </div>

          <p className='lg:mt-[124px] mt-[84px] font-canela font-thin text-brand-black text-[48px] lg:text-[60px]'>
            Investment: {priceLabel}
          </p>

          <Button
            variant='primary'
            className='w-full max-w-[347px] mt-[32px]'
            href={VIP_LINKS.WHO_LINK.href}
            trackingData={{
              cta_name: 'vip_cost_of_waiting_cta',
              cta_text: VIP_LINKS.WHO_LINK.label,
              cta_target_url: VIP_LINKS.WHO_LINK.href,
              cta_location: 'cost_of_waiting',
            }}
          >
            {VIP_LINKS.WHO_LINK.label}
          </Button>

          <p className='font-lato text-body font-normal text-[#757986] mt-[21px]'>
            (3 spots available per month due to the depth of personal involvement required)
          </p>

          <p className='font-lato text-body font-normal text-[#757986] mt-[12px]'>
            Applications are reviewed within 48 hours. If accepted, you&apos;ll receive calendar access to book your
            initial diagnostic session.
          </p>

          <p className='text-brand-primary font-lato font-normal text-[24px] mb-[70px] leading-[150%] mt-[33px]'>
            <span className='text-brand-deep'>Next cohort starts</span> {cohortLabel ?? 'March 18'}
          </p>
        </div>
      </article>
    </section>
  );
}
