import dayjs from "dayjs";
import { UserFormValues } from "@/components/ui/userModal/UserForm";
import { FORM_STORAGE_KEY } from "@/utils/constants"

export function generateRandomNumber(length = 6): string {
  let result = "R-";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

export const saveUserFormToStorage = (values: UserFormValues) => {
  try {
    const { name, ...rest } = values;
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(rest));
  } catch (e) {
    console.warn("Failed to save user form data", e);
  }
};

export const getUserFormFromStorage = (): Partial<UserFormValues> | null => {
  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    return {
      ...parsed,
      dateOfBirth: parsed.dateOfBirth
        ? dayjs(parsed.dateOfBirth)
        : undefined,
    };
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
