import Image from 'next/image';
import Button, { ButtonVariant, TrackingData } from './Button';

interface Props {
  href: string;
  linkLabel: string;
  buttonVariant?: ButtonVariant;
  trackingData?: TrackingData;
}

export const CantFix = ({ href, linkLabel, buttonVariant = 'primary' }: Props) => {
  return (
    <article>
      <h2 className='font-thin text-[48px] lg:text-[60px] leading-[126%] font-canela text-brand-deep mb-[50px] lg:mb-[100px] text-center'>
        You cannot fix a pattern you cannot see.
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-[4fr,3fr] gap-[43px] lg:gap-[102px] '>
        <div className='flex flex-col gap-5 lg:gap-8 justify-center'>
          <div className='relative md:mb-0 lg:mb-0 w-full h-[245px]  xl:w-[600px] lg:h-[380px] rounded-[32px]  overflow-hidden'>
            <Image
              src='/images/landing/triage_section_women_new.png'
              alt='Person sitting with a laptop'
              fill
              priority
              quality={100}
              className=''
            />
          </div>

          <div className='relative flex flex-row items-center gap-3 lg:gap-6'>
            <Image
              src='/images/landing/triage_section_author.png'
              alt='Person sitting with a laptop'
              width={66}
              height={66}
              priority
              quality={100}
            />

            <div>
              <div className='font-canela font-light text-[24px]/[130%] lg:text-[32px] text-brand-gray'>
                Lisa B. Gold, M.A., CH
              </div>

              <div className='font-lato italic font-normal lg:text-[22px] leading-[26px] text-[#6F4C40] text-[18px]'>
                Applied Behavior Analyst
              </div>

              <div className='font-lato text-[16px] leading-[22px] text-brand-gray-100 mt-1'>Boca Raton, FL</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className='font-thin text-[42px]/[126%] lg:text-[60px] font-canela text-brand-deep mb-4'>
            I am literally blown away...
          </h2>
          <p className='italic text-[#6F4C40] max-w-[496px] font-lato text-[22px]/[30px] mb-8'>
            {`“I've been a behavioral analyst for 25 years, and I am literally blown away by the accuracy. She hit it spot on what my relationship patterns were… She completed the missing piece. I have broken through my block, and I am living everything I've ever dreamed of.”`}
          </p>
          <Button variant={buttonVariant} className='w-full max-w-[392px]' href={href}>
            {linkLabel}
          </Button>
        </div>
      </div>
    </article>
  );
};
