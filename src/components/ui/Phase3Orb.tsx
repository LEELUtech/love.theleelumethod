'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Phase3Orb() {
  return (
    <div className='relative w-full max-w-[460px] mx-auto lg:mx-0'>
      <div className='relative w-full aspect-[480/554]'>
        {/* background oval */}
        <div className='absolute inset-0 rounded-[999px] bg-[#B02F44]' />

        {/* rotating fractal */}
        <div className='absolute inset-0 z-[2] flex items-center justify-center pointer-events-none'>
          <motion.div
            className='relative w-[72%] aspect-square'
            initial={{ rotate: 0 }}
            whileInView={{ rotate: 360 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 5, ease: 'linear' }}
            style={{
              willChange: 'transform',
              transformOrigin: '50% 50%',
            }}
          >
            <Image src='/icons/ornament_3.svg' alt='' fill priority className='object-contain select-none' />
          </motion.div>
        </div>

        {/* badge top */}
        <div className='absolute z-[3] top-[18%] right-[28%] w-[64px] h-[64px] md:w-[81px] md:h-[81px] rounded-full bg-[#F5E9E9] flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.25),0_20px_60px_rgba(0,0,0,0.35)]'>
          <div className='relative w-[26px] h-[26px] md:w-[32px] md:h-[39px]'>
            <Image src='/icons/red_star.svg' alt='' fill className='object-contain' />
          </div>
        </div>

        {/* badge bottom */}
        <div className='absolute z-[3] bottom-[22%] left-[25%] w-[64px] h-[64px] md:w-[81px] md:h-[81px] rounded-full bg-[#F5E9E9] flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.25),0_20px_60px_rgba(0,0,0,0.35)] '>
          <div className='relative w-[30px] h-[30px] md:w-[42px] md:h-[26px] translate-y-1'>
            <Image src='/icons/necktie.svg' alt='' fill className='object-contain' />
          </div>
        </div>
      </div>
    </div>
  );
}
