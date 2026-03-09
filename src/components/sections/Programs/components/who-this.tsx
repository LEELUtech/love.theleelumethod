'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { NecktieIC, StarIC } from '@/components/icons';
import { Section } from '@/components/ui/containers/section';

export interface IProgramsWhoThis {
  title: string;
  imgSrc: string;
  items: {
    id: number;
    icon: 'star' | 'necktie';
    title: string;
    text: string;
  }[];
}

const renderIcon = (type: 'star' | 'necktie') =>
  type === 'star' ? (
    <div className='w-[27px] h-[33px] mr-1.5'>
      <StarIC className='w-full h-full text-brand-primary' />
    </div>
  ) : (
    <div className='w-[42px] h-[26px] mr-1.5'>
      <NecktieIC className='w-full h-full text-brand-gold' />
    </div>
  );

interface Props extends IProgramsWhoThis {} // eslint-disable-line @typescript-eslint/no-empty-object-type

export const ProgramsWhoThis = (props: Props) => {
  const { title, imgSrc, items } = props;

  return (
    <Section sectionClasses='bg-brand-white'>
      <motion.div
        className='relative'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      >
        <div className='grid grid-cols-1 lg:grid-cols-[1.50fr_0.50fr] gap-12 md:gap-14 lg:gap-16 items-center'>
          <div className='order-2 lg:order-1'>
            <h2 className='font-canela font-thin text-brand-black text-[44px] md:text-[52px] lg:text-[60px] leading-[105%]'>
              {title}
            </h2>

            <div className='mt-[40px] md:mt-[44px] lg:mt-[56px] space-y-6'>
              {items.map((item) => (
                <div key={item.title} className='rounded-[16px] bg-[#FFF8F8] px-6 py-6'>
                  <div className='flex items-start gap-4'>
                    <div>
                      <div className='flex flex-row gap-4 items-center'>
                        {renderIcon(item.icon)}
                        <p className='font-canela font-light text-brand-deep text-[26px] md:text-[28px] lg:text-[32px] tracking-[0.02em]'>
                          {item.title}
                        </p>
                      </div>

                      <p className='mt-4 font-lato font-normal text-[#6A6A6A] text-body leading-[1.75]'>{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='relative order-1 lg:order-2 flex justify-center lg:justify-end'>
            <div className='relative w-full max-w-[380px] md:max-w-[420px] lg:max-w-[520px]'>
              <div className='relative'>
                <div className='relative w-full h-[520px] md:h-[620px] lg:w-[496px] lg:h-[834px] rounded-[100px] overflow-hidden'>
                  <Image src={imgSrc} alt='' fill priority quality={100} />
                </div>
              </div>

              <div className='absolute -bottom-[22px] md:-bottom-[28px] lg:-bottom-[26px] left-1/2 -translate-x-1/2'>
                <div
                  className="
                    bg-[#EB4F68] 
                  before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] 
                  before:opacity-15 before:mix-blend-overlay before:rounded-full flex items-center justify-center rounded-full
                    w-[96px] h-[132px]
                    md:w-[120px] md:h-[170px]
                    lg:w-[171px] lg:h-[238px]
                  "
                >
                  <div
                    className='
                      relative
                      w-[52px] h-[80px]
                      md:w-[60px] md:h-[110px]
                      lg:w-[69px] lg:h-[167px]
                    '
                  >
                    <Image
                      src='/icons/programs_icon_star.svg'
                      alt=''
                      fill
                      className='object-contain filter brightness-0 invert'
                    />
                  </div>
                </div>
              </div>

              <div className='h-10 md:h-14 lg:h-12' />
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};
