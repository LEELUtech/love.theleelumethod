import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CheckoutData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string | Date;
  gender?: string;
}

interface CheckoutStore {
  checkoutData: CheckoutData | null;
  setCheckoutData: (data: CheckoutData) => void;
  clearCheckoutData: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      checkoutData: null,
      setCheckoutData: (data) => set({ checkoutData: data }),
      clearCheckoutData: () => set({ checkoutData: null }),
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => sessionStorage), // Clears on tab close
    }
  )
);
