import { QUIZ_URL, WEBINAR_URL } from '@/utils/constants';

export interface ILink {
  label: string;
  href: string;
}

type RecordLink = Record<string, ILink>;

export const RESOURCES_LINKS: RecordLink = {
  SECRETS_LINK: {
    label: 'DOWNLOAD FREE GUIDE',
    href: '/resources/secrets',
  },
  COMPATIBILITY_LINK: {
    label: 'GET THE REPORT',
    href: '/resources/compatibility-report',
  },
  QUIZ_LINK: {
    label: 'START QUIZ',
    href: QUIZ_URL,
  },
  DECODED_LINK: {
    label: 'Save My Seat',
    href: '#',
  },
};

export const SECRETS_LINKS: RecordLink = {
  ACCESS_LINK: {
    label: 'ACCESS THE FREE GUIDE',
    href: '#hero',
  },
  CLAIM_LINK: {
    label: 'CLAIM YOUR FREE GUIDE',
    href: '#hero',
  },
};

export const DESCODE_LINKS: RecordLink = {
  HERO_LINK: {
    label: 'Save My Seat',
    href: WEBINAR_URL,
  },
  RESERVE_LINK: {
    label: 'Reserve My Spot',
    href: WEBINAR_URL,
  },
  REGISTER_LINK: {
    label: 'REGISTER NOW',
    href: WEBINAR_URL,
  },
  FOOTER_PROMO_LINK: {
    label: 'Save My Seat',
    href: WEBINAR_URL,
  },
};

export const COMPABILITY_REPORT_LINKS: RecordLink = {
  HERO_LINK: {
    label: 'GIVE ME MY COMPATIBILITY CODE REPORT',
    href: '#checkout',
  },
  PROBLEM_LINK: {
    label: 'GIVE ME MY COMPATIBILITY CODE REPORT',
    href: '#checkout',
  },
  UNLOCK_LINK: {
    label: 'UNLOCK MY COMPATIBILITY CODE - $3.33',
    href: '#',
  },
  FOOTER_PROMO_LINK: {
    label: 'GIVE ME MY COMPATIBILITY CODE REPORT',
    href: '#checkout',
  },
};

export const ABOUT_LINKS: RecordLink = {
  HERO_LINK: {
    label: 'START THE DECODE',
    href: '/decode',
  },
  FRACTURE_LINK: {
    label: 'START THE DECODE',
    href: '/decode',
  },
  SYNTHESIS_LINK: {
    label: 'START THE DECODE',
    href: '/decode',
  },
  STOP_GUESSING_LINK: {
    label: 'Access your Operating Manual',
    href: '#',
  },
};

export const PROGRAMS_LINKS: RecordLink = {
  HERO_LINK: {
    label: 'ENROLL NOW',
    href: '#pricing',
  },
  BLIND_LINK: {
    label: 'READ MORE TESTIMONIALS',
    href: '#stories', // Stories
  },
  PROTOCOL_LINK: {
    label: 'INITIATE THE PROTOCOL',
    href: '/programs/self-guided-transformation',
  },
  SELF_GUIDED_LINK: {
    label: 'BEGIN THE PROTOCOL',
    href: '/programs/self-guided-transformation',
  },
  BREAKTHROUGH_LINK: {
    label: 'GET PERSONALIZED SUPPORT',
    href: '/programs/guided-breakthrough',
  },
  VIP_LINK: {
    label: 'APPLY FOR VIP ACCESS',
    href: '/programs/vip-immersion',
  },
  PROTOCOL_ESSENTIALS_LINK: {
    label: 'BEGIN PROTOCOL',
    href: '/programs/self-guided-transformation#checkout',
  },
  PROTOCOL_BREAKTHROUGH_LINK: {
    label: 'BREAK THROUGH',
    href: '/programs/guided-breakthrough#checkout',
  },
  PROTOCOL_VIP_LINK: {
    label: 'APPLY FOR VIP',
    href: '/programs/vip-immersion#checkout',
  },
  FOOTER_PROMO_LINK: {
    label: 'ACCESS THE PROTOCOL',
    href: '/programs/self-guided-transformation',
  },
};

