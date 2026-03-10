import { Section } from '@/components/ui/containers/section';
import Image from 'next/image';

const ThePivotAndAccelerantSection = () => {
  return (
    <Section>
      <div>
        {/* The Pivot Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-[120px] md:gap-[80px] lg:gap-40 items-center mb-[121px] lg:mb-[200px]'>
          {/* Images composition */}
          <div className='flex justify-center order-1'>
            <div className='relative w-full max-w-[340px] md:max-w-[420px] lg:max-w-none h-[380px] md:h-[450px] lg:h-[520px] mx-auto'>
              {/* BACK IMAGE */}
              <div className='absolute top-0 left-0 w-[52%] h-[69%] rotate-[-3deg] shadow-[0_4px_50px_rgba(0,0,0,0.16)]'>
                <Image src='/images/pivot/img_3.jpg' alt='' fill quality={100} />
              </div>

              {/* RIGHT IMAGE */}
              <div className='absolute top-[33%] right-[-4%] w-[62%] h-[47%] rotate-[8deg] z-20 shadow-[0_4px_50px_rgba(0,0,0,0.16)]'>
                <Image src='/images/pivot/img_1.jpg' alt='' fill quality={100} />
              </div>

              {/* BOTTOM IMAGE */}
              <div className='absolute bottom-[-18%] left-[12%] w-[65%] h-[63%] z-10 shadow-[0_4px_50px_rgba(0,0,0,0.16)]'>
                <Image src='/images/pivot/img_2.jpg' alt='' fill quality={100} />
              </div>
            </div>
          </div>

          <div className='order-2'>
            <h2 className='font-thin text-[60px] lg:text-[60px] leading-[126%] font-canela text-brand-deep mb-6 lg:mb-8'>
              The Pivot
            </h2>
            <p className='font-normal font-lato text-[17px] leading-[130%] text-[#5A5757] mb-6 lg:mb-8'>
              When The Algorithm Saved My Life
            </p>
            <p className='font-normal text-[17px] text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6'>
              In 2014, a sudden geopolitical shift destabilized the region. Banking froze. The business landscape
              shifted overnight. Most people in my circle waited, relying on optimism, but I mapped the timing windows.
              The data signaled a critical exit point. Logic said to stay and protect my assets—the numbers said my
              window was closing. I packed my life into a car, took my son, and drove across seven countries to Madrid.
            </p>

            <p className='font-thin font-canela text-[28px] lg:text-[32px] leading-[130%] text-brand-deep'>
              The system didn&apos;t just predict my path; it secured my future.
            </p>
          </div>
        </div>

        {/* The Accelerant Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-40 items-center'>
          {/* Image first on mobile/tablet, second on desktop */}
          <div className='flex justify-center order-1 lg:order-2'>
            <div className='relative w-full max-w-[511px] aspect-[511/689]'>
              <Image
                src='/images/lily/lily_9.png'
                alt='The Accelerant'
                fill
                quality={100}
                className='object-cover'
                sizes='(min-width:1024px) 511px, 90vw'
              />
            </div>
          </div>

          {/* Text first on desktop */}
          <div className='lg:max-w-[510px] order-2 lg:order-1'>
            <h2 className='font-thin text-[60px] lg:text-[60px] leading-[126%] font-canela text-brand-deep mb-3 lg:mb-4'>
              The Accelerant
            </h2>
            <p className='font-thin font-canela text-[28px] lg:text-[32px] leading-[130%] text-brand-deep mb-6 lg:mb-8'>
              The St. Petersburg Protocol
            </p>
            <p className='font-medium text-body text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6'>
              The system I used to escape was effective, but I wanted military- grade precision.
            </p>
            <p className='font-normal text-body text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6'>
              I sought out the most advanced training in the world — a restricted facility, not open to the public, not
              affiliated with any university. This was not a school for mystics. It was a training ground for
              government-level personnel profiling.
            </p>
            <p className='font-normal text-body text-[#5A5757] font-lato leading-[26px] tracking-normal mb-6'>
              For seven years, I trained in an environment of total isolation. No phones. No recording devices. We
              worked 10-hour days calculating complex personality algorithms by hand.
            </p>

            <p className='font-thin font-canela text-[32px]/[130%] text-brand-deep'>
              If my early discovery was the software, this training was the GPU—the high-speed processor that turned
              basic data into high-frequency intelligence. It stripped away the &quot;woo&quot; and left only the
              mechanics of human engineering.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ThePivotAndAccelerantSection;
