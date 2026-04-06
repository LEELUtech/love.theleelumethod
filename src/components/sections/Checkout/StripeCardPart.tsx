// components/sections/Checkout/StripeCardPart.tsx
'use client';

import * as React from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeError } from '@stripe/stripe-js';
import type { BillingForm } from '@/helpers/checkout';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import Button from '@/components/ui/Button';
import { getStoredLastUTM } from '@/utils/utm-tracker';
import { salesiqIdentify } from '@/lib/tracking/salesiqIdentify';

const stripeElementOptions = {
  style: {
    base: {
      fontFamily: 'Lato, sans-serif',
      fontSize: '16px',
      color: '#757986',
      '::placeholder': { color: '#757986' },
    },
    invalid: { color: '#dc2626' },
  },
};

const fieldClass =
  'w-full rounded-[6px] border border-[#C3C6D1] bg-white px-[18px] py-[10px] font-lato font-normal text-body text-[#757986] outline-none';

type StripeErrorWithPI = StripeError & { payment_intent?: { status?: string } };
function hasPaymentIntent(err: StripeError): err is StripeErrorWithPI {
  return typeof (err as StripeErrorWithPI).payment_intent === 'object';
}

type CheckoutCtx = {
  site?: string;
  pagePath?: string;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

type Props = {
  clientSecret: string;
  productType: string;
  billing: BillingForm;

  ctx?: CheckoutCtx;

  onSubmitAttempt: () => boolean;
  onSuccess: () => void;

  productName?: string;
  priceLabel: string;
  firstPaymentLabel?: string;
  loading: boolean;
  buttonText?: string;
  webinarDiscount?: boolean;
};

export function StripeCardPart({
  clientSecret,
  productType,
  billing,
  ctx,

  onSubmitAttempt,
  onSuccess,

  productName,
  priceLabel,
  firstPaymentLabel,
  loading,
  buttonText = 'SIGN UP NOW',
  webinarDiscount,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const updateIntent = useCheckoutStore((s) => s.updateIntent);

  const [paying, setPaying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const lockRef = React.useRef(false);

  const [cardComplete, setCardComplete] = React.useState(false);
  const [expComplete, setExpComplete] = React.useState(false);
  const [cvcComplete, setCvcComplete] = React.useState(false);
  const [cardError, setCardError] = React.useState<string | null>(null);

  const canPay = !!stripe && !!elements && !paying && cardComplete && expComplete && cvcComplete && !cardError;

  const onPay = async () => {
    const ok = onSubmitAttempt();
    if (!ok) {
      setError('Please fill in all required billing fields.');
      return;
    }

    if (!stripe || !elements || lockRef.current) return;

    if (!cardComplete) return setError('Please enter a valid card number.');
    if (!expComplete) return setError('Please enter a valid expiry date.');
    if (!cvcComplete) return setError('Please enter a valid CVC.');
    if (cardError) return setError(cardError);

    lockRef.current = true;
    setPaying(true);
    setError(null);

    try {
      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) {
        setError('Card field is not ready yet.');
        return;
      }

      // update-intent BEFORE confirmCardPayment (LAST touch)
      try {
        const utm = getStoredLastUTM();

        const ctxSafe: CheckoutCtx = ctx || {};
        const emailNorm = (billing.email || '').trim().toLowerCase();

        salesiqIdentify({
          email: (billing.email || '').trim().toLowerCase() || undefined,
          firstName: (billing.firstName || '').trim() || undefined,
          lastName: (billing.lastName || '').trim() || undefined,
          phone: (billing.phone || '').trim() || undefined,
        });

        await updateIntent({
          ...ctxSafe,

          productType,
          email: emailNorm,
          firstName: billing.firstName,
          lastName: billing.lastName,
          phone: billing.phone,

          address1: billing.address1,
          address2: billing.address2,
          city: billing.city,
          state: billing.state,
          postalCode: billing.postalCode,
          country: billing.country,

          utmSource: utm?.utm_source,
          utmMedium: utm?.utm_medium,
          utmCampaign: utm?.utm_campaign,
          utmContent: utm?.utm_content,
          utmTerm: utm?.utm_term,

          installment: firstPaymentLabel ? '1' : undefined,
          webinarDiscount: webinarDiscount || undefined,
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to update payment info. Please try again.';
        setError(msg);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            email: (billing.email || '').trim() || undefined,
            name: `${billing.firstName ?? ''} ${billing.lastName ?? ''}`.trim() || undefined,
            phone: (billing.phone || '').trim() || undefined,
            address: {
              line1: (billing.address1 || '').trim() || undefined,
              line2: (billing.address2 || '').trim() || undefined,
              city: (billing.city || '').trim() || undefined,
              state: (billing.state || '').trim() || undefined,
              postal_code: (billing.postalCode || '').trim() || undefined,
              country: (billing.country || '').trim().toUpperCase() || undefined,
            },
          },
        },
      });

      if (confirmError) {
        const piStatus = hasPaymentIntent(confirmError) ? confirmError.payment_intent?.status : undefined;

        if (confirmError.code === 'payment_intent_unexpected_state' && piStatus === 'succeeded') {
          onSuccess();
          return;
        }

        setError(confirmError.message || 'Payment failed');
        return;
      }

      if (paymentIntent?.status === 'succeeded') onSuccess();
      else setError('Payment not completed. Please try again.');
    } finally {
      lockRef.current = false;
      setPaying(false);
    }
  };

  return (
    <>
      <div className='mt-4 space-y-3'>
        <div className={fieldClass}>
          <CardNumberElement
            options={{ ...stripeElementOptions, placeholder: 'Card number' }}
            onChange={(e) => {
              setCardComplete(!!e.complete);
              setCardError(e.error?.message ?? null);
              if (error) setError(null);
            }}
          />
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className={fieldClass}>
            <CardExpiryElement
              options={{ ...stripeElementOptions, placeholder: 'MM / YY' }}
              onChange={(e) => {
                setExpComplete(!!e.complete);
                if (error) setError(null);
              }}
            />
          </div>

          <div className={fieldClass}>
            <CardCvcElement
              options={{ ...stripeElementOptions, placeholder: 'CVC' }}
              onChange={(e) => {
                setCvcComplete(!!e.complete);
                if (error) setError(null);
              }}
            />
          </div>
        </div>

        {cardError ? <p className='mt-1 text-xs text-red-600'>{cardError}</p> : null}
        {error ? <p className='mt-1 text-xs text-red-600'>{error}</p> : null}
      </div>

      <div className='mt-[56px] md:mt-[56px] lg:mt-[94px]'>
        <h4 className='font-canela font-light text-brand-black text-[32px] md:text-[28px] lg:text-[32px]'>
          Order summary
        </h4>

        <div className='mt-5 space-y-3'>
          <div className='flex items-baseline justify-between gap-4'>
            <p className='font-lato text-body font-normal uppercase tracking-[0.03em] text-[#5A5757]'>
              {loading ? 'Loading...' : (productName ?? '')}
            </p>
            <p className='font-lato text-body font-normal text-brand-black'>{loading ? '...' : priceLabel}</p>
          </div>

          <div className='flex items-baseline justify-between gap-4'>
            <p className='font-lato text-body font-normal text-brand-black'>Subtotal</p>
            <p className='font-lato text-body font-normal text-brand-black'>{loading ? '...' : priceLabel}</p>
          </div>

          <div className='!my-[43px] md:!my-8 h-px w-full bg-black/10' />

          <div className='flex items-baseline justify-between gap-4'>
            <p className='font-lato text-body font-normal uppercase tracking-[0.03em] text-brand-black'>DUE TODAY</p>
            <p className='font-lato text-body font-normal text-brand-black'>
              {loading ? '...' : (firstPaymentLabel ?? priceLabel)}
            </p>
          </div>

          {firstPaymentLabel ? (
            <div className='flex items-baseline justify-between gap-4'>
              <p className='font-lato text-body font-normal text-[#41444E]'>Due in 30 days</p>
              <p className='font-lato text-body font-normal text-[#41444E]'>{loading ? '...' : firstPaymentLabel}</p>
            </div>
          ) : null}
        </div>
      </div>

      <Button
        type='button'
        onClick={onPay}
        disabled={!canPay}
        loading={paying}
        fullWidth
        className='mt-[24px] md:mt-10 lg:mt-[80px] !px-2 xl:!px-8 !text-[11px] xl:!text-[14px] !tracking-[0.03em] xl:!tracking-[0.10em]'
        trackingData={{
          cta_name: 'checkout_payment_submit_cta',
          cta_text: buttonText,
          cta_location: 'checkout',
        }}
      >
        {buttonText}
      </Button>
    </>
  );
}
