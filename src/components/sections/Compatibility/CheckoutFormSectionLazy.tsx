'use client';

import dynamic from 'next/dynamic';

const CheckoutFormSection = dynamic(() => import('./CheckoutFormSection'), { ssr: false });

export default function CheckoutFormSectionLazy() {
  return <CheckoutFormSection />;
}
