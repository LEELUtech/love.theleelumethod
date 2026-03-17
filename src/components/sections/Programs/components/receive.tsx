import { OpacityLineIC, StarIC } from '@/components/icons';
import { ArrowList } from '@/components/ui/lists';

import { Flex } from 'antd';
import Image from 'next/image';

export interface IProgramAdditionalModule {
  title: string;
  description: string[];
  list: string[];
  imgSrc: string;
}

export interface IProgramsReceive {
  receive: {
    title: string;
    subtitle: string;
  };
  module: {
    title: string;
    description?: string;
    list: string[];
    subtitle?: { highlight: string; content: string };
  };
  additionalModule?: IProgramAdditionalModule;
}

interface Props extends IProgramsReceive {} // eslint-disable-line @typescript-eslint/no-empty-object-type

export const ProgramsReceive = (props: Props) => {
  const { receive, module, additionalModule } = props;
  const { title: receiveTitle, subtitle: receiveSubtitle } = receive;
  const { title, description, list, subtitle } = module;
  const { highlight, content } = subtitle || {};

  return (
    <div className='text-center py-4 lg:py-0'>
      <Flex gap={35} component='article' className='mb-7'>
        <Flex vertical align='center' className='hidden md:flex w-70' gap={16}>
          <StarIC className='text-brand-gold' />
          <OpacityLineIC />
        </Flex>

        <div className='text-brand-deep text-center mx-auto md:mx-0 lg:text-left'>
          <h2 className='text-[48px]/[126%] font-canela font-thin lg:text-[60px]'>{receiveTitle}</h2>
          <p className='font-lato lg:mt-2 mt-6 max-w-[552px] text-body'>{receiveSubtitle}</p>
        </div>
      </Flex>

      <Flex
        component='article'
        className='flex-col-reverse md:flex-row lg:space-between md:gap-10  lg:gap-[90px] xl:gap-[110px] 2xl:gap-[130px]'
      >
        <Flex vertical className='flex-1 mt-[115px] flex-col items-cente lg:items-start'>
          <h3
            className='text-[32px]/[126%] lg:text-[48px] max-w-[485px] text-left font-light font-canela text-brand-deep'
            style={{ marginBottom: description ? 16 : 36 }}
          >
            {title}
          </h3>
          {description && (
            <h6 className='text-[17px]/[26px] text-left font-lato text-brand-gray mb-4 md:mb-9'>{description}</h6>
          )}
          <ArrowList list={list} />
          {subtitle && (
            <p className='text-[32px]/[126%] mt-[48px] text-left font-canela font-light'>
              <span className='text-brand-primary font-medium'>{highlight}</span> {content}{' '}
            </p>
          )}
        </Flex>

        <div className='flex-1 flex w-full max-w-full lg:max-w-[496px] flex-col items-center justify-center'>
          <div className='relative w-full max-w-[496px] aspect-[496/535]'>
            <Image src='/images/lily/lily_11.png' alt={module.title} fill quality={100} />
          </div>
        </div>
      </Flex>

      {additionalModule && (
        <Flex
          component='article'
          className='flex-col-reverse lg:pt-[140px] md:flex-row lg:space-between gap-10 lg:gap-[90px] xl:gap-[110px] 2xl:gap-[130px]'
        >
          <div className='flex-1 flex w-full max-w-full lg:max-w-[494px] flex-col items-center justify-center'>
            <div className='relative w-full max-w-[494px] aspect-[494/670] overflow-hidden rounded-t-[999px]'>
              <Image src={additionalModule.imgSrc} alt={additionalModule.title} fill quality={100} />
            </div>
          </div>

          <Flex vertical className='flex-1 mt-[80px] lg:mt-[115px]'>
            <h3
              className='text-[48px]/[126%] max-w-[485px] text-left font-light font-canela text-brand-deep'
              style={{ marginBottom: description ? 16 : 36 }}
            >
              {additionalModule.title}
            </h3>

            {additionalModule.description && (
              <h6 className='text-[17px]/[26px] flex flex-col gap-8 text-left font-lato text-brand-gray mb-[55px]'>
                {additionalModule.description.map((desc) => (
                  <span key={desc}>{desc}</span>
                ))}
              </h6>
            )}
            <ArrowList list={additionalModule.list} />
          </Flex>
        </Flex>
      )}
    </div>
  );
};
