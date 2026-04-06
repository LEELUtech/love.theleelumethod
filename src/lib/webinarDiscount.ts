import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function checkWebinarDiscount(email: string): Promise<boolean> {
  if (!email) return false;
  try {
    const snap = await getDocs(
      query(collection(db, 'webinar_discounts'), where('email', '==', email.trim().toLowerCase()))
    );
    if (snap.empty) return false;

    const data = snap.docs[0].data() as { expires_at?: { toDate?: () => Date } | Date | string };
    let expiresAt: Date | null = null;

    if (data.expires_at) {
      if (typeof (data.expires_at as { toDate?: () => Date }).toDate === 'function') {
        expiresAt = (data.expires_at as { toDate: () => Date }).toDate();
      } else if (data.expires_at instanceof Date) {
        expiresAt = data.expires_at;
      } else if (typeof data.expires_at === 'string') {
        expiresAt = new Date(data.expires_at);
      }
    }

    return expiresAt !== null && expiresAt > new Date();
  } catch {
    return false;
  }
}

export async function checkInstallmentPlan(email: string, productType: string): Promise<number | null> {
  if (!email) return null;
  try {
    const snap = await getDocs(
      query(collection(db, 'installment_plans'), where('email', '==', email))
    );
    const plan = snap.docs.find((d) => {
      const data = d.data() as { status?: string; product_type?: string };
      return (data.status === 'pending' || data.status === 'overdue') && data.product_type === productType;
    });
    if (!plan) return null;
    const amount = (plan.data() as { amount?: number }).amount;
    return typeof amount === 'number' && amount > 0 ? amount : null;
  } catch {
    return null;
  }
}
