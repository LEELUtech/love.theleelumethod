'use client';

import Image from 'next/image';
import React from 'react';
import AnimatedMechanicStep from './AnimatedMechanicStep';
import SlowVideo from '@/components/ui/SlowVideo';
import { Flex } from 'antd';
import { ArrowIC, OpacityLineIC, StarIC } from '@/components/icons';

const content = {
  receive: {
    title: 'WHAT YOU RECEIVE',
    subtitle: 'This isn’t a passive course. Over two weeks, you decode yourself and your relationships step by step.',
  },
  module: {
    title: 'THE 12-MODULE VIDEO SYSTEM',
    subtitle: 'A structured curriculum that teaches you:',
    list: [
      'Why your past relationships unfolded the way they did',
      'What patterns you repeat unconsciously',
      'How feminine and masculine energy works inside relationships',
      'How attraction is created, lost, and restored',
      'How to stop sabotaging connection',
      'How to build emotional safety and desire',
    ],
  },
  phase: {
    title: 'Delivered across three phases: ',
    icon: '',
    items: [
      {
        id: 1,
        title: 'The Audit',
        icon: '/icons/ornament_17.svg',
        module_start: 1,
        module_end: 4,
        modules: [
          'Locate your specific triggers',
          'Break the management pattern',
          'Detox unconscious narratives',
          'Shift from dependency to sovereignty',
        ],
        subtitle: 'Identify the invisible scripts running your romantic life.',
      },
      {
        id: 2,
        title: 'The Mechanics',
        icon: '/icons/ornament_16.svg',
        module_start: 5,
        module_end: 8,
        modules: [
          'Receive support without losing autonomy',
          'Shift from demands to requests that inspire action',
          'Decode masculine core drivers',
          'Become his sanctuary instead of his stressor, and reclaim your power.',
        ],
        subtitle: 'Decode the Male Operating System.',
      },
      {
        id: 3,
        title: 'The Strategy',
        icon: '/icons/ornament_11.svg',
        module_start: 9,
        module_end: 12,
        modules: [
          'Decode jealousy',
          'Map energy requirements',
          'Run the Compatibility Matrix to know if he’s a Life partner or a Lesson',
          'Identify his Hidden Desire so you become the only woman who speaks his language',
        ],
        subtitle: 'Master long-term relationship architecture..',
      },
    ],
    subtitle: '60-day access to the complete deprogramming curriculum.',
  },
  workbook: {
    title: 'Workbook & Written Integration Assignments',
    subtitle:
      'Each lesson includes a written homework assignment, reviewed by a Leelu Method program curator. Complete one lesson, integrate it through writing, and unlock the next only after submission.',
    description: 'This creates real transformation instead of passive consumption.',
  },
};

const VideoContent = () => (
  <div className='relative w-full max-w-[496px] aspect-[496/535] mx-auto'>
    <SlowVideo
      src='https://firebasestorage.googleapis.com/v0/b/leelu-tech.firebasestorage.app/o/landingVideos%2Flanding_video_1.mp4?alt=media&token=0c8dc725-566d-4cff-a30a-f88ccec29974'
      className='
        absolute inset-0
        w-full h-full
        object-cover
        rounded-t-[300px]
        [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]
        [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]
      '
      playbackRate={0.7}
    />

    <div className='absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-full flex justify-center'>
      <Image
        src='/icons/ornament_3.svg'
        alt=''
        width={700}
        height={700}
        className='w-full max-w-none opacity-60 filter brightness-0 invert'
      />
    </div>

    <div className='absolute top-[62%] left-1/2 -translate-x-1/2 translate-y-1/2 z-20'>
      <div className='w-[166px] p-4 flex flex-col items-center gap-6 bg-[#FFEBE5] rounded-[20px] shadow-lg'>
        <div className='relative w-[62px] h-[86px] flex items-center justify-center bg-[#EB4F68] rounded-full'>
          <Image src='/leelu_logo.svg' alt='' fill className='object-contain p-3 filter brightness-0 invert' />
        </div>

        <p className='text-center text-[18px] font-light'>The Relationship Protocol Workbook</p>
      </div>
    </div>
  </div>
);

export default function MechanicsDeliverablesSection() {
  const { receive, module, phase, workbook } = content;

  return (
    <section
      style={{
        backgroundImage: "url('/images/programs/self-guided-transformation/mechanics_section_bg.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[112px] 2xl:px-[180px] relative py-[80px] lg:pt-[110px] lg:pb-[230px]'>
        <div className='text-center mb-[150px]'>
          <Flex gap={35} className='mb-[35px]'>
            <Flex vertical align='center' className='w-70' gap={16}>
              <StarIC />
              <OpacityLineIC />
            </Flex>

            <div className='text-brand-deep text-left'>
              <h2 className='text-[48px]/[100%] font-canela font-thin lg:text-[60px]'>{receive.title}</h2>
              <p className='font-lato lg:mt-2 mt-6  text-body'>{receive.subtitle}</p>
            </div>
          </Flex>

          <Flex justify='space-between '>
            <Flex vertical className='mt-[115px]'>
              <h3 className='text-[48px]/[100%] text-left font-light font-canela text-brand-deep mb-4'>
                {module.title}
              </h3>
              <h6 className='text-[17px]/[26px] text-left font-lato text-brand-gray mb-9'>{module.subtitle}</h6>

              <ul className='text-[17px]/[26px] font-lato text-brand-gray'>
                {module.list.map((item, idx) => (
                  <Flex key={idx} gap={12} align='center'>
                    <ArrowIC />
                    <p>{item}</p>
                  </Flex>
                ))}
              </ul>
            </Flex>

            <div>
              <div className='relative w-[361px] h-[377px] sm:w-[320px] sm:h-[340px] md:w-[380px] md:h-[400px] lg:w-[496px] lg:h-[535px]'>
                <Image src='/images/lily/lily_11.png' alt={module.title} fill quality={100} />
              </div>
            </div>
          </Flex>

          <h4 className='text-[32px]/[100%] mt-[105px] text-brand-black-100 mb-[90px] text-left font-light'>
            {phase.title}
          </h4>

          <ul className='flex flex-wrap gap-x-6 gap-y-[80px] mb-5 justify-center'>
            {phase.items.map((item) => (
              <li key={item.id}>
                <AnimatedMechanicStep {...item} />
              </li>
            ))}
          </ul>

          <span className='text-[15px]/[24px] font-lato text-black'>{phase.subtitle}</span>
        </div>

        <div className='flex justify-center lg:gap-[60px] xl:gap-[90px] 2xl:gap-[130px]'>
          <div className='flex-1'>
            <VideoContent />
          </div>

          <Flex vertical className='flex-1'>
            <h2 className='text-[48px]/[100%] font-canela font-light text-brand-deep mb-4'>{workbook.title}</h2>
            <h5 className='text-[17px]/[26px] font-lato text-brand-gray mb-8'>{workbook.subtitle}</h5>
            <p className='text-[32px]/[100%] font-canela font-light text-brand-gray'>{workbook.description}</p>
          </Flex>
        </div>
      </div>
    </section>
  );
}
