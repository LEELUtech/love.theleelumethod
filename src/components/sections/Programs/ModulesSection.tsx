import Button from '@/components/ui/Button';
import Phase3Orb from '@/components/ui/Phase3Orb';
import RotateOnView from '@/components/ui/RotateOnView';
import { PROGRAMS_LINKS } from '@/static/links';
import Image from 'next/image';
import React from 'react';

type MiniCard = { title: string; text: string };
type Module = { title: string; text: string; accent?: 'red' | 'gold' | 'none' };

const MINI_CARDS: MiniCard[] = [
  { title: 'WHAT', text: 'Is the mathematical root of your\nconflict?' },
  {
    title: 'WHY',
    text: 'Is your "Inner Demon" triggered\nby specific archetypes?',
  },
  {
    title: 'HOW',
    text: 'Do you shift the power dynamic\nwithout saying a word?',
  },
];

const PHASE_1: Module[] = [
  {
    title: 'Module 1: The Trigger Map',
    text: `We stop treating the symptoms—the circular fights and that nagging feeling of inadequacy—and locate the source. We identify the specific triggers that threaten your connection, so you never get blindsided again.`,
    accent: 'red',
  },
  {
    title: 'Module 2: The Polarity Reset',
    text: `Are you exhausted from "wearing the pants" in your household? We break the over-functioning addiction that inadvertently pushes men into a "child" role—and reveal why doing less can give you more.`,
    accent: 'red',
  },
  {
    title: 'Module 3: The Narrative Detox',
    text: `We identify the unconscious romantic narrative you’ve been following—whether it’s the “fixer-upper,” the “tragic love story,” or another common script—and replace it with what you actually need to feel safe and loved.`,
    accent: 'red',
  },
  {
    title: 'Module 4: From Dependency to Sovereignty',
    text: `Learn to stop outsourcing your emotional well-being to your partner. We expose and reverse insecure attachment patterns so you stop negotiating for love from a place of lack and start receiving it from a place of power.`,
    accent: 'red',
  },
];

const PHASE_2: Module[] = [
  {
    title: 'Module 5: The Independence Protocol',
    text: 'How to receive deep support without losing your autonomy. We find the sweet spot between being a capable, high-achieving woman and a partner who allows herself to be truly seen and cared for.',
    accent: 'gold',
  },
  {
    title: 'Module 6: The Art of the Ask',
    text: 'Demands trigger his flight response. Requests activate his drive to provide. We give you the communication strategies that turn moments of tension into catalysts for his devotion.',
    accent: 'gold',
  },
  {
    title: 'Module 7: The Core Drivers',
    text: 'We decode the core drivers of the masculine psyche—Freedom, Significance, and Physical Connection—so you can finally understand how they shape every decision he makes, even the ones he can’t articulate himself.',
    accent: 'gold',
  },
  {
    title: 'Module 8: The Sanctuary Shift',
    text: `We dismantle the "Management" loop that triggers his biological withdrawal. You'll learn how to pivot from being his stressor to his sanctuary.`,
    accent: 'gold',
  },
];

const PHASE_3: Module[] = [
  {
    title: 'Module 9: The Security Anchor',
    text: `Jealousy isn't a flaw; it's data. We decode what your fear of loss is actually telling you and give you the tools to shift from anxious to anchored.`,
    accent: 'none',
  },
  {
    title: 'Module 10: The Energy Architecture',
    text: `We map your personal energy requirements: what drains you, what restores you, and the specific conditions you need to stay emotionally regulated and magnetically attractive.`,
    accent: 'none',
  },
  {
    title: 'Module 11: The Compatibility Matrix',
    text: `The Crown Jewel of my system. We analyze whether this is a "Growth" partner (here to teach you), or a "Life" partner (here to build with you). Gain total clarity before you invest another year of your life.`,
    accent: 'none',
  },
  {
    title: 'Module 12: The Hidden Desire',
    text: `Every human has a secret emotional driver (one of 87 types). We teach you how to identify his "Type" with surgical precision, making you the only person on Earth who truly speaks his language.`,
    accent: 'none',
  },
];

