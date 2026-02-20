import { Flex } from 'antd';
import Image from 'next/image';

interface Props {
  mb?: number;
}

export const FooterLabel = ({ mb = 12 }: Props) => {
  return (
    <Flex vertical>
      <span className='inline-block w-[57px] h-[57px] md:w-12 md:h-12 relative' style={{ marginBottom: mb }}>
        <Image src='/leelu_logo.svg' alt='Lily Chystofat Logo' fill className='object-contain' priority />
      </span>

      <div className=' text-[32px] md:text-[32px] leading-[130%]'>
        <span className='font-medium font-canela tracking-tight mr-1'>LILY</span>
        <span className='font-canela font-light'>CHYSTOFAT</span>
      </div>

      <p className='mt-2 text-gray-600 font-medium font-lato leading-6 text-[11px] uppercase max-w-xs'>
        Stop Guessing. Start Calculating.
      </p>
    </Flex>
  );
};
