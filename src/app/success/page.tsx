// app/success/page.tsx
import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Image from 'next/image';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className='relative min-h-screen overflow-hidden bg-white'>
      {/* Background for whole section */}
      <div className='absolute inset-0 z-0'>
        <Image src='/images/bg/success_bg.png' alt='' fill priority quality={100} />
      </div>

      <div className='container relative mx-auto flex min-h-screen items-center justify-center'>
        <section className='text-center'>
          {/* avatar + arc */}
          <div className='mx-auto flex flex-col items-center'>
            <div className='relative h-[253px] w-[179px] rounded-full'>
              <Image src='/images/lily/lily_5.png' alt='Lily' fill priority className='object-cover' quality={100} />

              <ArcAutoOnce
                className='absolute inset-0 z-[50] -translate-y-[-23%] pointer-events-none -translate-x-[-29%] rotate-[-28deg]'
                // endAt={0.9}
                flightStart={0.2}
                durMs={1500}
                arrowRotateDeg={254}
                arrowScale={1.2}
                arrowCenterX={6.5}
                arrowCenterY={-6}
                arrowOffsetY={3}
                // arcRx={220}
                // arcRy={208}
                strokeWidth={4}
                endAtByDevice={{ mobile: 1, desktop: 1 }}
                arcEnd={{ x: -10, y: -120 }}
                arcRx={270}
                arcRy={270}
              />
            </div>

            {/* logo */}
            <div className='font-light transition text-[24px] md:text-[22px] lg:text-[24px] leading-[126%] font-canela flex items-center gap-2 md:gap-2.5 lg:gap-3 text-brand-black  justify-center md:justify-start mt-[47px]'>
              <span className='w-[29px] h-[29px] relative flex-shrink-0'>
                <Image src='/leelu_logo.svg' alt='Lily Chystofat Logo' fill className='object-contain' priority quality={100} />
              </span>

              <div className='whitespace-nowrap lg:order-2 font-canela flex gap-1'>
                <span className='font-light'>THE</span>
                <span className='font-medium'>LEELU</span>
                <span className='font-canela'>METHOD</span>
              </div>
            </div>
          </div>

          {/* title */}
          <h1 className='font-canela mt-4 text-[48px] text-brand-deep md:text-[56px] lg:text-[60px]'>
            <span className='font-normal'>Welcome.</span>{' '}
            <span className='font-thin'>You&apos;re exactly where you need to be.</span>
          </h1>

          {/* subtitle */}
          <p className=' mt-4 font-canela text-[24px] leading-[1.6] text-brand-black lg:text-[24px] font-light'>
            Your invitation to the program is being prepared and delivered to your inbox.
          </p>

          {/* helper text */}
          <p className=' mt-4 font-lato text-body text-[#41444E] lg:text-body font-normal'>
            Please allow 10–15 minutes for it to arrive.
            <br />
            If it doesn&apos;t appear, simply reach out to{' '}
            <Link className='underline underline-offset-2' href='https://mail.google.com/mail/?view=cm&to=support@theleelumethod.com' target='_blank' rel='noopener noreferrer'>
              support@theleelumethod.com
            </Link>
            , and our team will be glad to assist you.
          </p>
        </section>
      </div>
    </main>
  );
}
