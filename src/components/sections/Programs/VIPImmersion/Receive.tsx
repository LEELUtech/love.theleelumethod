import { Flex } from 'antd';
import { ProgramsReceive } from '../components/receive';
import { vipImmersionModuleData } from './static';
import Image from 'next/image';
import { ArrowList } from '@/components/ui/lists/ArrowList';

const vipImmersionModuleAdditionalData = {
  title: 'Private Chat Support With Lily (1 MONTH)',
  subtitle: 'You have direct access to Lily throughout the month via WhatsApp or direct messages.',
  list: [
    'Priority response time: within 24 hours on business days',
    'Personal guidance as your situation unfolds in real time',
    'Support for decisions, conversations, emotional triggers, and next steps',
  ],
  description: {
    content: 'This goes beyond a single strategy session.',
    highlight: 'This is private access.',
  },
};

export const VIPImmersionReceive = () => {
  const { title, subtitle, description, list } = vipImmersionModuleAdditionalData;

  return (
    <section
      style={{
        backgroundImage: "url('/images/bg/checkout_bg.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[112px] 2xl:px-[180px] relative py-[80px] lg:py-[110px]'>
        <div className='text-center mb-[150px]'>
          <ProgramsReceive {...vipImmersionModuleData} />

          <Flex
            component='article'
            className='flex-col-reverse lg:flex-row lg:space-between mt-[175px]  lg:gap-[90px] xl:gap-[110px] 2xl:gap-[130px]'
          >
            <div className='flex-1 flex w-full max-w-[496px] flex-col items-center justify-center'>
              <div className='relative w-full max-w-[496px] aspect-[496/535]'>
                <Image src='/images/lily/lily_1.png' alt={title} fill quality={100} />
              </div>
            </div>

            <Flex vertical className='flex-1 mt-[115px] flex-col items-center lg:items-start'>
              <h3 className='text-[48px]/[126%] max-w-[600px] mb-4 text-left font-light font-canela text-brand-deep'>
                {title}
              </h3>
              <h6 className='text-[17px]/[26px] mb-[30px] text-left font-lato text-brand-gray'>{subtitle}</h6>
              <ArrowList list={list} />

              <p className='text-[17px]/[26px] mt-10 font-lato text-brand-gray'>
                {description.content} <span className='font-bold'>{description.highlight}</span>
              </p>
            </Flex>
          </Flex>
        </div>
      </div>
    </section>
  );
};
