import { ReportFormData } from '@/types/report-form';

export enum TIER {
  ESSENTIALS = 'Essentials',
  GUIDED = 'Guided',
  VIP = 'VIP',
}

export const initialReportForm: ReportFormData = {
  email: '',
  fullName: '',
  dob: '',
  // tier: '',
  path: null,
  partnerName: '',
  partnerDob: '',
  duration: '',
  consent: false,
};

export const PATH_OPTIONS = [
  {
    value: 'A' as const,
    label: "I'm going through a breakup",
    desc: "I recently ended a relationship or I'm in the process of separating. I want to understand why it didn't work and how to move forward.",
  },
  {
    value: 'B' as const,
    label: "I'm in a relationship",
    desc: "I'm currently with a partner. I want to decode our dynamic, understand what we both need, and strengthen the connection.",
  },
  {
    value: 'C' as const,
    label: "I'm single and looking",
    desc: "I'm not in a relationship right now. I want to understand my patterns, clear what's blocking me, and attract the right partner.",
  },
];

export const TIER_OPTIONS = [
  { value: TIER.ESSENTIALS, label: 'The Essentials' },
  { value: TIER.GUIDED, label: 'Guided Breakthrough' },
  { value: TIER.VIP, label: 'VIP Immersion' },
];

export const DURATION_OPTIONS = [
  { value: 'lt_6m', label: 'Less than 6 months' },
  { value: '6m_1y', label: '6 months - 1 year' },
  { value: '1y_3y', label: '1-3 years' },
  { value: '3y_5y', label: '3-5 years' },
  { value: '5y_plus', label: '5+ years' },
];
