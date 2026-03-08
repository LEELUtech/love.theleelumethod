'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface IconBubbleProps {
  src: string;
  className: string;
  iconClass: string;
}

const IconBubble = ({ src, className, iconClass }: IconBubbleProps) => {
  return (
    <div
      className={`absolute z-[3] w-[64px] h-[64px] md:w-[81px] md:h-[81px] rounded-full bg-[#F5E9E9] flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.25),0_20px_60px_rgba(0,0,0,0.35)] ${className}`}
    >
      <div className={`relative ${iconClass}`}>
        <Image src={src} alt='' fill className='object-contain' />
      </div>
    </div>
  );
};

export default function Phase3Orb() {
  return (
    <div className='relative w-full max-w-[520px] mx-auto lg:mx-0'>
      <div className='relative w-full aspect-[480/554]'>
        <div className='w-full h-full max-w-[480px] max-h-[554px] flex items-center justify-center rounded-[1000px] bg-[#B02F44]'>
          <motion.div
            className='relative w-[80%] aspect-square'
            initial={{ rotate: 0 }}
            whileInView={{ rotate: 360 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 5, ease: 'linear' }}
          >
            <Image src='/icons/ornament_3.svg' alt='' fill priority className='object-contain select-none' />
          </motion.div>
        </div>

        <IconBubble
          src='/icons/red_star.svg'
          className='top-[18%] right-[28%]'
          iconClass='w-[26px] h-[26px] md:w-[32px] md:h-[39px]'
        />

        <IconBubble
          src='/icons/necktie.svg'
          className='bottom-[22%] left-[25%]'
          iconClass='w-[30px] h-[30px] md:w-[42px] md:h-[26px] translate-y-1'
        />
      </div>
    </div>
  );
}
