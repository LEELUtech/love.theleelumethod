import { create } from "zustand";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import type {
  ApiErrorResponse,
  CreateIntentPayload,
  UpdateIntentPayload,
  CreateIntentResponse,
  UpdateIntentResponse,
  CheckoutStatus,
} from "@/types";

type CheckoutState = {
  clientSecret: string | null;
  intentId: string | null;
  intentToken: string | null;
  status: CheckoutStatus;
  error: string | null;
  intentKey: string | null;
  updateKey: string | null;
  createPromise: Promise<string> | null;
  updatePromise: Promise<void> | null;
  createIntent: (payload: CreateIntentPayload) => Promise<string>;
  updateIntent: (payload: UpdateIntentPayload) => Promise<void>;
  markProcessing: () => void;
  markSuccess: () => void;
  setError: (msg: string | null) => void;
  reset: () => void;
};

// Generates unique key for create intent deduplication
function buildCreateKey(productType: string) {
  return `create:${productType}`;
}

// Normalizes string value
function norm(v?: string) {
  return (v ?? "").trim();
}

// Normalizes and lowercases string
function normLower(v?: string) {
  return norm(v).toLowerCase();
}

// Generates unique key from all update intent params for deduplication
function buildUpdateKey(p: UpdateIntentPayload, intentId: string, intentToken: string) {
  return [
    "update",
    intentId,
    intentToken,
    p.productType,
    normLower(p.email),
    norm(p.firstName),
    norm(p.lastName),
    norm(p.phone),
    norm(p.address1),
    norm(p.address2),
    norm(p.city),
    norm(p.state),
    norm(p.postalCode),
    norm(p.country).toUpperCase(),
    norm(p.birthDate1),
    norm(p.birthDate2),
    // Phase 2: Include UTM params in deduplication key
    norm(p.utmSource),
    norm(p.utmMedium),
    norm(p.utmCampaign),
    norm(p.utmContent),
    norm(p.utmTerm),
    norm(p.checkoutVariant),
    norm(p.pagePath),
  ].join("|");
}

// Extracts error message from Axios error
function getAxiosMsg(e: unknown, fallback: string) {
  const axiosError = e as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.error || axiosError.message || fallback;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  clientSecret: null,
  intentId: null,
  intentToken: null,

  status: "idle",
  error: null,

  intentKey: null,
  updateKey: null,

  createPromise: null,
  updatePromise: null,

  // Creates Stripe PaymentIntent with deduplication
  createIntent: async ({ productType }) => {
    const { status, intentKey, clientSecret, createPromise } = get();
    const nextKey = buildCreateKey(productType);

    // reuse if already ready for same product
    if (status === "ready" && clientSecret && intentKey === nextKey) {
      return clientSecret;
    }

    // if create already running for same key -> await it
    if (status === "creating" && intentKey === nextKey && createPromise) {
      return await createPromise;
    }

    // start new create
    set({
      status: "creating",
      error: null,
      intentKey: nextKey,
      updateKey: null,

      clientSecret: null,
      intentId: null,
      intentToken: null,

      updatePromise: null,
    });

    const p = (async () => {
      try {
        const { data } = await api.post<CreateIntentResponse>("/api/create-payment-intent", {
          productType,
        });

        if (!data?.clientSecret) throw new Error("No clientSecret returned");
        if (!data?.intentId) throw new Error("No intentId returned");
        if (!data?.intentToken) throw new Error("No intentToken returned");

        set({
          clientSecret: data.clientSecret,
          intentId: data.intentId,
          intentToken: data.intentToken,
          status: "ready",
          createPromise: null,
        });

        return data.clientSecret;
      } catch (e) {
        const msg = getAxiosMsg(e, "Failed to create intent");
        set({
          status: "error",
          error: msg,
          clientSecret: null,
          intentId: null,
          intentToken: null,
          createPromise: null,
        });
        throw new Error(msg);
      }
    })();

    set({ createPromise: p });
    return await p;
  },

  // Updates PaymentIntent with billing data (deduplication by content)
  updateIntent: async (payload) => {
    const { intentId, intentToken, updateKey, updatePromise } = get();
    if (!intentId) throw new Error("No intentId in store. Create intent first.");
    if (!intentToken) throw new Error("No intentToken in store. Create intent first.");

    const nextKey = buildUpdateKey(payload, intentId, intentToken);

    // already updated with exactly same data -> skip
    if (updateKey === nextKey) return;

    // if update already running -> await it
    if (updatePromise) {
      await updatePromise;
      if (get().updateKey === nextKey) return;
    }

    set({ status: "updating", error: null });

    const p = (async () => {
      try {
        await api.post<UpdateIntentResponse>("/api/update-payment-intent", {
          intentId,
          intentToken,
          ...payload,
        });

        set({ status: "ready", updateKey: nextKey, updatePromise: null });
      } catch (e) {
        const msg = getAxiosMsg(e, "Failed to update intent");
        set({ status: "error", error: msg, updatePromise: null });
        throw new Error(msg);
      }
    })();

    set({ updatePromise: p });
    await p;
  },

  markProcessing: () => set({ status: "processing" }),
  markSuccess: () => set({ status: "success" }),

  setError: (msg) =>
    set((s) => ({
      error: msg,
      status: msg ? "error" : s.status,
    })),

  reset: () =>
    set({
      clientSecret: null,
      intentId: null,
      intentToken: null,
      status: "idle",
      error: null,
      intentKey: null,
      updateKey: null,
      createPromise: null,
      updatePromise: null,
    }),
}));
