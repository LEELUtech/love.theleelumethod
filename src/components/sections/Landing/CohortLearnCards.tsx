'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';

type Card = {
  title: string;
  text: string;
  size?: 'md' | 'lg';
};

function LearnCard({ title, text, size = 'lg' }: Card) {
  const height = size === 'lg' ? 'lg:h-[348px]' : 'lg:h-[274px]';

  return (
    <div
      className={`rounded-[32px] bg-brand-white backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)]
        max-w-[392px] px-8 py-[48px]
        sm:max-w-none sm:w-full sm:h-auto sm:px-7 sm:py-7
        lg:px-[38px] ${height}`}
    >
      <h3 className='font-canela font-light text-[32px]/[120%] text-brand-deep mb-4'>{title}</h3>

      <p className='font-lato font-medium text-brand-gray-100 text-body leading-[26px]'>{text}</p>
    </div>
  );
}

const CARDS = {
  top: {
    title: 'The Loyalty Algorithm',
    text: 'There are 87 types of "Hidden Desires." I will show you how to identify the one specific thing he needs (that he doesn\'t even know he needs) to trigger his commitment.',
  },
  left: {
    title: 'The “Script” Glitch',
    text: 'Why you keep attracting the same man with a different face. We will identify if you are running the "Man in the Skirt" program or a Subconscious Childhood Loop that rejects healthy love.',
  },
  right: {
    title: 'Math vs. Chemistry',
    text: 'Why "butterflies" are often a warning sign of incompatibility. We will look at the 475+ formulas that predict if a relationship will last or collapse.',
  },
  center: {
    title: 'The Conflict Origin',
    text: 'We will identify exactly what is responsible for the destructive cycle in your relationship and the specific behavioral move to stop it.',
  },
  bottomLeft: {
    title: 'The Energy Audit',
    text: 'Why you feel drained even after 8 hours of sleep. We will map the specific Attachment Patterns still tethered to your exes that are draining your nervous system and making you invisible to new partners.',
  },
  bottomRight: {
    title: 'The “Scorekeeper” Trap:',
    text: 'Are you operating as an Unconditional Giver, a Scorekeeper, or a Taker? I will show you how shifting out of the "Transactional Phase" kills resentment and forces him to step up.',
  },
} satisfies Record<string, Card>;

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.83, ease: easeOutQuint },
  },
};

function AnimatedCardWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export default function CohortLearnCards() {
  return (
    <div className='relative mt-6'>
      {/* Desktop layout (exact like screenshot) */}
      <motion.div
        className='hidden lg:grid grid-cols-3 items-start gap-5 gap-x-5'
        variants={containerVariants}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* row 1 */}
        <AnimatedCardWrap className='mt-[104px]'>
          <LearnCard {...CARDS.left} />
        </AnimatedCardWrap>

        <AnimatedCardWrap>
          <LearnCard {...CARDS.top} />
        </AnimatedCardWrap>

        <AnimatedCardWrap className='mt-[104px]'>
          <LearnCard {...CARDS.right} />
        </AnimatedCardWrap>

        {/* row 2 */}
        <AnimatedCardWrap>
          <LearnCard {...CARDS.bottomLeft} />
        </AnimatedCardWrap>

        <AnimatedCardWrap className='mt-[-96px]'>
          <LearnCard {...CARDS.center} size='md' />
        </AnimatedCardWrap>

        <AnimatedCardWrap>
          <LearnCard {...CARDS.bottomRight} />
        </AnimatedCardWrap>
      </motion.div>

      {/* Mobile/Tablet layout (stack) */}
      <motion.div
        className='lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'
        variants={containerVariants}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.2 }}
      >
        <AnimatedCardWrap>
          <LearnCard {...CARDS.left} />
        </AnimatedCardWrap>
        <AnimatedCardWrap>
          <LearnCard {...CARDS.bottomLeft} />
        </AnimatedCardWrap>
        <AnimatedCardWrap>
          <LearnCard {...CARDS.top} />
        </AnimatedCardWrap>
        <AnimatedCardWrap>
          <LearnCard {...CARDS.center} />
        </AnimatedCardWrap>
        <AnimatedCardWrap>
          <LearnCard {...CARDS.right} />
        </AnimatedCardWrap>
        <AnimatedCardWrap>
          <LearnCard {...CARDS.bottomRight} />
        </AnimatedCardWrap>
      </motion.div>
    </div>
  );
}
