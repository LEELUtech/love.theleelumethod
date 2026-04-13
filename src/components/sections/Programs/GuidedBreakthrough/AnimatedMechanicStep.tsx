'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

interface AnimatedMechanicStepProps {
  index: number;
  icon: string;
  stepNumber: string;
  title: string;
  description: string;
  className?: string;
}

export default function AnimatedMechanicStep({
  index,
  icon,
  stepNumber,
  title,
  description,
  className = '',
}: AnimatedMechanicStepProps) {
  return (
    <motion.div
      className={`flex flex-col items-center ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 2.0,
        delay: index * 0.2,
        ease: 'easeOut',
      }}
    >
      <div className='relative h-[210px] w-[177px]'>
        <Image src='/images/programs/self-guided-transformation/mechanic_icon.png' alt='' fill quality={85} />
        <div className='absolute top-1/2 left-[50px] -translate-y-14 h-[80px] w-[80px]'>
          <Image src={icon} alt='' fill className='object-contain' quality={85} />
        </div>
        <p className='mt-4 absolute bottom-[-15px] left-[70px] font-canela font-light text-[#C89F26] text-[60px] leading-none'>
          {stepNumber}
        </p>
      </div>

      <p className='mt-[76px] font-canela font-light text-brand-black lg:text-[32px] text-[24px] leading-[1.15]'>
        {title}
      </p>

      <p className='mt-4 text-center font-lato text-[#5A5757] text-body leading-[1.7]'>{description}</p>
    </motion.div>
  );
}
