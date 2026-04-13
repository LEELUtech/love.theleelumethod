import { QuizResultOrb } from '@/components/sections/QuizResult/QuizResultOrb';
import Image from 'next/image';
import React from 'react';

interface ProfileGlitchSectionProps {
  description: string;
  secondaryDescription: string;
}

const ProfileGlitchSection = ({ description, secondaryDescription }: ProfileGlitchSectionProps) => {
  return (
    <section className='relative overflow-hidden'>
      {/* background */}
      {/* <div className='absolute inset-0 z-0'>
        <Image
          src='https://firebasestorage.googleapis.com/v0/b/leelu-tech.firebasestorage.app/o/love.theleelumethod%2Fbg%2Fprofile_glitch_bg.png?alt=media'
          alt=''
          fill
          priority
          quality={85}
          className='object-cover'
        />
      </div> */}

      <div className='absolute inset-0 -z-10'>
        <Image src='/noise_bg.svg' alt='' fill quality={85} sizes='100vw' className='object-cover' />
      </div>
      <div className='absolute bottom-0 left-0 right-0 -z-10 pointer-events-none'>
        <Image src='/gradiend.svg' alt='' width={1440} height={400} className='w-full h-[500px] md:h-auto object-cover object-bottom md:object-fill' quality={85} />
      </div>

      <div className='container relative z-10 px-4 py-24 md:py-20 lg:py-24'>
        <div className='space-y-14 md:space-y-20'>
          {/* BLOCK 1 */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-10 lg:gap-16 items-center'>
            {/* ORB */}
            <div className='order-1 md:order-2 lg:justify-self-end'>
              <QuizResultOrb
                bgColor='#DD4B61'
                ornamentSrc='/icons/ornament_14.svg'
                topBadgeIcon='/icons/programs_icon_red.svg'
                showBottomBadge={false}
                badgeBgColor='#ffffff'
                withNoise
              />
            </div>

            {/* TEXT */}
            <div className='order-2 md:order-1 text-center md:text-left max-w-[560px] md:max-w-[420px] lg:max-w-[560px]'>
              <h2 className='font-canela font-thin text-[42px] md:text-[42px] lg:text-[48px]leading-[1.05] text-brand-deep'>
                THE PSYCHOLOGICAL
                <br />
                PROFILE:
              </h2>

              <p className='mt-[40px] font-canela font-light text-[32px] leading-[1.35] text-brand-deep'>
                You are running a script of High Output / Low Return.
              </p>

              <p className='mt-4 font-lato font-medium text-body leading-[1.7] text-[#5A5757]'>{description}</p>
            </div>
          </div>

          {/* BLOCK 2 */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-10 lg:gap-16 items-center'>
            {/* ORB */}
            <div className='order-1 md:order-1 lg:justify-self-start'>
              <QuizResultOrb
                bgColor='#0B0B0B'
                ornamentSrc='/icons/ornament_15.svg'
                topBadgeIcon='/icons/red_star.svg'
                bottomBadgeIcon='/icons/necktie_red.svg'
                badgeBgColor='#F5E9E9'
              />
            </div>

            {/* TEXT */}
            <div className='order-2 text-center md:text-left max-w-[560px] md:max-w-[420px] lg:max-w-[560px] lg:justify-self-end'>
              <h2
                className='font-canela font-thin text-[42px] md:text-[42px]
							lg:text-[48px] leading-[1.05] text-brand-deep'
              >
                THE
                <br />
                NUMEROLOGICAL
                <br />
                GLITCH:
              </h2>

              <p className='mt-[40px] font-canela font-light text-[32px] leading-[1.35] text-brand-deep'>
                This is a Polarity Inversion.
              </p>

              <p className='mt-4 font-lato font-medium text-body leading-[1.7] text-[#5A5757]'>
                {secondaryDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileGlitchSection;
