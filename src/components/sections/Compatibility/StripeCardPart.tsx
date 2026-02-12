"use client";

import * as React from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeError } from "@stripe/stripe-js";
import { useCheckoutStore } from "@/store/useCheckoutStore";

const stripeElementOptions = {
  style: {
    base: {
      fontFamily: "Lato, sans-serif",
      fontSize: "16px",
      color: "#757986",
      "::placeholder": { color: "#757986" },
    },
    invalid: { color: "#dc2626" },
  },
};

const fieldClass =
  "w-full rounded-[6px] border border-[#C3C6D1] bg-white px-[18px] py-[10px] font-lato font-normal text-body text-[#757986] outline-none";

type StripeErrorWithPI = StripeError & { payment_intent?: { status?: string } };
function hasPaymentIntent(err: StripeError): err is StripeErrorWithPI {
  return typeof (err as StripeErrorWithPI).payment_intent === "object";
}

export type StripePayState = {
  canPay: boolean;
  paying: boolean;
  error: string | null;
  cardError: string | null;
};

type Props = {
  clientSecret: string;
  productType: string;

  email: string;
  emailValid: boolean;
  birthDate1: string;
  birthDate2: string;

  onSuccess: () => void;
  onRegisterPay?: (payFn: () => Promise<void>) => void;
  onStateChange?: (state: StripePayState) => void;
};

export function StripeCardPart({
  clientSecret,
  productType,
  email,
  emailValid,
  birthDate1,
  birthDate2,
  onSuccess,
  onRegisterPay,
  onStateChange,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const updateIntent = useCheckoutStore((s) => s.updateIntent);

  const [paying, setPaying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cardError, setCardError] = React.useState<string | null>(null);
  const [cardComplete, setCardComplete] = React.useState(false);
  const [expComplete, setExpComplete] = React.useState(false);
  const [cvcComplete, setCvcComplete] = React.useState(false);

  const lockRef = React.useRef(false);

  const canPay =
    !!stripe &&
    !!elements &&
    !paying &&
    emailValid &&
    !!birthDate1 &&
    !!birthDate2 &&
    cardComplete &&
    expComplete &&
    cvcComplete &&
    !cardError;

  // Handles payment submission with Stripe
  const onPay = React.useCallback(async () => {
    if (!stripe || !elements || lockRef.current) return;

    if (!emailValid) return setError("Please enter a valid email.");
    if (!birthDate1 || !birthDate2) return setError("Please select both birthdates.");
    if (!cardComplete || !expComplete || !cvcComplete)
      return setError("Please complete your card details.");
    if (cardError) return setError(cardError);

    lockRef.current = true;
    setPaying(true);
    setError(null);

    try {
      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) {
        setError("Card field is not ready yet.");
        return;
      }

      // 1) update metadata BEFORE confirming (server-side)
      await updateIntent({
        productType,
        email,
        birthDate1,
        birthDate2,
      });

      // 2) confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumber,
            billing_details: { email: email.trim() || undefined },
          },
        },
      );

      if (confirmError) {
        const piStatus = hasPaymentIntent(confirmError)
          ? confirmError.payment_intent?.status
          : undefined;

        if (
          confirmError.code === "payment_intent_unexpected_state" &&
          piStatus === "succeeded"
        ) {
          onSuccess();
          return;
        }

        setError(confirmError.message || "Payment failed");
        return;
      }

      if (paymentIntent?.status === "succeeded") onSuccess();
      else setError("Payment not completed. Please try again.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Payment failed.");
    } finally {
      lockRef.current = false;
      setPaying(false);
    }
  }, [
    stripe,
    elements,
    clientSecret,
    updateIntent,
    productType,
    email,
    emailValid,
    birthDate1,
    birthDate2,
    cardComplete,
    expComplete,
    cvcComplete,
    cardError,
    onSuccess,
  ]);

  React.useEffect(() => {
    onRegisterPay?.(onPay);
  }, [onRegisterPay, onPay]);

  React.useEffect(() => {
    onStateChange?.({ canPay, paying, error, cardError });
  }, [canPay, paying, error, cardError, onStateChange]);

  return (
    <div className="mt-4 space-y-3">
      <div className={fieldClass}>
        <CardNumberElement
          options={{ ...stripeElementOptions, placeholder: "Card number" }}
          onChange={(e) => {
            setCardComplete(!!e.complete);
            setCardError(e.error?.message ?? null);
            if (error) setError(null);
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={fieldClass}>
          <CardExpiryElement
            options={{ ...stripeElementOptions, placeholder: "MM / YY" }}
            onChange={(e) => {
              setExpComplete(!!e.complete);
              if (error) setError(null);
            }}
          />
        </div>

        <div className={fieldClass}>
          <CardCvcElement
            options={{ ...stripeElementOptions, placeholder: "CVC" }}
            onChange={(e) => {
              setCvcComplete(!!e.complete);
              if (error) setError(null);
            }}
          />
        </div>
      </div>

      {cardError ? <p className="mt-1 text-xs text-red-600">{cardError}</p> : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
