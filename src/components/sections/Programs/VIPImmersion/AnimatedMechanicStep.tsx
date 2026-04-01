'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

interface Props {
  id: number;
  title: string;
  icon: string;
  description: string;
  size?: 'md' | 'lg';
}

export default function AnimatedMechanicStep({ id, icon, title, description, size = 'md' }: Props) {
  const imgClass = size === 'md' ? 'w-[64px] h-[64px]' : 'w-[87px] h-[87px]';
  const imgSize = size === 'md' ? 64 : 87;
  const imgWrapperClass = size === 'md' ? 'w-[90px] h-[90px] -top-10' : 'w-[177px] h-[210px] -top-[105px]';
  const titleClass = size === 'md' ? 'mt-[46px]' : 'mt-[70px]';

  return (
    <motion.div
      className={`flex flex-col items-center h-full`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: id * 0.2,
        ease: 'easeOut',
      }}
    >
      <div className='relative h-full rounded-[20px] px-[20px] pb-6 bg-white box-shadow-[0px 10px 20px rgba(0, 0, 0, 0.05)]'>
        <div
          className={`${imgWrapperClass} rounded-full flex items-center justify-center absolute -top-10 right-1/2 translate-x-1/2`}
          style={{
            backgroundImage: "url('/images/programs/self-guided-transformation/mechanic_icon.png')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <div className={imgClass}>
            <Image src={icon} alt={title} width={imgSize} height={imgSize} className='object-cover w-full h-full' quality={100} />
          </div>
        </div>

        <h2 className={`relative z-50 font-canela text-[60px]/[71px] mb-7 font-light text-[#C89F26] ${titleClass}`}>
          {id}.
        </h2>
        <h3 className='font-canela text-[32px]/[126%] mb-4 font-light text-brand-deep'>{title}</h3>

        <p className='font-lato font-medium text-[17px]/[26px] tracking-[3%] text-[#5A5757]'>{description}</p>
      </div>
    </motion.div>
  );
}
