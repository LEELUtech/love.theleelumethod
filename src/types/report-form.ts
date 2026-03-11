export type Path = 'A' | 'B' | 'C' | null;

export interface ReportFormData {
  email: string;
  fullName: string;
  dob: string;
  tier: string;
  path: Path;
  partnerName: string;
  partnerDob: string;
  duration: string;
  consent: boolean;
}
