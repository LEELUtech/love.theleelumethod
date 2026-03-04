import ProblemsListAnimated from '@/components/sections/Compatibility/ProblemsListAnimated';
import Button from '@/components/ui/Button';
import RotateOnView from '@/components/ui/RotateOnView';
import { COMPABILITY_REPORT_LINKS } from '@/static/links';
import Image from 'next/image';

export const PROBLEMS = [
  {
    id: 'same-fight',
    icon: 'red_star',
    text: "You keep having the same fight with different words, never understanding why certain triggers won't stop",
  },
  {
    id: 'shuts-down',
    icon: 'red_star',
    text: 'One partner slowly shuts down while the other pushes harder, creating a distance neither knows how to close',
  },
  {
    id: 'intensity',
    icon: 'red_star',
    text: "You confuse intensity for incompatibility—or worse, mistake calm for contentment when you're actually numbing out",
  },
  {
    id: 'years-pass',
    icon: 'red_star',
    text: 'Years pass before you realize you were solving the wrong problems the entire time',
  },
] as const;

type BlindCard = {
  title: string;
  text: string;
  variant: 'light' | 'peach' | 'warm' | 'mauve';
};

const CARDS: BlindCard[] = [
  {
    title: 'Your\nCompatibility\nType:',
    text: 'The specific dynamic governing how you connect, clash, and grow together.',
    variant: 'light',
  },
  {
    title: "Your\nRelationship's\nStrengths:",
    text: 'The exact advantages your pairing creates and where your connection naturally thrives.',
    variant: 'peach',
  },
  {
    title: "Your\nRelationship's\nChallenges:",
    text: "The predictable vulnerabilities you'll face and what threatens to pull you apart.",
    variant: 'light',
  },
  {
    title: 'The Lesson\nHidden in\nYour Connection:',
    text: 'What this relationship is designed to teach you both.',
    variant: 'mauve',
  },
];

function variantClass(v: BlindCard['variant']) {
  switch (v) {
    case 'light':
      return 'bg-[#f3e3e4]';
    case 'peach':
      return 'bg-[#fedad1]';
    case 'mauve':
      return 'bg-[#c7adb5]';
  }
}

function BlindSpotCard({ title, text, variant }: BlindCard) {
  return (
    <div
      className={[
        'w-full rounded-[20px] px-[24px] py-[40px] lg:min-h-[365px] shadow-[0_8px_30px_rgba(0,0,0,0.06)]',
        variantClass(variant),
      ].join(' ')}
    >
      <h3
        className={[
          'font-canela font-thin leading-[120%] whitespace-pre-line mb-4',
          'text-[42px] lg:text-[42px] text-center text-brand-deep',
        ].join(' ')}
      >
        {title}
      </h3>

      <p className={['font-lato font-normal text-[17px]/[26px] text-center text-brand-gray'].join(' ')}>{text}</p>
    </div>
  );
}

