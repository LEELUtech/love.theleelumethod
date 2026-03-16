import Button from '@/components/ui/Button';
import RotateOnView from '@/components/ui/RotateOnView';
import { PROGRAMS_LINKS } from '@/static/links';
import { Flex } from 'antd';
import Image from 'next/image';
import React from 'react';

const {
  SELF_GUIDED_LINK,
  BREAKTHROUGH_LINK,
  VIP_LINK,
  PROTOCOL_ESSENTIALS_LINK,
  PROTOCOL_BREAKTHROUGH_LINK,
  PROTOCOL_VIP_LINK,
} = PROGRAMS_LINKS;

const tiers = [
  {
    title: 'The Essentials',
    price: '$697',
    popular: false,
    features: [
      'Code-Level Transformation',
      '12-Module Video Sequence',
      'Written Assignments (Curator Reviewed)',
      '60-Day Circle Access + 2 Group Zooms + 3 Monthly Q&As',
      '3 Custom Reports: Energy Activation, Hidden Desires, Compatibility',
      '-',
      'Basic Couple Dynamics Report',
      'His Hidden Desires Only',
      '-',
      '-',
      'Group Q&A Format',
      '-',
      'Audience Access (Hot Seat Available)',
      '-',
    ],
    link: PROTOCOL_ESSENTIALS_LINK,
  },
  {
    title: 'Guided Breakthrough',
    price: '$1,700',
    popular: true,
    features: [
      'Transformation + Deeper Diagnostics',
      'Same as Essentials',
      'Same as Essentials (Lily Reviewed)',
      'Same as Essentials',
      'Same as Essentials',
      'Full Numerology Code Analysis (PDF)',
      'Extended Compatibility Blueprint (Full Relationship Manual)',
      'Same as Essentials',
      '1 x 90-Min Private Session',
      '-',
      'Same as Essentials',
      'Optional Partner Inclusion',
      'Hot Seat Priority',
      'Relationship Roadmap (Session-Based)',
    ],
    link: PROTOCOL_BREAKTHROUGH_LINK,
  },
  {
    title: 'VIP Immersion',
    price: '$4,997',
    popular: false,
    features: [
      'Deepest Access / 360° Intervention',
      'Same as Essentials',
      'Same as Essentials (Lily Reviewed)',
      'Same as Essentials',
      'Same as Essentials',
      'Same as Guided',
      'Same as Guided',
      'Full Partner Audit (Complete Personal Code + Behavioral Manual)',
      '4 x Total: 90min + (3) 60min',
      'Private Voxer/WhatsApp (30 days)',
      'Priority (< 24hrs weekdays)',
      'Yes (Joint Sessions Available)',
      'Private Analysis Included',
      'Step-by-Step Strategic Plan (Written + Session-Based)',
    ],
    link: PROTOCOL_VIP_LINK,
  },
];

const tiers_titles = [
  'Objective',
  'The Methodology',
  'Workbook & Integration',
  'Community Support',
  'Personalized Reports',
  'Advanced Personal Decoding',
  'Compatibility Analysis',
  'Partner Decoding',
  '1:1 Strategy',
  'Private Messaging',
  'Response Time',
  'Partner Inclusion',
  'Live Case Review',
  'Custom Action Plan',
];

type CardSize = 'lg' | 'xl' | 'md';

interface ICard {
  id: number;
  size: CardSize;
  title: string;
  description: string;
  listTitle: string;
  list: string[];
  link: {
    href: string;
    label: string;
  };
  for?: string;
}

