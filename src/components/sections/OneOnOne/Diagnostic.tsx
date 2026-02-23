import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Button from '@/components/ui/Button';
import RotateOnView from '@/components/ui/RotateOnView';
import Image from 'next/image';

const content = {
  title: 'PRIVATE 1:1 DIAGNOSTIC SESSION',
  subtitle: `One Problem. One Hour With Lily. Get The Decode You're Missing.`,
  methodTitle: `THE METHOD: Precision Pattern Analysis`,

  desc: [
    'This is The Leelu Method applied to your specific situation.',
    `When you're stuck in a repeating loop—a relationship pattern that never resolves, a career trajectory that hits the same ceiling, a behavioral cycle
     you can't parse from inside—you don't need more processing. You need diagnostic accuracy. You need to see the invisible architecture forcing you into the same outcome regardless of your effort.`,
    'The Diagnostic Session is a calculated analysis of your behavioral blueprint.',
  ],
};

export const Diagnostic = () => {
  return (
    <div className='flex flex-col-reverse lg:flex-row gap-x-2.5 max-w-[1600px] mx-auto px-2 md:px-8 2xl:px-[180px] 2xl:mb-[26px] 2xl:mt-[52px]'>
      <div>
        <div className='text-brand-deep flex-1 lg:max-w-[610px] flex flex-col items-center text-center lg:items-start lg:text-left'>
          <h2 className='text-section-mobile order-1 -mt-[150px] mb-6 font-canela font-thin md:text-[60px]/[126%] md:-mt-0'>
            {content.title}
          </h2>

          <h3 className='text-body mb-[40px] font-lato order-2 md:font-canela md:font-thin md:text-[32px]/[110%]'>
            {content.subtitle}
          </h3>

          <p className='text-body font-lato order-4 md:order-3 mb-6'>{content.methodTitle}</p>

          <p className='text-body tracking-0 text-left font-lato font-normal order-5 md:order-4 mb-[46px]'>
            {content.desc.map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>

          <Button variant='primary' size='md' className='w-full md:w-[52%] py-[16px] order-3 md:order-5' href='#'>
            BOOK YOUR SESSION
          </Button>
        </div>
      </div>{' '}
      <div className='flex-1 relative flex justify-center order-1 lg:order-2 lg:mt-[40px]'>
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
