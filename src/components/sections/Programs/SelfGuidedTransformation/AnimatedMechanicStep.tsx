'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

interface Props {
  id: number;
  title: string;
  icon: string;
  module_start: number;
  module_end: number;
  subtitle: string;
  modules: string[];
}

export default function AnimatedMechanicStep({ id, icon, module_start, module_end, title, subtitle, modules }: Props) {
  return (
    <motion.div
      className={`flex flex-col items-center h-full`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 2.0,
        delay: id * 0.2,
        ease: 'easeOut',
      }}
    >
      <div className='relative h-full rounded-[20px] px-[30px] w-full max-w-[392px] bg-white box-shadow-[0px 10px 20px rgba(0, 0, 0, 0.05)]'>
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
            <Image src={icon} alt={title} width={64} height={64} className='object-cover w-full h-full' quality={85} />
          </div>
        </div>

        <h2 className='mt-[46px] font-canela text-[60px]/[71px] mb-1 font-light text-[#C89F26]'>{id}.</h2>
        <h3 className='font-canela text-[42px]/[126%] mb-2 font-thin text-brand-deep'>{title}</h3>
        <h4 className='font-canela text-[20px]/[126%] text-[#010101] mb-[42px]'>
          (Modules {module_start} - {module_end})
        </h4>
        <h5 className='text-left font-canela text-[20px]/[126%] text-[#010101] mb-6'>{subtitle}</h5>

        <ul className='list-disc list-outside pl-5 flex flex-col justify-start mb-[46px]'>
          {modules.map((module, index) => (
            <li key={index} className='text-left text-brand-gray'>
              {module}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
