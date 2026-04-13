import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import RotateOnView from '@/components/ui/RotateOnView';
import { ABOUT_LINKS } from '@/static/links';
import Image from 'next/image';

const content = {
  title: 'I am Lily Chystofat.',
  description: [
    `I founded and scaled an elite profiling firm, deploying fifteen psychologists across five markets to validate a system that assessed 11,500 individuals. We proved numerology wasn't mysticism—it was a mathematical framework that predicted human behavior with precision.`,
    `After validating the science worked at scale, I traveled through the Middle East and Asia to study the original numerological lineages at their source.`,
    `From these experiences, The Leelu Method was forged—a precise framework that maps and decodes human behavior through ancient intelligence and modern behavioral science.`,
  ],
  link: ABOUT_LINKS.HERO_LINK,
};

const HeroSection = () => {
  const { title, description, link } = content;
  return (
    <section className='relative bg-brand-white lg:pb-[142px]'>
      <Header />
      <div className='container px-4 flex flex-col lg:flex-row items-center justify-between lg:gap-12 gap-0 mt-[80px]'>
        {/* Text Content */}
        <div className='lg:w-1/2 xs:relative xs:top-[-60px] flex flex-col max-w-[549px] order-2'>
          <h1 className='font-canela font-thin text-brand-deep mb-6 lg:mb-12 leading-[126%] tracking-normal text-[48px] lg:text-[60px] text-center lg:text-left'>
            {title}
          </h1>

          <p className='flex flex-col gap-4 font-lato text-[18px]/[26px] text-brand-gray order-3 lg:order-1 text-center lg:text-left'>
            {description.map((d, index) => {
              const isLast = index === description.length - 1;

              return (
                <span key={index} style={{ fontWeight: isLast ? 600 : 400 }}>
                  {d}
                </span>
              );
            })}
          </p>

          <Button
            variant='dark'
            className='w-full lg:w-[75%] mb-8 lg:mb-0 order-2 lg:order-4 mt-2 lg:mt-[32px]'
            href={link.href}
            trackingData={{
              cta_name: 'about_hero_cta',
              cta_text: link.label,
              cta_location: 'hero',
            }}
          >
            {link.label}
          </Button>
        </div>

        {/* Image Content */}
        <div className='lg:w-1/2 relative flex justify-center order-1 lg:order-2'>
          <div className='relative lg:w-[500px] lg:h-[549px] w-[330px] h-[350px] lg:pt-0'>
            <Image
              src='/images/lily/lily_3.png'
              alt='I am Lily Chystofat'
              fill
              priority
              quality={85}
              className='

							/* MOBILE: fade bottom */
							[mask-image:linear-gradient(to_bottom,black_55%,transparent_75%)]
							[-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent_75%)]

							/* DESKTOP: no mask */
							lg:[mask-image:none]
							lg:[-webkit-mask-image:none]
  '
            />
            <RotateOnView
              className='absolute bottom-[-80px] left-[140px] hidden lg:block pointer-events-none'
              duration={17}
              ease='linear'
              repeat={true}
            >
              <Image src='/icons/ornament_13.svg' alt='' width={209} height={215} priority quality={85} className='' />
            </RotateOnView>

            <ArcAutoOnce
              className='absolute hidden lg:block inset-0 -z-0 -translate-y-[13%] pointer-events-none -translate-x-[-7%]'
              // endAt={0.9}
              flightStart={0.2}
              durMs={2500}
              arrowRotateDeg={254}
              arrowScale={0.8}
              arrowCenterX={6.5}
              arrowCenterY={-6}
              arrowOffsetY={3}
              endAtByDevice={{ mobile: 0.87, desktop: 0.95 }}
              arcEnd={{ x: -60, y: 219 }}
              arcRx={260}
              arcRy={260}
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
