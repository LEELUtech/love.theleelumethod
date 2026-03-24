import Button from '@/components/ui/Button';
import Image from 'next/image';
import React from 'react';

const FixSection = () => {
  return (
    <section className='bg-white'>
      <div className='container px-4 py-14 md:py-20 lg:py-24'>
        {/* GRID */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-10 lg:gap-20 j items-center lg:mt-[52px]'>
          <div className='relative w-full max-w-[496px] mx-auto md:mx-0 aspect-[361/554] order-1 md:order-2'>
            <Image
              src='/images/programs/vip-immersion/who_this_is_for.png'
              alt=''
              fill
              quality={100}
              className='object-contain'
            />
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
              className='mt-[28px] md:mt-[36px] xs:px-4 px-10 md:px-12 tracking-[0.18em] uppercase xs:text-[12px] text-center'
              href="https://leelutech.ewebinar.com/webinar/decoded-love-22610"
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
    </section>
  );
};

export default FixSection;
