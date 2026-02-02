import type { UserFormValues } from "@/types/forms";
import { FORM_STORAGE_KEY } from "@/utils/constants";
import dayjs, { Dayjs } from "dayjs";

// Generates random number with R- prefix (e.g. R-123456)
export function generateRandomNumber(length = 6): string {
	let result = "R-";
	for (let i = 0; i < length; i++) {
		result += Math.floor(Math.random() * 10);
	}
	return result;
}

// Formats date to DD.MM.YYYY for backend parseBirthDate
export function formatDateToISO(
  dateValue: string | Date | Dayjs | undefined
): string {
  if (!dateValue) return "";

  const d = dayjs(dateValue);
  return d.isValid() ? d.format("DD.MM.YYYY") : "";
}

// Joins first and last name into full name
export function combineNames(
	firstName?: string,
	lastName?: string
): string {
	return [firstName, lastName].filter(Boolean).join(" ");
}

// Saves email to localStorage for form persistence
export const saveUserFormToStorage = (email: string) => {
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ email }));
  } catch (e) {
    console.warn("Failed to save user form data", e);
  }
};

// Retrieves saved email from localStorage
export const getUserFormFromStorage = (): Partial<UserFormValues> | null => {
  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.email ? { email: parsed.email } : null;
  } catch (e) {
    console.warn("Failed to read user form data", e);
    return null;
  }
};

// Clears saved form data from localStorage
export const clearUserFormStorage = () => {
  try {
    localStorage.removeItem(FORM_STORAGE_KEY);
  } catch (e) {
    console.warn("Failed to clear user form data", e);
  }
};

export function formatPriceFromCents(
  cents: number,
  options?: {
    currency?: string;
    showCents?: boolean;
    locale?: string;
  }
) {
  const {
    currency = "USD",
    showCents = false,
    locale = "en-US",
  } = options || {};

  const value = cents / 100;

  return value.toLocaleString(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  });
}
