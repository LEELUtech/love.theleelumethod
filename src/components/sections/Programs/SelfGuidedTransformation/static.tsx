import { ESSENTIALS_LINKS } from '@/static/links';
import { IProgramsHero } from '../components/hero';
import { IProgramItWorks } from '../components/it-works';
import { IProgramOverview } from '../components/overview';
import { IProgramsReceive } from '../components/receive';
import { IProgramResult } from '../components/result';
import { IProgramsWhoThis } from '../components/who-this';

export const selfGuidedHeroData: IProgramsHero = {
  title: 'THE PROTOCOL ESSENTIALS',
  description: 'Code-Level Transformation',
  imgSrc: '/images/lily/lily_4.jpg',
  subtitle: `YOUR RELATIONSHIP ISN'T BROKEN. YOU'RE RUNNING THE WRONG CODE.`,
  content: `You don’t need another conversation about "feelings." You need a structural audit of why your relationships keep hitting the same wall.`,
  link: {
    href: ESSENTIALS_LINKS.HERO_LINK.href,
    label: ESSENTIALS_LINKS.HERO_LINK.label,
  },
};

export const selfGuidedWhoThisData: IProgramsWhoThis = {
  title: 'WHO THIS IS FOR:',
  items: [
    {
      id: 1,
      icon: 'star',
      title: 'IN A RELATIONSHIP:',
      text: `You love him, but the friction is exhausting. You're constantly "managing" the emotional labor. You feel like the Project Manager, not the Partner.`,
    },
    {
      id: 2,
      icon: 'star',
      title: 'LOOKING:',
      text: `You're high-achieving in every area except love. You're tired of "potential." You want to know exactly how to screen for a builder, not a project.`,
    },

    {
      id: 3,
      icon: 'necktie',
      title: 'IN CRISIS:',
      text: `You just ended things again. You're determined not to repeat the cycle, but you don't trust your instincts anymore because it feels like you attract the same man with a different face.`,
    },
  ],
  imgSrc: '/images/programs/self-guided-transformation/diagnosis_section.png',
};

export const selfGuidedModuleData: IProgramsReceive = {
  receive: {
    title: 'WHAT YOU RECEIVE',
    subtitle: 'This isn’t a passive course. Over two weeks, you decode yourself and your relationships step by step.',
  },
  module: {
    title: 'THE 12-MODULE VIDEO SYSTEM',
    description: 'A structured curriculum that teaches you:',
    list: [
      'Why your past relationships unfolded the way they did',
      'What patterns you repeat unconsciously',
      'How feminine and masculine energy works inside relationships',
      'How attraction is created, lost, and restored',
      'How to stop sabotaging connection',
      'How to build emotional safety and desire',
    ],
  },
};

export const selfGuidedOverviewData: IProgramOverview = {
  title: (
    <h2 className='text-[48px]/[126%] lg:text-[122px] text-center font-canela font-thin text-brand-deep'>
      <span className='text-brand-primary'>Personalized</span> Reports
    </h2>
  ),
  subtitle: 'Calculated with The Leelu Method',
  description: 'Every participant receives three manually calculated reports based on full name + DOB:',
  cards: [
    {
      id: 1,
      size: 'md',
      title: 'Energy Activation Report',
      subtitle: 'Your personal energy & magnetism code.',
      description: 'Inside:',
      iconColor: 'text-brand-gold',
      list: [
        'What restores your energy and nervous system balance',
        'Personalized activities that recharge you',
        'What increases your feminine radiance and attractiveness',
        'What drains your energy',
        'What habits and environments accelerate burnout, aging, and loss of desire',
        'What must be reduced or eliminated to protect your vitality',
      ],
    },
    {
      id: 2,
      size: 'md',
      title: `“His Secret Desires” Report`,
      subtitle: 'Calculated for your partner or desired partner.',
      description: 'Inside:',
      iconColor: 'text-brand-gold',
      list: [
        'What truly ignites him emotionally and energetically',
        'What gives him joy, meaning, and satisfaction',
        'What type of feminine energy he subconsciously seeks',
        'Activities a woman can introduce so he associates her with pleasure and inspiration',
        'Red flags that drain his joy and push him away',
      ],
    },
    {
      id: 3,
      size: 'md',
      title: 'Compatibility & Couple Dynamics Report',
      subtitle: 'If you are in a relationship',
      description: 'Inside:',
      iconColor: 'text-brand-gold',
      list: [
        'Your shared mission as a couple',
        'What you can realistically build together',
        'What you truly feel for each other beneath the surface',
        'Core obstacles and repeating conflicts',
        'What each partner must do for the relationship to thrive',
        'What your connection is designed to teach you',
        'Hidden lessons and unresolved patterns',
      ],
    },
  ],
  overviews: [
    {
      id: 1,
      title: { label: 'Live Support During The Program', size: '[32px]/[126%]' },
      list: [
        '2 Live Group Q&A Calls with Lily ( End of Week 1 and End of Week 2 )',
        '60 days of community support inside Circle',
        'Chat questions answered by program curator',
        'During live calls, you may ask any questions related to the material and',
        'your specific situation.',
      ],
    },
    {
      id: 2,
      title: { label: 'Ongoing Access After Completition', size: '[32px]/[126%]' },
      description: 'All Essentials students receive:',
      list: ['Monthly live Q&A calls with Lily for 3 months', 'Bring any relationship or compatibility questions'],
    },
    {
      id: 3,
      title: { label: 'Program Duration: Approximately 2–3 weeks with guided pacing', size: '[32px]/[126%]' },
    },
  ],
};

export const selfGuidedResultData: IProgramResult = {
  title: 'Clarity.',
  description:
    'You stop operating on instinct (which is traumatized) and start operating on intelligence. You will know exactly why your past relationships failed and have the specific behavioral blueprint to build the next one on solid ground.',
  investment: 697,
  link: {
    label: ESSENTIALS_LINKS.RESULT_LINK.label,
    href: ESSENTIALS_LINKS.RESULT_LINK.href,
  },
};

export const selfGuidedItWorksData: IProgramItWorks = {
  description: [
    `Before we got serious, I got analytical. I ran our numbers to ensure our compatibility was structural, not just chemical. The result? Four years of excitement, fulfillment, and peace.`,
  ],
  subtitle: [`I didn't waste a decade finding the right one—I engineered it.`],
  link: {
    label: ESSENTIALS_LINKS.WORKED_LINK.label,
    href: ESSENTIALS_LINKS.WORKED_LINK.href,
  },
  imgSrc: '/images/programs/self-guided-transformation/it_worked_for_me.png',
};