const ProblemSolutionSection = () => {
  return (
    <section className='relative py-[80px] lg:py-[112px] pb-[220px] lg:pb-[200px] overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0 z-[-1] overflow-hidden'>
        <Image src='/images/about/fracture_section_bg.png' alt='' fill priority quality={100} />
      </div>
      <div className='container px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-start'>
          {/* Left Column - Image */}
          <div className='flex justify-center'>
            <div className='relative mb-[60px] md:mb-0 lg:mb-0 w-[360px] h-[459px] lg:w-[551px] lg:h-[748px] rounded-lg'>
              <Image
                src='/images/about/fracture_section.png'
                alt='Person sitting with a laptop'
                fill
                priority
                quality={100}
                className='rounded-lg'
              />
              <div className='absolute flex bottom-[-30px] left-[-10px] lg:left-[-30px] items-center justify-center bg-[#d8ac9e] rounded-[300px] w-[80px] h-[100px] md:w-[100px] md:h-[126px] lg:w-[123px] lg:h-[155px] z-10'>
                <div className=' relative w-[55px] h-[55px] lg:w-[75px] lg:h-[75px]'>
                  <Image src='/leelu_logo.svg' alt='' fill className='absolute filter brightness-0 invert' />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - The Fracture */}
          <div>
            <h2 className='font-thin text-[60px] leading-[126%] font-canela text-brand-deep mb-8'>
              The Cost of Guessing Wrong
            </h2>
            <p className='font-thin text-brand-deep text-[32px] font-canela leading-[130%] tracking-normal mb-8'>
              You&apos;ve already invested emotion. Time. Maybe years.
            </p>
            <p className='font-normal text-body text-[#5A5757] font-lato leading-[26px] tracking-normal mb-8'>
              Here&apos;s what happens when couples ignore their compatibility code:
            </p>

            <ProblemsListAnimated items={PROBLEMS} />

            <Button variant='primary' size='md' className='w-full' href={COMPABILITY_REPORT_LINKS.PROBLEM_LINK.href}>
              {COMPABILITY_REPORT_LINKS.PROBLEM_LINK.label}
            </Button>
          </div>
        </div>

        {/* The Laboratory Section */}
        <div className='lg:mt-[400px] mt-[250px] relative'>
          <div
            className='
											absolute z-0
											left-1/2 -translate-x-1/2
											top-[-150px]
											md:top-[-180px]
											lg:top-[-320px]
									
											flex flex-row items-center justify-center gap-[130px]
											pointer-events-none
										'
          >
            {/* LEFT ornament */}
            <div
              className='
							relative overflow-hidden
							w-[180px] h-[180px]
							lg:w-[238px] lg:h-[249px]
					
							translate-x-[250px] translate-y-[80px]
							md:translate-x-[120px] md:translate-y-[50px]
							lg:translate-x-[125px] lg:translate-y-[60px]
						'
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
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
                duration={5}
                amount={0.2}
                ease='easeOut'
                className='absolute inset-0'
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                <Image
                  src='/icons/ornament_3.svg'
                  alt=''
                  fill
                  className='object-contain'
                  style={{ filter: 'brightness(200%)' }}
                />
              </RotateOnView>
            </div>
            {/* CENTER ornament */}
            <div
              className='relative overflow-hidden
							w-[261px] h-[266px]
							lg:w-[512px] lg:h-[524px]
						'
              style={{
                WebkitMaskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,0.6) 58%, rgba(0,0,0,0) 88%)',
                maskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,0.6) 58%, rgba(0,0,0,0) 88%)',

                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            >
              <RotateOnView
                duration={5}
                amount={0.2}
                ease='easeOut'
                className='absolute inset-0'
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                <Image
                  src='/icons/ornament_2/ornament_2_light.svg'
                  alt=''
                  fill
                  className='object-contain'
                  style={{ filter: 'brightness(200%)' }}
                />
              </RotateOnView>
            </div>

            {/* RIGHT ornament */}
            <div
              className='
							relative overflow-hidden
							w-[180px] h-[180px]
							lg:w-[259px] lg:h-[242px]
					
							-translate-x-[250px] translate-y-[90px]
							md:-translate-x-[120px] md:translate-y-[50px]
							lg:-translate-x-[120px] lg:translate-y-[60px]
						'
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
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
                duration={10}
                amount={0.2}
                ease='easeOut'
                className='absolute inset-0'
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                <Image
                  src='/icons/ornament_right.svg'
                  alt=''
                  fill
                  className='object-contain'
                  style={{ filter: 'brightness(200%)' }}
                />
              </RotateOnView>
            </div>
          </div>
          <h2 className='relative font-thin text-[42px] lg:text-[60px] leading-[130%] font-canela text-brand-deep mb-8 text-center z-10'>
            The couples who succeed don&apos;t have fewer challenges.
          </h2>
          <h2 className='relative font-thin text-[32px]/[130%] font-canela text-brand-deep mb-8 text-center z-10'>
            They have the blueprint.
          </h2>
          <p className='text-[22px] font-normal font-lato leading-[150%] mb-6 text-center text-brand-gray-100  mx-auto'>
            The LeeluTech Compatibility Code Report analyzes how you each process emotion, handle conflict, and express
            needs—then ma ps whether your energies amplify, neutralize, or destabilize each other.
          </p>
          <p className='text-[22px] font-normal font-lato leading-[150%] mb-6 text-center text-brand-gray-100  mx-auto'>
            Your personalized Compatibility Code Report delivers:
          </p>

          <div className='mt-10 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-[100px] lg:mb-[112px]'>
            {CARDS.map((c) => (
              <BlindSpotCard key={c.title} {...c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
