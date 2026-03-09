import { OpacityTitleOrnamentIC } from '@/components/icons';
import RotateOnView from '../RotateOnView';

interface Props {
  mt: number;
  color: string;
  title: string;
  titleHightlight?: string;
  subtitle?: string;
}

export const OrnamentTitle = ({ mt, color, title, titleHightlight, subtitle }: Props) => (
  <div className='relative' style={{ marginTop: mt }}>
    <div className='absolute z-0 left-1/2 -translate-x-1/2 top-[-150px] md:top-[-180px] lg:top-[-300px] flex flex-row items-center justify-center gap-[130px]'>
      <div
        className='relative overflow-hidden w-[340px] h-[340px] sm:w-[418px] sm:h-[418px] md:translate-y-[50px] lg:translate-y-[60px]   '
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
          <OpacityTitleOrnamentIC stopColor={color} />
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
