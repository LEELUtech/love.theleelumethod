import Image from 'next/image';

interface Props {
  size?: 'md' | 'lg';
}

export const Logo = ({ size = 'md' }: Props) => {
  const imgSize = size === 'md' ? 'w-[29px] h-[29px]' : 'w-[32px] h-[32px]';

  return (
    <div className='font-canela flex items-center gap-3'>
      <span className={`inline-block relative flex-shrink-0 translate-y-[2px] ${imgSize}`}>
        <Image src='/leelu_logo.svg' alt='Lily Chystofat Logo' fill className='object-contain' priority quality={85} />
      </span>

      <div className='whitespace-nowrap text-[24px]/[126%] flex gap-1 text-brand-black'>
        <span className='font-light'>THE</span>

        <span className='font-medium'>LEELU</span>
        <span className='font-light'>METHOD</span>
      </div>
    </div>
  );
};
