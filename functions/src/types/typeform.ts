export enum PATH {
  A = "A",
  B = "B",
  C = "C",
}

export enum TypeFormError {
  INVALID_EMAIL = "INVALID_EMAIL",
  MISSING_FIELDS = "MISSING REQUIRED FIELDS",
  MISSING_TIER = "MISSING_TIER",
  FORM_SUBMITTED = "FORM_SUBMITTED",
}

export const PATH_LABELS = {
  [PATH.A]: "Path A",
  [PATH.B]: "Path B",
  [PATH.C]: "Path C",
};

export enum CIRCLE_TIER {
  ESSENTIALS = "Essentials",
  GUIDED = "Guided",
  VIP = "VIP",
}

export const TIER_LABELS = {
  [CIRCLE_TIER.ESSENTIALS]: "The Essentials",
  [CIRCLE_TIER.GUIDED]: "Guided Breakthrough",
  [CIRCLE_TIER.VIP]: "VIP Immersion",
};

export interface TypeformWebhookRequest {
  email: string;
  fullName: string;
  dob: string;
  // tier: TIER;
  path: PATH;
  partnerName?: string;
  partnerDob?: string;
  duration?: string;
  consent: boolean;
  submittedAt: string;
}

/// Essentials Guided VIP
