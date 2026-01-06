"use client";

import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import { Form, Input, DatePicker } from "antd";
import { useCustomForm } from "@/hooks/use-custom-form";
import { formatDateToISO, combineNames } from "@/helpers";

const FormItem = Form.Item;

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

export const CompatibilityForm: React.FC<CompatibilityFormProps> = ({ 
  title, 
  onSuccess, 
  onSubmit 
}) => {
  const [form] = useCustomForm<CompatibilityFormValues>();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: CompatibilityFormValues) => {
    setLoading(true);
    try {
      // Combine first and last names
      const name1 = combineNames(values.firstName1, values.lastName1);
      const name2 = combineNames(values.firstName2, values.lastName2);

      // Format both dates
      const dateOfBirth1 = formatDateToISO(values.dateOfBirth1);
      const dateOfBirth2 = formatDateToISO(values.dateOfBirth2);

      const submitValues: CompatibilityFormValues = { 
        ...values, 
        name1, 
        name2,
        dateOfBirth1, 
        dateOfBirth2 
      };

      if (onSubmit) await onSubmit(submitValues);
      if (onSuccess) onSuccess(submitValues);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="bg-white p-10 rounded-3xl max-w-4xl mx-auto border-zinc-200"
      onFinish={handleFinish}
    >
      <h2 className="text-3xl font-bold text-pink-600 mb-8 text-center tracking-tight drop-shadow-lg">
        {title || "Compatibility Report"}
      </h2>

      {/* Person 1 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-pink-500 mb-4">First Person</h3>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
          <FormItem
            name="firstName1"
            label={<span className="text-zinc-700 font-semibold text-base">First Name</span>}
            rules={[{ required: true, message: "Please enter first name" }]}
            className="mb-0"
          >
            <Input
              placeholder="Enter First Name"
              className="bg-zinc-50 text-zinc-900 border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-400/30 rounded-xl px-5 py-3 placeholder-zinc-400 text-base transition-all duration-200 shadow-sm"
              size="large"
            />
          </FormItem>
          <FormItem
            name="lastName1"
            label={<span className="text-zinc-700 font-semibold text-base">Last Name</span>}
            rules={[{ required: true, message: "Please enter last name" }]}
            className="mb-0"
          >
            <Input
              placeholder="Enter Last Name"
              className="bg-zinc-50 text-zinc-900 border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-400/30 rounded-xl px-5 py-3 placeholder-zinc-400 text-base transition-all duration-200 shadow-sm"
              size="large"
            />
          </FormItem>
          <FormItem
            name="dateOfBirth1"
            label={<span className="text-zinc-700 font-semibold text-base">Date of Birth</span>}
            rules={[{ required: true, message: "Please select date of birth" }]}
            className="mb-0 sm:col-span-2"
          >
            <DatePicker
              placeholder="MM-DD-YYYY"
              format="MM-DD-YYYY"
              className="w-full bg-zinc-50 text-zinc-900 border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-400/30 rounded-xl px-5 py-3 placeholder-zinc-400 text-base transition-all duration-200 shadow-sm"
              size="large"
            />
          </FormItem>
        </div>
      </div>

      {/* Person 2 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-purple-500 mb-4">Second Person</h3>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
          <FormItem
            name="firstName2"
            label={<span className="text-zinc-700 font-semibold text-base">First Name</span>}
            rules={[{ required: true, message: "Please enter first name" }]}
            className="mb-0"
          >
            <Input
              placeholder="Enter First Name"
              className="bg-zinc-50 text-zinc-900 border border-zinc-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-400/30 rounded-xl px-5 py-3 placeholder-zinc-400 text-base transition-all duration-200 shadow-sm"
              size="large"
            />
          </FormItem>
          <FormItem
            name="lastName2"
            label={<span className="text-zinc-700 font-semibold text-base">Last Name</span>}
            rules={[{ required: true, message: "Please enter last name" }]}
            className="mb-0"
          >
            <Input
              placeholder="Enter Last Name"
              className="bg-zinc-50 text-zinc-900 border border-zinc-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-400/30 rounded-xl px-5 py-3 placeholder-zinc-400 text-base transition-all duration-200 shadow-sm"
              size="large"
            />
          </FormItem>
          <FormItem
            name="dateOfBirth2"
            label={<span className="text-zinc-700 font-semibold text-base">Date of Birth</span>}
            rules={[{ required: true, message: "Please select date of birth" }]}
            className="mb-0 sm:col-span-2"
          >
            <DatePicker
              placeholder="MM-DD-YYYY"
              format="MM-DD-YYYY"
              className="w-full bg-zinc-50 text-zinc-900 border border-zinc-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-400/30 rounded-xl px-5 py-3 placeholder-zinc-400 text-base transition-all duration-200 shadow-sm"
              size="large"
            />
          </FormItem>
        </div>
      </div>

      {/* Email */}
      <div className="mb-8">
        <FormItem
          name="email"
          label={<span className="text-zinc-700 font-semibold text-base">Email for Report</span>}
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" }
          ]}
          className="mb-0"
        >
          <Input
            placeholder="email@example.com"
            className="bg-zinc-50 text-zinc-900 border border-zinc-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-400/30 rounded-xl px-5 py-3 placeholder-zinc-400 text-base transition-all duration-200 shadow-sm"
            size="large"
          />
        </FormItem>
      </div>

      <div className="flex justify-center mt-10">
        <button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-12 rounded-full text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50 flex items-center justify-center gap-2 relative"
          disabled={loading}
        >
          <span>{loading ? "Sending Report..." : "Get Compatibility Report"}</span>
          {loading && (
            <span className="ml-3 flex items-center">
              <LoadingOutlined className="text-white text-xl" spin />
            </span>
          )}
        </button>
      </div>
    </Form>
  );
};
