import { UserFormValues } from "@/components/ui/userModal/UserForm";
import { FORM_STORAGE_KEY } from "@/utils/constants"

export function generateRandomNumber(length = 6): string {
  let result = "R-";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

export const saveUserFormToStorage = (email: string) => {
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ email }));
  } catch (e) {
    console.warn("Failed to save user form data", e);
  }
};

export const getUserFormFromStorage = (): Partial<UserFormValues> | null => {
  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.email) return null;
    return { email: parsed.email };
  } catch (e) {
    console.warn("Failed to read user form data", e);
    return null;
  }
};

export const clearUserFormStorage = () => {
  try {
    localStorage.removeItem(FORM_STORAGE_KEY);
  } catch (e) {
    console.warn("Failed to clear user form data", e);
  }
};
