'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Section } from '@/components/ui/containers/section';

export interface IProgramItWorks {
  description: string[];
  subtitle: string[];
  link?: {
    label: string;
    href: string;
  };
  imgSrc: string;
}

interface Props extends IProgramItWorks {} // eslint-disable-line @typescript-eslint/no-empty-object-type

export const ProgramItWorks = ({ description, subtitle, link, imgSrc }: Props) => {
  return (
    <Section backgroundImage='https://firebasestorage.googleapis.com/v0/b/leelu-tech.firebasestorage.app/o/love.theleelumethod%2Fbg%2Fitworks_bg.png?alt=media'>
      <motion.div
        className='pt-[40px] pb-[160px] lg:pt-[60px]'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-10 items-center'>
          <div className='lg:max-w-[492px] lg:order-1 order-2 md:mx-auto lg:mx-0'>
            <h2 className='mb-6 font-canela font-thin text-brand-deep leading-[130%] text-[60px] md:text-[78px] lg:text-[112px]'>
              It Worked <br className='hidden lg:block' />
              For Me
            </h2>

            <p className='mb-12 flex flex-col gap-4 font-lato text-[#757986] text-[17px]/[26px] md:text-[18px] '>
              {description.map((line, idx) => (
                <span key={idx}>{line}</span>
              ))}
            </p>

            <p className='mb-[30px] flex flex-col gap-10 font-canela font-light text-brand-deep text-[32px]/[126%]'>
              {subtitle.map((line, idx) => (
                <span key={idx}>{line}</span>
              ))}
            </p>
            {link && (
              <Button
                variant='primary'
                href={link.href}
                className='w-full lg:w-[80%] mt-[32px]'
                trackingData={{
                  cta_name: 'program_it_works_cta',
                  cta_text: link.label,
                  cta_target_url: link.href,
                  cta_location: 'it_works',
                }}
              >
                {link.label}
              </Button>
            )}
          </div>

          <div className='flex order-1 lg:order-2 justify-center lg:justify-end'>
            <div className='relative w-full max-w-[420px] md:max-w-[560px] lg:max-w-[520px]'>
              <div className='relative overflow-hidden rounded-[44px] md:rounded-[56px] lg:rounded-[64px]'>
                <div className='relative w-full h-[510px] md:h-[806px] lg:h-[806px]'>
                  <Image src={imgSrc} alt='It worked for me' fill priority quality={100} className='object-cover' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};