const GOAL_CONTENT = {
  phase_1: {
    phase: 1,
    title: 'THE AUDIT',
    highlight: '(You)',
    highlightColor: 'text-brand-primary',
    description: `Before we can change the relationship, we examine the invisible architecture of your romantic programming. We move from confusion to clarity by identifying the silent scripts that have been steering your life.`,
  },
  phase_2: {
    phase: 2,
    title: 'THE MECHANICS',
    highlight: '(You & Him)',
    highlightColor: 'text-brand-gold',
    description: `Now that you've cleared your own internal scripts, we look at the dance between you. We decode the "Male Operating System" so you can find a rhythm where you feel cherished and he feels inspired.`,
  },

  phase_3: {
    phase: 3,
    title: 'THE STRATEGY',
    highlight: '(The Future)',
    highlightColor: 'text-brand-primary',
    description: `This is the Crown Jewel of the system. We move from relational competence into long-term mastery. You’ll leave with a customized roadmap for your specific union—ensuring you remain emotionally grounded and irresistibly present for years to come.`,
  },
};

function MiniWhyCard({ title, text }: MiniCard) {
  return (
    <div className='rounded-[16px] bg-[#FFF8F8] px-6 py-10 md:px-[26px] md:py-[57px] text-center'>
      <div className='font-canela font-thin text-brand-black-100 text-[60px]/[126%]'>{title}</div>
      <p className='mt-3 whitespace-pre-line font-lato text-[#757986] text-[22px]/[150%]'>{text}</p>
    </div>
  );
}

function ModuleCard({ title, text, accent = 'red' }: Module) {
  return (
    <div className='rounded-[16px] bg-[#FFF8F8] backdrop-blur-md px-[20px] py-[20px] md:px-[24px] md:py-[24px]'>
      <div className='flex flex-row gap-4 items-center mb-4'>
        {accent !== 'none' && (
          <div className='relative w-[26px] h-[33px] shrink-0'>
            <Image
              src={accent === 'red' ? '/icons/red_star.svg' : '/icons/necktie.svg'}
              alt=''
              fill
              quality={85}
            />
          </div>
        )}
        <div className='font-canela font-normal text-[#010101] text-[18px]/[126%] md:text-[20px]'>{title}</div>
      </div>

      <p className='font-lato text-brand-gray-100 text-[15px]/[24px]'>{text}</p>
    </div>
  );
}

interface GoalContentProps {
  phase: number;
  title: string;
  highlight: string;
  highlightColor: string;
  description: string;
}

const GoalContent = ({ phase, title, highlight, highlightColor, description }: GoalContentProps) => (
  <>
    <p className='font-canela font-thin text-brand-black text-[22px] md:text-[28px] tracking-[0.18em] uppercase'>
      PHASE {phase}:
    </p>

    <h3 className='mt-1 mb-4 font-canela font-thin text-brand-black text-[34px] md:text-[46px] lg:text-[56px] leading-[105%]'>
      {title} <br className='hidden lg:block' />
      <span className={`font-canela font-thin leading-[126%] tracking-normal ${highlightColor}`}>{highlight}</span>
    </h3>

    <p className='lg:max-w-[500px] font-lato text-[22px]/[30px] text-[#6F4C40] mb-[67px]'>
      <span className='font-bold'>The Goal:</span> <span className='italic'>{description}</span>
    </p>
  </>
);

