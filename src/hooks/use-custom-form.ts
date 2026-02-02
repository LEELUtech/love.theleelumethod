import { Form, FormInstance } from "antd";
import { NamePath } from "antd/es/form/interface";
import { useCallback } from "react";
import type { AnyObject, GetChangeHandler } from "@/types";

type ReturnType<T extends AnyObject> = [FormInstance<T>, GetChangeHandler<T>];

export const useCustomForm = <T extends AnyObject>(
  form?: FormInstance<T>,
): ReturnType<T> => {
  const [formInstance] = Form.useForm<T>(form);
  const { setFieldValue } = formInstance;

  const handleChange = useCallback<GetChangeHandler<T>>(
    (fieldName: NamePath) => {
      return (value) => setFieldValue(fieldName, value);
    },
    [setFieldValue],
  );

  return [formInstance, handleChange];
};
