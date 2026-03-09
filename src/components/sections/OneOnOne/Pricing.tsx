'use client';

import Button from '@/components/ui/Button';
import { SectionBadge } from '@/components/ui/SectionBadge';
import useMediaQuery from '@/hooks/use-media-query';
import { ILink, ONE_ON_ONE_LINKS } from '@/static/links';
import Image from 'next/image';

interface PricingOption {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description?: string;
  features?: string[];
  investment?: number;
  price?: number;
  perSession?: number;
  save?: number;
  saveLabel?: string;
  link: ILink;
  type: 'single' | 'package';
  note?: string;
  priceLabel?: string;
  whyList?: {
    title: string;
    description?: string;
    points?: {
      title: string;
      text: string;
    }[];
  }[];
}

const { SINGLE_SESSION_LINK, THREE_PACKAGE_LINK, NINE_PACKAGE_LINK } = ONE_ON_ONE_LINKS;

export const content: PricingOption[] = [
  {
    id: 1,
    badge: '1.',
    title: 'Single Session',
    subtitle: 'Precision Diagnostic',
    description: 'One complete pattern analysis with full pre-session preparation',
    features: [
      'Pre-call formula calculation (time commitment varies depending on situation)',
      '60-minute private diagnostic session',
      'Precise scripting of your next moves',
      'Full session recording (delivered within 24 hours)',
    ],
    note: `One session identifies one primary pattern. If you're working across multiple life domains (relationship + career, family + money) or need implementation support as you execute the correction, the multi-session packages provide ongoing diagnostic as implementation surfaces new information.`,
    investment: 497,
    priceLabel: 'Investment',
    link: SINGLE_SESSION_LINK,
    type: 'single',
  },
  {
    id: 2,
    badge: '2.',
    title: '3-Session Package',
    subtitle: 'For multiple domains or implementation support',

    whyList: [
      {
        title: 'Why multiple sessions?',
        points: [
          {
            title: 'Sequential Reveals:',
            text: 'Most people have patterns operating across multiple domains (love, career, family, money). One session decodes one domain. Three sessions map your complete architecture.',
          },
          {
            title: 'Implementation Support:',
            text: 'Executing the correction often surfaces secondary patterns. As you implement, new data emerges that requires adjustment.',
          },
          {
            title: 'Course Correction:',
            text: "Patterns don't always break on the first intervention. Multiple sessions give you real-time recalibration as your system responds to the changes.",
          },
        ],
      },

      {
        title: 'What You Get:',
        points: [
          {
            title: '',
            text: 'Three complete diagnostic sessions (including all pre-session analysis)',
          },
          {
            title: '',
            text: 'Progressive analysis as you implement the corrections',
          },
          {
            title: '',
            text: 'Course adjustments as the pattern begins to shift',
          },
        ],
      },
    ],

    investment: 1350,
    perSession: 450,
    save: 141,
    link: THREE_PACKAGE_LINK,
    type: 'package',
  },
  {
    id: 3,
    badge: '3.',
    title: '9-Session Package',
    subtitle: 'The Execution Arc',
    whyList: [
      {
        title: 'Why nine sessions?',
        description: `Many people either have patterns operating across multiple life domains that need sequential decoding, or they're navigating major transitions where patterns shift as circumstances change. Nine sessions gives you a diagnostic partnership across a full implementation cycle.`,
      },
      {
        title: 'What you get:',
        points: [
          {
            title: '',
            text: 'Nine complete diagnostic sessions ',
          },
          {
            title: '',
            text: 'Schedule flexibly within 3 months: monthly, as-needed for decisions, or clustered around transitions',
          },
          {
            title: '',
            text: 'Coverage across all major life domains (relationship, career, family, money, health, purpose)',
          },
        ],
      },
    ],

    investment: 3920,
    perSession: 436,
    save: 553,
    link: NINE_PACKAGE_LINK,
    type: 'package',
  },
];

