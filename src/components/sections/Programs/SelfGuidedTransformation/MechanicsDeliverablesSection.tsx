'use client';

import Image from 'next/image';
import React from 'react';
import AnimatedMechanicStep from './AnimatedMechanicStep';
import SlowVideo from '@/components/ui/SlowVideo';
import { Flex } from 'antd';
import { OpacityLineIC, StarIC } from '@/components/icons';
import { ArrowList } from '@/components/ui/lists';

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
  personalized: {
    title_left: 'Personalized',
    title_right: 'Report',
    subtitle: 'Calculated with The Leelu Method',
    description: 'Every participant receives three manually calculated reports based on full name + DOB:',
    items: [
      {
        id: 1,
        title: 'Energy Activation Report',
        subtitle: 'Your personal energy & magnetism code.',
        description: 'Inside:',
        list: [
          'What restores your energy and nervous system balance',
          'Personalized activities that recharge you',
          'What increases your feminine radiance and attractiveness',
          'What drains your energy',
          'What habits and environments accelerate burnout, aging, and loss of desire',
          'What must be reduced or eliminated to protect your vitality',
        ],
      },
      {
        id: 2,
        title: `“His Secret Desires” Report`,
        subtitle: 'Calculated for your partner or desired partner.',
        description: 'Inside:',
        list: [
          'What truly ignites him emotionally and energetically',
          'What gives him joy, meaning, and satisfaction',
          'What type of feminine energy he subconsciously seeks',
          'Activities a woman can introduce so he associates her with pleasure and inspiration',
          'Red flags that drain his joy and push him away',
        ],
      },
      {
        id: 3,
        title: 'Compatibility & Couple Dynamics Report',
        subtitle: 'If you are in a relationship',
        description: 'Inside:',
        list: [
          'Your shared mission as a couple',
          'What you can realistically build together',
          'What you truly feel for each other beneath the surface',
          'Core obstacles and repeating conflicts',
          'What each partner must do for the relationship to thrive',
          'What your connection is designed to teach you',
          'Hidden lessons and unresolved patterns',
        ],
      },
    ],
    program: [
      {
        id: '1',
        title: 'Live Support During The Program',
        list: [
          '2 Live Group Q&A Calls with Lily ( End of Week 1 and End of Week 2 )',
          '60 days of community support inside Circle',
          'Chat questions answered by program curator',
          'During live calls, you may ask any questions related to the material and',
          'your specific situation.',
        ],
      },
      {
        id: '2',
        title: 'Ongoing Access After Completition',
        subtitle: 'All Essentials students receive:',
        list: ['Monthly live Q&A calls with Lily for 3 months', 'Bring any relationship or compatibility questions'],
      },
      {
        id: '3',
        title: 'Program Duration: Approximately 2–3 weeks with guided pacing',
      },
    ],
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
  const { receive, module, phase, workbook, personalized } = content;

  return (
    <section
      style={{
        backgroundImage: "url('/images/programs/self-guided-transformation/mechanics_section_bg.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[112px] 2xl:px-[180px] relative py-[80px] lg:py-[110px]'>
        <div className='text-center mb-[150px]'>
          <Flex gap={35} className='mb-[35px]'>
            <Flex vertical align='center' className='w-70' gap={16}>
              <StarIC className='text-brand-gold' />
              <OpacityLineIC />
            </Flex>

            <div className='text-brand-deep text-left'>
              <h2 className='text-[48px]/[100%] font-canela font-thin lg:text-[60px]'>{receive.title}</h2>
              <p className='font-lato lg:mt-2 mt-6  text-body'>{receive.subtitle}</p>
            </div>
          </Flex>

          {/* MODULE */}
          <Flex component='article' justify='space-between'>
            <Flex vertical className='flex-1 mt-[115px]'>
              <h3 className='text-[48px]/[100%] max-w-[485px] text-left font-light font-canela text-brand-deep mb-4'>
                {module.title}
              </h3>
              <h6 className='text-[17px]/[26px] text-left font-lato text-brand-gray mb-9'>{module.subtitle}</h6>

              <ArrowList list={module.list} />
            </Flex>

            <div className='flex-1 relative max-w-[496px] aspect-[496/535]'>
              <Image src='/images/lily/lily_11.png' alt={module.title} fill quality={100} />
            </div>
          </Flex>

          {/* PHASE */}
          <article>
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
          </article>
        </div>

        {/* WORKBOOK */}
        <article className='flex flex-col-reverse lg:flex-row justify-center lg:gap-[60px] xl:gap-[90px] 2xl:gap-[130px] mb-[260px]'>
          <div className='flex-1'>
            <VideoContent />
          </div>

          <Flex vertical className='flex-1  mb-[78px] lg:mb-0'>
            <h2 className='text-[48px]/[100%] font-canela font-light text-brand-deep mb-4'>{workbook.title}</h2>
            <h5 className='text-[17px]/[26px] font-lato text-brand-gray mb-8'>{workbook.subtitle}</h5>
            <p className='text-[32px]/[100%] font-canela font-light text-brand-gray'>{workbook.description}</p>
          </Flex>
        </article>

        {/* Personalized Report */}
        <article>
          <Flex vertical align='center' gap={20} className='mb-[48px] lg:mb-[60px]'>
            <h2 className='text-[48px]/[100%] lg:text-[122px] text-center font-canela font-thin text-brand-deep'>
              <span className='text-brand-primary'>{personalized.title_left}</span> {personalized.title_right}
            </h2>
            <h4 className='text-[24px]/[100%] lg:text-[32px] font-canela font-light'>{personalized.subtitle}</h4>
            <p className='text-center lg:text-left text-[17px]/[26px] font-lato  text-brand-gray'>
              {personalized.description}
            </p>
          </Flex>

          <ul className='flex flex-col lg:flex-row gap-6 justify-center mb-[112px]'>
            {personalized.items.map((i) => {
              const isEven = i.id % 2 === 0;
              const bgColor = isEven ? 'bg-[#FFF3F0]' : 'bg-[#FFFFFF]';

              return (
                <li
                  key={i.id}
                  className={`w-full rounded-[20px] pl-[30px] pr-4 bs:px-[30px] pt-[38px] pb-[48px] ${bgColor} box-shadow-[0px 10px 20px rgba(0, 0, 0, 0.05)]`}
                >
                  <StarIC className='text-brand-gold mb-[26px]' width={27} height={33} />

                  <h4 className='text-[32px]/[100%] font-canela font-light mb-7 text-black'>{i.title}</h4>
                  <h5 className='text-[17px]/[26px] font-lato mb-11 text-brand-gray'>{i.subtitle}</h5>
                  <p className='text-[17px]/[26px] font-lato mb-11 text-brand-gray'>{i.description}</p>

                  <ul className='text-[17px]/[26px] font-lato text-brand-gray pl-4'>
                    {i.list.map((item) => (
                      <li key={item} className='list-disc'>
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>

          <div className='flex flex-col items-center justify-center lg:items-start lg:flex-row lg:justify-between lg:gap-[60px] xl:gap-[90px] 2xl:gap-[130px]'>
            <div className='flex-1 max-w-[496px] aspect-[496/761] rounded-[100px] overflow-hidden'>
              <Image src='/images/lily/lily_12.png' width={496} height={761} alt='' className='w-full h-auto' />
            </div>{' '}
            <div className='flex-1 pt-[72px] lg:pt-[112px]'>
              <ul className='flex flex-col gap-[48px]'>
                {personalized.program.map((item) => (
                  <li key={item.id}>
                    <h4 className='flex items-start gap-4 text-[32px]/[100%] font-canela font-light mb-8 text-brand-deep'>
                      <div className='w-[27px] h-[33px]'>
                        <StarIC width={27} height={33} className='text-brand-primary' />
                      </div>
                      {item.title}
                    </h4>

                    {item.subtitle && <h6 className='text-[17px]/[26px] font-lato mb-4'>{item.subtitle}</h6>}

                    {item.list && <ArrowList list={item.list} />}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
