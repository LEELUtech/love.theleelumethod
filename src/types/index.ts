export type Product = {
  id: string;
  title: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  currency: string;
  space_id?: string;
  hide_installments?: boolean;
};

export type ApiErrorResponse = {
  error?: string;
};

export * from "./checkout";
export * from "./circle";
export * from "./forms";
export * from "./firebase";
