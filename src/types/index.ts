export type Product = {
	id: string;
	title: string;
	name: string;
	description: string;
	price: number;
	currency: string;
};

export type ApiErrorResponse = {
  error?: string;
};
