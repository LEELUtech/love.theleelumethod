import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Button from '@/components/ui/Button';
import { Section } from '@/components/ui/containers/section';
import RotateOnView from '@/components/ui/RotateOnView';
import { ABOUT_LINKS } from '@/static/links';
import Image from 'next/image';

const StopGuessingSection = () => {
  return (
    <Section backgroundImage='/images/about/stop_guessing_section_bg.jpg' sectionClasses='mt-[300px] lg:mt-[200px]'>
      <div className='max-w-[900px] mx-auto text-center pb-[60px] md:pb-0'>
        {/* Top Image */}
        <div className='flex justify-center mb-12 relative pt-[50px] md:pt-[130px]'>
          <div className='absolute w-[268px] h-[290px] sm:w-[358px] sm:h-[376px] top-[-250px] overflow-visible'>
            <Image
              src='/images/resources/resources-section-1.png'
              alt='Stop Guessing'
              fill
              quality={100}
              sizes='(min-width: 640px) 358px, 320px'
            />

            {/* Logo badge */}
            <div
              className="
											absolute left-1/2 bottom-[-40px] -translate-x-1/2
											flex items-center justify-center overflow-hidden
											bg-[#EB4F68]
											before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay
											rounded-[300px]
											w-[80px] h-[100px]
											md:w-[100px] md:h-[126px]
											lg:w-[101px] lg:h-[140px]
											z-10
										"
            >
              <RotateOnView duration={5} amount={0.4} ease='easeOut'>
                <Image
                  src='/leelu_logo.svg'
                  alt=''
                  width={63}
                  height={61}
                  className='w-[51px] h-[53px] md:w-[65px] md:h-[63px] lg:w-[61px] lg:h-[63px] filter invert-[100%] brightness-[100%]'
                />
              </RotateOnView>
            </div>

            {/* Arc */}
            <ArcAutoOnce
              className='absolute inset-0 -z-0 -translate-y-[15%] pointer-events-none -translate-x-[2%]'
              endAt={0.9}
              flightStart={0.2}
              durMs={1500}
              startDelayMs={500}
              arrowRotateDeg={254}
              arrowScale={0.8}
              arrowCenterX={6.5}
              arrowCenterY={-6}
              arrowOffsetY={3}
              arcRx={220}
              arcRy={208}
            />
          </div>
        </div>

        {/* Heading */}
        <h2 className='font-thin pt-[100px] md:pt-0 text-[48px] lg:text-[60px] leading-[126%] font-canela text-brand-deep mb-6'>
          Stop Guessing. Start Knowing.
        </h2>

        {/* Subheading */}
        <p className='font-thin font-canela text-[24px] lg:text-[32px] leading-[130%] text-brand-deep mb-6 lg:mb-12 '>
          We don&apos;t just patch the relationship.
          <br />
          We rewrite the code.
        </p>

        <Button
          variant='primary'
          size='md'
          className='w-full lg:w-[40%] xs:text-[12px]'
          href={ABOUT_LINKS.STOP_GUESSING_LINK.href}
        >
          {ABOUT_LINKS.STOP_GUESSING_LINK.label}
        </Button>
      </div>
    </Section>
  );
};

export default StopGuessingSection;
