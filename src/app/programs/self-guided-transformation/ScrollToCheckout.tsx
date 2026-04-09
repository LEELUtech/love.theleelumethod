'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ScrollToCheckout() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const email = searchParams.get('email');
    if (!email) return;

    let attempts = 0;
    const interval = setInterval(() => {
      const el = document.getElementById('checkout');
      if (el) {
        clearInterval(interval);
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (++attempts > 20) clearInterval(interval);
    }, 300);

    return () => clearInterval(interval);
  }, [searchParams]);

  return null;
}