const SaveButton = ({ content }: { content: number }) => {
  return (
    <button
      className='text-[14px]/[26px] text-center mb-5 tracking-[10%] font-medium font-lato text-brand-black-100 mt-2 rounded-[300px] py-1.5 px-9 relative overflow-hidden'
      style={{
        background: 'linear-gradient(180deg, #FEF4F0 0%, #FFE6DE 100%)',
        boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <span className="absolute inset-0 bg-[url('/icons/noise.png')] opacity-10"></span>
      Save ${content}
    </button>
  );
};
export const Pricing = () => {
  const { width } = useMediaQuery();

  const isDesktop = (width || 0) >= 1024;

  return (
    <section
      id='pricing'
      className='px-4 bg-gradient-to-b from-[#F2E1E2] to-transparent md:px-6 2xl:px-[180px] relative '
    >
      <div className='absolute h-[50%] w-full bottom-0 left-0 z-[-1]'>
        <Image src='/images/bg/new_bg.png' alt='' fill priority quality={100} />
      </div>

      <div className='relative'>
        <SectionBadge bottom={-97} />
      </div>

      <div className='max-w-[1600px] mx-auto'>
        <h2 className='pt-[146px] text-[60px]/[126%] text-center mb-[90px] font-thin font-canela text-brand-deep'>
          PRICING STRUCTURE
        </h2>

        <ul className='flex flex-col gap-[100px] justify-center lg:flex-row lg:gap-[24px] pb-[110px]'>
          {content.map((item, i) => {
            const { id, title, subtitle, description, features, whyList, link, note, investment, perSession, save } =
              item;

            const isEven = i % 2 === 1;

            return (
              <li
                key={id}
                className='flex-1 max-w-full lg:max-w-[392px] bg-white rounded-[20px] px-6 xl:px-[30px] relative flex flex-col'
                style={{
                  boxShadow: '0 10px 20px 0 rgba(0,0,0,0.05)',
                  minHeight: isDesktop ? (isEven ? 1164 : 1124) : 'auto',
                  marginTop: isDesktop && !isEven ? 40 : 0,
                }}
              >
                <h3 className='text-brand-primary text-[72px]/[71px] font-light font-canela absolute -translate-y-1/2 -translate-x-1/2 left-1/2'>
                  {id}.
                </h3>

                <div className='flex flex-col items-center pt-[86px] mb-[56px] md:mb-[38px]'>
                  <h4 className='text-h2 font-normal font-canela text-brand-black-100 mb-2.5 md:mb-3 uppercase'>
                    {title}
                  </h4>
                  <h5 className='text-body font-lato text-brand-gray text-center'>{subtitle}</h5>
                </div>

                {description && <p className='text-cta font-lato mb-6 text-brand-gray'>{description}</p>}

                {!!features?.length && (
                  <ul className='flex flex-col pl-[20px]'>
                    {features.map((feature, index) => (
                      <li key={index} className='list-disc text-[15px]/[24px] font-lato text-[#41444E]'>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {!!whyList?.length && (
                  <ul className='flex flex-col pl-[20px] mb-[100px]'>
                    {whyList.map((item, index) => {
                      const { title, description, points } = item;

                      return (
                        <li key={index} className=' text-[15px]/[24px] font-lato  text-[#41444E]'>
                          <h4 className='text-[15px]/[24px] font-lato mb-4'>{title}</h4>
                          {description && <span>{description}</span>}

                          {!!points?.length && (
                            <ul className='flex flex-col pl-[20px]'>
                              {points.map((point, pointIndex) => (
                                <li key={pointIndex} className='list-disc text-[15px]/[24px] font-lato text-[#41444E]'>
                                  {point.title && <span className='font-bold'>{point.title} </span>}

                                  {point.text}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {note && (
                  <p className='text-[14px]/[20px] mb-[56px] italic font-lato mt-4 text-center lg:text-left text-brand-gray-100'>
                    {note}
                  </p>
                )}

                <div className='mt-auto mb-9 flex flex-col items-center'>
                  {save && <SaveButton content={save} />}
                  <h6 className='text-[32px]/[126%] text-center font-light font-canela text-[#3C1212] mb-2'>
                    Investment: ${investment}
                  </h6>
                  <div
                    className='text-[17px]/[26px] text-center font-canela text-brand-gray-100 mb-8'
                    style={{ opacity: perSession ? 100 : 0 }}
                  >
                    (${perSession}/session)
                  </div>
                  <Button
                    href={link.href}
                    className='py-[16px] block w-full'
                    trackingData={{
                      cta_name: 'one_on_one_pricing_cta',
                      cta_text: link.label,
                      cta_location: 'pricing',
                    }}
                  >
                    {link.label}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
