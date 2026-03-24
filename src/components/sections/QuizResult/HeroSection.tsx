import Button from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import Image from 'next/image';
import React from 'react';

interface HeroSectionProps {
  title: string;
}

const HeroSection = ({ title }: HeroSectionProps) => {
  return (
    <section className='relative overflow-hidden min-h-[686px]'>
      <div className='absolute inset-0 z-0'>
        {/* Mobile */}
        <Image
          src='/images/quiz-result/hero_section_bg_mobile.png'
          alt=''
          fill
          priority
          className='object-cover lg:hidden'
        />

        {/* Desktop */}
        <Image
          src='/images/quiz-result/hero_section_bg_desktop.png'
          alt=''
          fill
          priority
          className='object-cover hidden lg:block'
        />
      </div>

      {/* LOGO */}
      <div className='absolute top-[43px] md:top-[36px] left-1/2 -translate-x-1/2 z-50'>
        <Logo />
      </div>

      {/* CONTENT */}
      <div className='container relative z-10 h-[686px] md:h-[760px] flex items-center justify-center px-4 md:py-10'>
        <div className='text-center'>
          <p className='uppercase font-lato font-normal text-body text-brand-deep'>The diagnosis results</p>

          <h1 className='font-canela font-thin text-[48px] md:text-[54px] lg:text-[60px] leading-[126%] text-brand-deep mt-[14px]'>
            {title}
          </h1>

          <p className='font-canela font-light text-[20px] md:text-[22px] lg:text-[24px] text-brand-deep uppercase mt-[24px]'>
            High Friction / Misaligned Script
          </p>

          <Button
            className='mt-[24px] md:mt-[28px] xs:px-4 px-10 xs:text-[12px] text-center'
            href="https://leelutech.ewebinar.com/webinar/decoded-love-22610"
            trackingData={{
              cta_name: 'quiz_result_secure_seat_cta',
              cta_text: 'SECURE YOUR SEAT TO RESET THE DYNAMIC',
              cta_location: 'hero',
            }}
          >
            SECURE YOUR SEAT TO RESET THE DYNAMIC
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
