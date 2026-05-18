import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export type PromoData = {
  discountPrice: number;
  code: string;
};

type PromoDoc = {
  enabled?: boolean;
  expires_at?: { toDate?: () => Date } | Date | string;
  discount_price?: number;
};

function parseExpiry(raw: PromoDoc['expires_at']): Date | null {
  if (!raw) return null;
  if (typeof (raw as { toDate?: () => Date }).toDate === 'function') {
    return (raw as { toDate: () => Date }).toDate();
  }
  if (raw instanceof Date) return raw;
  if (typeof raw === 'string') return new Date(raw);
  return null;
}

export async function validatePromoCode(
  code: string,
  productType: string
): Promise<PromoData | null> {
  if (!code || productType !== 'protocol_essentials') return null;
  try {
    const snap = await getDoc(doc(db, 'promo_links', code.toUpperCase()));
    if (!snap.exists()) return null;

    const data = snap.data() as PromoDoc;

    if (!data.enabled) return null;

    const expiresAt = parseExpiry(data.expires_at);
    if (!expiresAt || expiresAt <= new Date()) return null;

    if (typeof data.discount_price !== 'number' || data.discount_price <= 0) return null;

    return {
      discountPrice: data.discount_price,
      code: code.toUpperCase(),
    };
  } catch {
    return null;
  }
}
