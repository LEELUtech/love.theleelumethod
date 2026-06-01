"use client";

import * as React from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { PaymentRequest, PaymentRequestPaymentMethodEvent, StripeError } from "@stripe/stripe-js";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { getStoredLastUTM } from "@/utils/utm-tracker";
import { salesiqIdentify } from "@/lib/tracking/salesiqIdentify";

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
  amountCents: number;

  firstName: string;
  email: string;
  emailValid: boolean;
  phone?: string;
  birthDate1: string;
  birthDate2: string;

  onSuccess: () => void;
  onRegisterPay?: (payFn: () => Promise<void>) => void;
  onStateChange?: (state: StripePayState) => void;
};

export function StripeCardPart({
  clientSecret,
  productType,
  amountCents,
  firstName,
  email,
  emailValid,
  phone,
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

  // ── Apple Pay ──────────────────────────────────────────────────────────────
  const [paymentRequest, setPaymentRequest] = React.useState<PaymentRequest | null>(null);
  const [canApplePay, setCanApplePay] = React.useState(false);
  const prInitialized = React.useRef(false);

  const birthDatesReady = !!birthDate1 && !!birthDate2;

  React.useEffect(() => {
    if (!stripe || !amountCents || prInitialized.current) return;
    prInitialized.current = true;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: { label: "Compatibility Report", amount: amountCents },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setCanApplePay(true);
      }
    });

    return () => { prInitialized.current = false; };
  }, [stripe, amountCents]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!paymentRequest || !stripe) return;

    const handlePaymentMethod = async (event: PaymentRequestPaymentMethodEvent) => {
      if (!birthDate1 || !birthDate2) {
        event.complete("fail");
        setError("Please select both birth dates before paying with Apple Pay.");
        return;
      }

      try {
        const utm = getStoredLastUTM();
        const nameParts = (event.payerName ?? "").trim().split(/\s+/);
        const appleFirstName = nameParts[0] ?? firstName;
        const addr = event.paymentMethod.billing_details.address;

        salesiqIdentify({
          email: event.payerEmail ?? undefined,
          firstName: appleFirstName || undefined,
          phone: event.payerPhone ?? undefined,
        });

        await updateIntent({
          productType,
          firstName: appleFirstName,
          email: event.payerEmail ?? email,
          phone: event.payerPhone ?? phone,
          birthDate1,
          birthDate2,
          address1: addr?.line1 ?? undefined,
          city: addr?.city ?? undefined,
          state: addr?.state ?? undefined,
          postalCode: addr?.postal_code ?? undefined,
          country: addr?.country ?? undefined,
          utmSource: utm?.utm_source,
          utmMedium: utm?.utm_medium,
          utmCampaign: utm?.utm_campaign,
          utmContent: utm?.utm_content,
          utmTerm: utm?.utm_term,
        });
      } catch {
        event.complete("fail");
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: event.paymentMethod.id },
        { handleActions: false },
      );

      if (confirmError) {
        event.complete("fail");
        setError(confirmError.message ?? "Payment failed");
        return;
      }

      event.complete("success");

      if (paymentIntent?.status === "requires_action") {
        const { error: actionError } = await stripe.confirmCardPayment(clientSecret);
        if (actionError) {
          setError(actionError.message ?? "Payment failed");
          return;
        }
        onSuccess();
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess();
      } else {
        setError("Payment not completed. Please try again.");
      }
    };

    paymentRequest.on("paymentmethod", handlePaymentMethod);
    return () => { paymentRequest.off("paymentmethod", handlePaymentMethod); };
  }, [paymentRequest, stripe, clientSecret, productType, firstName, email, phone, birthDate1, birthDate2, updateIntent, onSuccess]);
  // ── End Apple Pay ──────────────────────────────────────────────────────────

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
      const utm = getStoredLastUTM();

      salesiqIdentify({ email, firstName });

      await updateIntent({
        productType,
        firstName,
        email,
        phone,
        birthDate1,
        birthDate2,

        // last-touch UTM
        utmSource: utm?.utm_source,
        utmMedium: utm?.utm_medium,
        utmCampaign: utm?.utm_campaign,
        utmContent: utm?.utm_content,
        utmTerm: utm?.utm_term,
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
    firstName,
    email,
    emailValid,
    phone,
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
    <div>
      {canApplePay && paymentRequest ? (
        <div className="mb-4">
          {!birthDatesReady ? (
            <p className="mb-3 font-lato text-[12px] text-[#9B9DA8]">
              Fill in both birth dates above to pay with Apple Pay.
            </p>
          ) : null}
          <div style={{ opacity: birthDatesReady ? 1 : 0.4, pointerEvents: birthDatesReady ? 'auto' : 'none' }}>
            <PaymentRequestButtonElement
              options={{
                paymentRequest,
                style: {
                  paymentRequestButton: {
                    type: "default",
                    theme: "dark",
                    height: "48px",
                  },
                },
              }}
            />
          </div>
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#DADDE4]" />
            <span className="font-lato text-[12px] uppercase tracking-widest text-[#9B9DA8]">or pay with card</span>
            <div className="h-px flex-1 bg-[#DADDE4]" />
          </div>
        </div>
      ) : null}

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
    </div>
  );
}
