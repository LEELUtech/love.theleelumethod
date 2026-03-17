import ProgramFooter from '@/app/programs/ProgramFooter';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import React from 'react';

const FixSection = () => {
  return (
    <section className='bg-white min-h-[1400px]'>
      <div className='container px-4 py-14 md:py-20 lg:py-24'>
        {/* GRID */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-10 lg:gap-20 items-center lg:mt-[52px]'>
          {/* IMAGE */}
          <div className='relative mx-auto w-full max-w-[560px] order-1 md:order-2'>
            <div className='relative w-full h-[420px] md:h-[520px] lg:h-[813px]'>
              <Image
                src='/images/programs/vip-immersion/who_this_is_for.png'
                alt=''
                fill
                quality={100}
                className='object-contain'
              />
            </div>

            {/* DECOR CIRCLE */}
            <div
              className="
								absolute bottom-[-40px] left-[-10px]
								md:bottom-[-30px] md:left-[-10px]
								lg:bottom-[-60px] lg:left-[-60px]
								h-[90px] w-[70px]
								md:h-[110px] md:w-[85px]
								lg:h-[176px] lg:w-[140px]
								rounded-full overflow-hidden bg-[#E0B2A4]
								before:absolute before:inset-0
								before:bg-[url('/icons/noise.png')]
								before:opacity-15 before:mix-blend-overlay
								flex items-center justify-center
							"
            >
              <div className='relative w-[40px] h-[40px] md:w-[50px] md:h-[50px] lg:w-[76px] lg:h-[76px]'>
                <Image src='/leelu_logo.svg' alt='' fill className='object-contain filter brightness-0 invert' />
              </div>
            </div>
          </div>

          {/* TEXT */}
          <div className='text-center md:text-left mt-[40px] md:mt-0 max-w-[560px] md:max-w-[420px] lg:max-w-[560px] order-2 md:order-1'>
            <h2 className='font-canela font-thin text-[48px] leading-[1.05] text-brand-deep'>THE FIX:</h2>

            <p className='mt-[28px] font-canela font-light text-[26px] md:text-[30px] lg:text-[32px] leading-[1.25] text-brand-deep'>
              You cannot “do” more to fix this.
            </p>

            <p className='mt-[18px] font-medium font-lato text-body leading-[1.7] text-[#5A5757]'>
              You must learn The Script Shift. In the webinar, I will show you how to stop over-functioning and trigger
              his “Hero Instinct” using the Loyalty Code.
            </p>

            <Button
              className='mt-[28px] md:mt-[36px] px-10 md:px-12 tracking-[0.18em] uppercase'
              trackingData={{
                cta_name: 'secure_seat',
                cta_text: 'SECURE YOUR SEAT TO RESET THE DYNAMIC',
                cta_target_url: null,
                cta_location: 'quiz_result_fix',
              }}
            >
              SECURE YOUR SEAT TO RESET THE DYNAMIC
            </Button>
          </div>
        </div>
      </div>

      <div className='container px-4'>
        <ProgramFooter />
      </div>
    </section>
  );
};

export default FixSection;
