import Button from '@/components/ui/Button';
import RotateOnView from '@/components/ui/RotateOnView';
import { SECRETS_LINKS } from '@/static/links';
import Image from 'next/image';

export default function DiscoverSection() {
  return (
    <section className='relative bg-[#f5e8e8] py-12 md:py-16 lg:pt-[84px] lg:pb-[162px] overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0 z-0'>
        <Image src='/images/bg/discover_section_bg.png' alt='' fill quality={100} priority />
      </div>

      <div className='container relative z-10 px-4'>
        {/* Header with image */}
        <div className='flex flex-col items-center mb-8 md:mb-10 lg:mb-12'>
          <div className='relative w-[361px] min-h-[379px] md:w-[361px] md:h-[379px] lg:w-[356px] lg:h-[384px] mb-8'>
            <Image
              src='/icons/ornament_4.svg'
              alt=''
              width={103}
              height={103}
              className='absolute hidden md:block lg:block top-[140px] left-[-30px] md:top-[180px] md:left-[-40px] lg:top-[200px] lg:left-[-55px] z-0 w-[180px] h-[180px] md:w-[180px] md:h-[180px] lg:w-[103px] lg:h-[103px]'
            />
            <Image src='/images/lily/lily_1.png' alt='Woman' fill className='relative z-10' quality={100} />
            <RotateOnView
              className='absolute z-[10] bottom-[-120px] left-[25px] w-[298px] h-[272px] lg:w-[298px] lg:h-[272px]'
              duration={5}
              amount={0.4}
              ease='easeOut'
            >
              <Image src='/icons/ornament_14.svg' alt='' fill />
            </RotateOnView>

            {/* Ornament badge */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-25px] md:bottom-[-30px] lg:bottom-[-35px] flex items-center justify-center rounded-[300px] overflow-hidden bg-[#EB4F68] before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay w-[74px] h-[102px] md:w-[74px] md:h-[102px] lg:w-[74px] lg:h-[102px] z-10">
              <Image src='/leelu_logo.svg' alt='' width={46} height={46} className='filter invert' />
            </div>
          </div>
          <h1 className='text-center font-canela font-light leading-tight mt-4 md:mt-5 lg:mt-6 text-[42px] lowercase md:uppercase lg:uppercase md:text-[36px] lg:text-[60px]'>
            <span className='relative italic text-[#C4334F] font-thin text-[48px] lg:text-[60px] capitalize z-[20]'>
              Inside
            </span>
            <br />
            YOU&apos;LL DISCOVER
          </h1>
        </div>

        {/* Cards Grid */}
        <div className='max-w-[1216px] mx-auto mb-[67px] md:mb-12 lg:mb-16'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-x-6 lg:gap-y-6'>
            {/* Left column */}
            <div className='flex flex-col gap-6'>
              <div className='bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[50px] py-12 md:py-8 lg:py-12 lg:mt-[160px] w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col'>
                <h3 className='font-canela text-[32px] md:text-[32px] lg:text-[32px] mb-5 md:mb-3.5 lg:mb-4 text-black font-light leading-[126%]'>
                  The Emotional Detox
                </h3>
                <p className='text-[#5A5757] font-medium text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]'>
                  Why &quot;staying strong&quot; traps the pain in your body, and the exact release protocol that allows
                  you metabolize it safely.
                </p>
              </div>
              <div className='bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[50px] py-12 md:py-8 lg:py-12 w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col'>
                <h3 className='font-canela text-[32px] md:text-[32px] lg:text-[32px] mb-5 md:mb-3.5 lg:mb-4 text-black font-light leading-[126%]'>
                  The Pattern Interrupt
                </h3>
                <p className='text-[#5A5757] font-medium text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]'>
                  Why your routine is keeping you trapped in the past, and the radical environmental shifts that snap
                  your brain into the present.
                </p>
              </div>
            </div>

            {/* Center column */}
            <div className='flex flex-col gap-6'>
              <div className='bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[50px] py-12 md:py-8 lg:py-12 w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col'>
                <h3 className='font-canela text-[32px] md:text-[32px] lg:text-[32px] mb-5 md:mb-3.5 lg:mb-4 text-black font-light leading-[126%]'>
                  The Squad Audit
                </h3>
                <p className='text-[#5A5757] font-medium text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]'>
                  How to identify who&apos;s actually helping you heal versus who&apos;s keeping you stuck in the story,
                  and what to do about it.
                </p>
              </div>
              <div className='bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[50px] py-12 md:py-8 lg:py-12 w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col'>
                <h3 className='font-canela text-[32px] md:text-[32px] lg:text-[32px] mb-5 md:mb-3.5 lg:mb-4 text-black font-light leading-[126%]'>
                  The Mind Unload
                </h3>
                <p className='text-[#5A5757] font-medium text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]'>
                  A specific writing technique that stops the intrusive thought spiral. Instantly.
                </p>
              </div>
              <div className='bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[50px] py-12 md:py-8 lg:py-12 w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col'>
                <h3 className='font-canela text-[32px] md:text-[32px] lg:text-[32px] mb-5 md:mb-3.5 lg:mb-4 text-black font-light leading-[126%]'>
                  The Freedom Audit
                </h3>
                <p className='text-[#5A5757] font-medium text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]'>
                  A line-by-line inventory of what you sacrificed for him, and the exact plan to take it back.
                </p>
              </div>
            </div>

            {/* Right column */}
            <div className='flex flex-col gap-6'>
              <div className='bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[50px] py-12 md:py-8 lg:py-12 lg:mt-[160px] w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col'>
                <h3 className='font-canela text-[32px] md:text-[32px] lg:text-[32px] mb-5 md:mb-3.5 lg:mb-4 text-black font-light leading-[126%]'>
                  The Belief Debug
                </h3>
                <p className='text-[#5A5757] font-medium text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]'>
                  How to catch the &quot;I&apos;ll never love again&quot; script running in your subconscious, and
                  overwrite it.
                </p>
              </div>
              <div className='bg-white rounded-[16px] md:rounded-[18px] lg:rounded-[20px] px-[50px] py-12 md:py-8 lg:py-12 w-full min-h-[240px] md:min-h-[280px] lg:h-[301px] flex flex-col'>
                <h3 className='font-canela text-[32px] md:text-[32px] lg:text-[32px] mb-5 md:mb-3.5 lg:mb-4 text-black font-light leading-[126%]'>
                  Re-Entry Strategy
                </h3>
                <p className='text-[#5A5757] font-medium text-body font-lato leading-[22px] md:leading-[24px] lg:leading-[26px]'>
                  How to step back into the world without getting triggered, overwhelmed, or pulled back into the past.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom text and CTA */}
        <div className='text-center max-w-[774px] mx-auto'>
          <p className='text-black text-[32px] font-light font-canela mb-[32px] leading-[130%] tracking-normal'>
            This guide gives you 7 evidence-based strategies to reclaim your nervous system and your life.
          </p>
          <Button
            variant='primary'
            size='md'
            href={SECRETS_LINKS.ACCESS_LINK.href}
            className='w-full mt-[16px] md:w-[45%] md:mt-[66px]'
          >
            {SECRETS_LINKS.ACCESS_LINK.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
