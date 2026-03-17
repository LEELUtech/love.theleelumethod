import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function checkWebinarDiscount(email: string): Promise<boolean> {
  if (!email) return false;
  try {
    const docId = email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const ref = doc(db, 'webinar_discounts', docId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;

    const data = snap.data() as { expires_at?: { toDate?: () => Date } | Date | string };
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
