import Button from '@/components/ui/Button';
import { Section } from '@/components/ui/containers/section';
import RotateOnView from '@/components/ui/RotateOnView';
import { ABOUT_LINKS } from '@/static/links';

const SectionText = ({ text }: { text: string }) => (
  <p className='max-auto max-w-[800px] font-medium text-[#5A5757] font-lato tracking-[3%] mb-6 text-[17px]/[26px]'>
    {text}
  </p>
);

import Image from 'next/image';

const TheSynthesisSection = () => {
  return (
    <Section backgroundImage='/images/about/synthesis_section_bg.png'>
      <div className='max-w-[800px] mx-auto text-center px-2'>
        {/* Top Image */}
        <div className='flex justify-center mb-[120px] lg:mb-[75px]'>
          <div className='relative w-[361px] h-[377px] sm:w-[320px] sm:h-[340px] md:w-[380px] md:h-[400px] lg:w-[511px] lg:h-[534px]'>
            <Image src='/images/about/synthesis_section_img.png' alt='The Synthesis' fill quality={100} />

            {/* Logo */}
            <div
              className="
								absolute left-1/2 bottom-[-40px] -translate-x-1/2
								flex items-center justify-center overflow-hidden
								bg-[#EB4F68]
								before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay
								rounded-[300px]
								w-[80px] h-[100px]
								md:w-[100px] md:h-[126px]
								lg:w-[101px] lg:h-[140px]
								z-10
							"
            >
              <RotateOnView duration={5} amount={0.4} ease='easeOut'>
                <Image
                  src='/leelu_logo.svg'
                  alt=''
                  width={63}
                  height={61}
                  className='w-[51px] h-[53px] md:w-[65px] md:h-[63px] lg:w-[61px] lg:h-[63px] filter invert-[100%] brightness-[100%]'
                />
              </RotateOnView>
            </div>
          </div>
        </div>

        <h2 className='font-thin font-canela text-brand-deep mb-6 text-[60px]/[126%]'>THE SYNTHESIS</h2>

        <p className='font-canela text-brand-black mb-6 text-[32px]/[130%]'>Filling the Gaps</p>

        <SectionText
          text={`I spent the next few years traveling. I cross-referenced my profiling data with ancient energetic systems from Japan, India, China, and Israel. While the government training gave me the structure, the Eastern systems filled the gaps in the code, creating a hybrid methodology entirely unique to The Leelu Method.`}
        />

        <SectionText
          text={`Since then, I’ve decoded patterns for thousands of people, from pragmatic founders to whom the word “spiritual” is a red-flag to artists and deep feelers with a profound call toward their life’s purpose.`}
        />

        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-4 lg:mb-4'>
          <div className='relative w-full sm:w-[48%] lg:max-w-[306px]  aspect-[306/196]'>
            <Image src='/images/about/synthesis/img_1.png' alt='' fill className='object-contain' quality={100} />
          </div>
          <div className='relative w-full sm:w-[48%] lg:max-w-[306px]  aspect-[306/196]'>
            <Image src='/images/about/synthesis/img_2.png' alt='' fill className='object-contain' quality={100} />
          </div>
        </div>

        <SectionText
          text={`Whether you are navigating a corporate merger or a crisis of identity, the friction is the same: You are trying to play a game without knowing the rules.`}
        />

        <SectionText
          text={`My work bridges the gap between hard data and deep intuition. I use numerology as the framework to organize the chaos, but the goal, greater than relief, can be summed up in a single word:`}
        />

        <h3 className='font-canela text-brand-black mb-4 text-[32px]'>Fulfillment.</h3>

        <p className='font-thin font-canela text-brand-deep mb-10 text-[32px]/[130%]'>
          It is about executing the contract you signed at birth. It is about removing the friction between who you are
          and what you do, so you can live the most impactful, abundant version of the life you were designed to live.
        </p>

        <Button
          variant='primary'
          size='md'
          className='w-full lg:w-[40%]'
          href={ABOUT_LINKS.HERO_LINK.href}
          trackingData={{
            cta_name: 'about_synthesis_cta',
            cta_text: ABOUT_LINKS.HERO_LINK.label,
            cta_location: 'synthesis',
          }}
        >
          {ABOUT_LINKS.HERO_LINK.label}
        </Button>
      </div>
    </Section>
  );
};

export default TheSynthesisSection;
