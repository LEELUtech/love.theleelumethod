import Image from 'next/image';
import React from 'react';

const LEFT = [
  "You recognize the loop. The faces change, the story changes, but the ending is always the same and you're finally ready to understand why.",
  "You've outgrown generic advice. “Follow your heart” and “trust the process” haven't worked. You need a system, not a pep talk.",
  "You're at a crossroads. You're not sure if this relationship is broken or just stuck—but you know something has to shift, and you're willing to examine your role in the dynamic.",
  "You want precision, not mysticism. You're drawn to frameworks, data, clarity. You'd rather understand the architecture of your patterns than sit in another circle talking about “healing energy.”",
  "You're ready to see yourself clearly. Not in a self-blame way—but in a “show me the blind spot so I can finally stop tripping over it” way. You know growth requires honesty, and you're not afraid of uncomfortable truths.",
];

const RIGHT = [
  "Safety is your primary concern. If you're in a relationship where you feel unsafe (physically or emotionally), this course is not the right tool. Please reach out to a domestic violence resource first.",
  "You've already made your decision. If you know you're leaving and just need support through the exit, that's a different kind of work. This course is for women still exploring whether the relationship is repairable.",
  "You're hoping this will change him. This system will show you how to shift the dynamic—but it can't force someone to grow. If he's fundamentally unavailable or unwilling, the course will help you see that clearly (which may mean accepting it's time to go).",
  "You're looking for someone to take your side. I'm not here to validate your story or assign blame. I'm here to help you see the pattern and break it—which requires looking at your role in the loop.",
  "You're in immediate danger or emotional meltdown. If the crisis is happening right now, you need crisis support. Please reach out to a therapist or crisis counselor first. You can come back to this work when you're stable enough to engage with it.",
];

export default function WhoThisIsForSection() {
  return (
    <section className='bg-brand-white pt-[79px] pb-[130px] lg:pt-[80px] lg:pb-[162px]'>
      <div className='container'>
        {/* Title */}
        <h2
          className='
						font-canela font-thin text-brand-black
						text-[48px] md:text-[52px] lg:text-[60px]
						leading-[110%]
						mb-[32px] lg:mb-[64px]
						text-center md:text-left lg:text-left
					'
        >
          WHO THIS IS FOR:
        </h2>

        <div
          className='
						grid grid-cols-1
						md:grid-cols-2
						lg:grid-cols-2
						gap-[33px]
						md:gap-[48px]
						lg:gap-[32px]
						md:items-start
					'
        >
          {/* ===== LEFT ===== */}
          <div className='md:justify-self-start'>
            <h3 className='font-canela font-light text-brand-black text-[32px] mb-6'>
              This is <span className='text-brand-primary'>for you</span> if:
            </h3>

            <ul className='space-y-6'>
              {LEFT.map((item, i) => (
                <li key={i} className='flex gap-4'>
                  <div className='w-4 h-4 pt-2 flex-shrink-0'>
                    <Image src='/icons/arrow_right.svg' alt='Arrow' width={10} height={10} className='object-contain' />
                  </div>
                  <p className='font-lato font-normal text-[#5A5757] text-[15px] leading-[26px]'>{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== RIGHT ===== */}
          <div className='md:justify-self-end lg:justify-self-auto'>
            <h3 className='font-canela font-light text-brand-black text-[32px] mb-6'>
              This is <span className='text-brand-primary'>NOT</span> for you if:
            </h3>

            <ul className='space-y-6'>
              {RIGHT.map((item, i) => (
                <li key={i} className='flex gap-4'>
                  <div className='w-4 h-4 pt-2 flex-shrink-0'>
                    <Image src='/icons/arrow_right.svg' alt='Arrow' width={10} height={10} className='object-contain' />
                  </div>
                  <p className='font-lato font-normal text-[#5A5757] text-[15px] leading-[26px]'>{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
