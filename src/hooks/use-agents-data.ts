"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  FieldValue,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Agent } from "@/types";

interface AgentFirebaseData {
  name: string;
  email?: string;
  phone?: string;
  createdAt: FieldValue | Timestamp; // Firebase serverTimestamp type
  createdAtMs: number;
  zohoId?: string;
}

export interface UseAgentsDataResult {
  agents: Agent[];
  loading: boolean;
  error: Error | null;
  addAgent: (values: {
    name: string;
    email?: string;
    phone?: string;
  }) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  addLoading: boolean;
  deleteLoading: boolean;
}

export function useAgentsData(): UseAgentsDataResult {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "agents"), orderBy("createdAtMs", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Agent[] = snap.docs.map((d) => {
          const data = d.data() as Partial<Agent>;
          return {
            id: d.id,
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            zohoId: data.zohoId || "",
          };
        });
        setAgents(list);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Failed to subscribe to agents", err);
        setError(err);
        setLoading(false);
      },
    );

    return () => unsub();
  }, []);

  const addAgent = async (values: {
    name: string;
    email?: string;
    phone?: string;
  }) => {
    const { name, email, phone } = values;
    setAddLoading(true);
    try {
      const agentData: Partial<AgentFirebaseData> = {
        name,
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(),
      };

      // Only add email and phone if they have values
      if (email !== undefined && email !== "") {
        agentData.email = email;
      }
      if (phone !== undefined && phone !== "") {
        agentData.phone = phone;
      }

      const docRef = await addDoc(collection(db, "agents"), agentData);
      try {
        const res = await fetch("/api/zoho-create-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone }),
        });
        if (res.ok) {
          const data = await res.json();
          const zohoId = data?.data?.[0]?.details?.id as string | undefined;
          if (zohoId) {
            await updateDoc(docRef, { zohoId });
          }
        } else {
          console.error(
            "Zoho create agent call failed",
            await res.json().catch(() => ({})),
          );
        }
      } catch (e) {
        console.error("Zoho create agent call failed", e);
      }
    } finally {
      setAddLoading(false);
    }
  };

  const deleteAgent = async (agentId: string) => {
    setDeleteLoading(true);
    try {
      try {
        const ref = doc(db, "agents", agentId);
        const snap = await getDoc(ref);
        const data = snap.data() as { zohoId?: string } | undefined;
        const zohoId = data?.zohoId;
        if (zohoId) {
          await fetch("/api/zoho-delete-agent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ zohoId }),
          });
        }
      } catch (e) {
        console.error("Zoho delete agent call failed", e);
      }

      // Cascade delete referrals linked to this agent
      try {
        const referralsQ = query(
          collection(db, "referrals"),
          where("agentId", "==", agentId),
        );
        const referralsSnap = await getDocs(referralsQ);
        if (!referralsSnap.empty) {
          const batch = writeBatch(db);
          referralsSnap.forEach((d) => {
            batch.delete(doc(db, "referrals", d.id));
          });
          await batch.commit();
        }
      } catch (e) {
        console.error("Failed to cascade delete referrals for agent", e);
      }

      await deleteDoc(doc(db, "agents", agentId));
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    agents,
    loading,
    error,
    addAgent,
    deleteAgent,
    addLoading,
    deleteLoading,
  };
}
