"use client";

import React, { useEffect, useState, useCallback } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { Form, Input, DatePicker, Radio } from "antd";
import { useCustomForm } from "@/hooks/use-custom-form";
import { phoneValidationRules } from "@/utils/validations";
import { PhoneNumberInput } from "@/components/ui/phone-number-input";
import { getUserFormFromStorage, saveUserFormToStorage } from "@/helpers";

const FormItem = Form.Item;

const genderOptions = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

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

export const UserForm: React.FC<UserFormProps> = ({ title, onSuccess, onSubmit }) => {
  const [form, handleChange] = useCustomForm<UserFormValues>();
  const [loading, setLoading] = useState(false);
  const [autofillLoading, setAutofillLoading] = useState(false);

  const autofillForm = useCallback(async () => {
    const storedValues = getUserFormFromStorage();
    if (!storedValues?.email) return;
    setAutofillLoading(true);
    try {
      const res = await fetch("/api/zoho-get-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: storedValues.email }),
      });
      if (!res.ok) return;
      const data = await res.json();
      let dateOfBirth: Dayjs | undefined = undefined;
      if (data.Date_of_Birth) {
        const d = dayjs(data.Date_of_Birth);
        dateOfBirth = d.isValid() ? d : undefined;
      }
      form.setFieldsValue({
        firstName: data.First_Name || "",
        lastName: data.Last_Name || "",
        email: data.Email || storedValues.email,
        phoneNumber: data.Phone || "",
        dateOfBirth,
        gender: data.Gender || "",
      });
    } finally {
      setAutofillLoading(false);
    }
  }, [form]);

  useEffect(() => {
    autofillForm();
  }, [autofillForm]);

  const handleFinish = async (values: UserFormValues) => {
    setLoading(true);
    try {
      const name = [values.firstName, values.lastName].filter(Boolean).join(" ");
      let dateOfBirth = values.dateOfBirth;
      if (values.dateOfBirth) {
        if (typeof values.dateOfBirth === "string") {
          const d = dayjs(values.dateOfBirth);
          dateOfBirth = d.isValid() ? d.toISOString() : "";
        } else if (values.dateOfBirth instanceof Date) {
          dateOfBirth = values.dateOfBirth.toISOString();
        } else if (typeof values.dateOfBirth === "object") {
          const d = values.dateOfBirth as Dayjs;
          dateOfBirth = typeof d.isValid === "function" && d.isValid() ? d.toISOString() : "";
        } else {
          dateOfBirth = "";
        }
      } else {
        dateOfBirth = "";
      }
      const submitValues: UserFormValues = { ...values, name, dateOfBirth };
      if (submitValues.email) {
        saveUserFormToStorage(submitValues.email);
      }
      if (onSubmit) await onSubmit(submitValues);
      if (onSuccess) onSuccess(submitValues);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {autofillLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <LoadingOutlined className="text-pink-600 text-3xl mb-4" spin />
          <span className="text-zinc-500">Autofilling your data...</span>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          className="bg-white p-10 rounded-3xl max-w-2xl mx-auto border-zinc-200"
          onFinish={handleFinish}
        >
          <h2 className="text-3xl font-bold text-pink-600 mb-8 text-center tracking-tight drop-shadow-lg">
            {title || "Join the Program"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <FormItem
              name="firstName"
              label={<span className="text-zinc-700 font-semibold text-base">First Name</span>}
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Input
                placeholder="Enter First Name"
                className="bg-zinc-50 text-zinc-900 border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-400/30 rounded-xl px-5 py-3 placeholder-zinc-400 text-base transition-all duration-200 shadow-sm"
                size="large"
              />
            </FormItem>
            <FormItem
              name="lastName"
              label={<span className="text-zinc-700 font-semibold text-base">Last Name</span>}
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Input
                placeholder="Enter Last Name"
                className="bg-zinc-50 text-zinc-900 border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-400/30 rounded-xl px-5 py-3 placeholder-zinc-400 text-base transition-all duration-200 shadow-sm"
                size="large"
              />
            </FormItem>
            <FormItem
              name="email"
              label={<span className="text-zinc-700 font-semibold text-base">Email</span>}
              rules={[{ required: true, type: "email" }]}
              className="mb-0"
            >
              <Input
                placeholder="email@example.com"
                className="bg-zinc-50 text-zinc-900 border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-400/30 rounded-xl px-5 py-3 placeholder-zinc-400 text-base transition-all duration-200 shadow-sm"
                size="large"
              />
            </FormItem>
            <FormItem
              name="phoneNumber"
              label={<span className="text-zinc-700 font-semibold text-base">Phone</span>}
              rules={phoneValidationRules}
              className="mb-0"
            >
              <PhoneNumberInput
                value={form.getFieldValue("phoneNumber")}
                onChange={handleChange("phoneNumber")}
              />
            </FormItem>
            <FormItem
              name="dateOfBirth"
              label={<span className="text-zinc-700 font-semibold text-base">Date of Birth</span>}
              rules={[{ required: true }]}
              className="mb-0"
            >
              <DatePicker
                placeholder="MM-DD-YYYY"
                format="MM-DD-YYYY"
                className="w-full bg-zinc-50 text-zinc-900 border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-400/30 rounded-xl px-5 py-3 placeholder-zinc-400 text-base transition-all duration-200 shadow-sm"
                size="large"
              />
            </FormItem>
            <FormItem
              name="gender"
              label={<span className="text-zinc-700 font-semibold text-base">Gender</span>}
              rules={[{ required: true }]}
              className="mb-0 flex items-center"
            >
              <Radio.Group
                options={genderOptions}
                className="flex gap-4 text-zinc-700"
                optionType="button"
                buttonStyle="solid"
              />
            </FormItem>
          </div>
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-12 rounded-full text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50 flex items-center justify-center gap-2 relative"
              disabled={loading}
            >
              <span>{loading ? "Processing..." : "Submit"}</span>
              {loading && (
                <span className="ml-3 flex items-center">
                  <LoadingOutlined className="text-white text-xl" spin />
                </span>
              )}
            </button>
          </div>
        </Form>
      )}
    </>
  );
};