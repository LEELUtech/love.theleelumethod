import { db } from "../configs/firebase";
import { Timestamp } from "firebase-admin/firestore";

export interface CohortData {
  date: string | null;
  label: string | null;
}

// Module-level cache — lives for the duration of one function invocation
let _cached: CohortData | null = null;
let _cachedAt = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

export async function getCohortData(): Promise<CohortData> {
  if (_cached && Date.now() - _cachedAt < CACHE_TTL_MS) return _cached;

  try {
    const doc = await db.doc("config/cohort").get();
    const data = doc.data();

    let date: string | null = null;
    const value = data?.cohort_date;
    if (value) {
      if (value instanceof Timestamp) {
        date = value.toDate().toISOString().slice(0, 10);
      } else if (typeof value === "string") {
        const s = value.trim();
        if (s) {
          const d = new Date(s);
          date = isNaN(d.getTime()) ? s : d.toISOString().slice(0, 10);
        }
      }
    }

    const labelValue = data?.cohort_date_label;
    const label = typeof labelValue === "string" ? labelValue.trim() || null : null;

    _cached = { date, label };
    _cachedAt = Date.now();
    return _cached;
  } catch {
    return { date: null, label: null }; // non-blocking — don't fail contact creation if Firestore read fails
  }
}

// Backward-compatible alias
export async function getCohortDate(): Promise<string | null> {
  return (await getCohortData()).date;
}
