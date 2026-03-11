export enum PATH {
  A = "A",
  B = "B",
  C = "C",
}

export enum TypeFormError {
  INVALID_EMAIL = "INVALID_EMAL",
  MISSING_FIELDS = "MISSING REQUIRED FIELDS",
}

export const PATH_LABELS = {
  [PATH.A]: "Path A",
  [PATH.B]: "Path B",
  [PATH.C]: "Path C",
};

export enum TIER {
  ESSENTIALS = "essentials",
  GUIDED = "guided_breakthrough",
  VIP = "guided_vip_immersionbreakthrough",
}

export const TIER_LABELS = {
  [TIER.ESSENTIALS]: "The Essentials",
  [TIER.GUIDED]: "Guided Breakthrough",
  [TIER.VIP]: "VIP Immersion",
};

export interface TypeformWebhookRequest {
  email: string;
  fullName: string;
  dob: string;
  tier: TIER;
  path: PATH;
  partnerName?: string;
  partnerDob?: string;
  duration?: string;
  consent: boolean;
  submittedAt: string;
}

/// Essentials Guided VIP
