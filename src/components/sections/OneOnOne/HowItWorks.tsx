import Image from 'next/image';
import { motion } from 'framer-motion';
import { OrnamentTitle } from '@/components/ui/titles/OrnamentTitle';

const CARD_CONTENT = [
  {
    title_top: `Phase 1:`,
    title_bottom: `Pre-Session Preparation`,

    img: '/images/webinar/webinar_decor_up.png',
    text_top:
      'Upon booking, you submit your birth data and a specific request. I perform a comprehensive analysis of your numerological architecture:',
    text_bottom: `This preparation work is why the session delivers surgical precision. I'm not discovering your pattern during our call—I'm showing you what I've already spent time calculating.`,
    icon: '/icons/ornament_7.svg',
    list: [
      {
        title: 'Pattern Isolation:',
        content: 'Calculating the mathematical root of your friction point',
      },
      {
        title: 'Conflict Mapping:',
        content: 'Identifying where your core design is misaligned with your current situation',
      },
      {
        title: 'Diagnostic Framework:',
        content: 'Building your pattern map so we can move directly to clarity and strategy',
      },
    ],
  },

  {
    title_top: `Phase 2:`,
    title_bottom: `The Diagnostic Session (Us, 60 Minutes)`,
    img: '/images/webinar/webinar_decor_up.png',
    text_top: 'We spend one hour in focused analysis of the findings:',
    text_bottom: `Post-Session: Full session recording delivered within 24 hours.`,
    icon: '/icons/ornament_16.svg',
    list: [
      {
        title: 'Pattern Revelation:',
        content: 'I show you the true driver of your situation',
      },
      {
        title: 'Algorithmic Correction:',
        content: 'We locate the specific error in your current approach or behavioral sequence',
      },
      {
        title: 'Strategic Scripting:',
        content:
          'I provide the precise sequence of moves required to break the pattern and recalibrate your trajectory',
      },
    ],
  },
];

export const HowItWorks = () => {
  return (
    <section
      className='relative pb-[80px] px-4 md:px-8 2xl:px-[180px] lg:pt-[80px] lg:pb-[103px]'
      style={{
        background: "url('/images/bg/new_bg.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <OrnamentTitle
        color='#E5B8B8'
        title='HOW IT WORKS:'
        mt={300}
        subtitle='The value of our session begins before we speak.'
      />

      <div className='grid grid-cols-1 gap-6 items-center justify-items-center mb-10'>
        {CARD_CONTENT.map(({ text_bottom, text_top, title_top, title_bottom, list, img, icon }) => (
          <motion.div
            key={title_top}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.18,
              margin: '0px 0px -20% 0px',
            }}
            transition={{
              duration: 1.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className='
              bg-white rounded-[32px] text-center flex flex-col justify-center py-[42px] px-4
              w-full p-1
              sm:px-6
              md:p-8 md:flex-row md:gap-x-4
              lg:max-w-none lg:w-[1016px] lg:h-[468px] lg:px-[80px] lg:py-[64px] lg:gap-x-[105px]
            '
          >
            <div className='max-w-[350px] mx-auto md:mx-0'>
              {img && (
                <div className='relative w-[139px] h-[139px] mb-[10px] mx-auto md:mx-0 md:mt-[52px]'>
                  <Image src={img} alt='' fill className='object-contain opacity-35' />
                  <Image
                    src={icon}
                    alt={title_bottom}
                    width={90}
                    height={90}
                    className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                  />
                </div>
              )}

              <h4 className='font-canela text-center font-normal mb-6 md:font-light text-brand-black-100 md:mb-3 text-h2 md:text-start'>
                <span>{title_top}</span> <br />
                <span>{title_bottom}</span>
              </h4>
            </div>

            <div className='flex flex-1 flex-col gap-8 justify-start font-lato text-start text-brand-gray  text-cta'>
              <p>{text_top}</p>

              <ul className='flex flex-col pl-6'>
                {list.map(({ title, content }) => (
                  <li key={title} className='list-disc'>
                    <span className='font-bold'>{title}</span> <span>{content}</span>
                  </li>
                ))}
              </ul>

              <p>{text_bottom}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
