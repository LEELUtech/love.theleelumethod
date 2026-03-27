'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import RotateOnView from '@/components/ui/RotateOnView';

type Card = {
  title: string;
  text: string;
  img?: string;
  icon?: string;
};

export default function LoveLevelsAnimatedBlock({ cards }: { cards: Card[] }) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const headerInView = useInView(headerRef, {
    once: true,
    amount: 0.1,
    margin: '0px 0px -35% 0px',
  });

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ['start end', 'end start'],
  });
  const headerY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  return (
    <div>
      {/* SECOND BLOCK */}
      <motion.div ref={headerRef} className='relative text-center mb-12 md:mb-16 lg:mb-[34px]' style={{ y: headerY }}>
        <div
          className='
            absolute left-1/2 -translate-x-1/2 z-0 overflow-hidden
            top-[-220px] w-[350px] h-[350px]
            md:top-[-160px] md:w-[300px] md:h-[300px]
            lg:top-[-210px] lg:w-[400px] lg:h-[400px]
          '
          style={{
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
          }}
        >
          <RotateOnView duration={5} amount={0.2} ease='linear' className='absolute inset-0'>
            <Image
              src='/icons/ornament_2/ornament_2_light.svg'
              alt=''
              fill
              priority
              className='object-contain'
              style={{ filter: 'brightness(200%)' }}
            />
          </RotateOnView>
        </div>

        <motion.h3
          className='
            relative z-10 font-canela font-thin tracking-normal text-brand-deep mb-4 leading-[130%]
            text-[48px] md:text-[48px] lg:text-[60px]
          '
          initial={{ opacity: 0, y: 22 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Love isn&apos;t just about who you choose…
          <br />
          It&apos;s about what you&apos;re available for.
        </motion.h3>

        <motion.p
          className='
            font-light font-canela tracking-normal leading-[130%]
            text-[20px] md:text-[26px] lg:text-[32px]
          '
          initial={{ opacity: 0, y: 18 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          And that&apos;s determined at three levels, <br />
          each deeper than the last.
        </motion.p>
      </motion.div>

      {/* THIRD BLOCK */}
      <div className='grid grid-cols-1 gap-6 items-center justify-items-center mb-10'>
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.18,
              margin: '0px 0px -20% 0px',
            }}
            transition={{
              duration: 1.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className='
              bg-white rounded-[32px] text-center flex flex-col items-center justify-center
              w-full max-w-[909px] min-h-[450px] p-6 md:p-8 lg:p-10'
          >
            {card.img && (
              <div className='relative w-[139px] h-[139px] mb-4'>
                <Image src={card.img} alt='' fill className='object-contain opacity-35' />
                {card.icon && (
                  <Image
                    src={card.icon}
                    alt=''
                    width={90}
                    height={90}
                    className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                  />
                )}
              </div>
            )}

            <h4 className='font-canela font-normal md:font-light text-brand-black mb-3 text-[32px] md:text-[40px] lg:text-[60px]'>
              {card.title}
            </h4>

            <p className='font-lato text-brand-gray max-w-[680px] text-[17px]/[26px]'>{card.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
