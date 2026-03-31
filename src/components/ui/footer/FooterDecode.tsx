import Link from 'next/link';
import { FooterLabel } from './FooterLabel';

const FooterDecode = () => {
  return (
    <footer className='bg-white pb-[72px] pt-6 lg:pb-[180px]'>
      <div className='relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[40px] 4xl:px-[180px]'>
        <div className='flex flex-col lg:flex-row lg:justify-between gap-10 lg:gap-0'>
          <FooterLabel />

          <div className='mt-0 lg:mt-[62px]'>
            <h4 className='text-[32px] font-canela font-thin text-black mb-4 leading-[130%]'>
              Support
            </h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/legal'
                  className='text-[11px] font-lato font-medium leading-6 tracking-widest text-black uppercase'
                >
                  Legal
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterDecode;
