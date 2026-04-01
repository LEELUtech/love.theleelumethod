import Image from 'next/image';
import React from 'react';

export default function StopImprovisingSection() {
  return (
    <section className='bg-brand-white pt-[72px] lg:pt-[160px]'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-9 lg:gap-[104px] items-start'>
          <div className='order-1 lg:order-2 relative w-full max-w-[520px] mx-auto lg:mx-0 lg:ml-auto flex flex-col items-end'>
            <div className='relative xs:w-[360px] xs:h-[459px] lg:w-[496px] lg:h-[833px] md:w-[596px] md:h-[833px] overflow-hidden rounded-[60px] lg:rounded-[100px]'>
              <Image src='/images/woman-sitting-windowsill.png' alt='' fill priority className='object-cover' quality={100} />
            </div>

            <div className='block lg:hidden w-[130px] -mt-[85px] mr-6 h-[172px] relative rounded-[400px] overflow-hidden'>
              <Image fill src='/images/programs/happy_women.png' priority alt='Happy Women' quality={100} />
            </div>
          </div>

          {/* LEFT: text (MOBILE/TABLET SECOND) */}
          <div className='order-2 lg:order-1 max-w-[560px]'>
            <h2 className='font-canela font-thin text-brand-deep leading-[130%] text-[48px] md:text-[60px] lg:text-[60px]'>
              Stop improvising your
              <br />
              <span className='uppercase'>LOVE LIFE</span>
            </h2>

            <div className='mt-[30px] font-normal space-y-5 font-lato text-[#5A5757] text-body md:text-body leading-[24px] md:leading-[26px]'>
              <p>
                You manage your career. You strategize your finances.
                <br />
                But when it comes to the high-stakes architecture of your relationships, you are operating on instinct
                alone.
              </p>

              <p className='text-brand-primary font-canela text-[20px]'>And your instinct is sabotaging you.</p>

              <p className='text-brand-black text-[20px] font-light font-canela'>
                You are attracted to the wrong men.
                <br />
                You ignore the red flags.
                <br />
                You stay too long.
                <br />
                You convince yourself &quot;this time is different.&quot;
              </p>

              <p className='text-brand-primary font-canela text-[20px]'>
                It&apos;s not your fault. But it is your pattern.
              </p>

              <p>
                Your instincts are not random. They are code, written by your earliest experiences, your unhealed
                wounds, and the men who shaped your understanding of love.
              </p>

              <p>If the code is broken, the output will always be the same.</p>

              <p className='text-[#5A5757]'>The Relationship Protocol is not a collection of dating tips.</p>

              <p>
                It is an audit of your relational history, followed by a System Reset—a 12-module deprogramming
                sequence designed to identify the corrupted script running in your subconscious, delete the glitch, and
                install a new operating system for connection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
