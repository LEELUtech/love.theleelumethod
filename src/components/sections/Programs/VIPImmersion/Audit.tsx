import { Section } from '@/components/ui/containers/section';
import { ArrowList } from '@/components/ui/lists';
import RotateOnView from '@/components/ui/RotateOnView';
import { Flex } from 'antd';
import Image from 'next/image';

const content = {
  title: 'The Leelu Method Full Partner Audit',
  subtitle: [
    'This goes deeper than The Extended Compatibility Blueprint.',
    'You receive a complete decoding of your partner as a person—his wiring, patterns, needs, and relationship behavior.',
  ],
  description: 'This includes:',
  list: [
    "Full personal decoding of your partner's codes",
    'His emotional triggers and relationship patterns',
    'His strengths, blind spots, and behavior in conflict',
    'What motivates him and what shuts him down',
    'His personal energy and life strategy traits',
    'How to communicate with him effectively',
    'What he needs to feel love, respect, and desire',
  ],
  description_bottom: `He receives his own "instruction manual,” analyzing both how he shows up in your relationship and who he is at his core. Whether or not he participates, the decoding happens.`,
  highlight: `I work with the reality you're in—not the ideal one.`,
};

export const VIPImmersionAudit = () => {
  const { title, subtitle, description, list, description_bottom, highlight } = content;

  return (
    <Section backgroundImage='/images/bg/whatif-bg.jpg' wrapperClasses='py-[80px]'>
      <Flex className='flex-col-reverse lg:flex-row lg:space-between lg:mt-[175px] lg:gap-[90px] xl:gap-[110px] 2xl:gap-[130px]'>
        <Flex className='flex-1' vertical gap={24}>
          <h3 className='text-[48px]/[120%] font-canela font-light text-brand-deep'>{title}</h3>

          <h5 className='flex flex-col font-lato text-[17px]/[26px] text-brand-gray'>
            {subtitle.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </h5>
          <p className='font-lato text-[17px]/[26px] text-brand-gray'>{description}</p>

          <ArrowList list={list} />

          <p className='font-lato text-[17px]/[26px] text-brand-gray'>{description_bottom}</p>
          <h4 className='font-canela text-[32px]/[126%] font-light text-brand-deep'>{highlight}</h4>
        </Flex>

        <div className=' flex-1 w-full'>
          <div className='relative mx-auto w-full max-w-[400px] mb-10 lg:mb-0 lg:mx-0 lg:max-w-[518px] aspect-[518/820]'>
            <div>
              <div className='relative max-w-[493px] aspect-[493/367] overflow-hidden rounded-t-[300px]'>
                <Image src='/images/programs/vip-immersion/woman_orange.png' alt='Resources Section 3' quality={100} fill priority className='object-cover object-top' />
              </div>
              <div className='relative max-w-[493px] h-1 bg-white'>
                <div className='absolute right-[20px] xl:right-[25px] top-1/2 -translate-y-1/2 z-20'>
                  <div className='flex items-center justify-center rounded-full bg-white shadow-[0px_6px_20px_rgba(0,0,0,0.12)] size-[86px] md:size-[96px] lg:size-[104px]'>
                    <RotateOnView
                      duration={5}
                      amount={0.5}
                      className='relative size-[70px] md:size-[70px] lg:size-[80px]'
                      ease='easeOut'
                    >
                      <Image src='/icons/ornament_2/ornament_2_black.svg' alt='' fill priority quality={100} />
                    </RotateOnView>
                  </div>
                </div>
              </div>
              <div className='relative max-w-[493px] aspect-[493/367] overflow-hidden rounded-b-[20px]'>
                <Image src='/images/programs/phase_2.png' alt='Resources Section 3' quality={100} fill priority />
              </div>
            </div>
          </div>
        </div>
      </Flex>
    </Section>
  );
};
