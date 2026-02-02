import { isPhoneValid } from "@/utils/is-phone-valid";
import type { Rule } from "antd/es/form";

// phone validation with custom validator
export const phoneValidationRules = [
  {
    required: true,
    message: "Please input a valid phone number",
    validator: (_: Rule, value: string) => {
      if (!value) {
        // reject when empty to enforce required
        return Promise.reject("Please input a valid phone number");
      }

      if (!isPhoneValid(value)) {
        return Promise.reject("Please input a valid phone number");
      }

      return Promise.resolve();
    },
    validateTrigger: "onBlur",
  },
];

export const validateMessages = {
  required: "${label} is Required!",
};