export const HOME_LINKS: RecordLink = {
  HERO_LINK: {
    label: 'START THE DECODE',
    href: '/decode',
  },
  READ_LINK: {
    label: 'READ MORE STORIES',
    href: '#stories',
  },
  QUIZ_LINK: {
    label: 'TAKE THE QUIZ',
    href: QUIZ_URL,
  },
  REGISTER_LINK: {
    label: 'REGISTER FOR MASTERCLASS',
    href: WEBINAR_URL,
  },
  PERSONALIZED_LINK: {
    label: 'GET MY PERSONALIZED REPORT',
    href: '/resources/compatibility-report',
  },
  DECODED_LINK: {
    label: 'Save My Seat',
    href: WEBINAR_URL,
  },
  DECODED_LOVE_LINK: {
    label: 'Save My Seat',
    href: WEBINAR_URL,
  },
  RELATIONSHIP_LINK: {
    label: 'VIEW THE CURRICULUM',
    href: '/programs/self-guided-transformation',
  },
  PROTOCOL_BREAKTHROUGH_LINK: {
    label: 'BREAK THROUGH',
    href: '/programs/guided-breakthrough#checkout',
  },
  FOOTER_PROMO_LINK: {
    label: `YES, I'M IN`,
    href: '#triage-cards',
  },
};

export const ESSENTIALS_LINKS: RecordLink = {
  HERO_LINK: {
    label: 'ENROLL NOW',
    href: '#checkout',
  },
  INSIDE_LINK: {
    label: 'SECURE YOUR SPOT',
    href: '#checkout',
  },
  RESULT_LINK: {
    label: 'BEGIN THE PROTOCOL',
    href: '#checkout',
  },
  WORKED_LINK: {
    label: 'BEGIN THE PROTOCOL',
    href: '#checkout',
  },
  COST_LINK: {
    label: 'DECODE MY RELATIONSHIP',
    href: '#checkout',
  },
  CHECKOUT_LINK: {
    label: 'DECODE MY RELATIONSHIP',
    href: '#checkout',
  },
};

export const GUIDED_BREAKTHROUGH_LINKS: RecordLink = {
  HERO_LINK: {
    label: 'GET PERSONAL',
    href: '#checkout',
  },
  COMPATIBILITY_LINK: {
    label: 'ENROLL NOW',
    href: '#checkout',
  },
  WORKED_LINK: {
    label: 'GET PERSONALIZED SUPPORT',
    href: '#checkout',
  },
  COST_LINK: {
    label: 'CLAIM MY BREAKTHROUGH',
    href: '#checkout',
  },
  CHECKOUT_LINK: {
    label: 'SIGN UP & GET PERSONALIZED SUPPORT',
    href: '#checkout',
  },
};

export const VIP_LINKS: RecordLink = {
  HERO_LINK: {
    label: 'APPLY FOR ACCESS',
    href: '#checkout',
  },
  MECHANICS_LINK: {
    label: 'SECURE YOUR SPOT',
    href: '#checkout',
  },
  RESULT_LINK: {
    label: 'APPLY FOR VIP ACCESS',
    href: '#checkout',
  },
  WHO_LINK: {
    label: 'APPLY FOR VIP ACCESS',
    href: '#checkout',
  },
  CHECKOUT_LINK: {
    label: 'SIGN UP & APPLY FOR VIP ACCESS',
    href: '#checkout',
  },
};

export const ONE_ON_ONE_LINKS: RecordLink = {
  HERO_LINK: {
    label: 'BOOK YOUR SESSION',
    href: '#pricing',
  },
  SINGLE_SESSION_LINK: {
    label: 'BOOK SESSION',
    href: 'https://calendly.com/chystofat/1-1-video-session-with-lily-chystofat',
  },
  THREE_PACKAGE_LINK: {
    label: 'BOOK PACKAGE',
    href: 'https://calendly.com/chystofat/3-single-session-with-lily-chystofat',
  },
  NINE_PACKAGE_LINK: {
    label: 'BOOK PACKAGE',
    href: 'https://calendly.com/chystofat/9-session-pakage-with-lily-chystofat',
  },
  PRIMARY_LINK: {
    label: 'BOOK YOUR SESSION',
    href: '#pricing',
  },
};

export const SUCCESS_LINKS: RecordLink = {
  FOOTER_PROMO_LINK: {
    label: 'SECURE YOUR SEAT TO RESET THE DYNAMIC',
    href: '#',
  },
};
