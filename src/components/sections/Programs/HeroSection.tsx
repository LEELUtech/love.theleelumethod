import Button from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import RotateOnView from '@/components/ui/RotateOnView';
import { PROGRAMS_LINKS } from '@/static/links';
import Image from 'next/image';
import React from 'react';

const HeroSection = () => {
  return (
    <section className='relative overflow-hidden pt-[40px] lg:pt-[64px]'>
      {/* Background */}
      <div className='absolute inset-0 -z-10'>
        <Image src='https://firebasestorage.googleapis.com/v0/b/leelu-tech.firebasestorage.app/o/love.theleelumethod%2Fbg%2Fhero_section_bg.png?alt=media' alt='' fill priority className='object-cover' sizes='100vw' quality={100} />
      </div>

      <div className='container px-4 relative z-10'>
        <div className='flex flex-col items-center pt-[10px] md:pt-[56px] lg:pt-[40px] pb-[62px] lg:pb-[76px]'>
          <div
            className='
							order-1 lg:order-2
							font-light transition text-[24px] md:text-[22px] lg:text-[24px]
							leading-[126%] font-canela
							flex items-center gap-2 md:gap-2.5 lg:gap-3
							text-brand-black justify-center md:justify-start
							mt-0 lg:mt-[63px]
						'
          >
            <Logo />
          </div>

          <div className='relative order-2 lg:order-1 mt-[18px] lg:mt-0'>
            <div className='w-[359px] h-[305px] md:w-[520px] md:h-[420px] lg:w-[356px] lg:h-[384px]'>
              <Image
                src='/images/programs/hero_section.png'
                alt='Lily'
                fill
                quality={100}
                priority
                className='object-cover object-top md:object-top lg:object-center'
                style={{
                  maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                }}
              />
            </div>

            {/* Badge */}
            <div
              className="
								absolute left-1/2 bottom-[-40px] -translate-x-1/2
								flex items-center justify-center overflow-hidden
								bg-[#EB4F68]
								before:absolute before:inset-0 before:bg-[url('/icons/noise.png')]
								before:opacity-15 before:mix-blend-overlay
								rounded-[300px]
								w-[80px] h-[100px]
								md:w-[100px] md:h-[126px]
								lg:w-[101px] lg:h-[140px]
								z-10
							"
            >
              <RotateOnView duration={17} amount={0.4} ease='linear' repeat={true}>
                <Image
                  src='/leelu_logo.svg'
                  alt=''
                  width={63}
                  height={61}
                  className='w-[51px] h-[53px] md:w-[65px] md:h-[63px] lg:w-[61px] lg:h-[63px] filter invert'
                  quality={100}
                />
              </RotateOnView>
            </div>
          </div>

          {/* TITLE */}
          <h1
            className='
							order-3
							mt-[63px] lg:mt-[14px]
							font-canela font-thin uppercase text-brand-deep text-center
							text-[48px] leading-[110%]
							md:text-[56px]
							lg:text-[60px]
							max-w-[680px]
						'
          >
            THE RELATIONSHIP <br className='hidden lg:block' />
            PROTOCOL
          </h1>

          {/* SUBTITLE */}
          <p className='order-4 mt-4 font-canela font-thin text-brand-deep text-center text-[24px] md:text-[28px] lg:text-[32px]'>
            The Operating Manual for Human Connection. <br className='hidden lg:block' />
            For women who feel confused, anxious, or stuck in relationship loops.
          </p>

          {/* BUTTON */}
          <div className='order-5 w-full flex justify-center'>
            <Button
              variant='primary'
              className='w-full lg:w-[32%] mt-[32px]'
              href={PROGRAMS_LINKS.HERO_LINK.href}
              trackingData={{
                cta_name: 'programs_hero_cta',
                cta_text: PROGRAMS_LINKS.HERO_LINK.label,
                cta_location: 'hero',
              }}
            >
              {PROGRAMS_LINKS.HERO_LINK.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
