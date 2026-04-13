import React from 'react';
import Image from 'next/image';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import { RESOURCES_LINKS } from '@/static/links';

interface ResourceCard {
  title: string;
  description: string;
  cta: string;
  href?: string;
  imageAlt: string;
  imageSrc: string;
  ctaType?: 'compatibility' | 'quiz' | 'secrets';
  imageClassName?: string;
}

const { SECRETS_LINK, COMPATIBILITY_LINK, QUIZ_LINK } = RESOURCES_LINKS;

const resources: ResourceCard[] = [
  {
    title: 'The Heartbreak Protocol',
    description: 'This guide gives you 6 evidence-based strategies to reclaim your nervous system and your life.',
    cta: SECRETS_LINK.label,
    href: SECRETS_LINK.href,
    ctaType: 'secrets',
    imageAlt: 'Woman smiling in a red sweater',
    imageSrc: '/images/resources/resources-section-1.png',
  },
  {
    title: 'The Compatibility Report',
    description:
      'This report gives you code-level clarity: where codes align, where they clash, your compatibility type, and whether this was built to last.',
    cta: COMPATIBILITY_LINK.label,
    href: COMPATIBILITY_LINK.href,
    ctaType: 'compatibility',
    imageAlt: 'Hands holding each other',
    imageSrc: '/images/resources/resources-section-2.png',
  },
  {
    title: 'The Love Questionnaire',
    description:
      "Wondering why men pull away? I'm going to show you the exact reason. Not fluff, the actual mechanics. And once you see it, you can shift the whole dynamic instantly.",
    cta: QUIZ_LINK.label,
    href: QUIZ_LINK.href,
    ctaType: 'quiz',
    imageAlt: 'Woman sitting by window smiling',
    imageSrc: '/images/resources/resources-section-3.jpg',
    imageClassName: 'rounded-t-[100%]',
  },
];

export function ResourceCardsSection() {
  return (
    <section className='relative text-brand-deep bg-cover'>
      <Header />

      <div className="absolute inset-0 -z-10">
					<Image
						src="/noise_bg.svg"
						alt=""
						fill
						quality={85}
						sizes="100vw"
						className="object-cover"
					/>
				</div>

      <div className='container px-4 pb-16 md:pb-20 lg:pb-[112px] mt-10 md:mt-16 lg:mt-[80px]'>
        <h1 className='text-h1 font-canela mb-8 md:mb-10 lg:mb-12 font-thin lg:text-left text-center'>Resources</h1>
        <div className='grid gap-12 md:gap-16 lg:gap-20 md:grid-cols-2 lg:grid-cols-3'>
          {resources.map((item) => (
            <article key={item.title} className='flex flex-col px-[12px] lg:px-0'>
              <div className='relative mb-8 md:mb-8 overflow-hidden w-full aspect-[336/322]'>
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  quality={85}
                  sizes='(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw'
                  className={`object-cover ${item.imageClassName ?? ''}`}
                />
              </div>
              <h3 className='text-[32px] md:text-[30px] font-light leading-[100%] font-canela mb-4 md:mb-4 text-brand-deep'>
                {item.title}
              </h3>
              <p className='text-body text-[#5A5757] mb-6 md:mb-8 font-lato font-medium leading-[26px] tracking-[0.03em]'>
                {item.description}
              </p>
              <div className='mt-auto'>
                {item.ctaType === 'secrets' ? (
                  <Button
                    variant='primary'
                    className='w-full py-[12px] text-center !text-[12px]'
                    href={item.href}
                    trackingData={{
                      cta_name: 'download_guide',
                      cta_text: 'Download free guide',
                      cta_target_url: item.href,
                      cta_location: 'resources_section',
                    }}
                  >
                    {item.cta}
                  </Button>
                ) : item.ctaType === 'compatibility' ? (
                  <Button
                    variant='primary'
                    className='w-full py-[12px] text-center !text-[12px]'
                    href={item.href}
                    trackingData={{
                      cta_name: 'get_report',
                      cta_text: 'GET THE REPORT',
                      cta_target_url: item.href,
                      cta_location: 'resources_section',
                    }}
                  >
                    {item.cta}
                  </Button>
                ) : item.ctaType === 'quiz' ? (
                  <Button
                    variant='primary'
                    className='w-full py-[12px] text-center !text-[12px]'
                    href={item.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    trackingData={{
                      cta_name: 'start_quiz',
                      cta_text: 'Start quiz',
                      cta_target_url: item.href,
                      cta_location: 'resources_section',
                    }}
                  >
                    {item.cta}
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
