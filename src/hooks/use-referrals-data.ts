"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Referral } from "@/types";

export interface UseReferralsDataResult {
  referrals: Referral[];
  loading: boolean;
  error: Error | null;
  addReferral: (values: {
    code: string;
    value: number;
    agentId: string;
  }) => Promise<void>;
  deleteReferral: (id: string) => Promise<void>;
  addLoading: boolean;
  deleteLoading: boolean;
}

export function useReferralsData(): UseReferralsDataResult {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "referrals"),
      orderBy("createdAtMs", "desc"),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Referral[] = snap.docs.map((d) => {
          const data = d.data() as Partial<Referral>;
          return {
            id: d.id,
            code: data.code ?? "",
            value: data.value ?? 0,
            agentId: data.agentId ?? "",
            createdAtMs: data.createdAtMs,
          };
        });
        setReferrals(list);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Failed to subscribe to referrals", err);
        setError(err);
        setLoading(false);
      },
    );

    return () => unsub();
  }, []);

  const addReferral = async (values: {
    code: string;
    value: number;
    agentId: string;
  }) => {
    const { code, value, agentId } = values;
    setAddLoading(true);
    try {
      //  Create referral in Firestore
      await addDoc(collection(db, "referrals"), {
        code,
        value,
        agentId,
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(),
      });

      //  Update ZOHO Agent's Promo_Code if possible
      try {
        const agentRef = doc(db, "agents", agentId);
        const agentSnap = await getDoc(agentRef);
        const agentData = agentSnap.data() as { zohoId?: string } | undefined;
        const zohoId = agentData?.zohoId;
        if (zohoId) {
          await fetch("/api/zoho-update-agent-promo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ zohoId, promoCode: code }),
          });
        }
      } catch (e) {
        console.error("Zoho update agent promo failed", e);
      }
    } finally {
      setAddLoading(false);
    }
  };

  const deleteReferral = async (referralId: string) => {
    setDeleteLoading(true);
    try {
      // Get referral data before deletion to access agentId
      const referralRef = doc(db, "referrals", referralId);
      const referralSnap = await getDoc(referralRef);

      if (referralSnap.exists()) {
        const referralData = referralSnap.data() as Referral;
        const agentId = referralData.agentId;

        // Clear promo code from Zoho agent
        try {
          const agentRef = doc(db, "agents", agentId);
          const agentSnap = await getDoc(agentRef);
          const agentData = agentSnap.data() as { zohoId?: string } | undefined;
          const zohoId = agentData?.zohoId;

          if (zohoId) {
            await fetch("/api/zoho-update-agent-promo", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ zohoId, promoCode: "" }), // Clear promo code
            });
          }
        } catch (e) {
          console.error("Failed to clear Zoho agent promo code:", e);
        }
      }

      // Delete the referral from Firebase
      await deleteDoc(referralRef);
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    referrals,
    loading,
    error,
    addReferral,
    deleteReferral,
    addLoading,
    deleteLoading,
  };
}