export default function ModulesSection({ cohortLabel }: { cohortLabel?: string | null }) {
  return (
    <section className='relative overflow-hidden'>
      {/* Background for whole section */}
      <div className='absolute inset-0 -z-10'>
        <Image src='https://firebasestorage.googleapis.com/v0/b/leelu-tech.firebasestorage.app/o/love.theleelumethod%2Fbg%2Fmodules_section_bg.png?alt=media' alt='' quality={85} fill />
      </div>

      <div className='container px-4'>
        {/* ====== TOP BLOCK (WHY / WHAT / HOW) ====== */}
        <div className='pt-[198px] lg:pt-[176px] pb-[80px] lg:pb-[110px] text-center'>
          {/* portrait + badge */}
          <div className='mx-auto relative'>
            <div className='relative z-[10] mx-auto w-full max-w-[356px] aspect-[356/384] overflow-hidden'>
              <Image
                src='/images/programs/modules_lily.png'
                alt=''
                fill
                quality={85}
                className='object-cover'
              />
            </div>

            {/* ornaments: hide on mobile, keep from md+ */}
            <div
              className='
								absolute z-0
								left-1/2 -translate-x-[49.5%]
								top-[-100px]
								lg:top-[-90px]
								flex
								flex-row items-center justify-center gap-[130px]
								pointer-events-none
							'
            >
              {/* LEFT ornament */}
              <div className='relative hidden md:block w-[180px] h-[180px] lg:w-[238px] lg:h-[249px] md:translate-x-[120px] md:translate-y-[50px] lg:translate-x-[125px] lg:translate-y-[60px]'>
                <Image
                  src='/icons/ornament_3.svg'
                  alt=''
                  fill
                  className='absolute filter brightness-0 invert'
                  quality={85}
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 0%, black 10%, transparent 90%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 10%, transparent 90%)',
                    filter: 'brightness(200%)',
                  }}
                />
              </div>

              {/* CENTER ornament */}
              <div
                className='relative w-[261px] h-[266px] lg:w-[500px] lg:h-[500px]'
                style={{
                  maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
                }}
              >
                <Image
                  src='/icons/ornament_2/ornament_2_light.svg'
                  alt=''
                  fill
                  className='absolute'
                  quality={85}
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>

              {/* RIGHT ornament */}
              <div className='relative hidden md:block w-[180px] h-[180px] lg:w-[259px] lg:h-[242px] md:-translate-x-[120px] md:translate-y-[50px] lg:-translate-x-[120px] lg:translate-y-[60px]'>
                <Image
                  src='/icons/ornament_5.svg'
                  alt=''
                  fill
                  className='absolute filter brightness-0 invert'
                  quality={85}
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 0%, black 20%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 20%, transparent 100%)',
                    filter: 'brightness(200%)',
                  }}
                />
              </div>
            </div>

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
              <RotateOnView duration={17} amount={0.4} ease='linear' repeat={true}>
                <Image
                  src='/leelu_logo.svg'
                  alt=''
                  width={63}
                  height={61}
                  className='w-[51px] h-[53px] md:w-[65px] md:h-[63px] lg:w-[61px] lg:h-[63px] filter invert-[100%] brightness-[100%]'
                  quality={85}
                />
              </RotateOnView>
            </div>
          </div>

          <h2 className='mt-16 font-canela font-thin text-brand-deep text-[48px] md:text-[48px] lg:text-[48px] leading-[120%] max-w-[860px] mx-auto'>
            <span className='text-brand-primary'>The Leelu Method</span> answers the questions traditional therapy
            circles for years:
          </h2>

          <div className='mt-10 lg:mt-[80px] mb-[42px] lg:mb-5 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6mx-auto'>
            {MINI_CARDS.map((c, idx) => (
              <div key={c.title} className={idx === 1 ? 'md:-translate-y-6 lg:-translate-y-8' : ''}>
                <MiniWhyCard {...c} />
              </div>
            ))}
          </div>

          <Button
            variant='primary'
            className='w-full max-w-[392px]'
            href={PROGRAMS_LINKS.PROTOCOL_LINK.href}
            trackingData={{
              cta_name: 'programs_modules_initiate_protocol_cta',
              cta_text: 'INITIATE THE PROTOCOL',
              cta_location: 'modules',
            }}
          >
            {PROGRAMS_LINKS.PROTOCOL_LINK.label}
          </Button>
        </div>

        {/* ====== MODULES BLOCK ====== */}
        <div className='pb-[110px] lg:pb-[96px]'>
          <h2 className='text-center font-canela font-thin text-brand-deep text-[48px] md:text-[48px] lg:text-[80px] tracking-normal leading-[130%] mx-auto'>
            You are 12 modules away from the relationship{' '}
            <span className='text-brand-primary'>you were destined for.</span>
          </h2>

          <p className='mt-6 md:mt-8 text-center font-lato text-brand-deep text-[24px] md:text-[24px] lg:leading-[26px] leading-[150%]'>
            This is not a lecture series. It is a step-by-step reconfiguration of your relationship architecture.
          </p>

          <p className='mt-6 md:mt-8 text-center font-lato text-brand-deep text-[24px] md:text-[24px] lg:leading-[26px] leading-[150%]'>
            Next cohort starts <span className='text-brand-primary'>{cohortLabel ?? 'March 18'}</span>
          </p>

          {/* ================= PHASE 1 ================= */}
          <div className='mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center'>
            {/* left */}
            <div className='text-left'>
              <GoalContent {...GOAL_CONTENT.phase_1} />

              <div className='mt-4 relative w-full max-w-[420px] mx-auto lg:mx-0'>
                <div className='relative w-full aspect-[420/338]'>
                  <Image
                    src='/images/programs/phase_1.png'
                    alt='Phase 1'
                    fill
                    quality={85}
                    className='object-cover'
                  />
                </div>

                <div className="absolute left-[2%] bottom-[2%] h-[64px] w-[64px] md:h-[81px] md:w-[81px] rounded-full overflow-hidden bg-[#EB4F68] before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay flex items-center justify-center">
                  <div className='relative w-[26px] h-[32px] md:w-[32px] md:h-[39px]'>
                    <Image
                      src='/icons/red_star.svg'
                      alt=''
                      fill
                      quality={85}
                      className='filter brightness-0 invert'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* right modules */}
            <div className='grid gap-4'>
              {PHASE_1.map((m) => (
                <ModuleCard key={m.title} {...m} />
              ))}
            </div>
          </div>

          <div className='mt-[88px] hidden lg:block lg:mt-24 h-px w-full bg-brand-deep/20' />

          {/* ================= PHASE 2 ================= */}
          <div className='mt-14 lg:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center'>
            <div className='lg:order-1 order-2 grid gap-4'>
              {PHASE_2.map((m) => (
                <ModuleCard key={m.title} {...m} />
              ))}
            </div>

            <div className='lg:order-2 order-1 text-left'>
              <GoalContent {...GOAL_CONTENT.phase_2} />

              <div className='mt-4 md:mt-[65px] relative w-full max-w-[460px] mx-auto lg:mx-0'>
                <div className='relative w-full aspect-[460/378]'>
                  <Image
                    src='/images/programs/phase_2.png'
                    alt='Phase 2'
                    fill
                    quality={85}
                    className='object-cover rounded-b-[300px]'
                  />
                </div>

                <div className='absolute right-[8%] bottom-[11%] h-[64px] w-[64px] md:h-[81px] md:w-[81px] pt-2 rounded-full bg-[#C89F26] flex items-center justify-center'>
                  <div className='relative w-[34px] h-[20px] md:w-[42px] md:h-[26px]'>
                    <Image
                      src='/icons/necktie.svg'
                      alt=''
                      fill
                      quality={85}
                      className='filter brightness-0 invert'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PHASE 3 ================= */}
          <div className='mt-14 lg:mt-28 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center'>
            {/* left */}
            <div className='text-left'>
              <GoalContent {...GOAL_CONTENT.phase_3} />

              <div className='mt-4 md:mt-[65px] relative mx-auto lg:mx-0'>
                <Phase3Orb />
              </div>
            </div>

            {/* right modules */}
            <div className='grid gap-4'>
              {PHASE_3.map((m) => (
                <ModuleCard key={m.title} {...m} />
              ))}
            </div>
          </div>

          <div className='text-center relative mt-[200px] lg:mt-[100px]'>
            <div className='lg:hidden absolute z-0 left-1/2 -translate-x-1/2 top-[-80px] md:top-[-280px] lg:top-[-300px] flex flex-row items-center justify-center gap-[130px]'>
              <div
                className='relative overflow-hidden w-[340px] h-[340px] sm:w-[418px] sm:h-[418px] md:translate-y-[50px] lg:translate-y-[60px]   '
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
                  WebkitMaskSize: '100% 100%',
                  maskSize: '100% 100%',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }}
              >
                <RotateOnView
                  duration={33}
                  amount={0.2}
                  ease='linear'
                  repeat={true}
                  className='absolute inset-0'
                  style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                >
                  <Image
                    src='/icons/ornament_2/ornament_2_light.svg'
                    alt=''
                    fill
                    className='object-contain'
                    quality={85}
                    style={{ filter: 'brightness(0) invert(1) opacity(0.5)' }}
                  />
                </RotateOnView>
              </div>
            </div>

            <div className='pt-[170px] lg:pt-0'>
              <h3 className='font-canela font-light text-brand-deep text-[28px] md:text-[32px] leading-[120%]'>
                Reconfigure your relationship architecture.
              </h3>
              <Button
                variant='primary'
                className='w-full lg:w-[38%] mt-[32px]'
                href={PROGRAMS_LINKS.PROTOCOL_LINK.href}
                trackingData={{
                  cta_name: 'programs_modules_protocol_cta',
                  cta_text: PROGRAMS_LINKS.PROTOCOL_LINK.label,
                  cta_location: 'modules',
                }}
              >
                {PROGRAMS_LINKS.PROTOCOL_LINK.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
