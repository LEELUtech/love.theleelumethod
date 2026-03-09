import { StarIC } from '@/components/icons';
import Button from '@/components/ui/Button';
import { ArrowList } from '@/components/ui/lists/ArrowList';
import { Flex } from 'antd';
import Image from 'next/image';
import { ReactNode } from 'react';

export interface IProgramOverview {
  title: ReactNode;
  subtitle: string;
  description?: string;
  cards: { id: number; title: string; subtitle?: string; description?: string; list: string[]; iconColor: string }[];
  overviews: {
    id: number;
    title: {
      label: string;
      size: '[32px]/[126%]' | '[48px]/[126%]';
    };
    subtitle?: string;
    description?: string;
    list?: string[];
  }[];
  link?: {
    label: string;
    href: string;
  };
}

interface Props extends IProgramOverview {} // eslint-disable-line @typescript-eslint/no-empty-object-type

export const ProgramOverview = ({ title, subtitle, description, overviews, cards, link }: Props) => {
  return (
    <article>
      <Flex vertical align='center' gap={20} className='mb-[48px] lg:mb-[60px]'>
        {title}
        <h4 className='text-[24px]/[126%] lg:text-[32px] font-canela font-light'>{subtitle}</h4>
        {description && (
          <p className='text-center lg:text-left text-[17px]/[26px] font-lato  text-brand-gray'>{description}</p>
        )}
      </Flex>

      <ul
        className='
      grid grid-cols-1 gap-6 mb-[112px] justify-center justify-items-center
      md:grid-cols-4
      md:max-[947px]:[&>li:last-child:nth-child(odd)]:col-start-2
      xl:grid-cols-6
      xl:[&>li:last-child:nth-child(3n+1)]:col-start-3
      xl:[&>li:nth-last-child(2):nth-child(3n+1)]:col-start-2
      xl:[&>li:last-child:nth-child(3n+2)]:col-start-4
    '
      >
        {cards.map((card, idx) => {
          const bgColor = idx === 1 ? 'bg-[#FFF3F0]' : 'bg-[#FFFFFF]';

          return (
            <li
              key={card.id}
              className={`w-full min-[824px]:col-span-2 min-[948px]:max-w-[392px] rounded-[20px] pl-[30px] pr-4 bs:px-[30px] pt-[38px] pb-[48px] ${bgColor} box-shadow-[0px 10px 20px rgba(0, 0, 0, 0.05)]`}
            >
              <StarIC className={`mb-[26px] ${card.iconColor}`} width={27} height={33} />

              <h4 className='text-[32px]/[110%] text-left font-canela font-light mb-7 text-brand-deep'>{card.title}</h4>

              {card.subtitle && (
                <h5 className='text-[17px]/[26px] text-left font-lato mb-10 text-brand-gray'>{card.subtitle}</h5>
              )}

              {card.description && (
                <p className='text-[17px]/[26px] text-left font-lato mb-6 text-brand-gray'>{card.description}</p>
              )}

              <ul className='text-[17px]/[26px] font-lato text-brand-gray pl-4'>
                {card.list.map((item) => (
                  <li key={item} className='list-disc text-left'>
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
            {overviews.map((item) => {
              const iconMt = item.title.size === '[32px]/[126%]' ? 'mt-1' : 'mt-3';

              return (
                <li key={item.id}>
                  <h4 className='flex items-start gap-3 text-[32px]/[126%] font-canela font-light mb-8 text-brand-deep'>
                    <div className={`w-[27px] h-[33px] ${iconMt}`}>
                      <StarIC width={27} height={33} className='text-brand-primary' />
                    </div>
                    <span className={`text-${item.title.size} text-left font-canela font-light`}>
                      {item.title.label}
                    </span>
                  </h4>

                  {item.description && (
                    <p className='text-[17px]/[26px] font-lato mb-4 text-brand-gray'>{item.description}</p>
                  )}

                  {item.list && <ArrowList list={item.list} />}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {link && (
        <Button className='mt-[145px] px-[140px]' href={link.href} trackingData={{ cta_name: 'program_overview_cta', cta_text: link.label, cta_target_url: link.href, cta_location: 'overview' }}>
          {link.label}
        </Button>
      )}
    </article>
  );
};
