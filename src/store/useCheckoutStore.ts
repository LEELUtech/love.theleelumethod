import { create } from "zustand";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { ApiErrorResponse } from "@/types";

type CreateIntentPayload = {
	productType: string;
	email?: string;
	birthDate1?: string;
	birthDate2?: string;
};

type UpdateIntentPayload = {
  productType: string;

  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;

  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  birthDate1?: string;
  birthDate2?: string;
};

type CreateIntentResp = { clientSecret: string; intentId: string };
type UpdateIntentResp = {
  ok: boolean;
  intentId: string;
  metadata?: Record<string, string>;
};

type CheckoutStatus =
	| "idle"
	| "creating"
	| "ready"
	| "processing"
	| "success"
	| "error";

type CheckoutState = {
	clientSecret: string | null;
	intentId: string | null;
	status: CheckoutStatus;
	error: string | null;
	intentKey: string | null;

	createIntent: (payload: CreateIntentPayload) => Promise<string>;
	updateIntent: (payload: UpdateIntentPayload) => Promise<void>;
	markProcessing: () => void;
	markSuccess: () => void;
	setError: (msg: string | null) => void;
	reset: () => void;
};

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
	clientSecret: null,
	intentId: null,
	status: "idle",
	error: null,
	intentKey: null,

	createIntent: async (payload) => {
		const { status, intentKey } = get();

		const nextKey = `${payload.productType}:${payload.email ?? ""}:${payload.birthDate1 ?? ""}:${payload.birthDate2 ?? ""}`;

		if (status === "ready" && get().clientSecret && intentKey === nextKey) {
			return get().clientSecret!;
		}

		if (status === "creating" && intentKey === nextKey) {
			throw new Error("Payment is already initializing");
		}

		set({
			status: "creating",
			error: null,
			intentKey: nextKey,
			clientSecret: null,
			intentId: null,
		});

		try {
			const { data } = await api.post<CreateIntentResp>(
				"/api/create-payment-intent",
				payload,
			);

			if (!data?.clientSecret) throw new Error("No clientSecret returned");

			set({
				clientSecret: data.clientSecret,
				intentId: data.intentId,
				status: "ready",
			});
			return data.clientSecret;
		} catch (e) {
			const axiosError = e as AxiosError<ApiErrorResponse>;
			const msg =
				axiosError.response?.data?.error ||
				axiosError.message ||
				"Failed to create intent";

			set({ status: "error", error: msg, clientSecret: null, intentId: null });
			throw new Error(msg);
		}
	},
	updateIntent: async (payload) => {
		const { intentId } = get();
		if (!intentId)
			throw new Error("No intentId in store. Create intent first.");

		await api.post<UpdateIntentResp>("/api/update-payment-intent", {
			intentId,
			...payload
		});
	},

	markProcessing: () => set({ status: "processing" }),
	markSuccess: () => set({ status: "success" }),
	setError: (msg) => set({ error: msg, status: msg ? "error" : get().status }),

	reset: () =>
		set({
			clientSecret: null,
			intentId: null,
			status: "idle",
			error: null,
			intentKey: null,
		}),
}));
