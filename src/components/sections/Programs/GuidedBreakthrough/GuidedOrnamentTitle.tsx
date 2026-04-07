import Image from 'next/image';
import RotateOnView from '@/components/ui/RotateOnView';

interface Props {
  color: string;
  title: string;
  titleHightlight?: string;
  subtitle?: string;
  classNames?: string;
}

export const GuidedOrnamentTitle = ({ title, titleHightlight, subtitle, classNames = '' }: Props) => (
  <div className={`relative ${classNames}`}>
    <div
      className={`absolute z-0 left-1/2 -translate-x-1/2
                  top-[-140px] sm:top-[-180px] md:top-[-230px] lg:top-[-285px]
                  flex flex-row items-center justify-center gap-[130px] `}
    >
      <div
        className='relative overflow-hidden w-[340px] h-[340px] sm:w-[418px] sm:h-[418px] md:translate-y-[50px] lg:translate-y-[100px]   '
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 25%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 25%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0) 100%)',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      >
        <RotateOnView
          duration={33}
          amount={0.2}
          ease='easeOut'
          className='absolute inset-0'
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        >
          <Image src='/icons/ornament_2/ornament_2_light.svg' alt='' fill className='object-contain brightness-0 invert' quality={100} />
        </RotateOnView>
      </div>
    </div>
    <h2 className='relative font-light text-[48px]/[120%] lg:text-[60px] font-canela text-brand-deep mb-[20px] text-center z-10'>
      {title}

      {titleHightlight && (
        <>
          <br />
          <span className='text-brand-primary'>{titleHightlight}</span>
        </>
      )}
    </h2>

    {subtitle && (
      <p className=' font-canela font-light mb-8 text-[24px] lg:text-[32px]/[150%] text-center md:mb-[64px] text-[#0A0B0D] max-w-[638px] mx-auto'>
        {subtitle}{' '}
      </p>
    )}
  </div>
);
