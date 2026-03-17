import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Button from '@/components/ui/Button';
import { Section } from '@/components/ui/containers/section';
import RotateOnView from '@/components/ui/RotateOnView';
import { ONE_ON_ONE_LINKS } from '@/static/links';
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

const DiagnosticImg = () => {
  return (
    <div className='flex-1 relative flex justify-center mt-[40px]'>
      <div className='relative w-full max-w-[490px] max-h-[529px] aspect-[379/410] lg:aspect-[490/529] lg:min-w-[440px]'>
        <Image
          src='/images/lily/lily_3.png'
          alt='I am Lily Chystofat'
          fill
          priority
          quality={100}
          className='       
                [mask-image:linear-gradient(to_bottom,black_55%,transparent_75%)]
                [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent_75%)]
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
          className='absolute hidden bs:block inset-0 -z-0 -translate-y-[13%] pointer-events-none -translate-x-[-7%]'
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
  );
};
export const Diagnostic = () => {
  return (
    <Section wrapperClasses='!pb-0'>
      <div className='flex flex-col-reverse lg:flex-row  gap-[76px]'>
        <div>
          <div className='text-brand-deep flex-1 lg:max-w-[610px] flex flex-col items-center text-center lg:items-start lg:text-left'>
            <h2 className='text-[48px]/[120%] order-1 w-[300px] -mt-[200px] lg:mt-0 mb-6 font-canela font-thin md:w-full md:text-[60px]/[120%] md:-mt-0'>
              {content.title}
            </h2>

            <h3 className='text-body mb-[40px] font-lato order-2 md:font-canela md:font-thin md:text-[32px]/[110%]'>
              {content.subtitle}
            </h3>

            <p className='text-[32px]/[126%] font-canela font-thin order-4 md:text-body md:font-lato md:font-normal  md:order-3 mb-6'>
              {content.methodTitle}
            </p>

            <p className='text-body tracking-0 text-left font-lato font-normal order-5 md:order-4 mb-[46px]'>
              {content.desc.map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>

            <Button
              variant='primary'
              className='mb-8 w-full max-w-[316px] py-[16px] order-3 md:order-5 md:mb-0'
              href={ONE_ON_ONE_LINKS.HERO_LINK.href}
              trackingData={{
                cta_name: 'one_on_one_diagnostic_cta',
                cta_text: ONE_ON_ONE_LINKS.HERO_LINK.label,
                cta_location: 'diagnostic',
              }}
            >
              {ONE_ON_ONE_LINKS.HERO_LINK.label}
            </Button>
          </div>
        </div>{' '}
        <DiagnosticImg />
      </div>
    </Section>
  );
};
