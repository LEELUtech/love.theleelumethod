import Button from '@/components/ui/Button';
import { Section } from '@/components/ui/containers/section';
import RotateOnView from '@/components/ui/RotateOnView';
import { ABOUT_LINKS } from '@/static/links';
import Image from 'next/image';

const TheFractureAndLaboratorySection = () => {
  return (
    <Section backgroundImage='/images/about/fracture_section_bg.png' wrapperClasses='py-[80px]'>
      {' '}
      <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
          {/* Left Column - Image */}
          <div className='flex justify-center'>
            <div className='relative mb-[60px] md:mb-0 lg:mb-0 w-[360px] h-[459px] lg:w-[551px] lg:h-[748px] rounded-lg'>
              <Image
                src='/images/about/about_fracture.png'
                alt='Person sitting with a laptop'
                fill
                priority
                quality={100}
                className='rounded-lg'
              />
              <div className='absolute flex bottom-[-40px] left-[50%] -translate-x-[50%] md:-translate-x-0 md:left-[-30px] items-center justify-center bg-[#EB4F68] rounded-[300px] w-[80px] h-[100px] md:w-[100px] md:h-[126px] lg:w-[123px] lg:h-[155px] z-10'>
                <div className=' relative w-[55px] h-[55px] lg:w-[75px] lg:h-[75px]'>
                  <Image src='/leelu_logo.svg' alt='' fill className='absolute filter brightness-0 invert' />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - The Fracture */}
          <div>
            <h2 className='font-thin text-[60px] leading-[126%] font-canela text-brand-deep mb-8 '>The Fracture</h2>
            <p className='font-normal text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6'>
              My journey began with collapse.
            </p>
            <p className='font-normal text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6'>
              Years ago, I faced a brutal divorce. My life felt like it was incinerating. Therapy, religion, spiritual
              leaders—they offered comfort, but no map.
            </p>
            <p className='font-normal text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6'>
              Then, I sat with a numerologist. She laid out the prior twelve months of my life with terrifying accuracy
              before I spoke a word.
            </p>

            <p className='font-thin font-canela text-[32px]/[130%] text-brand-deep lg:mb-[30px] md:mb-[30px] mb-[30px]'>
              I realized my pain wasn&apos;t random. The pattern was already there, written into my design from day one.
            </p>

            <p className='font-thin font-canela text-[32px]/[130%] text-brand-deep lg:mb-[30px] md:mb-[30px] mb-[30px]'>
              That session was the spark that lit my path into the world of numerology and eventually, heelutech.
            </p>
            <Button
              variant='dark'
              size='md'
              className='w-full lg:w-[60%]'
              href={ABOUT_LINKS.FRACTURE_LINK.href}
              trackingData={{
                cta_name: 'about_fracture_cta',
                cta_text: ABOUT_LINKS.FRACTURE_LINK.label,
                cta_location: 'fracture',
              }}
            >
              {ABOUT_LINKS.FRACTURE_LINK.label}
            </Button>
          </div>
        </div>

        <div className='mt-[200px] md:mt-[300px] lg:mt-[400px] relative'>
          <div className='absolute z-0 left-1/2 -translate-x-1/2 top-[-150px] md:top-[-180px] lg:top-[-300px] flex flex-row items-center justify-center gap-[130px]'>
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
                duration={5}
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
              className='relative overflow-hidden
    w-[261px] h-[266px]
    lg:w-[512px] lg:h-[524px]
  '
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
          <h2 className='relative font-thin text-[60px] lg:text-[112px] leading-[130%] font-canela text-brand-deep mb-8 text-center z-10'>
            The Laboratory
          </h2>
          <p className='text-body font-lato leading-[26px] mb-6 text-center text-[#5A5757] max-w-[903px] mx-auto'>
            From 2008-2017, I ran a successful Human Resources firm placing candidates in security-sensitive roles where
            trust and discretion were paramount. The stakes were high; a bad hire was a security risk.
          </p>
          <p className='text-body font-lato leading-[26px] mb-6 text-center text-[#5A5757] max-w-[903px] mx-auto'>
            I turned the company into a testing ground for applied numerology, hiring fifteen clinical psychologists to
            work alongside me.
          </p>
          <p className='text-body font-lato leading-[26px] mb-6 lg:mb-6 text-center text-[#5A5757] max-w-[903px] mx-auto italic'>
            For each candidate, we ran two tracks:
          </p>
          <p className='font-thin font-canela text-brand-deep text-[32px] leading-[126%] tracking-normal max-w-[903px] mx-auto text-center mb-8'>
            Traditional clinical interviews and background checks. Independent numerology-based profiling.
          </p>
          <p className='font-thin font-canela text-brand-deep text-[32px] leading-[126%] tracking-normal max-w-[903px] mx-auto text-center lg:mb-8'>
            <span className='font-normal'>The results were undeniable.</span> Numerology didn’t just match the
            psychological profiles—it predicted behavioral traits psychologists missed in 75% of cases.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default TheFractureAndLaboratorySection;