const CARDS: ICard[] = [
  {
    id: 1,
    size: 'lg',
    title: 'SELF-GUIDED TRANSFORMATION',
    description: 'For the woman ready to do the work on her own timeline.',
    listTitle: 'What You Get:',
    list: [
      'The complete 12-module video curriculum (60-dayc access)',
      'The Relationship Protocol Workbook (downloadable)',
      'Bonus: Your Personal LeeluTech Breakdown PDF',
    ],
    link: SELF_GUIDED_LINK,
    for: `You're not in crisis—you're in clarity mode. You've done enough therapy, coaching, or self-work to know what you need to shift; you just need the specific system to do it. You're comfortable working independently, you trust your own discipline, and you'd rather move at your own pace than wait for scheduled calls. You need the blueprint, not a guide holding your hand through it.`,
  },
  {
    id: 2,
    size: 'xl',
    title: 'GUIDED BREAKTHROUGH ⭐ (Most Popular)',
    description: 'For the woman who wants personalized insight and direct support.',
    listTitle: 'Everything in Self-Guided, PLUS:',
    list: [
      `Written Compatibility Analysis: Lily personally reviews your numerological code against your partner's — identifying friction points, communication blind spots, and your hidden compatibility levers (delivered within 5 business days)`,
      `Private Strategy Session (90 Minutes): A deep-dive diagnostic call where Lily applies the system to your specific situation, helps you understand the root pattern, and scripts your next moves`,
    ],
    link: BREAKTHROUGH_LINK,
    for: `You're at a crossroads and need clarity now. You want the system—but you also want Lily in your corner, showing you exactly how to apply it to your relationship.`,
  },
  {
    id: 3,
    size: 'md',
    title: 'VIP IMMERSION',
    description: 'For the woman who needs deep, ongoing support through the transformation.',
    listTitle: 'Everything in Guided Breakthrough, PLUS:',
    list: [
      'Three additional 1:1 sessions (60 minutes each) — spaced strategically across 90 days for real-time course corrections as you implement',
      `Voxer/WhatsApp access to Lily for 60 days (text/voice, 24-hour response time weekdays)`,
      'Priority review of all materials, assignments, and personal situations as they arise',
      `Custom Relationship Action Plan — a written strategic roadmap based on your unique code, crisis point, and desired outcome`,
      `Partner Profile Add-On: If your partner is willing, Lily will include him in one joint session to accelerate alignment`,
    ],
    link: VIP_LINK,
  },
];

