'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Section } from '@/components/ui/containers/section';

const wrap: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.28,
      delayChildren: 0.15,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemFade: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
  },
};

const ITEMS = [
  {
    parts: [
      { text: 'Understand why your nervous system was trained to read intensity as love — and how to ' },
      { text: 'reset the signal.', bold: true },
    ],
  },
  {
    parts: [
      { text: 'Finally understand how to ' },
      { text: 'break the patterns', bold: true },
      { text: " you've inherited from past relationships." },
    ],
  },
  {
    parts: [
      { text: 'Know what ' },
      { text: 'chemistry', bold: true },
      { text: " can't tell you about " },
      { text: 'compatibility', bold: true },
      { text: ', and what The Leelu Method can.' },
    ],
  },
  {
    parts: [
      { text: 'Know what the connection to your ex really means, and how to ' },
      { text: 'cut the cord', bold: true },
      { text: ' for good.' },
    ],
  },
  {
    parts: [
      { text: 'Understand how to create a lasting, meaningful connection from clarity, ensuring your next relationship is built on a foundation of ' },
      { text: 'deep intimacy and enduring love.', bold: true },
    ],
  },
];

const WebinarDiscoverSection = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.12,
    margin: '0px 0px -25% 0px',
  });

  return (
    <Section wrapperClasses='xs:!pt-[1000px] md:!pt-[550px] lg:!pt-[420px]'>
      <div className='max-w-[1200px] mx-auto'>
        <motion.div ref={ref} variants={wrap} initial='hidden' animate={inView ? 'show' : 'hidden'}>
          <motion.h2
            variants={fadeUp}
            className='font-canela font-thin leading-[110%] text-center text-brand-deep mb-10 md:mb-12 lg:mb-16
              text-[48px] md:text-[48px] lg:text-[60px]'
          >
            By the end, you will:
          </motion.h2>

          <div className='max-w-[845px] mx-auto'>
            {ITEMS.map((item, i) => (
              <motion.div key={i} variants={itemFade} className={`flex gap-8 items-start ${i !== 0 ? 'mt-6 lg:mt-8' : ''}`}>
                <div className='font-canela font-light text-[32px] flex-shrink-0'>{i + 1}.</div>
                <p className='font-lato font-medium text-[#5A5757] text-[20px]/[130%] pt-1'>
                  {item.parts.map((part, idx) =>
                    part.bold ? (
                      <span key={idx} className='font-bold text-brand-primary'>
                        {part.text}
                      </span>
                    ) : (
                      <span key={idx}>{part.text}</span>
                    ),
                  )}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default WebinarDiscoverSection;
