import Button from '@/components/ui/Button';
import RotateOnView from '@/components/ui/RotateOnView';
import { WEBINAR_URL } from '@/utils/constants';
import Image from 'next/image';

const content = {
  title: 'I don’t guess. I calculate.',
  description: [
    `I’m Lily Chystofat. I founded and scaled a nationally recognized profiling firm. To drive our growth, I deployed fifteen psychologists across five regions to validate a high-precision, 360° numerological system that assessed 11,500 individuals for multinational corporations and high net worth clients. The system revolutionized executive selection and organizational compatibility—bringing predictive precision to leadership dynamics and team cohesion.`,
    `After a successful exit, I pursued the mathematical lineage behind the system—studying its original frameworks across the Middle East and Asia. Those insights converge in The Leelu Method today: ancient pattern intelligence rendered operational through modern behavioral science. Not mysticism. Precision.`,
    `I’ve enabled over a thousand women to stop improvising their love lives and start engineering them.`,
  ],
  subtitle: 'Are you next?',
  link: {
    href: WEBINAR_URL,
    label: 'SAVE MY SEAT',
  },
};

export default function WebinarHeyImLilySection() {
  const { title, description, subtitle, link } = content;

  return (
    <section className='bg-brand-white py-12 md:py-16 lg:py-[80px]'>
      <div className='container px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center'>
          {/* Left side - Image */}
          <div className='relative w-full max-w-[400px] md:max-w-[480px] lg:max-w-[551px] mx-auto lg:mx-0'>
            {/* Red circle badge with logo */}
            <div className="absolute left-[-10px] top-[-30px] md:left-[-40px] md:top-[-50px] lg:top-[-60px] lg:left-[-60px] flex items-center justify-center overflow-hidden bg-[#EB4F68] before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay rounded-[300px] w-[80px] h-[100px] md:w-[100px] md:h-[126px] lg:w-[134px] lg:h-[168px] z-10">
              <RotateOnView duration={5} amount={0.4} ease='easeOut'>
                <Image
                  src='/icons/ornament_2/ornament_2_light.svg'
                  alt=''
                  width={83}
                  height={83}
                  className='w-[65px] h-[65px] md:w-[65px] md:h-[65px] lg:w-[83px] lg:h-[83px]'
                />
              </RotateOnView>
            </div>

            {/* Main image with rounded corners */}
            <div className='relative w-full aspect-[551/748] rounded-[24px] md:rounded-[32px] lg:rounded-[40px] overflow-hidden'>
              <Image src='/images/lily/lily_2.png' alt='Lily' fill quality={100} className='object-cover' />
            </div>
          </div>

          {/* Right side - Content */}
          <div className='flex flex-col'>
            <h1 className='font-canela font-light mb-8 md:mb-8 lg:mb-8 leading-	[130%] text-brand-black text-[60px] md:text-[60px] lg:text-[60px]'>
              {title}
            </h1>

            <div className='space-y-8 md:space-y-8 lg:space-y-8 mb-8 md:mb-8 lg:mb-10'>
              {description.map((d, idx) => (
                <p
                  key={idx}
                  className='text-[#5A5757] font-lato text-[17px]/[24px] lg:text-body md:leading-[26px] lg:leading-[28px]'
                >
                  {d}
                </p>
              ))}

              <p
                className='
								font-canela font-thin text-brand-deep tracking-normal

								/* MOBILE */
								text-[32px] leading-[130%]

								/* TABLET */
								md:text-[32px] md:leading-[130%]

								/* DESKTOP */
								lg:text-[32px] lg:leading-[130%]
								'
              >
                {subtitle}
              </p>
            </div>

            <Button variant='primary' size='md' className='w-full md:w-[55%]' href={link.href}>
              {link.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
