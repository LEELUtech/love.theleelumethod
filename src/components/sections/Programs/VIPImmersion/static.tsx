import { VIP_LINKS } from '@/static/links';
import { IProgramsHero } from '../components/hero';
import { IProgramItWorks } from '../components/it-works';
import { IProgramsReceive } from '../components/receive';
import { IProgramResult } from '../components/result';
import { IProgramsWhoThis } from '../components/who-this';
import { IVIPImmersionOverview } from './Overwie';
const { HERO_LINK, RESULT_LINK } = VIP_LINKS;

export const vipImmersionHeroData: IProgramsHero = {
  title: 'THE VIP IMMERSION',
  imgSrc: '/images/lily/lily_4.png',
  subtitle: `Immediate Intervention. Permanent Reconstruction.`,
  content: `For the woman who needs the problem solved immediately. Real-time access. Deep-tissue deprogramming..`,
  link: HERO_LINK,
};

export const vipImmersionWhoThisData: IProgramsWhoThis = {
  title: 'WHO THIS IS FOR:',
  items: [
    {
      id: 1,
      icon: 'star',
      title: 'IN A RELATIONSHIP:',
      text: `The papers are on the table. Infidelity has happened. The trust is gone. You need a targeted intervention. You need to know if this can be saved, and you need a mediator who speaks "Code."`,
    },
    {
      id: 2,
      icon: 'star',
      title: 'LOOKING:',
      text: `You operate at a level where a bad match isn't just heartbreak—it's a liability. You want a professional profiler to vet your options and architect your love life with the same rigor you apply to your business.`,
    },

    {
      id: 3,
      icon: 'necktie',
      title: 'IN CRISIS:',
      text: `You're in freefall. Your nervous system is overwhelmed. You cannot function at work or at home. You need a stabilizer—someone to hold the frequency while you rebuild.`,
    },
  ],
  imgSrc: '/images/programs/vip-immersion/who_this.png',
};

export const vipImmersionModuleData: IProgramsReceive = {
  receive: {
    title: 'WHAT YOU RECEIVE',
    subtitle:
      'Everything in Guided Breakthrough—plus deeper private access, a full partner audit, and a step-by-step relationship plan built around your exact situation.',
  },
  module: {
    title: 'EVERYTHING IN GUIDED BREAKTHROUGH',
    list: [
      '12-step video program',
      'Workbook & written assignments',
      'Homework reviewed personally by Lily',
      'Personalized Reports calculated with The Leelu Method:',
      'Energy Activation Report',
      'His Secret Desires Report',
      'Extended Compatibility Blueprint (Couple Dynamics)',
      '2 live group Q&A calls during the program',
      '60-day community support inside Circle',
      '3 months of monthly live Q&A calls with Lily',
      'Full personal numerology decoding (your codes)',
      '90-minute private session with Lily',
      'Priority live case review with Lily during group calls',
    ],
    subtitle: {
      highlight: 'PLUS:',
      content: 'Your VIP Layer',
    },
  },
};

export const vipImmersionOverviewData: IVIPImmersionOverview[] = [
  {
    id: 1,
    title: 'Four Private Sessions In One Month',
    subtitle: 'A full month of private work with Lily:',
    list: ['1 x 90-minute session', '3 x 60-minute sessions'],
    description: ['Use sessions for:'],
    imgSrc: '/images/lily/lily_14.png',
    additional_list: [
      'Your personal situation',
      `Your partner's decoding`,
      'A joint session with your partner (if appropriate)',
      'A crisis plan, rebuilding plan, or separation strategy—depending on your case',
    ],
  },

  {
    id: 2,
    title: 'VIP Priority & Step-By-Step Action Plan',
    description: [
      'VIP means Lily fully immerses into your situation and builds a clear roadmap.',
      'Depending on your case, you receive:',
    ],
    isReversed: true,
    imgSrc: '/images/lily/lily_13.png',
    additional_list: [
      'A step-by-step plan to restore connection and passion',
      `Strategy to avoid conflicts and de-escalate situations`,
      'Guidance on what to say, what to do, and what to stop doing',
      'Clarity on whether to rebuild, reset, or release the relationship',
    ],
    subtitle_bottom: 'This is deep personal navigation—designed for fast transformation.',
  },
];

export const vipImmersionResultData: IProgramResult = {
  title: 'Permanent Shift.',
  description: `This is not a repair job; it is a demolition and a rebuild. We do not patch the cracks; we pour a new foundation. You get the highest level of access to ensure you never return to the old version of your life.`,
  investment: 4_997,
  link: RESULT_LINK,
};

export const vipImmersionItWorksData: IProgramItWorks = {
  description: [
    `This isn't academic theory. It's the exact system I used to engineer success in my own relationship.`,
    `I ran my partner’s chart before our second date. I identified his Hidden Desire in twenty minutes—the emotional driver most women spend years trying to guess. I knew which behaviors would trigger his desire, which would make me irreplaceable, and exactly how to navigate conflict before it happened.`,
    `Four years later, we have what my clients call "unicorn love." Not luck. Not chemistry. Code-level compatibility engineered from day one.`,
  ],
  subtitle: [
    `The Leelu Method works.`,
    `I've validated it across 11,500 behavioral assessments, hundreds of client relationships, then on my own life and relationship.`,
  ],

  imgSrc: '/images/programs/vip-immersion/it_worked_for_me.png',
};
