import Image from 'next/image';
import Link from 'next/link';

export const FooterLabel = () => {
  return (
    <div>
      <Link href='/' className='outline-none focus:outline-none text-inherit hover:text-inherit active:text-inherit'>
        <div className='flex items-center gap-3'>
          <span className='inline-block w-[57px] h-[57px] relative shrink-0'>
            <Image
              src='/leelu_logo.svg'
              width={57}
              height={57}
              alt='Lily Chystofat Logo'
              className='object-contain'
              priority
            />
          </span>

          <div className='text-[32px] md:text-[32px] leading-[130%]'>
            <span className='font-canela font-light'>THE</span>
            <span className='font-medium font-canela tracking-tight mr-1'> LEELU</span>
            <span className='font-canela font-light'>METHOD</span>
          </div>
        </div>

        <p className='mt-2 text-black font-medium font-lato leading-6 text-[11px] uppercase max-w-xs pl-[69px]'>
          Stop Guessing. Start Calculating.
        </p>
      </Link>
    </div>
  );
};
