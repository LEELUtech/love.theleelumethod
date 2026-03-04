import Button from '@/components/ui/Button';
import { Section } from '@/components/ui/containers/section';
import { SectionBadge } from '@/components/ui/SectionBadge';
import useMediaQuery from '@/hooks/use-media-query';
import { ONE_ON_ONE_LINKS } from '@/static/links';
import Image from 'next/image';

const content = {
  title: `IF YOUR PRIMARY ISSUE IS RELATIONSHIP PATTERNS`,
  subtitle: `The 1:1 Diagnostic can identify your core relationship pattern and provide immediate strategic direction for urgent decisions.`,
  description: `However, if you're ready for comprehensive relationship transformation—with a deprogramming curriculum, guided implementation, community support, and ongoing calls over 2-3 weeks—The Relationship Protocol is specifically designed for that journey.`,
};

export const Primary = () => {
  const { width } = useMediaQuery();

  const isTablet = (width || 0) < 768;

  return (
    <Section>
      <div className='flex flex-col gap-[40px] justify-center md:flex-row lg:gap-[90px] 2xl:gap-[130px]'>
        <div className='flex-1 md:max-w-[494px] text-brand-deep order-2 md:order-1 mt-[68px]'>
          <h3 className='text-[48px]/[126%] lg:text-[60px] font-thin  mb-6 font-canela'>{content.title}</h3>
          <h4 className='text-h2 text-deep font-light mb-9 font-canela'>{content.subtitle}</h4>
          <p className='text-body text-deep mb-[44px] font-lato'>{content.description}</p>
          <Button
            variant='primary'
            size='md'
            className='w-full px-[8px] md:w-[70%] lg:py-[16px]'
            href={ONE_ON_ONE_LINKS.PRIMARY_LINK.href}
          >
            {ONE_ON_ONE_LINKS.PRIMARY_LINK.label}
          </Button>
        </div>

        <div className='flex-1 order-1 md:order-2 relative'>
          <div className='max-w-full md:max-w-[600px] rounded-[100px] overflow-hidden '>
            <Image src='/images/lily/lily_10.png' width={600} height={600} alt='' className='w-full h-auto' />
          </div>{' '}
          {isTablet && <SectionBadge position='right' size='md' color='coral' />}
        </div>
      </div>
    </Section>
  );
};
