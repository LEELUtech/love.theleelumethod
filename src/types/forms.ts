import type { Dayjs } from "dayjs";

export type AnyObject<T = unknown> = Record<string, T>;

export type ObjectKeys<T = AnyObject> = keyof T;

export type ChangeHandler<T extends AnyObject, K extends ObjectKeys<T>> = (
  value: T[K],
) => void;

export type GetChangeHandler<T extends AnyObject> = (
  fieldName: ObjectKeys<T>,
) => ChangeHandler<T, ObjectKeys<T>>;

export interface UserFormValues {
  [key: string]: string | Date | Dayjs | undefined;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth: string | Date | Dayjs;
  gender: string;
  name?: string;
}

export interface UserFormProps {
  title?: string;
  onSuccess?: (values: UserFormValues) => void;
  onSubmit?: (values: UserFormValues) => Promise<void> | void;
}

export interface CompatibilityFormValues {
  [key: string]: string | Date | Dayjs | undefined;
  firstName1: string;
  lastName1: string;
  firstName2: string;
  lastName2: string;
  email: string;
  dateOfBirth1: string | Date | Dayjs;
  dateOfBirth2: string | Date | Dayjs;
  name1?: string;
  name2?: string;
}

export interface CompatibilityFormProps {
  title?: string;
  onSuccess?: (values: CompatibilityFormValues) => void;
  onSubmit?: (values: CompatibilityFormValues) => Promise<void> | void;
}

export type CountryOption = { 
  label: string; 
  value: string;
};
