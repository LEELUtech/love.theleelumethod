import React from 'react';
import Image from 'next/image';
import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Button from '@/components/ui/Button';
import { DESCODE_LINKS } from '@/static/links';
import { Section } from '@/components/ui/containers/section';

const WebinarWhatIfSection = () => {
  return (
    <Section backgroundImage='/images/bg/whatif-bg.jpg' wrapperClasses='xs:!pb-[120px] lg:!pb-[650px] !z-[9999]'>
      <div>
        {/* TOP SECTION */}
        <div className='flex mt-[100px] mb:mt-0 flex-col items-center gap-[107px] mb-[780px] xs:mb-[580px] min-[474px]:max-[574px]:!mb-[550px] sm:mb-[420px] md:flex-row md:gap-12 md:mb-[380px] lg:mb-20'>
          {/* Image */}
          <div className='relative flex justify-center w-full h-[489px] max-w-[380px] lg:max-w-[500px] lg:h-[700px] lg:aspect-auto'>
            <Image
              src='/images/smile-relax-portrait.jpg'
              alt=''
              fill
              quality={100}
              className='object-cover scale-x-[-1] object-[41%_30%] rounded-[1000px]'
            />
            <ArcAutoOnce
              className='absolute block inset-0 -z-0 -translate-y-[13%] pointer-events-none -translate-x-[-7%]'
              flightStart={0.2}
              durMs={1300}
              arrowRotateDeg={248}
              arrowScale={1}
              arrowCenterX={6.5}
              arrowCenterY={-6}
              arrowOffsetY={3}
              endAtByDevice={{ mobile: 0.87, desktop: 0.9 }}
              arcEnd={{ x: -60, y: 219 }}
              arcRx={260}
              arcRy={260}
            />
            <div
              className='
    /* Mobile default */
    w-[124px] h-[167px]
    xl:bottom-[-90px] xl:left-[-30px]
    lg:bottom-[-90px] lg:left-[-20px]
    bottom-[-30px] left-[-10px]
    md:bottom-[-50px] md:left-[-10px]

    /* Desktop */
    lg:w-[220px] lg:h-[307px]

    absolute
    overflow-hidden
    rounded-[1000px]
  '
            >
              <div className='absolute inset-0 scale-[1.12]'>
                <Image
                  src='/images/lily/lily_1.png'
                  alt=''
                  fill
                  quality={100}
                  className='object-cover object-[50%_35%]'
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className='w-full md:w-1/2'>
            <h2 className='font-canela font-thin text-brand-deep tracking-normal text-[48px]/[130%] mb-8 md:text-[48px] md:mb-8 md:text-left lg:text-[60px] lg:mb-[50px]'>
              What if the women who have the love you want... AREN&apos;T lucky or special?
            </h2>

            <div className='font-lato font-medium text-[#5A5757] text-[17px]/[130%] md:text-left'>
              <p>Women who have the love you want aren&apos;t luckier, more confident, or more &apos;feminine&apos; than you.</p>

              <p className='mt-8 md:mt-6'>
                They simply stopped guessing. They learned to read the internal codes driving their relationships
                instead of fighting them. In this training, I don&apos;t teach you how to &apos;act&apos;. I show you
                how to read the data.
              </p>

              <p className='font-canela font-thin text-brand-deep tracking-normal mt-8 text-[32px]/[130%]'>
                Because once you understand the architecture of your own love script, you stop repeating the pattern—and
                start rewriting it.
              </p>
            </div>
          </div>
        </div>

        {/* WHITE BOX */}
        <div
          className='
								bg-white rounded-[32px] shadow-[0_4px_12px_0_#00000014]

								/* MOBILE */
								absolute pt-[50px] px-[24px] pb-[50px]
								bottom-[-960px]
								left-1/2 -translate-x-1/2
								w-[calc(100%-32px)]

								/* TABLET */
								md:bottom-[-500px]

								/* DESKTOP */
								lg:absolute lg:p-[80px] lg:w-full lg:max-w-[1224px] lg:mx-auto lg:bottom-[-350px] lg:left-1/2 lg:-translate-x-1/2
							'
        >
          <h2 className='font-canela font-thin leading-[110%] text-center text-brand-deep mb-10 md:mb-12 lg:mb-16 text-[40px] md:text-[48px] lg:text-[60px]'>
            Inside the free masterclass, you will learn:
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-22 mb-10 lg:mb-12'>
            {/* Card 1 */}
            <div className='flex flex-col items-center lg:text-left'>
              <div className='w-full flex justify-center md:justify-start'>
                <div className='relative mb-5 md:mb-6 w-[140px] md:w-[160px] lg:w-[177px] aspect-[177/251]'>
                  <Image src='/images/webinar/webinar_discover_icon.png' alt='' fill className='object-contain' />
                  <Image src='/icons/ornament_9.svg' alt='' width={87} height={87} className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60px] pointer-events-none' />
                  <div className='font-canela font-light text-[#c89f26] absolute bottom-0 left-0 text-[60px]'>1.</div>
                </div>
              </div>
              <div>
                <h3 className='font-canela font-light text-brand-black mb-3 lg:mb-4 text-[24px] leading-[130%] lg:text-left text-center'>
                  Why You Attract Who You Are Not Who You Want
                </h3>
                <p className='font-lato font-medium text-[#5A5757] tracking-[0.03em] text-[17px] leading-[26px] lg:text-left text-center'>
                  How your internal baseline dictates partner selection, and the specific identity shift that finally attracts your ideal mate.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className='flex flex-col items-center lg:text-left'>
              <div className='w-full flex justify-center md:justify-start'>
                <div className='relative mb-5 md:mb-6 w-[140px] md:w-[160px] lg:w-[177px] aspect-[177/251]'>
                  <Image src='/images/webinar/webinar_discover_icon.png' alt='' fill className='object-contain' />
                  <Image src='/icons/ornament_10.svg' alt='' width={87} height={87} className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60px] pointer-events-none' />
                  <div className='font-canela font-light text-[#c89f26] absolute bottom-0 left-0 text-[60px]'>2.</div>
                </div>
              </div>
              <div>
                <h3 className='font-canela font-light text-brand-black mb-3 lg:mb-4 text-[24px] leading-[130%] lg:text-left text-center'>
                  Your Subconscious Love Script
                </h3>
                <p className='font-lato font-medium text-[#5A5757] tracking-[0.03em] text-[17px] leading-[26px] lg:text-left text-center'>
                  The childhood programming creating repetitive relationship dynamics—and how energetic ties to past partners keep you locked in destructive patterns.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className='flex flex-col items-center lg:text-left'>
              <div className='w-full flex justify-center md:justify-start'>
                <div className='relative mb-5 md:mb-6 w-[140px] md:w-[160px] lg:w-[177px] aspect-[177/251]'>
                  <Image src='/images/webinar/webinar_discover_icon.png' alt='' fill className='object-contain' />
                  <Image src='/icons/ornament_11.svg' alt='' width={87} height={87} className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60px] pointer-events-none' />
                  <div className='font-canela font-light text-[#c89f26] absolute bottom-0 left-0 text-[60px]'>3.</div>
                </div>
              </div>
              <div>
                <h3 className='font-canela font-light text-brand-black mb-3 lg:mb-4 text-[24px] leading-[130%] lg:text-left text-center'>
                  Your Destruction Pattern & Compatibility Formula
                </h3>
                <p className='font-lato font-medium text-[#5A5757] tracking-[0.03em] text-[17px] leading-[26px] lg:text-left text-center'>
                  The specific way you push love away when triggered — and the coded map that predicts whether a relationship will grow or collapse.
                </p>
              </div>
            </div>
          </div>

          <div className='flex justify-center'>
            <Button
              variant='primary'
              rel='noreferrer'
              target='blank'
              className='w-full max-w-[340px]'
              href={DESCODE_LINKS.REGISTER_LINK.href}
              trackingData={{
                cta_name: 'webinar_whatif_register_cta',
                cta_text: DESCODE_LINKS.REGISTER_LINK.label,
                cta_location: 'webinar_what_if',
              }}
            >
              {DESCODE_LINKS.REGISTER_LINK.label}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default WebinarWhatIfSection;
