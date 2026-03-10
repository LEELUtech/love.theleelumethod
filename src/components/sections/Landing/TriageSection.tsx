import Button from '@/components/ui/Button';
import { CantFix } from '@/components/ui/CantFix';
import RotateOnView from '@/components/ui/RotateOnView';
import { QUIZ_URL, WEBINAR_URL } from '@/utils/constants';
import Image from 'next/image';
import React from 'react';

const TriageSection = () => {
  return (
    <section className='relative pt-[57px] pb-[22px] lg:pt-[120px] lg:pb-[112px] overflow-hidden'>
      <div className='absolute inset-0 -z-10'>
        <Image src='/images/landing/triage_section_bg.png' alt='' fill priority quality={100} sizes='100vw' />
      </div>
      <div className='container w-full px-4'>
        <h2 className='font-thin text-[48px]  lg:text-[60px] leading-[126%] font-canela text-brand-deep mb-[50px] lg:mb-[100px] text-center'>
          You cannot fix a pattern you cannot see.
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-[4fr,3fr] gap-[43px] lg:gap-[102px] '>
          {/* Left Column - Image */}
          <div className='flex flex-col gap-5 lg:gap-8 justify-center'>
            <div className='relative md:mb-0 lg:mb-0 w-full rounded-[32px] h-[245px]  overflow-hidden lg:w-[600px] lg:h-[380px]'>
              <Image
                src='/images/landing/triage_section_women_new.png'
                alt='Person sitting with a laptop'
                fill
                priority
                quality={100}
                className=''
              />
            </div>

            <div className='relative flex flex-row items-center gap-3 lg:gap-6'>
              <Image
                src='/images/landing/triage_section_author.png'
                alt='Person sitting with a laptop'
                width={66}
                height={66}
                priority
                quality={100}
                className=''
              />

              <div>
                <div className='font-canela font-light text-[32px]/[130%] text-brand-gray'>Lisa B. Gold, M.A., CH</div>

                <div className='font-lato italic font-normal lg:text-[22px] leading-[26px] text-[#6F4C40] text-[18px]'>
                  Applied Behavior Analyst
                </div>

                <div className='font-lato text-[16px] leading-[22px] text-brand-gray-100 mt-1'>Boca Raton, FL</div>
              </div>
            </div>
          </div>

          {/* Right Column - The Fracture */}
          <div>
            <p className='font-thin text-[32px] leading-[126%] font-canela text-brand-black mb-2'>Thank you</p>
            <h2 className='font-thin text-[42px] leading-[126%] font-canela text-brand-deep mb-8'>
              It was eye-opening
            </h2>
            <p className='font-normal italic text-[#6F4C40] font-lato leading-[26px] tracking-normal mb-6'>
              “ Firstly, my fear of being alone disappeared. Secondly, I understood how I needed to behave, why I
              attracted all these men. I would never have thought that such things as personal relationships and family
              lineage could be connected. “
            </p>
            <Button
              variant='dark'
              size='md'
              className='w-full lg:w-[85%] xs:text-[12px]'
              trackingData={{
                cta_name: 'landing_triage_read_stories_cta',
                cta_text: 'READ MORE STORIES',
                cta_location: 'triage',
              }}
            >
              READ MORE STORIES
            </Button>
          </div>
        </div>
        <CantFix buttonVariant='dark' href='' linkLabel='READ MORE STORIES' />

        <div className='lg:mt-[250px] mt-[200px] mb-[52px] relative lg:mb-[32px]'>
          <div className='absolute z-0 left-1/2 -translate-x-1/2 top-[-150px] md:top-[-180px] lg:top-[-200px] flex flex-row items-center justify-center gap-[130px]'>
            {/* LEFT ornament */}
            <div
              className='
      relative overflow-hidden
      w-[180px] h-[180px]
      lg:w-[238px] lg:h-[249px]

      translate-x-[250px] translate-y-[80px]
      md:translate-x-[120px] md:translate-y-[50px]
      lg:translate-x-[125px] lg:translate-y-[60px]
    '
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            >
              <RotateOnView
                duration={10}
                amount={0.2}
                ease='easeOut'
                className='absolute inset-0'
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                <Image
                  src='/icons/ornament_3.svg'
                  alt=''
                  fill
                  className='object-contain'
                  style={{ filter: 'brightness(200%)' }}
                />
              </RotateOnView>
            </div>
            {/* CENTER ornament */}
            <div
              className='relative overflow-hidden w-[261px] h-[266px] lg:w-[512px] lg:h-[524px]'
              style={{
                WebkitMaskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,0.6) 58%, rgba(0,0,0,0) 88%)',
                maskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,0.6) 58%, rgba(0,0,0,0) 88%)',

                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            >
              <RotateOnView
                duration={5}
                amount={0.2}
                ease='easeOut'
                className='absolute inset-0'
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                <Image
                  src='/icons/ornament_2/ornament_2_light.svg'
                  alt=''
                  fill
                  className='object-contain'
                  style={{ filter: 'brightness(200%)' }}
                />
              </RotateOnView>
            </div>

            {/* RIGHT ornament */}
            <div
              className='
      relative overflow-hidden
      w-[180px] h-[180px]
      lg:w-[259px] lg:h-[242px]

      -translate-x-[250px] translate-y-[90px]
      md:-translate-x-[120px] md:translate-y-[50px]
      lg:-translate-x-[120px] lg:translate-y-[60px]
    '
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            >
              <RotateOnView
                duration={10}
                amount={0.2}
                ease='easeOut'
                className='absolute inset-0'
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                <Image
                  src='/icons/ornament_right.svg'
                  alt=''
                  fill
                  className='object-contain'
                  style={{ filter: 'brightness(200%)' }}
                />
              </RotateOnView>
            </div>
          </div>
          <h2 className='relative font-thin text-[48px] lg:text-[60px] leading-[130%] font-canela text-brand-deep mb-8 text-center z-10 xs:max-w-[309px] lg:max-w-[550px] mx-auto uppercase'>
            The Relationship TRIAGE
          </h2>

          <div className='mt-12 lg:mt-[100px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch justify-items-center'>
            {/* Card 1 */}
            <div className='max-w-[392px] w-full rounded-[24px] bg-brand-white backdrop-blur-md px-[25px] py-[47px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col'>
              <h2 className='text-center text-[38px] lg:text-[42px] font-thin text-brand-deep mb-[34px]'>
                I am <span className='font-light'>Confused</span>
              </h2>

              <p className='text-[20px] font-normal font-canela mb-[20px]'>Is it a trauma bond or a soul connection?</p>

              <p className='font-lato font-normal text-[15px] text-[#41444E] mb-[20px]'>
                Your intuition is currently biased by emotion. Numerological algorithms are not
              </p>

              <p className='font-lato font-normal text-[15px] text-[#41444E] mb-[20px]'>
                Answer 10 questions to uncover:
              </p>

              <p className='font-lato font-normal text-[15px] text-[#41444E] mb-[20px]'>
                <span className='font-semibold'>The Friction Points:</span> Why you keep having the same fight
              </p>

              <p className='font-lato font-normal text-[15px] text-[#41444E] mb-[20px]'>
                <span className='font-semibold'>The Probability:</span> Is this relationship built for the long haul or
                a lesson?
              </p>

              <p className='font-lato font-normal text-[15px] text-[#41444E] mb-[48px]'>
                <span className='font-semibold'>The Truth:</span> What his behavior is actually saying.
              </p>

              <Button
                variant='dark'
                size='md'
                className='w-full xs:text-[12px] mt-auto'
                href={QUIZ_URL}
                trackingData={{
                  cta_name: 'landing_triage_quiz_cta',
                  cta_text: 'TAKE THE QUIZ',
                  cta_location: 'triage',
                }}
              >
                TAKE THE QUIZ
              </Button>
            </div>

            {/* Card 2 (raised on lg only) */}
            <div className='max-w-[392px] w-full rounded-[24px] bg-brand-white backdrop-blur-md px-[25px] py-[47px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col lg:-translate-y-10'>
              <h2 className='text-center text-[38px] lg:text-[40px] font-thin text-brand-deep mb-[34px]'>
                I am Ready to <span className='font-light'>Fix it</span>
              </h2>

              <p className='text-[20px] font-normal font-canela mb-[20px]'>You want the truth? Join the deep dive.</p>

              <p className='font-lato font-normal text-[15px] text-[#41444E] mb-[20px]'>
                I will show you the exact mechanics of why men pull away and how to shift the power dynamic instantly.
              </p>

              <p className='font-lato font-semibold text-[15px] text-[#41444E] mb-[20px]'>We will cover:</p>

              <p className='font-lato font-normal text-[15px] text-[#41444E] mb-[20px]'>
                <span className='font-semibold'>The &quot;Inner Devil&quot;:</span> The dark side of your personality
                that sabotages love.
              </p>

              <p className='font-lato font-normal text-[15px] text-[#41444E] mb-[20px]'>
                <span className='font-semibold'>Hidden Desires:</span> The one thing he needs (that he doesn&apos;t even
                know he needs).
              </p>

              <p className='font-lato font-normal text-[15px] text-[#41444E] mb-[48px]'>
                <span className='font-semibold'>The Script Shift:</span> How to stop over-functioning and inspire his
                loyalty.
              </p>

              <Button
                variant='dark'
                size='md'
                className='w-full xs:text-[12px] mt-auto'
                href={WEBINAR_URL}
                trackingData={{
                  cta_name: 'landing_triage_webinar_cta',
                  cta_text: 'REGISTER FOR WEBINAR',
                  cta_location: 'triage',
                }}
              >
                REGISTER FOR WEBINAR
              </Button>
            </div>

            {/* Card 3 */}
            <div className='max-w-[392px] w-full rounded-[24px] bg-brand-white backdrop-blur-md px-[25px] py-[47px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col md:col-span-2 md:max-w-[820px] lg:col-span-1 lg:max-w-[392px]'>
              <h2 className='text-center text-[38px] lg:text-[38px] font-thin text-brand-deep mb-[34px]'>
                I am <span className='font-light'>Done Guessing</span>
              </h2>

              <p className='text-[20px] font-normal font-canela mb-[20px]'>
                Should this relationship be salvaged? Was the last one doomed from the start?
              </p>

              <p className='font-lato font-normal text-[15px] text-[#41444E] mb-[20px]'>
                This analysis shows you the structural reality: where relationship codes align, where they clash, and
                whether the friction you&apos;re experiencing is solvable or baked into the pairing itself.
              </p>

              <p className='font-lato font-normal text-[15px] text-[#41444E] mb-[20px]'>
                You&apos;ll see what&apos;s actually fixable versus what you&apos;ve been forcing.
              </p>

              <p className='font-lato font-semibold text-[15px] text-[#41444E] mb-[48px]'>
                No opinions. No blame. Mathematical certainty.
              </p>

              <Button
                variant='dark'
                size='md'
                className='w-full xs:text-[12px] mt-auto'
                href='/resources/compatibility-report'
                trackingData={{
                  cta_name: 'landing_triage_analysis_cta',
                  cta_text: 'GET MY ANALYSIS',
                  cta_location: 'triage',
                }}
              >
                GET MY ANALYSIS
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TriageSection;

// CARD 2

//  <Button
//             variant='dark'
//             size='md'
//             className='w-full xs:text-[12px] mt-auto'
//             href={WEBINAR_URL}
//             trackingData={{
//               cta_name: 'landing_triage_webinar_cta',
//               cta_text: 'REGISTER FOR WEBINAR',
//               cta_location: 'triage',
//             }}
//           >
//             REGISTER FOR WEBINAR
//           </Button>

// CARD 3

// trackingData={{
//             cta_name: 'landing_triage_analysis_cta',
//             cta_text: 'GET MY ANALYSIS',
//             cta_location: 'triage',
//           }}
//         >
//           GET MY ANALYSIS
//         </Button>
