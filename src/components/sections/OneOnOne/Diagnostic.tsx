import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Button from '@/components/ui/Button';
import RotateOnView from '@/components/ui/RotateOnView';
import Image from 'next/image';

export const Diagnostic = () => {
  return (
    <div className='flex gap-x-[42px] lg:px-[180px] lg:mt-[36px]'>
      <div>
        <div className='max-w-[610px] flex flex-col gap-y-8'>
          <h2 className='text-[60px]/[126%] text-[#3C0606] font-canela font-thin'>PRIVATE 1:1 DIAGNOSTIC SESSION</h2>
          <h3 className='text-[32px]/[126%] text-[#3C0606] font-canela font-thin'>
            One Problem. One Hour With Lily. Get The Decode You're Missing.
          </h3>

          <p className='text-[17px]/[126%] font-lato font-normal text-[#3C0606]'>
            THE METHOD: Precision Pattern Analysis
          </p>

          <p className='text-[17px]/[126%]  tracking-[0.05em] font-lato font-normal text-[#3C0606]'>
            This is The Leelu Method applied to your specific situation. When you're stuck in a repeating loop—a
            relationship pattern that never resolves, a career trajectory that hits the same ceiling, a behavioral cycle
            you can't parse from inside—you don't need more processing. You need diagnostic accuracy. You need to see
            the invisible architecture forcing you into the same outcome regardless of your effort.
            <br />
            The Diagnostic Session is a calculated analysis of your behavioral blueprint.
          </p>

          <Button variant='primary' size='md' className='w-full md:w-[65%] py-[12px]' href='#'>
            BOOK YOUR SESSION
          </Button>
        </div>
      </div>{' '}
      <div className='lg:w-1/2 relative flex justify-center order-1 lg:order-2'>
        <div className='relative lg:w-[500px] lg:h-[549px] w-[330px] h-[350px] lg:pt-0'>
          <Image
            src='/images/lily/lily_3.png'
            alt='I am Lily Chystofat'
            fill
            priority
            quality={100}
            className='
  
                /* MOBILE: fade bottom */
                [mask-image:linear-gradient(to_bottom,black_55%,transparent_75%)]
                [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent_75%)]
  
                /* DESKTOP: no mask */
                lg:[mask-image:none]
                lg:[-webkit-mask-image:none]
    '
          />
          <RotateOnView
            className='absolute bottom-[-80px] left-[140px] hidden lg:block pointer-events-none'
            duration={5}
            ease='easeOut'
          >
            <Image src='/icons/ornament_13.svg' alt='' width={209} height={215} priority quality={100} className='' />
          </RotateOnView>
          <ArcAutoOnce
            className='absolute inset-0 -z-0 -translate-y-[13%] pointer-events-none -translate-x-[-7%]'
            // endAt={0.9}
            flightStart={0.2}
            durMs={1500}
            arrowRotateDeg={254}
            arrowScale={0.8}
            arrowCenterX={6.5}
            arrowCenterY={-6}
            arrowOffsetY={3}
            endAtByDevice={{ mobile: 0.87, desktop: 0.95 }}
            arcEnd={{ x: -60, y: 219 }}
            arcRx={260}
            arcRy={260}
            strokeWidth={2}
          />
        </div>
      </div>
    </div>
  );
};
