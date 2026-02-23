import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Button from '@/components/ui/Button';
import RotateOnView from '@/components/ui/RotateOnView';
import Image from 'next/image';
import React from 'react';

const HeroSection = () => {
  return (
    <section className='relative lg:py-[131px] pt-[54px] bg-brand-white overflow-hidden'>
      <div className='container px-4 relative z-10'>
        <div
          className='
						flex flex-col items-center
						pt-[10px]
						md:pt-[56px]
						lg:pt-[40px]
						lg:pb-[76px]
						pb-[62px]
					'
        >
          {/* Top image (arched) */}
          <div className='relative'>
            {/* Arch frame */}
            <div
              className='
								w-[359px] h-[305px]
								md:w-[520px] md:h-[420px]
								lg:w-[356px] lg:h-[322px]
								 overflow-hidden
							'
            >
              <Image
                src='/images/lily/lily_4.jpg'
                alt='Lily'
                fill
                quality={100}
                priority
                className='object-cover object-top md:object-top lg:object-top rounded-t-[999px]'
                style={{
                  maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                }}
              />
            </div>

            <ArcAutoOnce
              className='absolute inset-0 -z-0 -translate-y-[15%] pointer-events-none -translate-x-[-7%]'
              // endAt={0.9}
              flightStart={0.2}
              durMs={1500}
              arrowRotateDeg={254}
              arrowScale={0}
              arrowCenterX={6.5}
              arrowCenterY={-6}
              arrowOffsetY={3}
              // arcRx={220}
              // arcRy={208}
              endAtByDevice={{ mobile: 0.87, desktop: 0.9 }}
              arcEnd={{ x: -62, y: 219 }}
              arcRx={260}
              arcRy={270}
              disableAnimation={false}
            />

            {/* Badge */}
            <div
              className="
								absolute left-1/2 bottom-[-40px] -translate-x-1/2
								flex items-center justify-center overflow-hidden
								bg-[#EB4F68]
								before:absolute before:inset-0 before:bg-[url('/icons/noise.png')]
								before:opacity-15 before:mix-blend-overlay
								rounded-[300px]
								w-[74px] h-[102px]
								md:w-[100px] md:h-[126px]
								lg:w-[74px] lg:h-[102px]
								z-10
							"
            >
              <RotateOnView duration={5} amount={0.4} ease='easeOut'>
                <Image
                  src='/leelu_logo.svg'
                  alt=''
                  width={46}
                  height={46}
                  className='w-[46px] h-[46px] md:w-[46px] md:h-[46px] lg:w-[46px] lg:h-[46px] filter invert'
                />
              </RotateOnView>
            </div>
          </div>

          <div className='font-light transition text-[24px] md:text-[22px] lg:text-[24px] leading-[100%] font-canela flex items-center gap-2 md:gap-2.5 lg:gap-3 text-brand-black  justify-center md:justify-start mt-[63px]'>
            <span className=' w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 relative flex-shrink-0'>
              <Image src='/leelu_logo.svg' alt='Lily Chystofat Logo' fill className='object-contain' priority />
            </span>
            <div className='whitespace-nowrap lg:order-2'>
              <span className='font-medium font-canela tracking-tight mr-1'>LILY</span>
              <span className='font-canela font-light'>CHYSTOFAT</span>
            </div>
          </div>

          {/* Title */}
          <h1
            className='
							my-4
							font-canela font-thin uppercase text-brand-black text-center
							text-[46px] leading-[110%]
							md:text-[56px] md:leading-[110%]
							lg:text-[60px] lg:leading-[110%]
						'
          >
            THE PROTOCOL ESSENTIALS
          </h1>

          <p className='text-[17px]/[100%] mb-4 font-canela font-thin'>Code-Level Transformation</p>

          {/* Subtitle */}
          <p
            className='
							font-canela font-thin text-brand-deep text-center
							text-[24px]
							md:text-[28px]
							lg:text-[32px]
						'
          >
            YOUR RELATIONSHIP ISN&apos;T BROKEN. YOU&apos;RE RUNNING THE <br /> WRONG CODE.
          </p>

          <p
            className='
							order-2 md:order-1
							mt-4
							font-lato font-normal text-center text-[#757986]
							text-[17px] leading-[145%]
							md:text-[17px] md:leading-[150%]
							lg:text-[17px] lg:leading-[150%]
						'
          >
            You don&apos;t need another conversation about &quot;feelings.&quot; You need a structural audit of why your
            relationships keep hitting the same wall.
          </p>

          {/* CTA */}
          <Button variant='primary' size='md' className='w-full lg:w-[30%] xs:text-[12px] mt-[32px] lg:order-3'>
            ENROLL NOW
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
