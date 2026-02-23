'use client';

import Button from '@/components/ui/Button';
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
        icon: 'icons/ornament_17.svg',
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
        icon: 'icons/ornament_16.svg',
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
        icon: 'icons/ornament_11.svg',
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

export default function MechanicsDeliverablesSection() {
  const { receive, module, phase, workbook } = content;

  return (
    <section className='relative overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <Image
          src='/images/programs/self-guided-transformation/mechanics_section_bg.png'
          alt=''
          fill
          priority
          quality={100}
        />
      </div>
      <div className='container px-4 relative py-[80px] lg:pt-[110px] lg:pb-[230px]'>
        <div className='text-center'>
          <Flex gap={35}>
            <Flex vertical align='center' className='w-70' gap={16}>
              <StarIC />
              <OpacityLineIC />
            </Flex>

            <div className='text-brand-deep text-left'>
              <h2 className='text-[48px]/[100%] font-canela font-thin lg:text-[60px]'>{receive.title}</h2>
              <p className='font-lato lg:mt-2 mt-6  text-body'>{receive.subtitle}</p>
            </div>
          </Flex>

          <Flex justify='space-between'>
            <Flex vertical>
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

          <div
            className='
							grid grid-cols-1
							md:grid-cols-2
							lg:grid-cols-3
							gap-8 md:gap-6
							items-stretch
						'
          >
            {phase.items.map((item) => (
              <AnimatedMechanicStep key={item.id} {...item} />
            ))}
          </div>
        </div>

        {/* ===== IMAGE/VIDEO BLOCK (MOBILE + TABLET ONLY) ===== */}
        <div className='flex justify-center mt-[108px] lg:hidden'>
          <div
            className='
      relative
      w-[361px] h-[390px]
      md:w-[520px] md:h-[520px]
    '
          >
            {/* Main video */}
            <SlowVideo
              src='https://firebasestorage.googleapis.com/v0/b/leelu-tech.firebasestorage.app/o/landingVideos%2Flanding_video_1.mp4?alt=media&token=0c8dc725-566d-4cff-a30a-f88ccec29974'
              playbackRate={0.7}
              className='
        w-full h-full object-cover
        [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
        [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
				rounded-t-[300px]
      '
            />

            {/* Ornament */}
            <div
              className='
        absolute z-10 opacity-60
        bottom-[-400px] left-[-65px] w-[484px] h-[506px]
        md:bottom-[-320px] md:left-[-20px] md:w-[560px] md:h-[560px]
      '
            >
              <Image
                src='/icons/ornament_3.svg'
                alt=''
                fill
                quality={100}
                className='
          filter brightness-0 invert
          [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]
          [-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]
        '
              />
            </div>

            {/* Floating card */}
            <div
              className='
        absolute z-20
        bottom-[-280px] right-[100px]
        w-[166px] h-[238px]
        md:bottom-[-210px] md:right-[178px]
        bg-[#FFEBE5]
        rounded-[20px]
        shadow-[5.62px_5.62px_16.85px_0px_rgba(0,0,0,0.1)]
        flex flex-col items-center gap-[16px] pt-[20px] px-4
      '
            >
              <div
                className="
          relative
          flex items-center justify-center
          bg-[#EB4F68]
          rounded-[300px]
          w-[58px] h-[86px]
          overflow-hidden
          before:absolute before:inset-0
          before:bg-[url('/icons/noise.png')]
          before:opacity-15
          before:mix-blend-overlay
        "
              >
                <Image
                  src='/leelu_logo.svg'
                  alt=''
                  width={39}
                  height={39}
                  className='relative z-10 filter brightness-0 invert'
                />
              </div>

              <p className='font-canela font-light text-[18px] text-center text-brand-black'>
                The Relationship Protocol Workbook
              </p>
            </div>
          </div>
        </div>

        {/* === TITLE === */}
        <div className='flex mt-[340px] md:mt-[280px] lg:mt-[121px] items-start gap-[24px] lg:gap-[37px] justify-center lg:justify-start'>
          <Image src='/icons/star_with_line.png' alt='' width={48} height={48} />
          <h2 className='font-thin text-[48px] lg:text-[60px] leading-[100%] font-canela text-brand-deep text-left'>
            The Deliverables
          </h2>
        </div>

        {/* === DESKTOP GRID === */}
        <div className='grid grid-cols-1 mt-[55px] lg:grid-cols-2 gap-16 items-start'>
          {/* LEFT: TEXT */}
          <div>
            <div className='space-y-12 max-w-[557px] mx-auto lg:mx-0'>
              {[
                {
                  title: '12-Module Video System:',
                  text: 'Lifetime access to the full deprogramming curriculum.',
                },
                {
                  title: 'The Relationship Protocol Workbook:',
                  text: 'The exact exercises to rewrite your internal script.',
                },
                {
                  title: '60-Day Reprogramming Schedule:',
                  text: 'Daily homework and audio assignments delivered via Circle community to ensure consistent implementation.',
                },
                {
                  title: '2 Live Group Zoom Calls:',
                  text: 'Kick-off session to orient you to the system + wrap-up session to troubleshoot and integrate your results.',
                },
                {
                  title: 'Access to Quarterly Live Diagnostics:',
                  text: 'Watch Lily analyze VIP client cases in real-time)',
                },
                {
                  title: 'Bonus:',
                  text: 'Your Personal LeeluTech Breakdown (PDF)',
                },
              ].map((item, idx) => (
                <div key={idx} className='flex items-start gap-4'>
                  <Image src='/icons/star.svg' alt='' width={20} height={20} className='flex-shrink-0 mt-1' />
                  <div>
                    <h3 className='font-normal text-[24px] leading-[150%] font-lato text-[#8F6E0E] mb-3'>
                      {item.title}
                    </h3>
                    <p className='font-medium text-body text-[#5A5757] font-lato leading-[130%]'>{item.text}</p>
                  </div>
                </div>
              ))}

              <Button variant='primary' size='md' className='w-full xs:text-[12px] mt-[32px]'>
                ENROLL NOW
              </Button>
            </div>
          </div>

          {/* RIGHT: IMAGE (DESKTOP ONLY) */}
          <div className='hidden lg:flex'>
            <div className='relative w-[496px] h-[535px]'>
              <SlowVideo
                src='https://firebasestorage.googleapis.com/v0/b/leelu-tech.firebasestorage.app/o/landingVideos%2Flanding_video_1.mp4?alt=media&token=0c8dc725-566d-4cff-a30a-f88ccec29974'
                className='
		w-full h-full object-cover
		[mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]
		[-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]
		rounded-t-[300px]
	'
                playbackRate={0.7}
              />

              <div className='absolute z-30 bottom-[-300px] left-[20px] w-[484px] h-[506px] opacity-60'>
                <Image
                  src='/icons/ornament_3.svg'
                  alt=''
                  fill
                  quality={100}
                  className='
										filter brightness-0 invert
										[mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]
										[-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]
									'
                />
              </div>

              <div className='absolute p-4 flex flex-col gap-[27px] items-center bottom-[-200px] left-[180px] w-[166px] h-[238px] bg-[#FFEBE5] z-[40] rounded-[20px] shadow-[5.62px_5.62px_16.85px_0px_rgba(0,0,0,0.1)]'>
                <div
                  className="
									relative
										top-[20px]
									flex items-center justify-center
									bg-[#EB4F68]
									rounded-[254px]
									w-[62px] h-[86px]
									z-10
									overflow-hidden

									before:absolute before:inset-0
									before:bg-[url('/icons/noise.png')]
									before:opacity-15
									before:mix-blend-overlay
								"
                >
                  <Image
                    src='/leelu_logo.svg'
                    alt=''
                    width={39}
                    height={39}
                    className='relative z-10 filter brightness-0 invert'
                  />
                </div>
                <p className='font-canela font-light text-[18px] text-center text-brand-black'>
                  The Relationship Protocol Workbook
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
