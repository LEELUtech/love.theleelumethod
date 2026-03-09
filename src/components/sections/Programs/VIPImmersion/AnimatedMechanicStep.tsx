'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

interface Props {
  id: number;
  title: string;
  icon: string;
  description: string;
}

export default function AnimatedMechanicStep({ id, icon, title, description }: Props) {
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
          className='w-[90px] h-[90px] rounded-full flex items-center justify-center absolute -top-10 right-1/2 translate-x-1/2'
          style={{
            backgroundImage: "url('/images/programs/self-guided-transformation/mechanic_icon.png')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <div className='w-[64px] h-[64px]'>
            <Image src={icon} alt={title} width={64} height={64} className='object-cover w-full h-full' />
          </div>
        </div>

        <h2 className='mt-[46px] font-canela text-[60px]/[71px] mb-7 font-light text-[#C89F26]'>{id}.</h2>
        <h3 className='font-canela text-[32px]/[126%] mb-4 font-light text-brand-deep'>{title}</h3>

        <p className='font-lato font-medium text-[17px]/[26px] tracking-[3%] text-[#5A5757]'>{description}</p>
      </div>
    </motion.div>
  );
}
