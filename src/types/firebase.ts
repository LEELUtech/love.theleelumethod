export type SendEmailPayload = {
  firstName: string;
  email: string;
};

export type SendEmailResult = {
  success: boolean;
};

export type FirestoreOfferingDoc = {
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  discount_price?: number;
  currency?: string;
  space_id?: string;
};
