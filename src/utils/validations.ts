import { isPhoneValid } from "@/utils/is-phone-valid";
import { RuleObject } from "rc-field-form/lib/interface";

export const phoneValidationRules = [
  {
    required: true,
    message: "Please input a valid phone number",
    validator: (rule: RuleObject, value: string) => {
      if (!value) {
        // reject when empty to enforce required
        return Promise.reject(rule.message as string);
      }

      if (!isPhoneValid(value)) {
        return Promise.reject(rule.message as string);
      }

      return Promise.resolve();
    },
    validateTrigger: "onBlur",
  },
];

export const validateMessages = {
  required: "${label} is Required!",
};
