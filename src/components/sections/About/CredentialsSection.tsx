import { Section } from '@/components/ui/containers/section';
import Image from 'next/image';

const CredentialsSection = () => {
  return (
    <Section wrapperClasses='py-[60px]'>
      <div>
        {/* === MOBILE + TABLET IMAGE (TOP) === */}
        <div className='flex justify-center mb-[128px] lg:hidden'>
          <div className='relative w-full max-w-[595px] aspect-[361/529] lg:aspect-[595/913]'>
            <Image src='/images/lily/lily_8.png' alt='Credentials' fill quality={100} className='rounded-[60px]' />

            {/* Logo Badge */}
            <div
              className="
    absolute bottom-[-35px] right-[-10px] flex items-center justify-center overflow-hidden bg-[#d8ac9e] rounded-[300px] w-[100px] h-[130px] md:w-[90px] md:h-[115px] z-10
    before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay
  "
            >
              <Image
                src='/leelu_logo.svg'
                alt=''
                width={65}
                height={65}
                className='relative z-10 filter brightness-0 invert'
              />
            </div>
          </div>
        </div>

        {/* === TITLE === */}
        <div className='flex items-start gap-[24px] lg:gap-[37px] mb-[60px] lg:mb-[82px] justify-center lg:justify-start'>
          <Image src='/icons/star_with_line.png' alt='' width={48} height={48} />
          <h2 className='font-thin text-[48px] lg:text-[60px] leading-[126%] font-canela text-brand-deep text-left'>
            Credentials At Glance
          </h2>
        </div>

        {/* === DESKTOP GRID === */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* LEFT: TEXT */}
          <div>
            <div className='space-y-12 max-w-[557px] mx-auto lg:mx-0'>
              {[
                {
                  title: 'Specialized Training',
                  text: 'Graduate of the elite Protocol 003 — Personality Profiling Program (Levels 1-8).',
                },
                {
                  title: 'Validated Data',
                  text: 'Methodology stress-tested on 11,500+ profiles in a commercial HR environment.',
                },
                {
                  title: 'Clinical Oversight',
                  text: 'Formulas verified by a team of 15 in-house psychologists.',
                },
                {
                  title: 'Human Potential & Mentoring',
                  text: 'Former Founder of Miss Crimea (2013-2016) and international modeling/etiquette agencies. Mentored young women in confidence and self-awareness across Europe and Asia.',
                },
                {
                  title: 'Awards & Recognition',
                  text: 'Recipient of the Gold Medal from the Ministry of Culture for contributions to regional cultural development. Featured in Canal+ documentaries on the entertainment industry.',
                },
                {
                  title: 'Global Perspective',
                  text: 'Synthesized systems from training in Eastern Europe, Japan, India, China, and Israel.',
                },
              ].map((item, idx) => (
                <div key={idx} className='flex items-start gap-4'>
                  <Image src='/icons/star.svg' alt='' width={20} height={20} className='flex-shrink-0 mt-1' />
                  <div>
                    <h3 className='font-medium text-body font-lato text-[#8F6E0E] mb-3 italic'>{item.title}</h3>
                    <p className=' lg:max-w-[455px] font-normal text-body text-[#5A5757] font-canela leading-[130%]'>
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: IMAGE (DESKTOP ONLY) */}
          <div className='hidden lg:flex'>
            <div className='relative w-full max-w-[595px]  aspect-[595/913] shrink-0'>
              <Image src='/images/lily/lily_8.png' alt='Credentials' fill quality={100} className='rounded-[113px]' />

              {/* Logo Badge */}
              <div
                className="
    absolute
    bottom-[-50px] right-[-40px]
    flex items-center justify-center
    bg-[#d8ac9e] rounded-[300px]
    w-[123px] h-[155px]
    z-10
    overflow-hidden

    before:content-['']
    before:absolute before:inset-0
    before:bg-[url('/icons/noise.png')]
    before:opacity-15
    before:mix-blend-overlay
    before:pointer-events-none
  "
              >
                <Image
                  src='/leelu_logo.svg'
                  alt=''
                  width={75}
                  height={75}
                  className='relative z-10 filter brightness-0 invert'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CredentialsSection;
