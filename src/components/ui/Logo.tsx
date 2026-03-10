import Image from 'next/image';

export const Logo = () => {
  return (
    <div className='font-canela flex items-center gap-3'>
      <span className='inline-block w-[29px] h-[29px] relative flex-shrink-0'>
        <Image src='/leelu_logo.svg' alt='Lily Chystofat Logo' fill className='object-contain' priority />
      </span>

      <div className='whitespace-nowrap leading-[126%]'>
        <span className='font-medium tracking-tight mr-1 text-[24px] text-brand-black'>THE LEELU</span>
        <span className='font-thin text-[24px] text-brand-black'>METHOD</span>
      </div>
    </div>
  );
};
