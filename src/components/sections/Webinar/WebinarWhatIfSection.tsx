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
        <div className='flex mt-[100px] mb:mt-0 flex-col items-center gap-[107px] mb-12	md:flex-row md:gap-12 md:mb-20'>
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
              className='absolute inset-0 -z-0 -translate-y-[13%] pointer-events-none -translate-x-[-7%]'
              // endAt={0.9}
              flightStart={0.2}
              durMs={1300}
              arrowRotateDeg={248}
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
            <div
              className='
    /* Mobile default */
    w-[124px] h-[167px]

    lg:bottom-[-90px] lg:left-[-50px]
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
            <h2 className='font-canela font-thin text-brand-deep tracking-normal text-[48px]/[130%] mb-6 md:text-[48px] md:mb-8 md:text-left lg:text-[60px] lg:mb-[50px]'>
              What if the women who have the love you want... AREN&apos;T lucky or special?
            </h2>

            <div className='font-lato font-medium text-[#5A5757] text-[17px]/[130%] md:text-left'>
              <p>Women who have the love you want aren&apos;t luckier, more confident, or more charming than you.</p>

              <p className='mt-4 md:mt-5'>
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
							// md:p-10 md:mt-16
							md:bottom-[-500px]

							/* DESKTOP (unchanged) */
							lg:absolute lg:p-[80px] lg:h-[877px] lg:w-full lg:max-w-[1224px] lg:mx-auto lg:bottom-[-350px] lg:left-1/2 lg:-translate-x-1/2
						'
        >
          <h3
            className='
								font-canela font-thin lg:text-center text-left text-brand-deep text-[48px]/[130%] mb-8 md:text-[40px] md:mb-12 lg:text-[60px] lg:mb-[64px]'
          >
            By the end of this free training, you will:
          </h3>

          <div className='mb-[58px] max-w-[845px] mx-auto'>
            {[
              {
                parts: [
                  { text: 'Break the emotional', bold: true },
                  {
                    text: ' loops that cause anxiety, fear, and self-sabotage.',
                  },
                ],
              },
              {
                parts: [
                  { text: 'Decode your love script', bold: true },
                  {
                    text: ' so you stop repeating the same painful patterns.',
                  },
                ],
              },
              {
                parts: [
                  {
                    text: 'Identify the "Compatibility Code" required for true partnership—so you can vet for ',
                  },
                  {
                    text: 'long-term fit instead of just short-term chemistry.',
                    bold: true,
                  },
                ],
              },
              {
                parts: [
                  { text: 'Shift into an identity that ' },
                  { text: 'naturally', bold: true },
                  {
                    text: ' attracts healthy, grounded, emotionally available men.',
                  },
                ],
              },
              {
                parts: [
                  {
                    text: 'Create lasting, meaningful connection from clarity, ensuring your next relationship is built on a foundation of ',
                  },
                  { text: 'deep intimacy and enduring love.', bold: true },
                ],
              },
            ].map((item, i) => (
              <div key={i} className={`flex gap-8 items-center ${i !== 0 ? 'mt-6 lg:mt-8' : ''}`}>
                <div className='font-canela font-light text-[32px] flex-shrink-0'>{i + 1}.</div>

                <p className='font-lato font-medium text-[#5A5757] text-[20px]/[130%]'>
                  {item.parts.map((part, idx) =>
                    part.bold ? (
                      <span key={idx} className='font-bold text-brand-primary'>
                        {part.text}
                      </span>
                    ) : (
                      <span key={idx} className='font-medium'>
                        {part.text}
                      </span>
                    ),
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className='flex justify-center'>
            <Button
              variant='primary'
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
