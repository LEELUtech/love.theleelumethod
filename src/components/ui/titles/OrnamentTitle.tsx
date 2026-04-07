import Image from 'next/image';
import RotateOnView from '../RotateOnView';

interface Props {
  color: string;
  title: string;
  titleHightlight?: string;
  subtitle?: string;
  classNames?: string;
}

export const OrnamentTitle = ({ title, titleHightlight, subtitle, classNames = '' }: Props) => (
  <div className={`relative ${classNames}`}>
    <div
      className={`absolute z-0 left-1/2 -translate-x-1/2
                  top-[-200px] sm:top-[-240px] md:top-[-230px] lg:top-[-350px]
                  flex flex-row items-center justify-center gap-[130px] `}
    >
      <div
        className='relative overflow-hidden w-[340px] h-[340px] sm:w-[418px] sm:h-[418px] translate-y-[20px] md:translate-y-[10px] lg:translate-y-[120px]   '
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 55%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 55%)',
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
          <Image src='/icons/ornament_2/ornament_2_pink.svg' alt='' fill className='object-contain opacity-50' quality={100} />
        </RotateOnView>
      </div>
    </div>
    <h2 className='relative font-thin text-[48px]/[120%] lg:text-[60px] font-canela text-brand-deep mb-[20px] text-center z-10'>
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
