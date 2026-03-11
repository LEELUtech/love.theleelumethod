import { isPhoneValid } from '@/utils/is-phone-valid';
import type { Rule } from 'antd/es/form';

// phone validation with custom validator
export const phoneValidationRules = [
  {
    required: true,
    message: 'Please input a valid phone number',
    validator: (_: Rule, value: string) => {
      if (!value) {
        // reject when empty to enforce required
        return Promise.reject('Please input a valid phone number');
      }

      if (!isPhoneValid(value)) {
        return Promise.reject('Please input a valid phone number');
      }

      return Promise.resolve();
    },
    validateTrigger: 'onBlur',
  },
];

export const validateMessages = {
  required: '${label} is Required!',
};

export const validateBirthDate = (value: string) => {
  if (!value) return 'Date of birth is required.';

  const dob = new Date(value);
  const today = new Date();
  const age18 = new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate());

  if (dob.getFullYear() < 1950) return 'Date of birth cannot be earlier than 1950.';
  if (age18 > today) return 'You must be at least 18 years old.';

  return null;
};

export const validateName = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) return 'Name is required.';
  if (trimmed.length < 2) return 'Name must be at least 2 characters.';

  return null;
};
