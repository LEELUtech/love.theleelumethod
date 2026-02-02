"use client";

import * as React from "react";
import axios, { AxiosError } from "axios";
import { api } from "@/lib/api";
import { ApiErrorResponse } from "@/types"

type Payload = {
  productType: string;
  email?: string;
  birthDate1?: string;
  birthDate2?: string;
};

type Resp = {
  clientSecret: string;
  intentId: string;
};

// Hook for creating Stripe PaymentIntent with deduplication
export function useCreatePaymentIntent() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const inFlightRef = React.useRef<Promise<string> | null>(null);

  const create = React.useCallback(async (payload: Payload): Promise<string> => {
    // Prevent duplicate API calls
    if (inFlightRef.current) return inFlightRef.current;

    setLoading(true);
    setError(null);

    const p = (async () => {
      try {
        const cleanPayload: Payload = {
          productType: payload.productType.trim(),
          ...(payload.email ? { email: payload.email.trim() } : {}),
          ...(payload.birthDate1 ? { birthDate1: payload.birthDate1.trim() } : {}),
          ...(payload.birthDate2 ? { birthDate2: payload.birthDate2.trim() } : {}),
        };

        const { data } = await api.post<Resp>(
          "/api/create-payment-intent",
          cleanPayload
        );

        if (!data?.clientSecret) {
          throw new Error("No clientSecret returned");
        }

        return data.clientSecret;
      } catch (e: unknown) {
        let msg = "Failed to create payment intent";

        if (axios.isAxiosError(e)) {
          const ax = e as AxiosError<ApiErrorResponse>;
          msg = ax.response?.data?.error || ax.message;
        } else if (e instanceof Error) {
          msg = e.message;
        }

        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
        inFlightRef.current = null;
      }
    })();

    inFlightRef.current = p;
    return p;
  }, []);

  return { create, loading, error, setError };
}
