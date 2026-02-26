import { IProgramsHero } from '../components/hero';
import { IProgramsWhoThis } from '../components/who-this';
import { IProgramsReceive } from '../components/receive';
import { IProgramOverview } from '../components/overview';
import { IProgramResult } from '../components/result';
import { IProgramItWorks } from '../components/it-works';
import { OrnamentTitle } from '@/components/ui/titles/OrnamentTitle';

export const guidedBreakthroughWhoThisData: IProgramsWhoThis = {
  title: 'WHO THIS IS FOR:',
  items: [
    {
      id: 1,
      icon: 'star',
      title: 'IN A RELATIONSHIP:',
      text: `You're at a breaking point. You need to know right now: is this fixable, or is it dead? You cannot afford to waste another 6 months wondering.`,
    },
    {
      id: 2,
      icon: 'star',

      title: 'LOOKING:',
      text: `You're ready to build something real, but terrified of repeating the pattern. You want the full diagnostic precision of The Leelu Method applied directly to your life.`,
    },

    {
      id: 3,
      icon: 'necktie',
      title: 'IN CRISIS:',
      text: `The breakup shattered your confidence. You're spinning in "why did this happen?" loops. You need an external authority to tell you exactly what went wrong so you can sleep again.`,
    },
  ],
  imgSrc: '/images/programs/guided-breakthrough/GUIDED_IMMERSION _TOP_1.png',
};

export const guidedBreakthroughHeroData: IProgramsHero = {
  title: 'GUIDED BREAKTHROUGH',
  imgSrc: '/images/lily/lily_3.png',
  subtitle: 'Personalized Diagnosis and Priority Access',
  content: `Stop guessing and get the precise correction.`,
  contentBottom: `You don't just need the framework. You need someone to diagnose your specific pattern—and hand you the exact fix.`,
  buttonLabel: 'GET PERSONAL',
};

export const guidedBreakthroughModuleData: IProgramsReceive = {
  receive: {
    title: 'WHAT YOU RECEIVE',
    subtitle:
      'Everything in The Protocol Essentials—plus deep personal decoding, a private strategy session, and priority access to Lily.',
  },
  module: {
    title: 'EVERYTHING IN ESSENTIALS',
    list: [
      '12-Module Video System (60-day access)',
      'Workbook & Written Integration Assignments',
      '3 Personalized Reports: Energy Activation, His Secret Desires,',
      'Compatibility & Couple Dynamics',
      '2 Live Group Q&A Calls (Week 1 + Week 2)',
      '60 Days of Circle Community Support',
      '3 Months of Monthly Live Q&A Calls with Lily',
    ],
    subtitle: {
      highlight: 'PLUS:',
      content: 'Your Personalized Layer',
    },
  },
  additionalModule: {
    title: 'Full Leelu Method Personal Numerology Decoding',
    description: [
      'Manual analysis of your personal codes based on your full name and date of birth.',
      'You receive a personalized PDF revealing:',
    ],
    list: [
      'Your core relationship patterns',
      'Emotional triggers',
      'Strengths and blind spots in love',
      'Why you attract certain partners',
      'What type of partner suits you best',
      'Your main lessons in relationships',
    ],
    imgSrc: '/images/lily/lily_2.png',
  },
};

export const guidedBreakthroughOverviewData: IProgramOverview = {
  title: (
    <OrnamentTitle
      mt={300}
      title='The Extended Leelu Method'
      titleHightlight='Compatibility Blueprint'
      color='#ffffff'
    />
  ),
  subtitle: 'An exhaustive, manually calculated relationship instruction manual based on both birth dates.',
  cards: [
    {
      id: 1,
      title: 'Relationship Development Over Time',
      iconColor: 'text-brand-primary',
      list: [
        'First meeting & attraction',
        'Dating stage',
        'Living together',
        'Marriage & family',
        'Long-term partnership',
        'How feelings change as the relationship evolves',
        'Whether the couple has real potential for marriage and family',
      ],
    },
    {
      id: 2,
      title: `Conflict Navigation & Behavioral Strategy`,
      description: 'For both partners:',
      iconColor: 'text-brand-primary',
      list: [
        'Core reasons conflicts arise',
        'What dissatisfaction accumulates from',
        'What partners will most often fight about',
        'Who usually initiates conflict',
        'Who escalates conflict',
        'Conflict-avoidance strategy',
        'Conflict-exit strategy',
        'How to de-escalate arguments',
        'How to reconcile after conflict',
        'Behavioral rewiring plan for both partners',
      ],
    },
    {
      id: 3,
      title: 'Life Strategy as a Couple',
      iconColor: 'text-brand-primary',
      list: [
        'How joint goals evolve',
        `Whether it's favorable to build a business together`,
        'Potential for having children',
        'Best growth direction as a couple',
        'Maximum potential areas',
        'What environments support the relationship',
        'What social circle benefits the couple',
      ],
    },
    {
      id: 4,
      title: 'Separation / Breakup Scenario (If Relevant) ',
      iconColor: 'text-brand-primary',
      list: [
        'Who gains and who loses from separation',
        `How each partner experiences the breakup`,
        'Best strategy to separate with minimal emotional damage',
      ],
    },
    {
      id: 5,
      title: 'Red Flags & Maximum Potential',
      iconColor: 'text-brand-primary',
      list: [
        'Red flags the couple must avoid',
        `Areas of maximum growth`,
        'Where to focus energy',
        'What destroys the relationship long-term',
      ],
    },
  ],
  overviews: [
    {
      id: 1,
      title: { label: '90-minute private Session with Lilly', size: '[48px]/[126%]' },
      description: 'A one-on-one strategy session focused entirely on you.Inside this call:',
      list: [
        'We review your personalized reports',
        'You may ask any questions about your situation',
        'You receive clear direction and next steps',
        'We create your personal relationship roadmap',
      ],
    },
    {
      id: 2,
      title: { label: 'Priority Live Case Review With Lily', size: '[48px]/[126%]' },
      subtitle: 'During group calls, your case is prioritized. If you choose to participate:',
      list: [
        'Your relationship is analyzed live',
        'Your compatibility is reviewed',
        'Your questions are answered in real time',
        'You receive personalized guidance',
      ],
    },
  ],

  link: {
    label: 'ENROLL NOW',
    href: '#',
  },
};

export const guidedBreakthroughResultData: IProgramResult = {
  title: 'Precision.',
  description: `The Essentials gives you the map, but you're learning a new language. Without a guide, you will second-guess every application. In this tier, we remove the trial and error. You walk away with absolute certainty on your next move.`,
};

export const guidedBreakthroughItWorksData: IProgramItWorks = {
  description: [
    `I'm not teaching theory. I'm teaching the method I used to decode my own relationship.`,
    `When I met my partner, I ran his chart before our second date. I knew his Hidden Desire, his friction points, and exactly how to position myself as his sanctuary—not his project.`,
    `Four years later, we're building a life most people don't believe is possible. Not because we're "lucky" or "soulmates"—because we speak the same behavioral language.`,
  ],
  subtitle: [
    `The Leelu Method works. `,
    `I've validated it across thousands of behavioral assessments, hundreds of client relationships, then on myself and my own relationship.`,
  ],
  link: {
    label: 'GET PERSONALIZED SUPPORT',
    href: '#',
  },
  imgSrc: '/images/programs/guided-breakthrough/it_worked_for_me.png',
};
