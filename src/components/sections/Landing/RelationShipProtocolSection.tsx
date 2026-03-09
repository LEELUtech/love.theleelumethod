import Button from '@/components/ui/Button';
import Image from 'next/image';
import React from 'react';

const CARDS = [
  {
    id: 1,
    title: 'Identify Your Invisible Script',
    description:
      'The unconscious pattern running your romantic choices—and why you attract the same man with different faces.',
  },
  {
    id: 2,
    title: 'Decode the Male Operating System',
    description:
      'His core drivers, what triggers his withdrawal, and how to become his sanctuary instead of his stressor.',
  },
  {
    id: 3,
    title: 'Run the Compatibility Matrix',
    description: `Know if he's a Life partner or a Lesson—and identify his Hidden Desire so you speak his language.`,
  },
];

interface CardProps {
  id: number;
  title: string;
  description: string;
}

const Card = ({ title, description, id }: CardProps) => {
  const isEven = id % 2 === 0;

  const mt = isEven ? 'lg:-mt-[26px]' : '';

  return (
    <div
      className={`rounded-[16px] w-full bg-[#FFF8F8] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)]
              px-[56px] py-[48px]
              md:px-8 md:py-8 text-left
              max-w-[500px] mx-auto lg:mx-0 ${mt}
              `}
    >
      <h3 className='font-canela font-light text-[32px] md:text-[28px] lg:text-[32px] leading-[120%] text-brand-deep mb-4 text-center lg:text-left'>
        {title}
      </h3>
      <p className='font-lato font-medium text-[#757986] text-body md:text-[14px] lg:text-body leading-[26px] md:leading-[24px] text-center lg:text-left'>
        {description}
      </p>
    </div>
  );
};

const RelationShipProtocolSection = () => {
  const ornamentIcon = <Image src='/icons/ornament_1.svg' alt='' width={24} height={24} />;

  return (
    <section className='relative pb-[80px] pt-[100px]'>
      {/* Background Image */}
      <div className='absolute inset-0 -z-10'>
        <Image
          src='/images/landing/relationship_protocol_section_bg.png'
          alt=''
          fill
          priority
          quality={100}
          className='object-cover'
          sizes='100vw'
        />
      </div>

      <div className='container px-4'>
        <div className='text-center'>
          {/* Heading */}
          <h2 className='font-thin text-[48px]/[126%] lg:text-[80px] font-canela text-brand-deep mb-5'>
            The Relationship Protocol
          </h2>

          {/* Subheading */}
          <p className='font-light font-canela text-[32px] lg:text-[32px] leading-[130%] text-brand-primary mb-6 lg:mb-5 text-center'>
            The Operating Manual for Human Connection
          </p>

          {/* Text (tablet only smaller) */}
          <p className='font-normal font-lato text-[22px] md:text-[18px] lg:text-[22px] leading-[130%] text-[#41444E] lg:text-brand-black mb-6 lg:mb-12 mx-auto text-center'>
            Most relationship advice is guesswork. &quot;Just be yourself.&quot; &quot;Wait for the right one.&quot;
            <br />
            That is bad advice. It leaves you powerless. The Relationship Protocol is a forensic audit of your love
            life. <br /> It is 12 modules of deep deprogramming designed to take you from Burnout to Balance.
          </p>

          {/* Cards (ONLY tablet tweaks) */}
          <div className='w-full grid gap-8 md:gap-6 lg:gap-5 lg:grid-cols-3 mb-12 lg:mt-[100px] mt-[50px]'>
            {CARDS.map((c) => (
              <Card key={c.id} {...c} />
            ))}
          </div>

          <p className='font-light font-canela text-[32px] lg:text-[32px] leading-[130%] text-brand-deep mb-6 lg:mb-12 max-w-[500px] mx-auto'>
            We don&apos;t just patch the relationship. We rewrite the code.
          </p>

          <Button
            variant='dark'
            leftIcon={ornamentIcon}
            leftIconBg='transparent'
            size='md'
            className='w-full lg:w-fit xs:text-[12px] mt-[32px]'
            trackingData={{
              cta_name: 'landing_protocol_view_curriculum_cta',
              cta_text: 'VIEW THE CURRICULUM',
              cta_location: 'relationship_protocol',
            }}
          >
            VIEW THE CURRICULUM
          </Button>
        </div>

        {/* <RelationshipProtocolTiers /> */}
      </div>
    </section>
  );
};

export default RelationShipProtocolSection;
