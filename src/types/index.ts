import { btnStyleKeyType } from "@/components/ui/button";

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date | null;
  gender: string;
  phoneNumber: string;
  videoId?: string;
  programId?: string;
  createdAt?: string;
};

export type ProgramType = {
  id: string;
  mobileUrl: string;
  webUrl: string;
  mobileUrlM?: string;
  webUrlM?: string;
  femaleQuotes: string[];
  maleQuotes: string[];
};

export type OrderItemType = {
  id: string;
  title: string;
  price: number;
  image: string;
  selected: boolean;
  selectedStyle: string;
};

export type ProductType = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  discover: string[];
  imageUrl: string;
  price: string;
  backgroundImg: string;
  btnStyleKey?: btnStyleKeyType;
  cardColor?: string;
  smallImageUrl?: string;
};

export type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  zohoId: string;
};

export interface Referral {
  id: string;
  code: string;
  value: number;
  agentId: string;
  createdAtMs?: number;
}
