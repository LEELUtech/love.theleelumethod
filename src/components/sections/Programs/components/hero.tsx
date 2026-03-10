import ArcAutoOnce from '@/components/ui/ArcFlyOnce';
import Button from '@/components/ui/Button';
import { Section } from '@/components/ui/containers/section';
import { Logo } from '@/components/ui/Logo';
import RotateOnView from '@/components/ui/RotateOnView';
import { ILink } from '@/static/links';
import Image from 'next/image';

export interface IProgramsHero {
  title: string;
  description?: string;
  subtitle: string;
  content: string;
  contentBottom?: string;
  link: ILink;
  imgSrc: string;
}

interface Props extends IProgramsHero {} // eslint-disable-line @typescript-eslint/no-empty-object-type

export const ProgramsHero = (props: Props) => {
  const { title, description, subtitle, content, contentBottom, link, imgSrc } = props;
  return (
    <Section sectionClasses='bg-brand-white'>
      <div className='flex flex-col items-center'>
        <div className='relative'>
          <div className='w-[359px] h-[305px] md:w-[520px] md:h-[420px] lg:w-[356px] lg:h-[322px] overflow-hidden'>
            <Image
              src={imgSrc}
              alt='Lily'
              fill
              quality={100}
              priority
              className='object-cover object-top md:object-top lg:object-top rounded-t-[999px]'
              style={{
                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
              }}
            />
          </div>

          <ArcAutoOnce
            className='absolute inset-0 -z-0 -translate-y-[15%] pointer-events-none -translate-x-[-7%]'
            flightStart={0.2}
            durMs={1500}
            arrowRotateDeg={254}
            arrowScale={0}
            arrowCenterX={6.5}
            arrowCenterY={-6}
            arrowOffsetY={3}
            endAtByDevice={{ mobile: 0.87, desktop: 0.9 }}
            arcEnd={{ x: -62, y: 219 }}
            arcRx={260}
            arcRy={270}
            disableAnimation={false}
          />

          <div
            className="
                  absolute left-1/2 bottom-[-40px] -translate-x-1/2
                  flex items-center justify-center overflow-hidden
                  bg-[#EB4F68]
                  before:absolute before:inset-0 before:bg-[url('/icons/noise.png')]
                  before:opacity-15 before:mix-blend-overlay
                  rounded-[300px]
                  w-[74px] h-[102px]
                  md:w-[100px] md:h-[126px]
                  lg:w-[74px] lg:h-[102px]
                  z-10
                "
          >
            <RotateOnView duration={5} amount={0.4} ease='easeOut'>
              <Image
                src='/leelu_logo.svg'
                alt=''
                width={46}
                height={46}
                className='w-[46px] h-[46px] md:w-[46px] md:h-[46px] lg:w-[46px] lg:h-[46px] filter invert'
              />
            </RotateOnView>
          </div>
        </div>

        <div className='font-light transition text-[24px]/[126%] md:text-[22px]/[126%] lg:text-[24px]/[126%] font-canela flex items-center gap-2 md:gap-2.5 lg:gap-3 text-brand-black  justify-center md:justify-start mt-[63px]'>
          <Logo />
        </div>

        <h1
          className='my-4 font-canela font-thin uppercase text-brand-black text-center
                     text-[46px] leading-[110%] md:text-[56px] lg:text-[60px]
                    '
        >
          {title}{' '}
        </h1>

        {description && <p className='text-[17px]/[126%] mb-4 font-canela font-thin'>{description}</p>}

        <p className='font-canela font-thin max-w-[820px] text-brand-deep text-center text-[24px] md:text-[28px]'>
          {subtitle}
        </p>

        <p className='order-2 md:order-1 mt-4 font-lato text-center text-[#757986] text-[17px]/[145%]'>
          {content}

          {contentBottom && (
            <>
              <br />
              {contentBottom}
            </>
          )}
        </p>

        <Button
          variant='primary'
          size='md'
          className='w-full lg:w-[30%] xs:text-[12px] mt-[32px] lg:order-3'
          href={link.href}
          trackingData={{
            cta_name: 'program_hero_cta',
            cta_text: link.label,
            cta_target_url: link.href,
            cta_location: 'hero',
          }}
        >
          {link.label}
        </Button>
      </div>
    </Section>
  );
};