const Card = ({ size, title, description, listTitle, list, link, id, for: forText }: ICard) => {
  const sizeClasses = {
    md: {
      list: 'gap-4',
    },
    lg: { list: '' },
    xl: {
      list: 'gap-4 mb-[46px]',
    },
  };

  const { list: listClass } = sizeClasses[size];

  const cardSizeClasses = size === 'xl' ? '2xl:-mt-[38px]' : '';

  return (
    <article
      className={`relative w-full rounded-[20px]  bg-brand-white px-6 md:px-7 pt-[89px] pb-[48px] flex flex-col ${cardSizeClasses}`}
    >
      <h5 className='block 2xl:hidden text-[72px]/[71px] absolute top-0 left-[50%] -translate-x-[50%] -translate-y-[50%] text-brand-primary font-canela font-light'>
        {id}.
      </h5>
      <h3 className='text-center font-canela font-normal text-brand-black text-[32px]/[120%]'>{title}</h3>

      <p className='mt-3 text-center font-normal font-lato text-[#5A5757] text-body leading-[18px] mx-auto'>
        {description}
      </p>

      <div className='mt-6 space-y-[48px] mb-6'>
        <div>
          <p className='font-lato font-bold text-brand-black text-[18px] mb-3'>{listTitle}</p>

          <ul className={`${listClass} flex flex-col`}>
            {list.map((item, index) => (
              <li key={index} className='font-lato list-disc text-brand-gray text-[15px]/[24px]'>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {forText && (
          <div className='font-lato'>
            <p className='font-bold text-brand-black-100 text-[22px]/[150%]'>Who This Is For:</p>

            <p className='text-brand-gray text-[15px]/[24px]'>{forText}</p>
          </div>
        )}
      </div>

      <div>
        <Button
          variant='primary'
          className='w-full'
          href={link.href}
          trackingData={{
            cta_name: 'programs_choose_path_cta',
            cta_text: link.label,
            cta_location: 'choose_your_path',
          }}
        >
          {link.label}
        </Button>
      </div>
    </article>
  );
};

export default function ChooseYourPathSection() {
  return (
    <section
      id='pricing'
      className='pt-0 pb-[122px] '
      style={{
        background: "url('/images/programs/choose_your_path_bg.png') no-repeat center center / cover",
      }}
    >
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[60px] 4xl:px-[180px] relative py-[80px] lg:py-[110px]'>
        <div className='relative flex justify-center'>
          <div
            className="
											absolute left-1/2 lg:top-[-220px] top-[-200px] -translate-x-1/2
											flex items-center justify-center overflow-hidden
											bg-[#EB4F68]
											before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay
											rounded-[300px]
											w-[107px] h-[148px]
											md:w-[107px] md:h-[148px]
											lg:w-[142px] lg:h-[195px]
											z-10
										"
          >
            <RotateOnView duration={5} amount={0.4} ease='easeOut'>
              <Image
                src='/leelu_logo.svg'
                alt=''
                width={88}
                height={88}
                className='w-[65px] h-[65px] md:w-[65px] md:h-[65px] lg:w-[88px] lg:h-[88px] filter invert-[100%] brightness-[100%]'
              />
            </RotateOnView>
          </div>
        </div>

        <h2 className='text-center font-canela font-thin text-brand-deep text-[60px] lg:text-[72px] leading-[110%]'>
          CHOOSE YOUR PATH
        </h2>

        <div className='mt-10 mb-[60px] lg:mb-[130px] lg:mt-[178px] grid grid-cols-1 2xl:grid-cols-3 gap-12 2xl:gap-6 items-start'>
          {CARDS.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </div>

        <div>
          <div className='mb-[80px]'>
            <h2 className='text-[60px]/[126%] lg:text-[80px] text-center font-canela font-thin mb-4'>
              <span className='text-brand-primary'>Relationship Protocol</span> Tiers{' '}
            </h2>
            <p className='font-lato text-[24px]/[150%] text-center'>
              Next cohort starts <span className='text-brand-primary'>March 18</span>
            </p>
          </div>

          <Flex>
            <ul className='min-w-[280px] hidden 4xl:block'>
              <h4 className='font-canela mt-[50px] mb-[80px] text-[36px]/[126%] font-light text-black'> Feature</h4>

              {tiers_titles.map((title) => (
                <li className='3xl:h-[100px] 4xl:h-[90px] text-[24px]/[150%] font-lato text-brand-gray' key={title}>
                  {title}
                </li>
              ))}
            </ul>

            <div className='w-full grid grid-cols-1 gap-10 3xl:gap-6 justify-center justify-items-stretch 3xl:grid-cols-3 3xl:justify-items-center'>
              {tiers.map((tier) => (
                <div
                  key={tier.title}
                  className={`relative flex w-full flex-col rounded-[32px] bg-white py-8 shadow-lg 3xl:w-auto`}
                >
                  {tier.popular && (
                    <span className='absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#EB4F68] w-[154px] text-center py-1.5 text-[14px]/[26px] tracking-[10%] font-medium text-white'>
                      <span className="absolute inset-0 bg-[url('/icons/noise.png')] opacity-10"></span>
                      MOST POPULAR
                    </span>
                  )}

                  <h3 className='mx-[30px] text-[42px]/[126%] mb-[10px] max-w-[200px] lg:mx-auto font-canela font-thin lg:text-[36px] text-brand-black'>
                    {tier.title}
                  </h3>

                  <ul className='mt-8 flex flex-col gap-4 3xl:gap-0 flex-1 px-8 font-lato text-[18px]/[120%] text-brand-gray'>
                    {tier.features.map((feature, i) => {
                      const isExist = feature !== '-';

                      const justifyClass = isExist ? 'justify-start' : 'justify-center';

                      const title = tiers_titles[i];

                      return (
                        <li
                          key={i}
                          className={`flex flex-col justify-center 4xl:flex-row 4xl:items-center h-auto 3xl:h-[100px] 4xl:h-[90px] 3xl:border-b border-[#C6ABB3] last:border-none ${justifyClass}`}
                        >
                          <h5 className={`text-brand-gray text-[17px]/[26px] 4xl:hidden`}>{title}</h5>
                          <span
                            className={`font-lato font-semibold text-[22px]/[150%] 4xl:font-normal 2xl:text-[18px]`}
                          >
                            {feature}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <div className='mt-10 text-left lg:text-center px-4'>
                    <p className='font-canela lg:font-light mb-5 text-[48px]/[126%] lg:text-[32px] text-[#3C1212]'>
                      {tier.price}
                    </p>
                    <Button
                      className='w-full max-w-[450px] px-0'
                      variant='dark'
                      href={tier.link.href}
                      trackingData={{
                        cta_name: 'programs_protocol_tier_cta',
                        cta_text: tier.link.label,
                        cta_location: 'relationship_protocol_tiers',
                      }}
                    >
                      {tier.link.label}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Flex>
        </div>
      </div>
    </section>
  );
}
