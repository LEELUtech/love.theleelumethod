// store/useProductStore.ts
"use client";

import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // <-- твой firebase init
import type { Product } from "@/types";

type FirestoreOfferingDoc = {
  title?: string;
  name?: string;
  description?: string;
  price?: number;  
  currency?: string; 
}

interface ProductState {
  productsById: Record<string, Product | undefined>;
  loadingById: Record<string, boolean | undefined>;
  errorById: Record<string, string | undefined>;

  // actions
  fetchProduct: (id: string, opts?: { force?: boolean }) => Promise<Product | null>;
  preloadProducts: (ids: string[]) => Promise<void>;

  // selectors/helpers
  getProduct: (id: string) => Product | undefined;
  isLoading: (id: string) => boolean;
  getError: (id: string) => string | undefined;
}

function normalizePriceToCents(raw?: number) {
  if (typeof raw !== "number") return 0;
  return Math.round(raw);
}

const useProductStore = create<ProductState>((set, get) => ({
  productsById: {},
  loadingById: {},
  errorById: {},

  getProduct: (id) => get().productsById[id],
  isLoading: (id) => Boolean(get().loadingById[id]),
  getError: (id) => get().errorById[id],

  fetchProduct: async (id, opts) => {
    const force = opts?.force ?? false;

    // cache hit
    const cached = get().productsById[id];
    if (cached && !force) return cached;

    set((state) => ({
      loadingById: { ...state.loadingById, [id]: true },
      errorById: { ...state.errorById, [id]: undefined },
    }));

    try {
      const ref = doc(db, "offerings", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        set((state) => ({
          loadingById: { ...state.loadingById, [id]: false },
          errorById: { ...state.errorById, [id]: "Product not found" },
        }));
        return null;
      }

      const data = snap.data() as FirestoreOfferingDoc;

      console.log('123', data)

      const product: Product = {
        id: snap.id,
        title: data.title ?? "",
        name: data.name ?? "",
        description: data.description ?? "",
        price: normalizePriceToCents(data.price),
        currency: data.currency ?? "USD",
      };

      set((state) => ({
        productsById: { ...state.productsById, [id]: product },
        loadingById: { ...state.loadingById, [id]: false },
      }));

      return product;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to fetch product";
      set((state) => ({
        loadingById: { ...state.loadingById, [id]: false },
        errorById: { ...state.errorById, [id]: msg },
      }));
      return null;
    }
  },

  preloadProducts: async (ids) => {
    await Promise.all(ids.map((id) => get().fetchProduct(id)));
  },
}));

export default useProductStore;
